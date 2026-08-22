/**
 * 성분·순서 규칙 엔진
 *
 * 왜 LLM이 아니라 규칙인가 —
 * 피부에 바르는 제품의 병용 판정에서 환각이 나오면 사용자가 다칠 수 있다.
 * 여기 있는 판정은 전부 결정적이고, 각 규칙이 근거(basis)를 함께 들고 다닌다.
 * 나중에 Gemini를 얹을 자리는 `explain()` 한 곳뿐 — 판정은 그대로 두고
 * 문장만 사용자 상황에 맞게 다듬는 층으로만 쓴다. 판정을 LLM에 넘기지 말 것.
 *
 * 규칙의 핵심 축은 두 개다:
 *  1) 순서 — 기기가 바르기 전인지 후인지. 광 기반은 전, 전류 기반은 후.
 *  2) 병용 — 같은 시간대에 겹치면 안 되는 조합, 겹치면 좋은 조합.
 *
 * 표현 수위: "치료·개선"이라고 쓰지 않는다. 관리·순서·자극 수준만 말한다
 * (화장품법 제13조·별표5-2). 기기는 효능을 언급하지 않고 순서와 안전만 다룬다.
 */

import {
  brandOf,
  products,
  type ActiveKey,
  type DeviceKind,
  type Product,
} from "@/data/catalog";

/** 우리가 팔지 않는 제품도 검사 대상에 넣는다. 이게 브랜드 중립의 실질이고,
 *  우리 카탈로그 안에서만 보면 충돌이 거의 안 나서 기능이 시늉이 된다. */
export type ExternalItem = {
  id: string;
  label: string;
  hint: string;
  actives: ActiveKey[];
};

export const externalItems: ExternalItem[] = [
  {
    id: "x-retinol",
    label: "레티놀 제품",
    hint: "레티놀·레티날·레티닐팔미테이트",
    actives: ["retinol"],
  },
  {
    id: "x-acid",
    label: "각질 제품 (AHA·BHA)",
    hint: "글리콜산·살리실산·필링 패드",
    actives: ["aha-bha"],
  },
  {
    id: "x-vitc",
    label: "고농도 비타민C",
    hint: "아스코르빅애씨드 10% 이상",
    actives: ["vitaminC"],
  },
  {
    id: "x-niacinamide",
    label: "나이아신아마이드 제품",
    hint: "다른 브랜드에서 쓰고 있는 것",
    actives: ["niacinamide"],
  },
  {
    id: "x-sunscreen",
    label: "선크림",
    hint: "쓰고 있는 자외선 차단제",
    actives: ["sunscreen"],
  },
];

export const externalOf = (id: string) => externalItems.find((x) => x.id === id);

/** 검사 대상 한 건 — 우리 상품이거나 외부 제품 유형 */
export type Entry =
  | { kind: "product"; product: Product }
  | { kind: "external"; item: ExternalItem };

export const entryName = (e: Entry) =>
  e.kind === "product" ? `${brandOf(e.product.brand).name} ${e.product.name}` : e.item.label;

export const resolveEntries = (ids: string[]): Entry[] =>
  ids
    .map<Entry | null>((id) => {
      const p = products.find((x) => x.id === id);
      if (p) return { kind: "product", product: p };
      const x = externalOf(id);
      if (x) return { kind: "external", item: x };
      return null;
    })
    .filter((e): e is Entry => e !== null);

const activesOf = (e: Entry): ActiveKey[] =>
  e.kind === "product" ? (e.product.actives ?? []).map((a) => a.key) : e.item.actives;

const pctOf = (e: Entry, key: ActiveKey): number | undefined =>
  e.kind === "product" ? e.product.actives?.find((a) => a.key === key)?.pct : undefined;

const devicesOf = (e: Entry): DeviceKind[] =>
  e.kind === "product" ? (e.product.deviceKinds ?? []) : [];

const has = (e: Entry, key: ActiveKey) => activesOf(e).includes(key);
const isDevice = (e: Entry) => devicesOf(e).length > 0;

// ── 결과 타입 ────────────────────────────────────
export type Note = {
  /** caution = 겹치면 자극 위험 / order = 순서 / synergy = 함께 쓰면 값이 생김 */
  level: "caution" | "order" | "synergy";
  title: string;
  detail: string;
  /** 왜 그렇게 판정했는지. 화면에 그대로 노출한다 — 근거 없는 지시는 신뢰가 안 생긴다 */
  basis: string;
  /** 이 판정에 관여한 항목 이름 */
  about: string[];
};

export type Slot = "아침" | "저녁" | "주 1~2회";

export type Step = { order: number; slot: Slot; name: string; how: string };

export type Result = {
  steps: Step[];
  notes: Note[];
};

// ── 기기 순서 규칙 ────────────────────────────────
/**
 * 기기를 하나의 자리에만 배치한다. 이 함수가 유일한 판정 지점 —
 * 여러 곳에서 각각 판단하면 복합기가 아침·저녁에 중복으로 나온다.
 *
 * - 초음파: 매일 쓰는 기기가 아니라 주 1~2회
 * - 갈바닉: 성분을 밀어 넣으므로 **바른 후**
 * - LED 단독: 빛이 통과해야 하므로 **바르기 전**
 * - 복합기(고주파·EMS·미세전류): LED가 함께 있어도 전용 젤을 바르고 쓰는 방식이라
 *   "바르기 전" 규칙 대상이 아니다. LED 단독기와 구분해야 한다.
 */
type DeviceSlot = { slot: Slot; rank: number; how: string };

const isLedOnly = (kinds: DeviceKind[]) =>
  kinds.includes("led") &&
  !kinds.some((k) => k === "rf" || k === "ems" || k === "microcurrent" || k === "ultrasound");

const deviceSlot = (kinds: DeviceKind[], gelFree: boolean): DeviceSlot => {
  if (kinds.includes("ultrasound"))
    return { slot: "주 1~2회", rank: 1, how: "전용 젤을 충분히 바르고 사용" };
  if (kinds.includes("galvanic"))
    return { slot: "저녁", rank: 3, how: "앰플을 올린 다음에 — 바른 후예요" };
  if (isLedOnly(kinds))
    return { slot: "저녁", rank: 1, how: "세안 후 맨 피부에 — 바르기 전이에요" };
  // 젤 불필요로 명시된 기기에 "젤을 바르고"라고 쓰면 판정과 순서표가 서로 어긋난다
  return {
    slot: "아침",
    rank: 1,
    how: gelFree ? "세안 후 바로 — 전용 젤이 필요 없어요" : "전용 젤을 바르고 밀어 올려요",
  };
};

const deviceLabel: Record<DeviceKind, string> = {
  led: "LED",
  galvanic: "갈바닉",
  rf: "고주파",
  ems: "EMS",
  microcurrent: "미세전류",
  ultrasound: "초음파",
};

/**
 * 검사 실행. 순수 함수 — 같은 입력이면 항상 같은 결과.
 */
export function check(ids: string[]): Result {
  const entries = resolveEntries(ids);
  const notes: Note[] = [];

  const devices = entries.filter(isDevice);
  const cosmetics = entries.filter((e) => !isDevice(e));

  // ── 1. 기기 순서 ──
  for (const d of devices) {
    const kinds = devicesOf(d);
    const names = kinds.map((k) => deviceLabel[k]).join("·");

    // "바르기 전"은 LED 단독기만. 복합기는 젤 기반이라 해당하지 않는다
    if (isLedOnly(kinds)) {
      notes.push({
        level: "order",
        title: "이 기기는 바르기 전에 쓰세요",
        detail: `세안 후 아무것도 바르지 않은 상태에서 사용하고, 끝난 다음 세럼·크림을 올립니다.`,
        basis:
          "LED는 빛이 피부에 닿아야 작동합니다. 세럼이나 크림을 먼저 바르면 그 층이 빛을 산란시켜 도달하는 양이 줄어요.",
        about: [entryName(d)],
      });
    }
    if (kinds.includes("galvanic")) {
      notes.push({
        level: "order",
        title: "이 기기는 바른 다음에 쓰세요",
        detail: "앰플이나 세럼을 먼저 올린 상태에서 사용합니다. 맨 피부에 쓰면 하는 일이 거의 없어요.",
        basis:
          "갈바닉은 약한 전류로 이미 피부 위에 있는 성분을 안쪽으로 밀어 넣는 방식입니다. LED와 순서가 정반대예요.",
        about: [entryName(d)],
      });
    }
    if (kinds.includes("rf")) {
      const hasBarrier = cosmetics.some((c) => has(c, "ceramide") || has(c, "panthenol"));
      notes.push({
        level: hasBarrier ? "order" : "caution",
        title: hasBarrier ? "고주파 다음은 장벽 제품으로 마무리" : "고주파를 쓰면 마무리 보습이 필요해요",
        detail: hasBarrier
          ? "고른 조합에 세라마이드·판테놀이 들어 있어 마무리 단계가 채워져 있어요."
          : "지금 고른 조합엔 세라마이드·판테놀 같은 장벽 성분이 없어요. 기기 쓴 날 마무리 보습을 하나 더하는 편이 좋습니다.",
        basis:
          "고주파는 피부 안쪽에 열을 만드는 방식이라 쓰고 나면 수분이 빠져나가기 쉬운 상태가 됩니다.",
        about: [entryName(d)],
      });
    }
    if (kinds.includes("ultrasound")) {
      notes.push({
        level: "caution",
        title: "초음파 기기는 전용 젤과 사용 주기를 지키세요",
        detail:
          "젤을 충분히 바르고, 같은 자리를 반복하지 않는 것이 원칙이에요. 사용 주기는 제품 설명서를 따라주세요.",
        basis: "집속 초음파는 에너지를 한 점에 모으는 방식이라 매일 쓰는 종류의 기기가 아닙니다.",
        about: [entryName(d)],
      });
    }
    if (
      !isLedOnly(kinds) &&
      !kinds.includes("galvanic") &&
      !kinds.includes("ultrasound") &&
      (kinds.includes("ems") || kinds.includes("microcurrent"))
    ) {
      // 전용 젤이 필요 없다고 브랜드가 명시한 기기는 제외 (예: 울트라튠)
      const gelFree = e2SpecSaysGelFree(d);
      notes.push({
        level: "order",
        title: gelFree ? "이 기기는 전용 젤이 필요 없어요" : "전용 젤을 바르고 사용하세요",
        detail: gelFree
          ? `세안 후 바로 쓸 수 있어서 준비 단계가 하나 줄어요.`
          : `${names} 방식은 전류가 흐를 매개가 필요해서 전용 젤 단계를 건너뛰면 안 됩니다.`,
        basis: gelFree
          ? "브랜드가 공개한 사양에 전용 젤 불필요로 표기돼 있습니다."
          : "미세전류·EMS는 젤이 없으면 전류가 고르게 퍼지지 않고 자극만 커집니다.",
        about: [entryName(d)],
      });
    }
  }

  // ── 2. 성분 병용 ──
  const withRetinol = entries.filter((e) => has(e, "retinol"));
  const withAcid = entries.filter((e) => has(e, "aha-bha"));
  const withVitC = entries.filter((e) => has(e, "vitaminC"));
  const withNia = entries.filter((e) => has(e, "niacinamide"));
  const withTxa = entries.filter((e) => has(e, "tranexamic"));
  const withSun = entries.filter((e) => has(e, "sunscreen"));

  if (withRetinol.length > 0 && withAcid.length > 0) {
    notes.push({
      level: "caution",
      title: "레티놀과 각질 제품은 같은 날 저녁에 겹치지 마세요",
      detail: "하루씩 번갈아 쓰거나, 각질 제품을 주 1~2회로 줄이는 쪽을 권합니다.",
      basis: "둘 다 각질 turnover를 올리는 방향이라 같은 저녁에 겹치면 자극과 장벽 손상이 커집니다.",
      about: [...withRetinol.map(entryName), ...withAcid.map(entryName)],
    });
  }

  if (withRetinol.length > 0) {
    notes.push({
      level: "order",
      title: "레티놀은 저녁에만",
      detail: "아침 루틴에 넣지 말고, 쓰는 기간에는 낮 자외선 차단을 더 챙기세요.",
      basis: "레티놀은 빛에 불안정하고, 쓰는 동안 피부가 자외선에 더 민감해집니다.",
      about: withRetinol.map(entryName),
    });
    if (withNia.length > 0) {
      notes.push({
        level: "synergy",
        title: "나이아신아마이드가 레티놀 적응을 도와요",
        detail: "레티놀 때문에 당기거나 붉어지는 시기에 같이 쓰면 견디기가 수월해집니다.",
        basis: "나이아신아마이드는 장벽 쪽을 함께 관리해서 레티놀 초기 자극을 완충하는 방향으로 작용합니다.",
        about: [...withNia.map(entryName), ...withRetinol.map(entryName)],
      });
    }
  }

  if (withRetinol.length > 0 && withVitC.length > 0) {
    notes.push({
      level: "order",
      title: "비타민C는 아침, 레티놀은 저녁으로 나누세요",
      detail: "같은 시간대에 겹쳐 쓰면 둘 다 자극 쪽으로만 기울기 쉬워요.",
      basis: "선호 pH가 다르고 둘 다 단독으로도 자극이 있는 성분이라, 시간대를 나누는 쪽이 안전합니다.",
      about: [...withVitC.map(entryName), ...withRetinol.map(entryName)],
    });
  }

  if (withAcid.length > 0) {
    notes.push({
      level: "order",
      title: "각질 제품은 주 1~2회로",
      detail: "매일 쓰면 오히려 속당김과 붉어짐이 늘어납니다. 쓴 날은 보습을 한 겹 더하세요.",
      basis: "40대 이후는 장벽 회복 속도가 느려져 같은 빈도로도 자극이 더 오래 남습니다.",
      about: withAcid.map(entryName),
    });
  }

  // 나이아신아마이드 중복 — 함량을 아는 경우만 수치로 말한다
  if (withNia.length >= 2) {
    const known = withNia
      .map((e) => ({ e, pct: pctOf(e, "niacinamide") }))
      .filter((x) => x.pct !== undefined);
    const total = known.reduce((s, x) => s + (x.pct ?? 0), 0);
    notes.push({
      level: "caution",
      title: "나이아신아마이드가 겹쳐 있어요",
      detail:
        known.length >= 2
          ? `공개 함량 기준 ${known
              .map((x) => `${x.pct}%`)
              .join(" + ")} 로 겹칩니다. 둘을 같은 시간대에 쓰기보다 아침·저녁으로 나누거나 하나만 쓰는 쪽을 권합니다.`
          : "같은 성분이 두 제품에 들어 있어요. 아침·저녁으로 나누거나 하나만 쓰는 쪽을 권합니다.",
      basis:
        total >= 10
          ? `합산 ${total}%는 국내 미백 기능성 고시 범위(2~5%)를 크게 넘는 구간이라, 겹쳐 쓰면 붉어짐이 생기는 사람이 있습니다.`
          : "같은 성분을 여러 제품으로 겹쳐도 효과가 비례해서 늘지는 않고, 자극 가능성만 올라갑니다.",
      about: withNia.map(entryName),
    });
  }

  if (withNia.length > 0 && withTxa.length > 0) {
    notes.push({
      level: "synergy",
      title: "나이아신아마이드와 트라넥삼산은 겹칠 값이 있어요",
      detail: "색소 관리에서 서로 다른 지점을 맡기 때문에 한쪽만 쓰는 것보다 낫습니다.",
      basis:
        "나이아신아마이드는 만들어진 멜라닌이 표피 세포로 넘어가는 단계를, 트라넥삼산은 자외선 자극이 멜라닌 생성 신호로 이어지는 앞단을 건드립니다.",
      about: [...withNia.map(entryName), ...withTxa.map(entryName)],
    });
  }

  // ── 3. 빠진 것 ──
  const hasPigmentCare = withNia.length > 0 || withTxa.length > 0 || withVitC.length > 0;
  if (hasPigmentCare && withSun.length === 0) {
    notes.push({
      level: "caution",
      title: "자외선 차단제가 빠져 있어요",
      detail: "색소 쪽을 관리하는 제품이 있는데 차단이 없으면 옅힌 만큼 다시 쌓입니다.",
      basis:
        "색소는 자외선 자극으로 계속 새로 만들어지기 때문에, 차단이 없으면 앞 단계가 상쇄됩니다.",
      about: withNia.concat(withTxa, withVitC).map(entryName),
    });
  }

  // ── 4. 순서표 ──
  /**
   * 항목마다 자리를 **정확히 하나만** 준다. 예전엔 여러 규칙이 각자 push해서
   * 복합기가 아침·저녁에 두 번, 각질 제품이 저녁·주간에 두 번 나왔다.
   *
   * rank는 한 시간대 안에서의 순서:
   *  1 기기(바르기 전) · 2 세럼·앰플 · 3 기기(바른 후) · 4 마무리 크림 · 5 자외선 차단
   */
  type Placed = { slot: Slot; rank: number; name: string; how: string };
  const placed: Placed[] = [];

  for (const d of devices) {
    const s = deviceSlot(devicesOf(d), e2SpecSaysGelFree(d));
    placed.push({ slot: s.slot, rank: s.rank, name: entryName(d), how: s.how });
  }

  for (const c of cosmetics) {
    // 각질 제품은 매일 쓰는 자리가 아니다 — 주간 자리에만 둔다
    if (has(c, "aha-bha")) {
      placed.push({
        slot: "주 1~2회",
        rank: 2,
        name: entryName(c),
        how: "레티놀과 같은 날은 피해서",
      });
      continue;
    }
    if (has(c, "sunscreen")) {
      placed.push({ slot: "아침", rank: 5, name: entryName(c), how: "아침 마지막 단계" });
      continue;
    }
    if (has(c, "vitaminC")) {
      placed.push({ slot: "아침", rank: 2, name: entryName(c), how: "토너 후 먼저" });
      continue;
    }
    if (has(c, "ceramide")) {
      placed.push({
        slot: "저녁",
        rank: 4,
        name: entryName(c),
        how: "마지막 단계로 수분을 잠가요",
      });
      continue;
    }
    placed.push({
      slot: "저녁",
      rank: 2,
      name: entryName(c),
      how: has(c, "retinol") ? "저녁에만 — 토너 후 세럼 단계" : "토너 후 세럼 단계",
    });
  }

  const slotOrder: Slot[] = ["아침", "저녁", "주 1~2회"];
  const steps: Step[] = placed
    .sort(
      (a, b) => slotOrder.indexOf(a.slot) - slotOrder.indexOf(b.slot) || a.rank - b.rank
    )
    .map((p, i) => ({ order: i + 1, slot: p.slot, name: p.name, how: p.how }));

  return { steps, notes };
}

/** 브랜드가 사양에 "전용 젤 불필요"로 명시했는지 */
function e2SpecSaysGelFree(e: Entry): boolean {
  if (e.kind !== "product") return false;
  return (e.product.specs ?? []).some(
    (s) => s.label === "전용 젤" && s.value.includes("불필요")
  );
}

/**
 * AI 문장 다듬기 자리 (아직 미연결).
 *
 * 붙일 때 지킬 것: `check()`의 판정 결과를 **입력으로만** 넘기고,
 * 모델이 새로운 병용 판정이나 성분 주장을 만들지 못하게 한다.
 * 즉 level/title/about은 고정하고 detail 문장만 사용자 어투에 맞게 바꾸는 용도.
 * 판정 자체를 모델에 맡기면 이 파일이 존재하는 이유가 없어진다.
 */
export async function explain(result: Result): Promise<Result> {
  return result;
}
