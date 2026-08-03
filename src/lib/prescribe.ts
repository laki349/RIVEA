import { productOf, products, type Product } from "@/data/catalog";
import {
  devicePlacement,
  findDeviceCautions,
  findInteractions,
  type DeviceCaution,
  type Interaction,
} from "@/data/interactions";
import {
  STEP_LABEL,
  inSlot,
  regimenOf,
  stepRank,
  type Step,
} from "@/data/regimen";
import type { ShelfEntry } from "./shelf";

/**
 * 고민 → **아침·저녁 루틴**.
 *
 * 지금까지 프로필(고민)이 하던 일은 홈의 정렬을 바꾸는 것뿐이었다. 정렬은
 * "무엇을 살까"만 돕는다. **40대+가 실제로 막히는 지점은 순서다** —
 * 좋은 걸 사놓고도 토너 다음에 뭘 올릴지, 레티놀을 아침에 써도 되는지에서 멈춘다.
 * 유튜브로 배우는 세대가 아니고, 브랜드는 자기 제품 한 통의 사용법만 알려준다.
 *
 * 그래서 이 모듈은 상품을 고르는 게 아니라 **자리를 채운다.** 단계가 먼저 있고,
 * 각 자리에 고민에 맞는 제품을 하나씩 앉힌다. 빈 자리는 빈 자리로 보여준다 —
 * 채울 게 없으면 없다고 말하는 게 아무거나 끼워 넣는 것보다 정확하다.
 */

/** 아침·저녁의 자리. 비어 있어도 자리는 보여준다 (`OPTIONAL`은 예외) */
const AM_STEPS: Step[] = ["cleanse", "toner", "serum", "cream", "sun"];
const PM_STEPS: Step[] = ["cleanse", "exfoliate", "toner", "serum", "cream"];

/**
 * 비면 자리째 감추는 단계.
 *
 * 각질 정리는 **안 하는 게 기본**인 단계다. 세안처럼 "쓰시던 걸 쓰세요"로 남기면
 * 안 쓰던 사람에게 없던 숙제를 만든다. 세안·토너·크림은 누구나 하는 일이라 남긴다.
 */
const OPTIONAL: Step[] = ["exfoliate"];

export type Slotted = {
  step: Step;
  label: string;
  /** 이 자리에 앉은 제품. null이면 채울 게 없는 자리 */
  product: Product | null;
  /** 왜 이 자리에 이걸 놓았는지 — 고민 이름 */
  reason: string | null;
  /**
   * 이미 갖고 계신 것으로 채운 자리.
   *
   * 이 값이 있으면 **살 목록에서 뺀다.** 파는 앱이 하지 않는 일이고,
   * 여기서 신뢰가 붙는다 — 앱이 내 것을 알아보고 덜 팔았다는 사실이 남는다.
   */
  owned: { name: string } | null;
};

export type Prescription = {
  am: Slotted[];
  pm: Slotted[];
  /** 주 몇 회로 쓰는 것들 — 기기·팩. 매일 루틴과 섞으면 매일 써야 하는 줄 안다 */
  weekly: { product: Product; when: string }[];
  /** 처방 안에서 생기는 병용 주의 */
  notes: Interaction[];
  deviceNotes: DeviceCaution[];
  /** 매일 쓰는 자리에 앉은 상품 id — 전체 담기에 쓴다 */
  productIds: string[];
  /** 주 2~3회 것들의 id. 병용 판정에는 넣지만 전체 담기에는 넣지 않는다 */
  weeklyIds: string[];
};

/**
 * 고민 하나에 대해 제품을 고르는 점수.
 *
 * 실존 제품(source 있음)을 앞세우는 이유: 처방은 "이걸 사서 이렇게 쓰세요"라는
 * 말인데, 데모용으로 만든 상품을 그 자리에 놓으면 처방 자체가 데모가 된다.
 */
function scoreFor(p: Product, concerns: string[]): number {
  const hit = p.concerns.filter((c) => concerns.includes(c));
  if (hit.length === 0) return -1;
  // 첫 고민에 맞는 걸 가장 높게 — 프로필의 입력 순서가 우선순위다
  const best = Math.min(...hit.map((c) => concerns.indexOf(c)));
  let s = (concerns.length - best) * 100 + hit.length * 10;
  if (p.source) s += 40;
  s += p.rating;
  return s;
}

function pick(
  step: Step,
  slot: "am" | "pm",
  concerns: string[],
  used: Set<string>
): { product: Product; reason: string } | null {
  const pool = products
    .filter((p) => p.category !== "device")
    .filter((p) => {
      const r = regimenOf(p);
      return r.step === step && inSlot(r, slot);
    })
    .filter((p) => !used.has(p.id))
    .map((p) => ({ p, s: scoreFor(p, concerns) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);

  if (pool.length === 0) return null;
  const p = pool[0].p;
  // 이 제품이 붙은 고민 중, 사용자 우선순위가 가장 높은 것을 이유로 쓴다
  const hit = p.concerns.filter((c) => concerns.includes(c));
  const top = hit.sort((a, b) => concerns.indexOf(a) - concerns.indexOf(b))[0];
  return { product: p, reason: top };
}

/**
 * 세안·토너는 고민과 상관없이 필요한 자리다. 고민으로 못 채우면
 * 고민을 무시하고라도 채운다 — 세안 없는 루틴은 루틴이 아니다.
 */
function fillBasic(step: Step, slot: "am" | "pm", used: Set<string>): Product | null {
  const pool = products
    .filter((p) => p.category !== "device")
    .filter((p) => {
      const r = regimenOf(p);
      return r.step === step && inSlot(r, slot);
    })
    .filter((p) => !used.has(p.id))
    .sort((a, b) => (b.source ? 1 : 0) - (a.source ? 1 : 0) || b.rating - a.rating);
  return pool[0] ?? null;
}

const BASIC: Step[] = ["cleanse", "toner"];

/**
 * 갖고 계신 것으로 **대체할 수 있는** 자리.
 *
 * 세럼이 빠져 있는 게 핵심이다. 세안·토너·크림·선크림은 하나면 충분한 자리라
 * 이미 있으면 살 필요가 없다. 그런데 세럼은 **고민마다 다른 자리**다 —
 * 화장대에 비타민C 앰플 하나가 있다고 주름·모공 세럼 추천을 지우면,
 * 고민 3개를 받아놓고 세럼 하나로 다 된다고 말하는 셈이 된다.
 * (실제로 그렇게 만들었더니 아침·저녁 세럼 추천이 통째로 사라졌다.)
 */
const REPLACEABLE: Step[] = ["cleanse", "toner", "cream", "sun", "exfoliate", "scalp"];

export function prescribe(concerns: string[], shelf: ShelfEntry[] = []): Prescription {
  /**
   * 이미 자리를 잡은 제품. 아침·저녁을 통틀어 관리한다.
   *
   * 단, `slot: "both"` 제품은 **양쪽에 같이 놓는다.** 클렌저를 아침용·저녁용으로
   * 두 개 사는 사람은 없다. 처음엔 아침·저녁 중복을 전부 막았더니 저녁을 먼저
   * 짠 탓에 아침 세안·토너 자리가 통째로 비었다 — 규칙이 만든 가짜 빈자리였다.
   */
  const used = new Set<string>();

  const build = (steps: Step[], slot: "am" | "pm"): Slotted[] =>
    steps.map((step) => {
      const base = { step, label: STEP_LABEL[step] };

      // 갖고 계신 것이 이 자리에 맞으면 그것으로 채운다. 새로 살 것을 권하기 전에
      // 이미 있는 걸 쓰게 하는 게 순서다.
      const mine = REPLACEABLE.includes(step)
        ? shelf.find((e) => e.step === step)
        : undefined;
      if (mine) {
        return {
          ...base,
          product: mine.product,
          reason: null,
          owned: { name: mine.name },
        };
      }

      const hit = pick(step, slot, concerns, used);
      if (hit) {
        if (regimenOf(hit.product).slot !== "both") used.add(hit.product.id);
        return { ...base, product: hit.product, reason: hit.reason, owned: null };
      }
      if (BASIC.includes(step)) {
        const basic = fillBasic(step, slot, used);
        if (basic) {
          if (regimenOf(basic).slot !== "both") used.add(basic.id);
          return { ...base, product: basic, reason: null, owned: null };
        }
      }
      return { ...base, product: null, reason: null, owned: null };
    });

  // 저녁을 먼저 짠다. 색소·주름 성분은 대부분 저녁 자리라, 아침을 먼저 짜면
  // 저녁 세럼 자리에 놓을 게 남지 않는다.
  const pm = build(PM_STEPS, "pm").filter((s) => s.product || !OPTIONAL.includes(s.step));
  const am = build(AM_STEPS, "am").filter((s) => s.product || !OPTIONAL.includes(s.step));

  const weekly = weeklyFor(concerns, used);

  // 갖고 계신 자리(owned)는 살 목록에서 뺀다 — 병용 판정에는 화장대가 따로 들어간다
  const daily = Array.from(
    new Set(
      [...pm, ...am]
        .filter((s) => !s.owned)
        .map((s) => s.product)
        .filter((p): p is Product => p !== null)
    )
  );
  const all = [...daily, ...weekly.map((w) => w.product)];
  const keys = Array.from(
    new Set([
      ...all.flatMap((p) => (p.actives ?? []).map((a) => a.key)),
      ...shelf.flatMap((e) => e.actives),
    ])
  );

  return {
    am,
    pm,
    weekly,
    notes: findInteractions(keys),
    deviceNotes: findDeviceCautions(keys, all.some((p) => p.category === "device")),
    // 전체 담기는 **매일 쓰는 것만.** 기기는 10만원대 결정이라 루틴에 묶어
    // 담으면 담기 버튼 하나가 갑자기 13만원이 된다. 기기는 각자 담게 둔다.
    productIds: daily.map((p) => p.id),
    weeklyIds: weekly.map((w) => w.product.id),
  };
}

/** 주 2~3회 쓰는 것 — 기기 하나, 팩 하나까지. 더 넣으면 루틴이 숙제가 된다 */
function weeklyFor(concerns: string[], used: Set<string>) {
  const out: { product: Product; when: string }[] = [];

  const device = products
    .filter((p) => p.category === "device" && !used.has(p.id))
    .map((p) => ({ p, s: scoreFor(p, concerns) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)[0]?.p;
  if (device) {
    used.add(device.id);
    const where =
      devicePlacement(device.deviceKinds) === "before"
        ? "세안 후 아무것도 바르지 않은 상태에서"
        : "세럼을 바른 다음에";
    out.push({ product: device, when: `주 2~3회 저녁, ${where}` });
  }

  const mask = products
    .filter((p) => regimenOf(p).step === "mask" && !used.has(p.id))
    .map((p) => ({ p, s: scoreFor(p, concerns) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)[0]?.p;
  if (mask) {
    used.add(mask.id);
    out.push({ product: mask, when: "주 2회 저녁, 토너 다음에" });
  }

  return out;
}

/** 순서 표시용 — 화면에서 단계를 다시 정렬할 때 */
export const byStep = (a: { step: Step }, b: { step: Step }) =>
  stepRank(a.step) - stepRank(b.step);

export { productOf };
