import { productOf, type Category, type Product } from "./catalog";

/**
 * 제품을 **루틴의 어느 자리**에 놓을지, 그리고 **얼마나 쓰는지**.
 *
 * 카테고리(`skincare`)만으로는 자리를 못 정한다 — 토너·세럼·크림이 전부 skincare다.
 * `usage` 본문에 "저녁 토너 후" 같은 말이 있지만 자유 텍스트라 판정에 쓸 수 없다.
 * 그래서 여기서 **판정 가능한 값으로 한 번 더 접는다.**
 *
 * 카탈로그에 필드를 더하지 않고 파일을 나눈 이유: catalog.ts는 이미 1,100줄이고,
 * 이 값들은 "상품이 무엇인가"가 아니라 "이 앱이 상품을 어떻게 쓰는가"다.
 * actives.ts가 같은 이유로 분리돼 있다.
 */

/** 바르는 순서. 배열 인덱스가 곧 순서다 */
export const STEP_ORDER = [
  "cleanse",
  "exfoliate",
  "toner",
  "serum",
  "cream",
  "sun",
  "makeup",
] as const;

export type Step = (typeof STEP_ORDER)[number] | "mask" | "scalp" | "inner" | "device";

export const STEP_LABEL: Record<Step, string> = {
  cleanse: "세안",
  exfoliate: "각질 정리",
  toner: "토너",
  serum: "세럼·앰플",
  cream: "크림",
  sun: "자외선 차단",
  makeup: "베이스 메이크업",
  mask: "마스크팩",
  scalp: "두피",
  inner: "이너뷰티",
  device: "기기",
};

/** 언제 쓰는지 */
export type Slot = "am" | "pm" | "both";

export type Regimen = {
  step: Step;
  slot: Slot;
  /**
   * 표준 사용량으로 한 통을 쓰는 데 걸리는 **예상** 일수.
   * 용량과 1회 사용량에서 잡은 값이라 정확한 약속이 아니다 — 화면에서도 "쯤"으로만 말한다.
   * null이면 재구매 개념이 없다 (기기).
   */
  lifespanDays: number | null;
};

/**
 * 카테고리만으로 정해지는 기본값. 대부분 여기서 끝난다.
 * skincare만 이름을 봐야 하고, 그건 아래 `stepOfSkincare`가 맡는다.
 */
const BY_CATEGORY: Record<Category, Regimen> = {
  skincare: { step: "serum", slot: "pm", lifespanDays: 60 },
  device: { step: "device", slot: "pm", lifespanDays: null },
  "cover-makeup": { step: "makeup", slot: "am", lifespanDays: 90 },
  mask: { step: "mask", slot: "pm", lifespanDays: 35 },
  suncare: { step: "sun", slot: "am", lifespanDays: 45 },
  cleansing: { step: "cleanse", slot: "both", lifespanDays: 60 },
  "scalp-hair": { step: "scalp", slot: "both", lifespanDays: 60 },
  inner: { step: "inner", slot: "both", lifespanDays: 30 },
};

/** 스킨케어 안에서의 자리 — 제품명이 가장 정확한 신호다 */
function stepOfSkincare(name: string): Step {
  if (/토너|스킨|미스트/.test(name)) return "toner";
  if (/크림|밤|모이스처|로션/.test(name)) return "cream";
  return "serum";
}

/**
 * 개별 제품에서만 다른 값. 카테고리 기본값으로 안 맞는 것만 적는다.
 * (전부 적으면 카탈로그를 두 벌 관리하게 된다)
 */
const OVERRIDES: Record<string, Partial<Regimen>> = {
  // 산은 클렌징 카테고리에 있지만 자리는 세안 다음 "각질 정리"다
  "c-paulas-bha": { step: "exfoliate", slot: "pm", lifespanDays: 80 },
  // 레티놀은 저녁 전용
  "c-anua-retinol": { step: "serum", slot: "pm", lifespanDays: 75 },
  // 아침·저녁 둘 다 쓰는 세럼들
  "c-lrp-melab3": { slot: "both" },
  p3: { slot: "both", lifespanDays: 90 },
  // 국소 도포라 한 통이 오래 간다
  "c-glasslike-wrinkle": { lifespanDays: 120 },
  "c-glasslike-lip": { slot: "both", lifespanDays: 90 },
  // 55g 크림
  "c-medicube-txa-cream": { step: "cream", lifespanDays: 75 },
  // 500ml 샴푸
  "c-drforhair-bio3": { lifespanDays: 75 },
  // 10매입 — 주 2~3회면 한 달
  "c-mediheal-madeca": { lifespanDays: 30 },
  // 30포 = 하루 1포
  p8: { lifespanDays: 30 },
  // 리필 15g 쿠션
  "c-iope-aircushion": { lifespanDays: 75 },
  // 200ml 토너 · 50ml 크림 — 아침·저녁 둘 다 쓰는 자리
  "c-roundlab-dokdo-toner": { slot: "both", lifespanDays: 70 },
  "c-roundlab-dokdo-cream": { slot: "both", lifespanDays: 60 },
  "c-roundlab-birch-cleanser": { slot: "both" },
};

export function regimenOf(p: Product): Regimen {
  const base = BY_CATEGORY[p.category];
  const step = p.category === "skincare" ? stepOfSkincare(p.name) : base.step;
  return { ...base, step, ...OVERRIDES[p.id] };
}

export function regimenById(id: string): Regimen | null {
  const p = productOf(id);
  return p ? regimenOf(p) : null;
}

/** 아침/저녁 중 해당 시간대에 쓰는 제품인가 */
export function inSlot(r: Regimen, slot: "am" | "pm"): boolean {
  return r.slot === "both" || r.slot === slot;
}

/** 순서 정렬용 — STEP_ORDER에 없는 단계(기기·팩 등)는 뒤로 */
export function stepRank(step: Step): number {
  const i = (STEP_ORDER as readonly string[]).indexOf(step);
  return i === -1 ? STEP_ORDER.length : i;
}
