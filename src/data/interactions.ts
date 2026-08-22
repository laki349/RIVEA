import type { ActiveKey, DeviceKind } from "./catalog";

/**
 * 성분을 **같이 쓸 때** 알아둘 것.
 *
 * 왜 이 파일이 이 앱의 중심인가: 40대+가 화장품에서 실제로 막히는 지점은
 * "뭘 사지"가 아니라 **"이걸 같이 써도 되나, 어떤 순서로 쓰나"** 다.
 * 상품을 파는 곳은 이 답을 주지 않는다 — 브랜드는 자기 제품 하나만 설명하고,
 * 종합몰은 조합을 볼 이유가 없다. 중개형인 이 앱은 장바구니 안에 여러 브랜드가
 * 섞이므로 **조합을 볼 수 있는 유일한 자리**다.
 *
 * ⚠️ 표현의 선 (actives.ts와 같은 원칙, 더 조심해서)
 *
 * 여기 적는 건 **사용 안내**지 효능·안전성 판정이 아니다.
 * - "자극이 있을 수 있어요 / 시간대를 나누세요" → 일반 사용 안내. 괜찮다.
 * - "이 조합이 주름에 더 좋아요" → 기능성 표시. 쓰지 않는다.
 * - "이 조합은 위험합니다" → 안전성 단정. 쓰지 않는다. 피부 반응은 사람마다 다르다.
 *
 * `kind`를 세 가지로 나눈 것도 그래서다. 경고만 늘어놓으면 앱이 겁을 주고,
 * 겁을 주면 사용자는 아무것도 안 사는 게 아니라 **앱을 닫는다.**
 * - `caution` 나눠 쓰면 되는 것 (금지가 아니다)
 * - `pair`    한쪽을 쓰면 다른 쪽이 따라와야 하는 것
 * - `fine`    괜히 걱정하는 조합 — 괜찮다고 말해주는 것도 정보다
 */
export type InteractionKind = "caution" | "pair" | "fine";

export type Interaction = {
  /** 성분 두 개. 순서는 판정에 쓰지 않는다 */
  pair: [ActiveKey, ActiveKey];
  kind: InteractionKind;
  /** 한 줄 제목 */
  title: string;
  /** 왜 그런지 — 작용 지점만. 결과를 약속하지 않는다 */
  why: string;
  /** 그래서 어떻게 쓰면 되는지. caution이면 반드시 있다 */
  how: string;
};

export const interactions: Interaction[] = [
  {
    pair: ["retinol", "aha-bha"],
    kind: "caution",
    title: "레티놀과 산은 날을 나눠서",
    why: "둘 다 피부 표면이 새로 도는 주기에 관여해요. 같은 날 겹치면 자극이 쌓이기 쉬워요.",
    how: "월·수·금은 레티놀, 화·목은 산처럼 요일을 나누세요. 둘 다 처음이라면 한 가지부터 시작하는 게 편해요.",
  },
  {
    pair: ["retinol", "vitaminC"],
    kind: "caution",
    title: "레티놀과 비타민C는 시간대를 나눠서",
    why: "비타민C는 산성에서, 레티놀은 그렇지 않은 환경에서 안정적이에요. 한 단계에 겹쳐 바르면 서로 불안정해질 수 있어요.",
    how: "비타민C는 아침, 레티놀은 저녁으로 나누면 둘 다 쓸 수 있어요.",
  },
  {
    pair: ["vitaminC", "aha-bha"],
    kind: "caution",
    title: "비타민C와 산을 한 번에 겹치지 않게",
    why: "둘 다 산성이라 같은 단계에 올리면 따가움을 느끼는 분이 있어요.",
    how: "산은 저녁, 비타민C는 아침으로 나누거나 하루 걸러 쓰세요.",
  },
  {
    pair: ["retinol", "sunscreen"],
    kind: "pair",
    title: "레티놀을 쓰면 아침 자외선 차단은 함께",
    why: "레티놀을 쓰는 동안에는 피부가 자외선에 평소보다 민감해져요.",
    how: "저녁에 레티놀을 썼다면 다음 날 아침 자외선 차단제를 빠뜨리지 마세요.",
  },
  {
    pair: ["aha-bha", "sunscreen"],
    kind: "pair",
    title: "각질을 정리한 다음 날은 자외선 차단을",
    why: "각질을 걷어낸 직후의 피부는 자외선을 그대로 받아요.",
    how: "산을 쓴 다음 날 아침엔 자외선 차단제를 평소보다 넉넉히 바르세요.",
  },
  {
    pair: ["niacinamide", "vitaminC"],
    kind: "fine",
    title: "나이아신아마이드와 비타민C, 같이 써도 괜찮아요",
    why: "예전엔 같이 쓰지 말라는 이야기가 돌았지만, 지금 시중에 나온 제품들은 대부분 함께 배합돼 나와요.",
    how: "그대로 쓰셔도 됩니다. 따가움이 느껴지면 그때 단계를 나누세요.",
  },
  {
    pair: ["niacinamide", "retinol"],
    kind: "fine",
    title: "나이아신아마이드와 레티놀은 자주 같이 나와요",
    why: "레티놀 제품에 나이아신아마이드를 함께 넣어 파는 경우가 많아요.",
    how: "따로 챙길 건 없어요. 레티놀 쪽 사용 빈도만 천천히 늘리세요.",
  },
];

/**
 * 기기와 성분. 기기는 성분이 아니라 별도 규칙이 필요하다.
 *
 * 기기 쪽은 표현을 더 좁게 잡는다 — 2019년 식약처가 비의료용 LED 마스크 48개에
 * 시정명령을 낸 사유가 기기에 효능을 붙인 것이었다. 여기서는 **효과를 말하지 않고
 * 순서와 간격만** 말한다.
 */
export type DeviceCaution = {
  active: ActiveKey;
  title: string;
  why: string;
  how: string;
};

export const deviceCautions: DeviceCaution[] = [
  {
    active: "aha-bha",
    title: "각질을 정리한 날은 기기를 쉬어요",
    why: "산을 쓴 직후의 피부는 평소보다 자극을 느끼기 쉬워요.",
    how: "산을 쓴 날과 기기를 쓰는 날을 하루 걸러 두세요.",
  },
  {
    active: "retinol",
    title: "레티놀을 쓴 날은 기기를 쉬어요",
    why: "레티놀도 표면이 새로 도는 주기에 관여해서, 같은 날 기기까지 더하면 자극이 겹쳐요.",
    how: "레티놀은 저녁, 기기는 레티놀을 쉬는 날에 쓰세요.",
  },
];

/** 기기를 바르기 **전**에 쓰는지 **후**에 쓰는지 — 작동 방식이 가른다 */
export function devicePlacement(kinds: DeviceKind[] | undefined): "before" | "after" {
  // 광 기반은 빛이 피부에 닿아야 하니 아무것도 바르지 않은 상태에서,
  // 전류·초음파 기반은 올린 것을 밀어 넣는 방식이라 바른 다음에 쓴다.
  if (kinds?.length && kinds.every((k) => k === "led")) return "before";
  return "after";
}

/**
 * 성분 묶음 하나에 걸리는 규칙을 모두 찾는다.
 *
 * 주의(caution)를 먼저, 짝(pair) 다음, 괜찮음(fine)을 마지막에 둔다 —
 * 사용자가 위에서부터 읽으므로 행동이 필요한 것이 위에 있어야 한다.
 */
const ORDER: Record<InteractionKind, number> = { caution: 0, pair: 1, fine: 2 };

export function findInteractions(keys: ActiveKey[]): Interaction[] {
  const set = new Set(keys);
  return interactions
    .filter(({ pair }) => set.has(pair[0]) && set.has(pair[1]))
    .sort((a, b) => ORDER[a.kind] - ORDER[b.kind]);
}

/** 기기가 함께 있을 때만 걸리는 규칙 */
export function findDeviceCautions(keys: ActiveKey[], hasDevice: boolean): DeviceCaution[] {
  if (!hasDevice) return [];
  const set = new Set(keys);
  return deviceCautions.filter((c) => set.has(c.active));
}
