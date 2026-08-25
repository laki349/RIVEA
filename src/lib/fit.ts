import type { Product } from "@/data/catalog";
import { activeInfo } from "@/data/actives";
import type { SkinSignal } from "./profile";

/**
 * 「이게 나한테 맞나」 — 고민과 **다른 축**이다.
 *
 * 고민은 *무엇을 해결할까*이고, 적합성은 *내 피부가 견딜 만한가*다. 둘은 직교한다 —
 * 기미 고민인 사람이 지성일 수도 건성일 수도 있는데, 지금까지 처방은 그걸 안 봤다.
 * 설문에서 「고를 때 불편」 1위가 「이게 나한테 맞는 건지 모르겠다」 16/32(50%)였고
 * (`docs/15`), 그 문장의 '맞는'이 정확히 이쪽이다.
 *
 * ## 새 데이터를 만들지 않는다
 *
 * 제품에 「건성용」 태그를 손으로 붙이는 순간 QA ISSUE-001이 그대로 재발한다
 * (근거 없는 손 태그가 화면에서 이유로 읽히는 문제). 그래서 **파생만 쓴다** —
 * 이 프로젝트의 「파생할 수 있는 건 저장하지 않는다」 원칙 그대로다.
 *
 *  - **제형 무게**는 제품명에서 나온다. 젤·미스트·앰플 vs 크림·밤·오일.
 *  - **자극/진정**은 `actives`에서 나온다. 레티놀·산 vs 판테놀·센텔라·히알루론산·세라마이드.
 *
 * ⚠️ 판정이 안 되는 건 **중립**으로 둔다. 모르면 점수를 주지도 빼지도 않는다.
 */

/** 제형 무게. 이름이 유일하게 믿을 만한 신호다 (브랜드가 제형을 구조화해 공개하지 않는다) */
export type Texture = "light" | "mid" | "rich" | "unknown";

const LIGHT = /젤|미스트|플루이드|워터|토너|앰플|세럼|에센스|패드|리퀴드|부스터/;
const RICH = /크림|밤\b|오일|버터/;
const MID = /로션|밀크|이멀전/;

export function textureOf(p: Product): Texture {
  // 젤크림처럼 둘 다 걸리는 이름이 있다. **가벼운 쪽이 이긴다** —
  // 「젤크림」은 크림 자리를 채우되 무거운 제형은 아니라는 뜻으로 붙인 이름이다.
  if (LIGHT.test(p.name)) return "light";
  if (RICH.test(p.name)) return "rich";
  if (MID.test(p.name)) return "mid";
  return "unknown";
}

/** 자극 성향. `actives`가 있는 제품만 판정된다 — 없으면 중립이다 */
export type Irritation = "irritant" | "soothing" | "neutral";

export function irritationOf(p: Product): Irritation {
  const keys = (p.actives ?? []).map((a) => a.key);
  if (keys.some((k) => k === "retinol" || k === "aha-bha")) return "irritant";
  // 고함량 나이아신아마이드도 자극 쪽으로 본다 — 근거표의 caveat가 그렇게 적혀 있다
  const strongB3 = (p.actives ?? []).some((a) => a.key === "niacinamide" && (a.pct ?? 0) >= 10);
  if (strongB3) return "irritant";
  if (keys.some((k) => activeInfo[k]?.concerns.includes("dry"))) return "soothing";
  return "neutral";
}

/**
 * 고른 신호 → 조정 방향. **타입 이름을 만들지 않는다.**
 * 「당김 + 번들거림」이면 rich와 light가 동시에 오르는데, 그 상태가 곧 답이다 —
 * 가벼운 제형이면서 보습이 강한 쪽을 찾게 된다. 이름을 붙일 이유가 없다.
 */
export type FitWeights = { rich: number; light: number; gentle: number };

const RULES: Record<SkinSignal, Partial<FitWeights>> = {
  tight: { rich: 2 },
  shiny: { light: 2 },
  flaky: { rich: 2, gentle: 1 },
  sting: { gentle: 3 },
  breakout: { light: 2 },
};

export function weightsFrom(signals: SkinSignal[]): FitWeights {
  const w: FitWeights = { rich: 0, light: 0, gentle: 0 };
  for (const s of signals) {
    const r = RULES[s];
    w.rich += r.rich ?? 0;
    w.light += r.light ?? 0;
    w.gentle += r.gentle ?? 0;
  }
  return w;
}

export const hasWeights = (w: FitWeights) => w.rich > 0 || w.light > 0 || w.gentle > 0;

/**
 * 적합성 점수. **고민 점수를 뒤집지 않는 크기로 둔다.**
 *
 * 이건 「무엇을 살까」를 바꾸는 축이 아니라 「같은 자리에 후보가 여럿일 때 어느 쪽인가」다.
 * 고민 점수가 100 단위(`prescribe.ts` scoreFor)라 여기는 한 자리 수로 맞춘다 —
 * 피부 신호가 고민을 이기면, 기미를 고른 사람에게 기미와 무관한 제품이 나간다.
 */
export function fitScore(p: Product, w: FitWeights): number {
  if (!hasWeights(w)) return 0;
  let s = 0;

  const tex = textureOf(p);
  const irr = irritationOf(p);

  /**
   * **당김과 번들거림을 동시에 고른 경우.**
   *
   * 40대+에 흔한 상태이고 4분법 어디에도 없다. 처음엔 rich와 light를 서로 빼도록
   * 짰는데, 그러면 둘이 **상쇄돼서 아무것도 안 고른 것과 같아진다** — 정확히 이
   * 사람들이 답을 못 받는다. 안 맞는 사람을 없애려고 만든 기능이 그 사람을 다시 버린다.
   *
   * 그래서 두 축을 **다른 수단에 배정한다.**
   *  - 번들거림은 **제형**의 문제다 → 가벼운 쪽을 고른다
   *  - 당김은 **보습**의 문제다 → 성분(판테놀·히알루론산·세라마이드·센텔라)으로 채운다
   *
   * "가벼운데 보습이 강한 것"이 답이고, 우리는 그걸 수분부족지성이라 부를 필요가 없다.
   */
  const both = w.rich > 0 && w.light > 0;

  if (both) {
    if (tex === "light") s += w.light;
    if (tex === "rich") s -= 1;
    // 보습을 제형 대신 성분에서 받는다
    if (irr === "soothing") s += w.rich;
  } else {
    if (tex === "rich") s += w.rich - w.light;
    if (tex === "light") s += w.light - w.rich;
    if (irr === "soothing") s += w.gentle;
  }

  // 자극 회피는 어느 경우에나 같다
  if (irr === "irritant") s -= w.gentle * 2;

  return s;
}
