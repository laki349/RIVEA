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
  // 눈가와 목은 **얼굴 크림 자리를 뺏으면 안 된다.**
  // 자리를 안 만들고 넣었더니 「넥 링클 크림」이 이름에 크림이 있다는 이유로
  // 얼굴 마지막 자리에 앉았다 — 6만원짜리 목 전용 제품을 얼굴에 바르라는 처방이 된다.
  // 둘 다 OPTIONAL이라 채울 게 없으면 자리째 사라진다 (prescribe.ts).
  "eye",
  "cream",
  "neck",
  "sun",
  "makeup",
] as const;

export type Step = (typeof STEP_ORDER)[number] | "mask" | "scalp" | "inner" | "device";

export const STEP_LABEL: Record<Step, string> = {
  cleanse: "세안",
  exfoliate: "각질 정리",
  toner: "토너",
  serum: "세럼·앰플",
  eye: "눈가",
  cream: "크림",
  neck: "목·턱선",
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
   * **한 단계 안에서의 역할.** 같은 역할끼리는 둘 중 하나지, 같이 쓰는 게 아니다.
   *
   * 왜 생겼나: 두피 제품이 샴푸 하나뿐일 땐 「자리 하나에 둘까지」로 충분했다.
   * 샴푸가 둘이 되자 처방이 **샴푸 두 개를 같이 쓰라고** 내밀었다 —
   * 「감는 것」과 「감고 남기는 것」이 다른 역할인데 단계 이름이 `scalp` 하나여서
   * 구분할 수가 없었다. 역할이 없으면(undefined) 그 단계는 **하나만** 고른다.
   */
  sub?: "wash" | "leave-in";
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

/**
 * 두피 안에서의 역할 — 여기서도 제품명이 가장 정확한 신호다.
 * 샴푸는 씻어내고, 토닉·세럼·트리트먼트는 남긴다. 순서도 그 순서다.
 */
function subOfScalp(name: string): "wash" | "leave-in" {
  return /샴푸/.test(name) ? "wash" : "leave-in";
}

/**
 * 스킨케어 안에서의 자리 — 제품명이 가장 정확한 신호다.
 *
 * ⚠️ **부위 판정이 제형 판정보다 먼저다.** 「아이크림」·「넥 링클 크림」에는 둘 다
 *    「크림」이 들어 있어서, 제형을 먼저 보면 눈가·목 전용 제품이 얼굴 크림 자리를
 *    차지한다. 어디에 바르는가가 무엇으로 바르는가보다 앞선다.
 */
function stepOfSkincare(name: string): Step {
  if (/아이크림|아이 크림|눈가|아이세럼|아이 세럼/.test(name)) return "eye";
  if (/넥|목주름|데콜테/.test(name)) return "neck";
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
  // 필링젤·토너패드도 마찬가지 — 카테고리는 클렌징인데 자리는 각질 정리다
  "c-roundlab-dokdo-peeling": { step: "exfoliate", slot: "pm", lifespanDays: 90 },
  "c-mediheal-teatree-pad": { step: "exfoliate", slot: "pm", lifespanDays: 50 },
  "c-mediheal-pdrn-pad": { step: "exfoliate", slot: "pm", lifespanDays: 50 },
  "c-anua-clear-pad": { step: "exfoliate", slot: "pm", lifespanDays: 45 },
  "c-glasslike-pha-pad": { step: "exfoliate", slot: "pm", lifespanDays: 45 },
  "c-torriden-vita-pad": { step: "exfoliate", slot: "pm", lifespanDays: 45 },
  "c-torriden-dive-peeling": { step: "exfoliate", slot: "pm", lifespanDays: 90 },
  "c-torriden-cica-pad": { step: "exfoliate", slot: "pm", lifespanDays: 40 },
  "c-numbuzin-pha-pack": { step: "exfoliate", slot: "pm", lifespanDays: 60 },
  // 이중세안은 저녁에만 한다. 아침 세안 자리까지 오일로 채우면 없던 숙제가 생긴다
  "c-roundlab-dokdo-cleansing-oil": { slot: "pm", lifespanDays: 60 },
  "c-anua-cleansing-oil": { slot: "pm", lifespanDays: 60 },
  "c-torriden-dive-oil": { slot: "pm", lifespanDays: 60 },
  // 레티놀은 저녁 전용
  "c-anua-retinol": { step: "serum", slot: "pm", lifespanDays: 75 },
  // 아침·저녁 둘 다 쓰는 세럼들
  "c-lrp-melab3": { slot: "both" },
  "c-anua-pdrn-serum": { slot: "both", lifespanDays: 75 },
  // 국소 도포라 한 통이 오래 간다
  "c-glasslike-wrinkle": { lifespanDays: 120 },
  "c-glasslike-lip": { slot: "both", lifespanDays: 90 },
  // 55g 크림
  "c-medicube-txa-cream": { step: "cream", lifespanDays: 75 },
  // 500ml 샴푸
  "c-drforhair-bio3": { lifespanDays: 75 },
  "c-drforhair-thickening-shampoo": { lifespanDays: 75 },
  // 10매입 — 주 2~3회면 한 달
  "c-mediheal-madeca": { lifespanDays: 30 },
  "c-mediheal-teatree": { lifespanDays: 30 },
  "c-roundlab-dokdo-mask": { lifespanDays: 30 },
  // 미스트는 이름으로 이미 toner 자리다. 아침·저녁 둘 다 쓴다
  "c-anua-pdrn-mist": { slot: "both", lifespanDays: 60 },
  // 아침·저녁 둘 다 쓰는 수분 라인 (아누아 자작나무 3종 · 시카플라스트 · PDRN 세럼)
  "c-anua-birch-toner": { slot: "both", lifespanDays: 80 },
  "c-anua-birch-serum": { slot: "both", lifespanDays: 60 },
  "c-anua-birch-cream": { slot: "both", lifespanDays: 60 },
  "c-laroche-cicaplast": { slot: "both", lifespanDays: 90 },
  "c-mediheal-pdrn-serum": { slot: "both", lifespanDays: 70 },
  // 90ml·100ml 대용량
  "c-glasslike-pdrn-ampoule": { slot: "both", lifespanDays: 110 },
  "c-glasslike-gel-cream": { slot: "both", lifespanDays: 90 },
  "c-glasslike-barrier-cream": { slot: "both", lifespanDays: 60 },
  "c-glasslike-modeling-mask": { lifespanDays: 28 },
  "c-torriden-dive-mask": { lifespanDays: 30 },
  "c-torriden-cell-collagen-mask": { lifespanDays: 30 },
  // 300ml 토너 · 100ml 크림 — 아침·저녁 둘 다
  "c-torriden-dive-toner": { slot: "both", lifespanDays: 90 },
  "c-torriden-dive-serum": { slot: "both", lifespanDays: 70 },
  "c-torriden-dive-cream": { slot: "both", lifespanDays: 90 },
  "c-torriden-dive-mist": { slot: "both", lifespanDays: 60 },
  "c-torriden-vita-toner": { slot: "both", lifespanDays: 70 },
  "c-torriden-cica-toner": { slot: "both", lifespanDays: 80 },
  "c-torriden-cica-cream": { slot: "both", lifespanDays: 75 },
  "c-torriden-cica-mask": { lifespanDays: 30 },
  "c-torriden-dive-milk": { slot: "pm", lifespanDays: 60 },
  "c-torriden-dive-water": { slot: "pm", lifespanDays: 70 },
  "c-numbuzin-cleansing-oil": { slot: "pm", lifespanDays: 60 },
  "c-numbuzin-panto-serum": { slot: "both", lifespanDays: 70 },
  "c-numbuzin-panto-cream": { slot: "both", lifespanDays: 75 },
  "c-numbuzin-boost-toner": { slot: "both", lifespanDays: 70 },
  "c-numbuzin-panto-gauze": { lifespanDays: 30 },
  "c-torriden-dive-glow-serum": { slot: "both", lifespanDays: 90 },
  // 국소 도포라 한 통이 오래 간다
  "c-torriden-vita-spot": { slot: "pm", lifespanDays: 120 },
  "c-torriden-lip-essence": { slot: "both", lifespanDays: 90 },
  // 30포 = 하루 1포
  "c-nutree-timezero": { lifespanDays: 30 },
  "c-nutree-time-biotin": { lifespanDays: 30 },
  "c-nutree-time-retinol": { lifespanDays: 30 },
  "c-nutree-skinhair": { lifespanDays: 28 },
  // 두피 토닉·세럼은 감고 난 뒤 자리다 — 샴푸(both)와 달리 저녁 한 번으로 잡는다
  "c-drforhair-tonic": { slot: "pm", lifespanDays: 60 },
  "c-drforhair-serum": { slot: "pm", lifespanDays: 50 },
  // 리필 15g 쿠션
  "c-iope-aircushion": { lifespanDays: 75 },
  "c-hera-black-cushion": { lifespanDays: 150 },
  "c-clio-concealer": { lifespanDays: 120 },
  // 눈가·목은 쓰는 양이 적어 한 통이 오래 간다
  "c-ahc-eyecream": { slot: "both", lifespanDays: 90 },
  "c-ahc-eyecream-s13": { slot: "both", lifespanDays: 110 },
  "c-eucerin-eyecream": { slot: "both", lifespanDays: 60 },
  "c-centellian24-eyecream": { slot: "both", lifespanDays: 60 },
  "c-medicube-neck-cream": { slot: "pm", lifespanDays: 90 },
  "c-estra-atobarrier-cream": { slot: "both", lifespanDays: 75 },
  // 50ml 크림 두 종 — 아침·저녁 둘 다 쓰는 마지막 자리
  "c-anua-pdrn-cream": { slot: "both", lifespanDays: 60 },
  // 나이아신아마이드는 레티놀과 달리 빛을 피할 이유가 없다 — 아침 크림 자리도 이걸로 채운다
  "c-roundlab-vita-cream": { slot: "both", lifespanDays: 60 },
  // 200ml 토너 · 50ml 크림 — 아침·저녁 둘 다 쓰는 자리
  "c-roundlab-dokdo-toner": { slot: "both", lifespanDays: 70 },
  "c-roundlab-dokdo-cream": { slot: "both", lifespanDays: 60 },
  "c-roundlab-birch-cleanser": { slot: "both" },
};

export function regimenOf(p: Product): Regimen {
  const base = BY_CATEGORY[p.category];
  const step = p.category === "skincare" ? stepOfSkincare(p.name) : base.step;
  const sub = p.category === "scalp-hair" ? subOfScalp(p.name) : undefined;
  return { ...base, step, ...(sub ? { sub } : {}), ...OVERRIDES[p.id] };
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
