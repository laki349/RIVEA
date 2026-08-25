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
  /**
   * 근거. `docs/17-ingredient-evidence.md`에서 그대로 가져온다.
   * **여기에 새 문장을 지어내지 않는다.** 문서에 없으면 비워둔다 —
   * 빈 칸이 창작보다 낫다. 화면에는 「근거 정리 전」이 그대로 나간다.
   */
  evidence?: Evidence;
  /**
   * 언제 판정하나. 설문 최대 신호가 「효과 모르겠다」 72%였다(`docs/15`).
   * 처음부터 시점을 말해두면 그 72%에 직접 답한다.
   * 숫자의 출처는 시험 설계의 관찰 시점이라 성분마다 다르다.
   */
  verdictWeeks?: number;
};

/**
 * 근거 등급 (`docs/17` §0).
 *  A — 체계적 문헌고찰 · 메타분석 · 대규모 RCT
 *  B — 단일 RCT · 통제된 임상
 *  C — 관찰연구 · 기전 설명 · 2차 정리 문헌
 * 브랜드 자체 시험·원료사 자료는 애초에 올리지 않는다.
 */
export type EvidenceGrade = "A" | "B" | "C";

export type Evidence = {
  grade: EvidenceGrade;
  /** 한 줄. **결과를 약속하지 않고 「보고됐다」까지만 쓴다** */
  claim: string;
  /** 출처. 사람이 찾아갈 수 있는 수준까지 (저널·연도·PMID) */
  source: string;
  /** 같이 말해야 정직한 단서. 숨기면 나중에 신뢰가 통째로 간다 */
  caveat?: string;
};

/** 등급을 화면에 뭐라고 쓰나 — 알파벳만 보여주면 아무 뜻이 없다 */
export const gradeLabel: Record<EvidenceGrade, string> = {
  A: "메타분석·대규모 임상",
  B: "임상시험",
  C: "기전·관찰 연구",
};

export const activeInfo: Record<ActiveKey, ActiveInfo> = {
  niacinamide: {
    name: "나이아신아마이드",
    concerns: ["pigment", "pore"],
    role: "멜라닌이 피부 위층으로 옮겨가는 단계에서 작용해요",
    evidence: {
      grade: "B",
      claim: "국소 도포 임상에서 색소 지표와 경피수분손실(TEWL) 개선이 보고됐어요. 통제 시험에서 쓰인 농도는 대략 1.4~10% 범위예요.",
      source: "다수 RCT (docs/17 §3)",
      caveat: "높을수록 좋은 게 아니에요. 한 시험에서 4%가 2%보다 효과적이었지만 자극도 더 잦았어요. 토너·세럼·크림에 같이 들어 있으면 합산됩니다.",
    },
    verdictWeeks: 12,
  },
  tranexamic: {
    name: "트라넥삼산",
    concerns: ["pigment"],
    role: "멜라닌을 만들라는 신호 쪽에서 작용해요",
    evidence: {
      grade: "A",
      claim: "바르는 형태는 8주차부터 색소 지표가 움직이는 것으로 보고됩니다.",
      // ⚠️ 2026-08-25 수정 (QA ISSUE-004). 전에는 출처가 하나였는데 caveat의 「레이저·IPL
      //    대비 순위」는 PMID 38843906이 아니라 **다른 논문**의 내용이었다. 사실은 맞고
      //    출처가 틀린 인용이라, 발표에서 PMID를 열면 그 문장이 없다. 둘로 나눴다.
      //    확인 못 한 「RCT 63편」은 뺐다 — 초록·검색 어디에도 그 수가 없다.
      source:
        "Tranexamic acid as a therapeutic option for melasma management, J Dermatolog Treat 2024 · PMID 38843906 (경구>주사>바르는 것 순) / 형태 간 순위는 별도 네트워크 메타분석 PMC12562867 (14개 시험·738명)",
      caveat: "먹는 것·주사·바르는 것은 근거가 다르고, 바르는 형태가 셋 중 가장 약합니다. 별도 네트워크 메타분석에서는 바르는 형태가 레이저·시술 병용보다 순위가 낮았어요. 후기를 볼 때 형태를 확인하세요.",
    },
    verdictWeeks: 8,
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
    evidence: {
      grade: "B",
      claim: "원물(L-아스코르빅애씨드)은 RCT 3편 모두에서 대조군보다 매끄럽고 주름이 적다고 보고됐어요.",
      source: "체계적 문헌고찰 PMID 36200216 · PMID 37128827",
      caveat: "형태가 여러 개고 형태마다 근거가 다릅니다. 아스코르빌글루코사이드는 안정성이 장점이지만 원물과 동등하다는 임상 근거는 아직 없어요. 성분표에서 이름을 보세요.",
    },
    verdictWeeks: 12,
  },
  retinol: {
    name: "레티놀",
    concerns: ["wrinkle", "pore"],
    role: "피부 표면이 새로 도는 주기에 관여해요",
    evidence: {
      grade: "A",
      claim: "RCT 23편·3,905명 메타분석에서 잔주름과 색소침착 양쪽에서 유의한 개선을 보였어요.",
      source: "Scientific Reports 2025;15:26889 · 네트워크 메타분석",
      caveat: "이 분석의 상위 성분 상당수는 전문의약품이라 화장품으로는 못 삽니다. 「레티놀이 1위」는 아니고, 살 수 있는 것 중에 근거가 가장 두꺼운 쪽이에요.",
    },
    verdictWeeks: 12,
  },
  "aha-bha": {
    name: "AHA·BHA",
    concerns: ["pore"],
    role: "쌓인 각질을 떨어뜨리는 산이에요",
    evidence: {
      grade: "A",
      claim: "같은 메타분석에서 글라이콜릭애씨드(AHA)가 피부 거칠기 개선 1위였어요.",
      source: "Scientific Reports 2025;15:26889 · 네트워크 메타분석",
      caveat: "동시에 이상반응 위험이 높은 쪽으로 분류됐어요. 주 2회, 순한 것부터. BHA 단독 근거는 아직 정리 중입니다.",
    },
    verdictWeeks: 12,
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
    evidence: {
      grade: "B",
      claim: "1회 도포로 수분이 오르고 경피수분손실(TEWL)이 줄어든 상태가 최대 24시간 유지됐어요. 건조는 14·28일차에 유의하게 완화됐고요.",
      source: "세라마이드 우세 크림 RCT · PMC8459234",
      caveat: "핵심 근거가 습진(아토피) 대상 시험이에요. 노화성 건조에 그대로 옮겨 읽으면 안 됩니다. 다만 건성·민감 피부 대상 시험도 따로 있어요.",
    },
    verdictWeeks: 2,
  },
  panthenol: {
    name: "판테놀",
    concerns: ["dry"],
    role: "수분을 끌어와 붙잡아요",
  },
  sunscreen: {
    name: "자외선 차단 성분",
    // 주름을 넣은 건 마케팅이 아니라 **아래 인용이 광노화 시험이기 때문**이다.
    // Hughes 2013이 4.5년간 측정한 게 정확히 노화 지표고, 화장품에서 「노화를 늦춘다」를
    // 장기 시험으로 보인 사실상 유일한 항목이다. 여기에 wrinkle이 없으면 처방에서
    // 주름 고민에 선크림을 놓고도 이유를 말하지 못한다 — 근거가 가장 두꺼운 자리인데.
    concerns: ["sun", "wrinkle"],
    role: "자외선을 막거나 흩어요",
    evidence: {
      grade: "A",
      claim: "903명을 4.5년 추적한 무작위 시험에서 매일 바른 쪽의 광노화가 24% 적었어요. 화장품에서 「노화를 늦춘다」를 장기 시험으로 보인 사실상 유일한 항목이에요.",
      source: "Hughes MCB et al. Ann Intern Med 2013;158(11):781-790 · PMID 23732711",
      caveat: "측정한 건 손등 피부 미세지형이지 얼굴 주름이 아니에요. SPF 15+ 기준이고, 더 높은 지수가 비례해서 낫다는 근거는 이 시험에 없습니다.",
    },
  },
  hyaluronic: {
    name: "히알루론산",
    concerns: ["dry"],
    role: "물을 끌어와 각질층에 붙잡아두는 보습 성분이에요",
    evidence: {
      grade: "B",
      claim:
        "바르는 형태를 다룬 체계적 문헌고찰(RCT 3편 포함 6편)에서 주름·수분·탄력 지표 개선이 보고됐어요.",
      source: "Topical Hyaluronic Acid for Photoaged Skin: A Systematic Review of Formulation Effectiveness (2025)",
      caveat:
        "제형이 결과를 크게 가릅니다 — 같은 고찰에서 마이크로니들 패치가 일반 제형보다 낫다고 나왔어요. 분자 크기도 제품마다 다른데 대부분 공개하지 않습니다. 그리고 습도가 낮은 날엔 오히려 피부 속 수분을 끌어 쓸 수 있어서, 위를 덮는 크림 없이 이것만 바르면 더 당길 수 있어요.",
    },
    verdictWeeks: 2,
  },
  centella: {
    name: "센텔라·마데카소사이드",
    concerns: ["dry"],
    role: "장벽을 진정시키는 쪽에서 작용해요",
    evidence: {
      grade: "C",
      claim:
        "레이저 시술 후 회복을 본 이중맹검 RCT에서 3·7·14일차 홍반·색소 지표가 대조군보다 낮았어요. 당뇨 건성 피부 대상 3군 RCT(159명)에서는 피부 수분량이 대조군보다 높았고요.",
      source: "마데카소사이드 함유 마스크 RCT · PMC12232337 / 센텔라 경구·국소 3군 RCT · PMC7471832",
      caveat:
        "두 시험 다 일반 노화 피부가 아닙니다 — 하나는 레이저 시술 직후, 하나는 당뇨 환자예요. 게다가 뒤쪽은 먹는 것과 바르는 것을 같이 준 군이라 바르는 쪽만의 몫을 가를 수 없습니다. 「진정된다」까지는 말할 수 있고 그 이상은 아직이에요.",
    },
    verdictWeeks: 4,
  },
  pdrn: {
    name: "PDRN",
    // ⚠️ 주름·모공을 붙이지 않는다. 아래 근거가 정확히 그 반대를 말한다.
    //    콜라겐(500달톤)과 같은 구조의 문제이고, 우리는 콜라겐에서 이미 같은 판단을 했다.
    concerns: ["dry"],
    role: "연어 DNA에서 온 조각이에요. 바르는 형태는 표면에 머무릅니다",
    evidence: {
      grade: "C",
      claim:
        "주사 형태는 미용 목적 9개 연구·219명에서 주름·결·탄력 개선이 보고됐어요. 다만 그 근거의 질은 낮음~보통으로 평가됐습니다.",
      source: "PDRN 미용 적응증 체계적 문헌고찰 (2025) · 국소 전달 연구 PLOS One 2025 · PMC12388916",
      caveat:
        "바르는 것과 주사는 다릅니다. PDRN은 분자량이 크고 음전하를 띠어 피부 통과가 제한됩니다. 일반 분자량 PDRN을 세럼으로 바르면 목표인 진피 섬유아세포까지 닿지 않는다는 게 현재 정리예요 — 통과를 돕는 제형(중간 분자량·플라즈마 처리)은 연구 단계입니다. 바르는 PDRN에 기대할 수 있는 건 보습과 가벼운 결 정도이고, 주사 결과를 그대로 옮겨 읽으면 안 됩니다.",
    },
    verdictWeeks: 8,
  },
  collagen: {
    name: "콜라겐",
    // ⚠️ wrinkle을 뺐다 (2026-08-25). 아래 근거가 **바르는 콜라겐은 통과를 기대할 수 없다**는
    //    내용인데 주름을 달고 있으면, 처방이 그 근거를 근거로 주름 자리를 정당화하게 된다.
    //    먹는 형태는 "근거가 따로"이지 여기서 입증된 게 아니다. 그래서 inner만 남긴다.
    concerns: ["inner"],
    role: "먹는 형태로 공급하는 단백질 조각이에요",
    evidence: {
      grade: "C",
      claim: "천연 콜라겐은 분자량이 약 30만 달톤이고, 피부 통과 경험칙은 500달톤 이하예요. 바르는 형태의 실제 역할은 표면 보습막입니다.",
      source: "Bos & Meinardi. Exp Dermatol 2000;9(3):165-169 · PMID 10839713",
      caveat: "500달톤 룰은 경험칙이라 예외가 있어요. 「안 들어간다」가 아니라 「그 크기로는 통과를 기대할 근거가 없다」까지가 정확합니다. 먹는 형태는 근거가 따로예요.",
    },
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
