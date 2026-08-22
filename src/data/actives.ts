import type { ActiveKey } from "./catalog";

/**
 * 성분이 무엇을 하는 성분인지 — 상품 상세의 「성분이 하는 일」 바에 쓴다.
 *
 * ⚠️ 표현의 선을 여기서 지킨다.
 *
 * 화장품에서 **미백·주름개선·자외선차단은 「기능성화장품」 표시**라, 식약처 심사를 받은
 * 품목만 쓸 수 있는 말이다. 성분 하나를 두고 "미백에 좋아요"라고 적으면 심사받지 않은
 * 제품에 기능성 표시를 붙이는 셈이 된다.
 *
 * 그래서 `role`은 **작용 지점**만 적는다 — "무엇에 좋다"가 아니라 "어디서 작용한다".
 * `concerns`도 효능 주장이 아니라 **이 앱의 고민 분류로 가는 이동 수단**이다
 * (누르면 그 고민 화면으로 간다). 같은 이유로 **디바이스에는 이 바를 붙이지 않는다** —
 * 2019년 식약처가 비의료용 LED 마스크 48개에 시정명령을 낸 사유가 정확히
 * 기기에 효능을 붙인 것이었다 (docs/05 §0-A "지킨 선").
 */
export type ActiveInfo = {
  /** 화면 표시명 */
  name: string;
  /** 이 앱의 고민 slug — 누르면 그 고민 화면으로 */
  concerns: string[];
  /** 작용 지점 한 줄. 결과를 약속하지 않는다 */
  role: string;
};

export const activeInfo: Record<ActiveKey, ActiveInfo> = {
  niacinamide: {
    name: "나이아신아마이드",
    concerns: ["pigment", "pore"],
    role: "멜라닌이 피부 위층으로 옮겨가는 단계에서 작용해요",
  },
  tranexamic: {
    name: "트라넥삼산",
    concerns: ["pigment"],
    role: "멜라닌을 만들라는 신호 쪽에서 작용해요",
  },
  arbutin: {
    name: "알부틴",
    concerns: ["pigment"],
    role: "멜라닌을 만드는 효소에 달라붙어 작용해요",
  },
  vitaminC: {
    name: "비타민C",
    concerns: ["pigment"],
    role: "산화를 늦추는 항산화 성분이에요",
  },
  retinol: {
    name: "레티놀",
    concerns: ["wrinkle", "pore"],
    role: "피부 표면이 새로 도는 주기에 관여해요",
  },
  "aha-bha": {
    name: "AHA·BHA",
    concerns: ["pore"],
    role: "쌓인 각질을 떨어뜨리는 산이에요",
  },
  peptide: {
    name: "펩타이드",
    concerns: ["wrinkle"],
    role: "콜라겐을 만들라는 신호를 흉내 내는 조각이에요",
  },
  ceramide: {
    name: "세라마이드",
    concerns: ["dry"],
    role: "피부 장벽의 틈을 메우는 지질이에요",
  },
  panthenol: {
    name: "판테놀",
    concerns: ["dry"],
    role: "수분을 끌어와 붙잡아요",
  },
  sunscreen: {
    name: "자외선 차단 성분",
    concerns: ["sun"],
    role: "자외선을 막거나 흩어요",
  },
  collagen: {
    name: "콜라겐",
    concerns: ["inner", "wrinkle"],
    role: "먹는 형태로 공급하는 단백질 조각이에요",
  },
};

/**
 * 함량을 어떻게 읽을지. 브랜드가 공개한 값만 있고, 없으면 표시하지 않는다.
 * ppm으로 공개한 제품(메디큐브 50,000ppm)이 있어 %로 환산해 통일한다.
 */
export function pctLabel(pct?: number): string | null {
  if (pct === undefined) return null;
  // 소수점은 필요할 때만 (10% / 0.5%)
  return `${Number.isInteger(pct) ? pct : pct.toFixed(1)}%`;
}
