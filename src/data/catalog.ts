/**
 * RIVEA 카탈로그 — 브랜드·고민·상품·루틴세트
 *
 * ⚠️ 이 앱은 **랩 발표용 데모**다. 실제 판매하지 않는다 (홈 하단에 고지).
 *
 * **여기 있는 상품은 전부 실제로 파는 제품이다.** (2026-08-25)
 *
 * 전에는 데모 브랜드(source 없음) 8종이 섞여 있었다. 지웠다 — 처방은 "이걸 사서
 * 이렇게 쓰세요"라는 말인데, 존재하지 않는 제품이 그 자리에 앉으면 처방 전체가
 * 거짓이 된다. 아웃바운드(공식몰로 내보내기)를 퍼널의 끝으로 잡은 뒤로는
 * 나갈 곳이 없는 상품을 카드로 세울 이유도 없어졌다.
 *
 * 그래서 **`source` 없는 상품은 이 배열에 넣지 않는다.** 새 상품을 넣을 때는
 * 모델명·가격·물리 스펙을 공개 정보에서 실측 수집하고, `source`에 수집 출처
 * (sourceUrl)·확인 시점(pricedAt)·가격 성격(priceNote)을 남긴다.
 * 발표 때 "이 숫자 어디서 났나"에 답할 수 있어야 하므로 지우지 말 것.
 *
 * 다만 **평점·리뷰수·조회수(cohortViews)는 여전히 데모값이다** — 우리 집계가 아니다.
 * 실제 집계가 붙기 전까지 이 세 값을 근거로 무엇도 주장하지 않는다.
 *
 * 지키는 선 두 개:
 *  - **효과·효능 표현을 specs에 넣지 않는다.** 판매처에 "주름개선·탄력개선"으로
 *    표기돼 있어도 옮기지 않는다. specs는 측정 가능한 물리량(방식·파장·무게·시간)만.
 *    2019년 식약처가 비의료용 LED 마스크 48개 제품에 시정명령을 낸 사유가 이것이다.
 *  - **브랜드 제품 사진을 쓰지 않는다.** 저작물이고 이 앱은 공개 배포된다.
 *    `image`는 docs/04로 생성한 자체 이미지 21장을 제품 유형별로 매핑한 것 —
 *    해당 제품의 실제 사진이 아니라 유형 대표 이미지다.
 *
 * 비교표(디바이스 전용)는 공정위 「비교표시·광고에 관한 심사지침」 요건을 따른다:
 *   비교 항목·기준 명시 / 객관적 확인 가능한 사항만 / 가격 확인 시점 표기.
 */

// ── 고민 (concern-first IA의 축) ──────────────────
/**
 * 설문(n=32, `docs/15-survey-findings.md`)이 이 타입을 세 번 고치게 했다.
 *
 * ① **축은 확정.** 「내 피부 고민」이 1순위 1위 28/32(88%)다. 연령 무관(50대 21/24).
 *    이 IA를 두고 다시 논쟁하지 않는다.
 *
 * ② **`youIf` 신설** — 고를 때 불편 1위가 「이게 나한테 맞는 건지 모르겠다」 16/32(50%)였다.
 *    고민 이름만 있으면 그 50%를 못 넘긴다. **자기 확인 문장**이 있어야 "내 얘기다"가 성립한다.
 *
 * ③ **`verdictAt` 신설** — 쓰는 중 불편 1위가 「효과가 있는 건지 모르겠다」 23/32(72%)로
 *    설문 전체 최대 신호다. 고민마다 **언제 판정하는지**를 처음부터 알려주지 않으면
 *    방치·폐기(18/32, 56%)로 간다.
 *
 * ④ **`knownWords`** — 성분 병용 개념은 30/32가 모른다. 반면 성분 **단어**는 안다
 *    (Q22 실측: 히알루론산 6 · PDRN 3 · 나이아신아마이드 2 · 세라마이드 2 · 시카 2 ·
 *    비타민C 2 · 레티놀 2). 아는 단어로 먼저 말을 걸고 판정은 뒤에서 돌린다.
 */
export type Concern = {
  slug: string;
  name: string;
  question: string; // "왜 지금 ~?"
  intro: string;
  tips: { bold: string; rest: string }[];
  /**
   * 「이런 경우예요」 — 자기 확인 문장. 2~3개.
   * ⚠️ 진단이 아니다. 증상을 단정하지 않고 **관찰 가능한 상황**으로만 쓴다
   *    (화장품법 13조. 「~면 ~입니다」가 아니라 「~면 이쪽입니다」)
   */
  youIf: string[];
  /** 언제 판정하나. 「4주에 결론 내면 멀쩡한 것도 버린다」에 대한 답 */
  verdictAt: { weeks: number; what: string };
  /** 이 고민에서 사람들이 실제로 아는 성분 단어 (설문 Q22 기반). 앞에서 말을 걸 때 쓴다 */
  knownWords: string[];
};

export const concerns: Concern[] = [
  {
    slug: "pigment",
    name: "기미·잡티",
    question: "왜 지금 기미가 올라올까?",
    intro:
      "호르몬 변화와 누적된 자외선으로 멜라닌이 과잉 생성되는 시기예요. 한 번 진해진 색소는 천천히 옅어지기 때문에, 예방과 관리가 함께 가야 합니다.",
    tips: [
      { bold: "자외선 차단", rest: "아침 자외선 차단이 색소 관리의 절반" },
      { bold: "나이아신·비타C", rest: "저녁엔 나이아신·비타C로 톤 케어" },
      { bold: "디바이스", rest: "주 2~3회 디바이스로 집중 케어" },
    ],
    youIf: [
      "세수한 뒤 거울에서 광대 위쪽이 먼저 눈에 들어온다",
      "화장으로 가리는 시간이 작년보다 길어졌다",
      "여름 지나고 나서 돌아오지 않는 자리가 있다",
    ],
    verdictAt: { weeks: 12, what: "색소는 천천히 옅어집니다. 4주엔 아직 판단하지 마세요" },
    knownWords: ["나이아신아마이드", "비타민C", "PDRN", "트라넥삼산"],
  },
  {
    slug: "wrinkle",
    name: "주름·탄력",
    question: "탄력은 왜 갑자기 무너질까?",
    intro:
      "콜라겐 생성이 줄면서 피부 지지력이 약해지는 시기예요. 무너진 탄력은 바르는 것과 물리적 자극(리프팅)을 함께 써야 효과가 빨라집니다.",
    tips: [
      { bold: "콜라겐·펩타이드", rest: "저녁 루틴에 콜라겐·펩타이드 성분을" },
      { bold: "EMS 리프팅", rest: "아침 3분, EMS 리프팅 디바이스" },
      { bold: "목·턱선", rest: "얼굴만큼 목·턱선 라인도 함께" },
    ],
    youIf: [
      "표정을 풀어도 미간이나 눈가에 선이 남아 있다",
      "웃을 때 접히던 자리가 안 웃어도 보인다",
      "팔자 라인이 깊어진 것 같다",
    ],
    verdictAt: { weeks: 12, what: "구조는 가장 느리게 움직입니다. 자극은 그날 바로 판단하세요" },
    knownWords: ["레티놀", "콜라겐", "펩타이드"],
  },
  {
    slug: "dry",
    name: "건조",
    question: "왜 발라도 계속 당길까?",
    intro:
      "피부 장벽이 약해지면 수분을 채워도 금방 날아갑니다. 채우는 것보다 지키는 보습이 중요한 시기예요.",
    tips: [
      { bold: "세라마이드", rest: "세라마이드 장벽 성분으로 수분 잠그기" },
      { bold: "저자극 클렌징", rest: "저자극 클렌징으로 세안부터 순하게" },
      { bold: "수분 마스크", rest: "주 2회 수분 마스크로 집중 보습" },
    ],
    youIf: [
      "세수 직후 몇 분만 지나도 당긴다",
      "발랐는데 오후에 각질이 일어난다",
      "겨울이 아닌데도 화장이 들뜬다",
    ],
    verdictAt: { weeks: 2, what: "보습은 셋 중 가장 빨리 답이 옵니다. 2주면 알 수 있어요" },
    knownWords: ["히알루론산", "세라마이드", "시카", "판테놀"],
  },
  {
    slug: "sun",
    name: "자외선",
    question: "실내에서도 선크림이 필요할까?",
    intro:
      "창을 통과하는 생활 자외선이 색소와 주름의 주범이에요. 매일, 계절 없이 차단하는 습관이 최고의 안티에이징입니다.",
    tips: [
      { bold: "SPF50+", rest: "외출 전 마지막 단계는 SPF50+" },
      { bold: "덧바르기", rest: "낮엔 쿠션·스틱으로 덧바르기" },
      { bold: "톤업 겸용", rest: "톤업 겸용으로 커버와 차단을 한 번에" },
    ],
    youIf: [
      "실내에 있는 날엔 자외선 차단을 건너뛴다",
      "흐린 날엔 안 발라도 된다고 생각한 적이 있다",
      "아침에 바르고 하루 종일 덧바르지 않는다",
    ],
    verdictAt: { weeks: 0, what: "이건 판정할 게 아니라 매일 하는 겁니다. 지금 시작하세요" },
    knownWords: ["SPF", "PA", "무기자차"],
  },
  {
    slug: "pore",
    name: "모공",
    question: "모공은 왜 점점 늘어질까?",
    intro:
      "탄력 저하로 모공이 세로로 늘어나는 시기예요. 조이는 관리와 탄력 관리를 함께 해야 합니다.",
    tips: [
      { bold: "BHA", rest: "주 1~2회 BHA로 각질·피지 정리" },
      { bold: "수분", rest: "속건조 방지 — 수분 먼저 채우기" },
      { bold: "탄력 케어", rest: "모공 관리의 반은 탄력 케어" },
    ],
    youIf: [
      "모공이 동그랗지 않고 세로로 늘어나 보인다",
      "코보다 볼 쪽이 더 신경 쓰인다",
      "각질 제거를 해도 그때뿐이다",
    ],
    verdictAt: { weeks: 8, what: "모공은 조이는 것보다 탄력 쪽이 오래 걸립니다" },
    knownWords: ["BHA", "AHA", "나이아신아마이드"],
  },
  {
    slug: "scalp-hair",
    name: "두피·헤어",
    question: "머리숱, 관리로 지킬 수 있을까?",
    intro:
      "모발이 가늘어지고 두피가 예민해지는 시기예요. 두피도 피부 — 스킨케어처럼 단계적으로 관리하면 달라집니다.",
    tips: [
      { bold: "두피 스케일링", rest: "주 1회 두피 스케일링으로 노폐물 정리" },
      { bold: "볼륨 앰플", rest: "매일 볼륨 앰플로 모근 강화" },
      { bold: "LED 두피 디바이스", rest: "LED 두피 디바이스로 모근 자극" },
    ],
    youIf: [
      "가르마가 예전보다 넓어 보인다",
      "머리를 감을 때 빠지는 양이 달라졌다",
      "두피가 가렵거나 붉어질 때가 있다",
    ],
    verdictAt: { weeks: 12, what: "모발은 자라는 주기가 있어 최소 3개월을 봅니다" },
    knownWords: ["두피 스케일링", "비오틴"],
  },
  {
    slug: "inner",
    name: "이너뷰티",
    question: "바르는 것만으로 부족할 때",
    intro:
      "콜라겐·유산균·비타민 — 안에서 채우는 관리가 바르는 관리의 효과를 끌어올립니다.",
    tips: [
      { bold: "저분자 콜라겐", rest: "흡수율 높은 저분자 콜라겐 제형으로" },
      { bold: "유산균", rest: "장이 편해야 피부가 맑아요 — 유산균" },
      { bold: "꾸준함", rest: "이너뷰티는 꾸준함, 최소 8주" },
    ],
    youIf: [
      "바르는 건 챙기는데 달라지는 게 없다",
      "피부보다 컨디션 자체가 먼저 무너진다",
      "먹는 걸로도 관리해볼까 생각 중이다",
    ],
    verdictAt: { weeks: 8, what: "먹는 관리는 최소 8주. 그 전엔 판단이 안 됩니다" },
    knownWords: ["콜라겐", "유산균", "비타민"],
  },
];

// ── 브랜드 (입점사) ────────────────────────────────
export type Brand = {
  slug: string;
  name: string;
  tagline: string;
  since: string; // 입점 시기
  rating: number;
  freeShippingOver: number | null; // null = 배송비 별도
  shippingFee: number;
  /** 시중에 실제 존재하는 브랜드 (제품 스펙·가격이 실측 데이터) */
  isReal?: boolean;
  officialUrl?: string;
};

export const brands: Brand[] = [
  // 실제 시판 브랜드만 남긴다. 가상 브랜드 6곳(라비드·오브제·셀렌·뮤엘·온휴·비타랩)은
  // 2026-08-25에 소속 상품과 함께 지웠다 — 없는 회사의 배송비·무료배송 기준을
  // 화면에 띄우고 있었다.
  { slug: "medicube", name: "메디큐브", tagline: "에이피알 홈뷰티 디바이스", since: "2023", rating: 4.7, freeShippingOver: 30000, shippingFee: 3000, isReal: true, officialUrl: "https://themedicube.co.kr/age-r/main.html" },
  { slug: "lgpral", name: "LG 프라엘", tagline: "LG 뷰티 디바이스", since: "2023", rating: 4.6, freeShippingOver: 50000, shippingFee: 4000, isReal: true, officialUrl: "https://lgpralofficial.co.kr/" },
  { slug: "glasslike", name: "글래스라이크", tagline: "기기 전용 스킨케어", since: "2025", rating: 4.5, freeShippingOver: 30000, shippingFee: 3000, isReal: true, officialUrl: "https://www.lgcaremall.com/product/list/10665" },
  { slug: "cellreturn", name: "셀리턴", tagline: "LED·PEMF 웰니스 디바이스", since: "2024", rating: 4.6, freeShippingOver: null, shippingFee: 5000, isReal: true, officialUrl: "https://cellreturnmall.co.kr/" },
  { slug: "dualsonic", name: "듀얼소닉", tagline: "홈 초음파 리프팅", since: "2024", rating: 4.5, freeShippingOver: null, shippingFee: 5000, isReal: true, officialUrl: "https://dualsonic.com/" },
  { slug: "anua", name: "아누아", tagline: "성분 함량 공개 스킨케어", since: "2025", rating: 4.8, freeShippingOver: 20000, shippingFee: 2500, isReal: true, officialUrl: "https://anua.kr" },
  { slug: "paulaschoice", name: "폴라초이스", tagline: "성분 중심 더마 스킨케어", since: "2024", rating: 4.7, freeShippingOver: 30000, shippingFee: 2500, isReal: true, officialUrl: "https://www.paulaschoice.co.kr" },
  { slug: "laroche", name: "라로슈포제", tagline: "민감 피부 더마", since: "2024", rating: 4.7, freeShippingOver: 30000, shippingFee: 2500, isReal: true, officialUrl: "https://www.larocheposay.co.kr" },
  { slug: "roundlab", name: "라운드랩", tagline: "자작나무 수분 라인", since: "2025", rating: 4.7, freeShippingOver: 30000, shippingFee: 3000, isReal: true, officialUrl: "https://roundlab.co.kr" },
  { slug: "drforhair", name: "닥터포헤어", tagline: "두피·탈모 케어 전문", since: "2025", rating: 4.6, freeShippingOver: 30000, shippingFee: 3000, isReal: true, officialUrl: "https://www.drforhair.co.kr" },
  { slug: "mediheal", name: "메디힐", tagline: "데일리 시트 마스크", since: "2025", rating: 4.6, freeShippingOver: 20000, shippingFee: 3000, isReal: true, officialUrl: "https://medihealshop.com" },
  { slug: "nutree", name: "뉴트리", tagline: "에버콜라겐 이너뷰티", since: "2025", rating: 4.7, freeShippingOver: 30000, shippingFee: 3000, isReal: true, officialUrl: "https://newtreemall.co.kr" },
  { slug: "iope", name: "아이오페", tagline: "아모레퍼시픽 베이스 메이크업", since: "2025", rating: 4.5, freeShippingOver: 30000, shippingFee: 2500, isReal: true, officialUrl: "https://www.iope.com" },
];

// ── 상품 ──────────────────────────────────────────
export type Category =
  | "skincare"
  | "device"
  | "cover-makeup"
  | "mask"
  | "suncare"
  | "cleansing"
  | "scalp-hair"
  | "inner";

export const categories: { slug: Category; name: string; sub: string[] }[] = [
  { slug: "skincare", name: "스킨케어", sub: ["세럼·앰플", "에센스", "크림", "토너·미스트", "아이케어", "오일"] },
  { slug: "device", name: "디바이스", sub: ["LED 마스크", "리프팅", "색소 케어", "두피", "클렌징기"] },
  { slug: "cover-makeup", name: "기미커버", sub: ["쿠션", "컨실러", "파운데이션", "톤업"] },
  { slug: "mask", name: "마스크팩", sub: ["시트", "워시오프", "슬리핑", "패치"] },
  { slug: "suncare", name: "선케어", sub: ["선크림", "선쿠션", "선스틱"] },
  { slug: "cleansing", name: "클렌징", sub: ["클렌징폼", "오일·밤", "워터", "각질"] },
  { slug: "scalp-hair", name: "두피·헤어", sub: ["샴푸", "앰플·토닉", "트리트먼트", "두피 디바이스"] },
  { slug: "inner", name: "이너뷰티", sub: ["콜라겐", "유산균", "비타민", "다이어트"] },
];

/** 비교표에 쓰는 축. 측정 가능한 물리량만 — 효과 표현 금지 */
export type ProductSpec = { label: string; value: string };

/**
 * 규칙 판정용 성분 키. `keyIngredient` 문자열은 사람이 읽는 표시용이라
 * 순서·충돌 판정에 쓸 수 없어서 별도로 구조화한다.
 */
export type ActiveKey =
  | "niacinamide"
  | "tranexamic"
  | "arbutin"
  | "vitaminC"
  | "retinol"
  | "aha-bha"
  | "peptide"
  | "ceramide"
  | "panthenol"
  | "sunscreen"
  | "collagen";

/** 함량은 브랜드가 공개한 값만. 미공개면 pct 없음 */
export type Active = { key: ActiveKey; pct?: number };

/**
 * 기기 작동 방식. 이게 "바르기 전/후"를 가른다 —
 * 광 기반(led)은 빛이 통과해야 하니 바르기 전, 전류 기반(galvanic)은 밀어 넣으니 바른 후.
 */
export type DeviceKind = "led" | "galvanic" | "rf" | "ems" | "microcurrent" | "ultrasound";

/** 실제 시판 제품의 출처 기록. 발표 때 숫자의 근거를 댈 수 있게 남긴다 */
export type ProductSource = {
  sourceUrl: string; // 가격·스펙 확인 출처
  pricedAt: string; // 가격 확인 시점
  priceNote: string; // 가격의 성격 — "다나와 최저가" / "권장소비자가" / "공식몰 소비자가"
  officialUrl?: string; // 브랜드 공식몰 (확인된 경우만)
  /**
   * **이 제품을 파는 정확한 페이지.** 「구매」 버튼의 목적지 1순위 (`buyUrlOf`).
   *
   * `sourceUrl`과 나누는 이유: `sourceUrl`은 **가격을 확인한 곳**이고 목록·비교
   * 페이지일 수 있다. 구매 버튼이 목록으로 보내면 사람이 거기서 제품을 다시 찾아야
   * 한다 — 40대+에게 특히 나쁘다. 그래서 상세 페이지를 따로 확인했을 때만 여기 적는다.
   */
  buyUrl?: string;
  /**
   * 브랜드 실제 제품 사진 (2026-08-23 신설, 운영자 결정).
   *
   * ⚠️ **저작물이다.** 브랜드가 자기 공식몰에 올린 이미지를 쓴다 — 출처가 명확해야
   *    문제 제기 시 그 제품만 즉시 내릴 수 있다. 그래서 `imageSource`를 같이 남긴다.
   *    (이전 방침은 자체 생성 이미지였다. `docs/05` 「지킨 선 두 개」 참고 — 뒤집었다)
   *
   * ⚠️ 화면에는 **📷출처를 함께 노출**한다. 협찬 오인과 무단 사용 인상을 동시에 줄인다.
   * ⚠️ 없으면 자체 유형 이미지(`image`)로 폴백한다. 실사진이 없다고 카드가 비면 안 된다.
   */
  imageUrl?: string;
  /** 위 이미지를 가져온 페이지. 내려달라는 요청이 오면 이 값으로 찾는다 */
  imageSource?: string;
  /**
   * 의료기기 여부. 홈뷰티 기기는 의료용(식약처)과 비의료용(국가기술표준원)으로 나뉜다.
   * "medical"로 확인되면 광고가 사전심의 대상이라 비교표에서 제외해야 한다.
   */
  deviceClass?: "non-medical" | "unknown";
};

export type Product = {
  id: string;
  brand: string; // brand slug
  name: string;
  category: Category;
  concerns: string[]; // concern slugs
  tags: string[];
  price: number; // 판매가
  listPrice: number | null; // 정가(할인 시)
  rating: number;
  reviewCount: number;
  likes: number;
  badges: ("빠른배송" | "단독" | "NEW" | "베스트")[];
  keyIngredient: string;
  volume: string;
  usage: string;
  cohortViews: { "40s": number; "50s": number; "60s": number }; // 연령대 주간 조회
  /** 이미지 파일명 (public/images/product/). 제품 유형 대표 이미지 — 실제 제품 사진이 아니다 */
  image: string;
  /** 규칙 엔진용 구조화 성분 (화장품) */
  actives?: Active[];
  /** 규칙 엔진용 작동 방식 (디바이스). 복합기는 여러 개 */
  deviceKinds?: DeviceKind[];
  /** 비교표·사양 섹션 축. 디바이스만 */
  specs?: ProductSpec[];
  /** 있으면 스펙·가격이 실측 데이터인 실제 시판 제품 */
  source?: ProductSource;
};

export const products: Product[] = [

  // ══ 전부 실제 시판 제품이다 ═════════════════════════
  // 2026-08-25에 창작 상품 8종(p1~p8)과 그 가상 브랜드 6곳을 카탈로그에서 지웠다.
  // 이제 `source` 없는 항목은 이 배열에 존재하지 않는다 — 새로 넣을 때도 마찬가지다.
  // 가격·스펙은 각 항목의 source.sourceUrl에서 source.pricedAt 시점에 실측 수집.
  // specs는 물리량만 — 판매처의 "주름개선·탄력개선" 류 효과 표기는 옮기지 않았다.
  // image는 제품 유형 대표 이미지(자체 생성분)이고 해당 제품의 실제 사진이 아니다.

  // ── 디바이스: 미세전류·EMS 계열 ──
  {
    id: "d-medicube-x2",
    deviceKinds: ["ems", "microcurrent", "rf", "led"],
    image: "product-p2.jpg",
    brand: "medicube",
    name: "AGE-R 부스터 프로 X2",
    category: "device",
    concerns: ["wrinkle", "pore"],
    tags: ["주름·탄력", "EMS", "중주파", "LED"],
    price: 259300,
    listPrice: 299000,
    rating: 4.7,
    reviewCount: 12840,
    likes: 5300,
    badges: ["베스트", "빠른배송"],
    keyIngredient: "중주파·미세전류·EMS·LED",
    volume: "본체 230g",
    usage:
      "세안 후 전용 젤을 바르고 턱선에서 귀 방향으로 밀어 올립니다. 얼굴과 목까지 쓸 수 있어요. 자세한 단계와 사용 빈도는 제품 설명서를 따라주세요.",
    cohortViews: { "40s": 1980, "50s": 1540, "60s": 610 },
    specs: [
      { label: "작동 방식", value: "중주파 · 미세전류 · EMS · LED" },
      { label: "LED 광원", value: "6색 (레드·블루·옐로우·오렌지·그린·퍼플)" },
      { label: "사용 부위", value: "얼굴 · 목" },
      { label: "무게", value: "230g" },
    ],
    source: {
      sourceUrl: "https://prod.danawa.com/info/?pcode=108463403",
      pricedAt: "2026-07-30",
      priceNote: "다나와 최저가",
      imageUrl: "/images/product/real/d-medicube-x2.jpg",
      imageSource: "https://prod.danawa.com/info/?pcode=108463403",
      officialUrl: "https://themedicube.co.kr/age-r/main.html",
      deviceClass: "unknown",
    },
  },
  {
    id: "d-medicube-pro",
    deviceKinds: ["microcurrent", "rf", "led"],
    image: "product-p2.jpg",
    brand: "medicube",
    name: "AGE-R 부스터 프로",
    category: "device",
    concerns: ["wrinkle", "pore"],
    tags: ["주름·탄력", "중주파", "미세전류"],
    price: 183440,
    listPrice: 219000,
    rating: 4.6,
    reviewCount: 21460,
    likes: 7900,
    badges: ["베스트"],
    keyIngredient: "중주파·미세전류·LED",
    volume: "본체 150g",
    usage:
      "세안 후 전용 젤을 바르고 얼굴 안쪽에서 바깥쪽으로 밀어 올립니다. 가벼워서 매일 쓰기 부담이 적어요. 사용 빈도는 제품 설명서를 따라주세요.",
    cohortViews: { "40s": 1720, "50s": 1380, "60s": 540 },
    specs: [
      { label: "작동 방식", value: "중주파 · 미세전류 · LED" },
      { label: "LED 광원", value: "5색 (레드·블루·오렌지·그린·퍼플)" },
      { label: "사용 부위", value: "얼굴" },
      { label: "무게", value: "150g" },
    ],
    source: {
      sourceUrl: "https://prod.danawa.com/info/?pcode=28857110",
      pricedAt: "2026-07-30",
      priceNote: "다나와 최저가",
      imageUrl: "/images/product/real/d-medicube-pro.jpg",
      imageSource: "https://prod.danawa.com/info/?pcode=28857110",
      officialUrl: "https://themedicube.co.kr/age-r/main.html",
      deviceClass: "unknown",
    },
  },
  {
    id: "d-medicube-mini",
    deviceKinds: ["led"],
    image: "product-p6.jpg",
    brand: "medicube",
    name: "AGE-R 부스터 프로 미니 플러스",
    category: "device",
    concerns: ["wrinkle", "pigment"],
    tags: ["입문용", "LED", "가벼움"],
    price: 113400,
    listPrice: 139000,
    rating: 4.5,
    reviewCount: 6210,
    likes: 2400,
    badges: ["NEW"],
    keyIngredient: "LED",
    volume: "본체 75g",
    usage:
      "세안 후 세럼을 바르고 얼굴에 가볍게 밀착시켜 사용합니다. 75g으로 가벼워 기기가 처음이라면 여기서 시작해도 좋아요.",
    cohortViews: { "40s": 1140, "50s": 890, "60s": 470 },
    specs: [
      { label: "작동 방식", value: "LED" },
      { label: "LED 광원", value: "3색 (레드·블루·퍼플)" },
      { label: "사용 부위", value: "얼굴" },
      { label: "무게", value: "75g" },
    ],
    source: {
      sourceUrl: "https://prod.danawa.com/info/?pcode=96368432",
      pricedAt: "2026-07-30",
      priceNote: "다나와 최저가",
      imageUrl: "/images/product/real/d-medicube-mini.jpg",
      imageSource: "https://prod.danawa.com/info/?pcode=96368432",
      officialUrl: "https://themedicube.co.kr/age-r/main.html",
      deviceClass: "unknown",
    },
  },

  // ── 디바이스: 고주파(RF) 계열 ──
  {
    id: "d-medicube-ultratune",
    deviceKinds: ["rf", "microcurrent", "led"],
    image: "product-p2.jpg",
    brand: "medicube",
    name: "AGE-R 울트라튠 40.68",
    category: "device",
    concerns: ["wrinkle", "pore"],
    tags: ["주름·탄력", "고주파", "젤 불필요"],
    price: 107320,
    listPrice: 149000,
    rating: 4.6,
    reviewCount: 8930,
    likes: 4100,
    badges: ["단독", "빠른배송"],
    keyIngredient: "고주파·미세전류·LED",
    volume: "본체 320g",
    usage:
      "별도 전용 젤 없이 세안 후 바로 사용합니다. 얼굴과 목을 나눠 구역별로 천천히 움직여 주세요. 강도는 낮은 단계부터 올리고, 자세한 사용법은 제품 설명서를 따라주세요.",
    cohortViews: { "40s": 1610, "50s": 1250, "60s": 480 },
    specs: [
      { label: "작동 방식", value: "고주파 · 미세전류 · LED" },
      { label: "LED 광원", value: "5색 (레드·블루·오렌지·그린·퍼플)" },
      { label: "사용 부위", value: "얼굴 · 목" },
      { label: "무게", value: "320g" },
      { label: "전용 젤", value: "불필요" },
    ],
    source: {
      sourceUrl: "https://prod.danawa.com/info/?pcode=52365911",
      pricedAt: "2026-07-30",
      priceNote: "다나와 최저가",
      imageUrl: "/images/product/real/d-medicube-ultratune.jpg",
      imageSource: "https://prod.danawa.com/info/?pcode=52365911",
      officialUrl: "https://themedicube.co.kr/age-r/main.html",
      deviceClass: "unknown",
    },
  },

  // ── 디바이스: 갈바닉 (이온 도입) ──
  {
    id: "d-lg-galvanic",
    deviceKinds: ["galvanic"],
    image: "product-p6.jpg",
    brand: "lgpral",
    name: "수퍼폼 갈바닉 부스터",
    category: "device",
    concerns: ["dry", "pigment"],
    tags: ["갈바닉", "흡수", "기기 전용 화장품"],
    price: 108000,
    listPrice: null,
    rating: 4.5,
    reviewCount: 3120,
    likes: 1500,
    badges: ["NEW"],
    keyIngredient: "갈바닉",
    volume: "본체",
    usage:
      "세럼이나 앰플을 먼저 바른 다음 사용합니다. 갈바닉은 이미 올려둔 성분을 밀어 넣는 방식이라 순서를 바꾸면 의미가 줄어요.",
    cohortViews: { "40s": 980, "50s": 760, "60s": 350 },
    specs: [
      { label: "작동 방식", value: "갈바닉" },
      { label: "사용 부위", value: "얼굴" },
      { label: "전용 화장품", value: "글래스라이크 3종" },
    ],
    source: {
      sourceUrl: "https://www.lg.co.kr/media/release/29074",
      pricedAt: "2026-07-30",
      priceNote: "권장소비자가",
      officialUrl: "https://lgpralofficial.co.kr/",
      deviceClass: "unknown",
    },
  },

  // ── 디바이스: LED 마스크 ──
  {
    id: "d-lg-ledmask",
    deviceKinds: ["led"],
    image: "product-p6.jpg",
    brand: "lgpral",
    name: "더마 LED 마스크 BWJ1",
    category: "device",
    concerns: ["wrinkle", "pigment"],
    tags: ["LED 마스크", "9분", "핸즈프리"],
    price: 330940,
    listPrice: 449000,
    rating: 4.5,
    reviewCount: 5470,
    likes: 2600,
    badges: ["베스트"],
    keyIngredient: "레드·근적외선 LED 120개",
    volume: "본체 230g",
    usage:
      "세안 후 아무것도 바르지 않은 상태에서 착용하고 1회 9분 사용합니다. 마친 뒤에 세럼과 크림을 바르는 순서예요.",
    cohortViews: { "40s": 1290, "50s": 1460, "60s": 720 },
    specs: [
      { label: "작동 방식", value: "LED (120개)" },
      { label: "LED 광원", value: "레드 · 근적외선" },
      { label: "1회 사용 시간", value: "9분" },
      { label: "사용 부위", value: "얼굴" },
      { label: "무게", value: "230g" },
    ],
    source: {
      sourceUrl: "https://prod.danawa.com/info/?pcode=5519389",
      pricedAt: "2026-07-30",
      priceNote: "다나와 최저가",
      imageUrl: "/images/product/real/d-lg-ledmask.jpg",
      imageSource: "https://prod.danawa.com/info/?pcode=5519389",
      officialUrl: "https://lgpralofficial.co.kr/",
      deviceClass: "non-medical",
    },
  },
  {
    id: "d-cellreturn-platinum",
    deviceKinds: ["led"],
    image: "product-p6.jpg",
    brand: "cellreturn",
    name: "LED 마스크 플래티넘",
    category: "device",
    concerns: ["wrinkle"],
    tags: ["LED 마스크", "1,026개", "20분"],
    price: 1980000,
    listPrice: null,
    rating: 4.6,
    reviewCount: 1840,
    likes: 900,
    badges: [],
    keyIngredient: "근적외선·레드·블루 LED 1,026개",
    volume: "본체 645g",
    usage:
      "세안 후 착용하고 1회 20분 사용합니다. 645g으로 무게가 있어 누워서 쓰는 편이 편해요. 마친 뒤 스킨케어를 올립니다.",
    cohortViews: { "40s": 640, "50s": 780, "60s": 410 },
    specs: [
      { label: "작동 방식", value: "LED (1,026개)" },
      { label: "LED 광원", value: "근적외선 · 레드 · 블루" },
      { label: "1회 사용 시간", value: "20분" },
      { label: "사용 부위", value: "얼굴" },
      { label: "무게", value: "645g" },
    ],
    source: {
      sourceUrl: "https://prod.danawa.com/info/?pcode=8365023",
      pricedAt: "2026-07-30",
      priceNote: "다나와 최저가",
      imageUrl: "/images/product/real/d-cellreturn-platinum.jpg",
      imageSource: "https://prod.danawa.com/info/?pcode=8365023",
      officialUrl: "https://cellreturnmall.co.kr/",
      deviceClass: "unknown",
    },
  },

  // ── 디바이스: 초음파(HIFU) ──
  {
    id: "d-dualsonic-pro",
    deviceKinds: ["ultrasound"],
    image: "product-p2.jpg",
    brand: "dualsonic",
    name: "프로페셔널 세트",
    category: "device",
    concerns: ["wrinkle"],
    tags: ["초음파", "카트리지형", "주 1회"],
    price: 1350000,
    listPrice: null,
    rating: 4.5,
    reviewCount: 1120,
    likes: 520,
    badges: ["단독"],
    keyIngredient: "집속 초음파",
    volume: "본체 + 얼굴·눈가 카트리지",
    usage:
      "전용 젤을 충분히 바르고 구역을 나눠 사용합니다. 강도는 5단계 중 낮은 쪽부터, 같은 자리를 반복하지 않는 것이 원칙이에요. 사용 주기는 제품 설명서를 따라주세요.",
    cohortViews: { "40s": 520, "50s": 610, "60s": 240 },
    specs: [
      { label: "작동 방식", value: "집속 초음파 (5단계)" },
      { label: "사용 부위", value: "얼굴 · 눈가" },
      { label: "무게", value: "309g" },
      { label: "소모품", value: "카트리지 교체형" },
    ],
    source: {
      sourceUrl: "https://prod.danawa.com/info/?pcode=8207959",
      pricedAt: "2026-07-30",
      priceNote: "다나와 최저가",
      imageUrl: "/images/product/real/d-dualsonic-pro.jpg",
      imageSource: "https://prod.danawa.com/info/?pcode=8207959",
      officialUrl: "https://dualsonic.com/",
      deviceClass: "unknown",
    },
  },

  // ── 화장품: 색소 (나이아신아마이드 · 트라넥삼산 계열) ──
  {
    id: "c-anua-txa",
    actives: [{ key: "niacinamide", pct: 10 }, { key: "tranexamic", pct: 4 }, { key: "arbutin" }],
    image: "product-p1.jpg",
    brand: "anua",
    name: "나이아신아마이드 10 TXA 4 다크 스팟 세럼 30ml",
    category: "skincare",
    concerns: ["pigment", "pore"],
    tags: ["기미·잡티", "나이아신아마이드", "트라넥삼산"],
    price: 32000,
    listPrice: 39000,
    rating: 4.8,
    reviewCount: 18720,
    likes: 8100,
    badges: ["베스트", "빠른배송"],
    keyIngredient: "나이아신아마이드 10%·트라넥삼산 4%·알부틴",
    volume: "30ml",
    usage:
      "저녁 토너 후 2~3방울을 얼굴 전체에 펴 바릅니다. 고함량이라 처음엔 이틀에 한 번으로 시작해 피부가 적응하면 매일로 늘리세요.",
    cohortViews: { "40s": 2140, "50s": 1680, "60s": 620 },
    source: {
      sourceUrl: "https://www.kurly.com/goods/1001393811",
      pricedAt: "2026-07-30",
      priceNote: "온라인 판매가",
      imageUrl: "/images/product/real/c-anua-txa.jpg",
      imageSource: "https://www.kurly.com/goods/1001393811",
    },
  },
  {
    id: "c-medicube-txa-cream",
    actives: [
      { key: "niacinamide", pct: 5 },
      { key: "tranexamic" },
      { key: "ceramide" },
      { key: "panthenol" },
    ],
    image: "product-p4.jpg",
    brand: "medicube",
    name: "트라넥사믹애씨드 나이아신아마이드 캡슐 크림 55g",
    category: "skincare",
    concerns: ["pigment", "dry"],
    tags: ["기미·잡티", "세라마이드", "캡슐 크림"],
    price: 23800,
    listPrice: 36100,
    rating: 4.7,
    reviewCount: 14350,
    likes: 6200,
    badges: ["베스트"],
    keyIngredient: "나이아신아마이드 5%(50,000ppm)·트라넥삼산·세라마이드·판테놀",
    volume: "55g",
    usage:
      "핑크 캡슐과 레드 젤을 섞어 마지막 단계에 바릅니다. 세라마이드와 판테놀이 함께 들어 있어 기기를 쓴 날 마무리로도 좋아요.",
    cohortViews: { "40s": 1870, "50s": 1930, "60s": 840 },
    source: {
      sourceUrl:
        "https://themedicube.co.kr/product/%ED%8A%B8%EB%9D%BC%EB%84%A5%EC%82%BC%EC%82%B0-%EA%B8%B0%EB%AF%B8%ED%86%A0%EB%8B%9D-%EC%BA%A1%EC%8A%90%ED%81%AC%EB%A6%BC/2245/",
      pricedAt: "2026-07-30",
      priceNote: "공식몰 회원가 (소비자가 36,100원)",
      officialUrl: "https://themedicube.co.kr/",
    },
  },
  {
    id: "c-paulas-b3",
    actives: [{ key: "niacinamide", pct: 10 }],
    image: "product-p3.jpg",
    brand: "paulaschoice",
    name: "10% 나이아신아마이드 부스터 20ml",
    category: "skincare",
    concerns: ["pore", "pigment"],
    tags: ["모공", "나이아신아마이드", "부스터"],
    price: 69000,
    listPrice: null,
    rating: 4.7,
    reviewCount: 9640,
    likes: 3700,
    badges: [],
    keyIngredient: "나이아신아마이드 10%",
    volume: "20ml",
    usage:
      "쓰던 세럼이나 크림에 2~3방울 섞어 쓰거나 단독으로 바릅니다. 농도가 높아 단계를 늘리지 않고 기존 루틴에 얹는 방식이 편해요.",
    cohortViews: { "40s": 1420, "50s": 1010, "60s": 380 },
    source: {
      sourceUrl: "https://www.paulaschoice.co.kr/expert-advice/beauty-advice-015.html",
      buyUrl: "https://www.paulaschoice.co.kr/paulas-choice-skincare/798.html",
      pricedAt: "2026-07-30",
      priceNote: "공식몰 판매가",
      imageUrl: "/images/product/real/c-paulas-b3.jpg",
      imageSource: "https://www.paulaschoice.co.kr/expert-advice/beauty-advice-015.html",
    },
  },
  {
    id: "c-lrp-melab3",
    actives: [{ key: "niacinamide" }],
    image: "product-p1.jpg",
    brand: "laroche",
    name: "멜라 B3 세럼 30ml",
    category: "skincare",
    concerns: ["pigment"],
    tags: ["기미·잡티", "나이아신아마이드", "민감 피부"],
    price: 67000,
    listPrice: null,
    rating: 4.7,
    reviewCount: 7280,
    likes: 3200,
    badges: ["빠른배송"],
    keyIngredient: "나이아신아마이드",
    volume: "30ml",
    usage:
      "아침·저녁 토너 후 얼굴 전체에 얇게 바릅니다. 민감 피부용으로 설계된 제형이라 자극이 걱정될 때 선택지가 됩니다.",
    cohortViews: { "40s": 1560, "50s": 1290, "60s": 510 },
    source: {
      sourceUrl: "https://www.harpersbazaar.co.kr/article/1872529",
      pricedAt: "2026-07-30",
      priceNote: "온라인 판매가",
    },
  },

  // ── 화장품: 기기 전용 라인 (갈바닉 궁합) ──
  {
    id: "c-glasslike-vita",
    image: "product-p3.jpg",
    brand: "glasslike",
    name: "비타 글로우 앰플 세럼 30ml",
    category: "skincare",
    concerns: ["pigment", "dry"],
    tags: ["기기 전용", "앰플", "갈바닉 궁합"],
    price: 35000,
    listPrice: null,
    rating: 4.5,
    reviewCount: 2140,
    likes: 980,
    badges: ["NEW"],
    keyIngredient: "브랜드 미공개",
    volume: "30ml",
    usage:
      "토너 후 얼굴 전체에 바릅니다. 갈바닉 기기를 쓸 경우 이 단계까지 마친 다음 기기를 올리는 순서예요.",
    cohortViews: { "40s": 870, "50s": 690, "60s": 300 },
    source: {
      sourceUrl: "https://www.lg.co.kr/media/release/29074",
      pricedAt: "2026-07-30",
      priceNote: "권장소비자가",
      officialUrl: "https://www.lgcaremall.com/product/list/10665",
    },
  },
  {
    id: "c-glasslike-wrinkle",
    image: "product-p4.jpg",
    brand: "glasslike",
    name: "트리플 파워 링클 스팟 20ml",
    category: "skincare",
    concerns: ["wrinkle"],
    tags: ["주름·탄력", "국소 케어", "기기 전용"],
    price: 35000,
    listPrice: null,
    rating: 4.4,
    reviewCount: 1620,
    likes: 740,
    badges: ["NEW"],
    keyIngredient: "브랜드 미공개",
    volume: "20ml",
    usage:
      "눈가·입가처럼 접히는 부위에 국소로 얹습니다. 얼굴 전체용이 아니라 신경 쓰이는 라인에 집중해 쓰는 제형이에요.",
    cohortViews: { "40s": 790, "50s": 640, "60s": 290 },
    source: {
      sourceUrl: "https://www.lg.co.kr/media/release/29074",
      pricedAt: "2026-07-30",
      priceNote: "권장소비자가",
      officialUrl: "https://www.lgcaremall.com/product/list/10665",
    },
  },
  {
    id: "c-glasslike-lip",
    image: "product-p3.jpg",
    brand: "glasslike",
    name: "플럼핑 비타립 세럼 10ml",
    category: "skincare",
    concerns: ["dry"],
    tags: ["건조", "립", "기기 전용"],
    price: 25000,
    listPrice: null,
    rating: 4.4,
    reviewCount: 1180,
    likes: 520,
    badges: ["NEW"],
    keyIngredient: "브랜드 미공개",
    volume: "10ml",
    usage: "입술과 입술 주변에 수시로 얹습니다. 건조가 심한 계절엔 자기 전 한 번 더 바르세요.",
    cohortViews: { "40s": 610, "50s": 480, "60s": 260 },
    source: {
      sourceUrl: "https://www.lg.co.kr/media/release/29074",
      pricedAt: "2026-07-30",
      priceNote: "권장소비자가",
      officialUrl: "https://www.lgcaremall.com/product/list/10665",
    },
  },
  {
    id: "c-laroche-uvmune",
    actives: [{ key: "sunscreen" }],
    image: "product-p5.jpg",
    brand: "laroche",
    name: "안뗄리오스 유브이뮨 400 하이드레이팅 크림 50ml",
    category: "suncare",
    // 주름을 붙인 건 마케팅이 아니라 자리 때문이다. 주름 고민을 고르면 아침 차단 자리가
    // 통째로 비어 「쓰시던 걸 쓰세요」가 됐다 — 광노화가 주름 근거에서 차지하는 비중을
    // 생각하면, 그 자리를 비워두는 쪽이 오히려 틀린 처방이다 (docs/17).
    concerns: ["sun", "pigment", "wrinkle"],
    tags: ["자외선", "민감 피부", "촉촉"],
    price: 35000,
    listPrice: null,
    rating: 4.8,
    reviewCount: 9240,
    likes: 4100,
    badges: ["베스트"],
    keyIngredient: "멕소릴 400 필터",
    volume: "50ml",
    usage:
      "아침 마지막 단계에 얼굴 전체에 충분히 폅니다. 색소 관리 중이면 바르는 제품보다 이걸 거르지 않는 게 먼저예요.",
    cohortViews: { "40s": 2240, "50s": 1980, "60s": 900 },
    source: {
      sourceUrl: "https://www.larocheposay.co.kr/product/view/4175.do",
      pricedAt: "2026-07-31",
      priceNote: "공식몰 판매가",
      imageUrl: "/images/product/real/c-laroche-uvmune.png",
      imageSource: "https://www.larocheposay.co.kr/product/view/4175.do",
      officialUrl: "https://www.larocheposay.co.kr",
    },
  },
  {
    id: "c-roundlab-birch-sun",
    actives: [{ key: "sunscreen" }],
    image: "product-p5.jpg",
    brand: "roundlab",
    name: "자작나무 수분 선크림 50ml",
    category: "suncare",
    concerns: ["sun", "dry"],
    tags: ["자외선", "수분", "데일리"],
    price: 22500,
    listPrice: 25000,
    rating: 4.7,
    reviewCount: 15600,
    likes: 6800,
    badges: ["빠른배송"],
    keyIngredient: "자작나무 수액",
    volume: "50ml",
    usage: "아침 마지막 단계에 폅니다. 백탁이 적어 덧발라도 밀리지 않아요.",
    cohortViews: { "40s": 2600, "50s": 1740, "60s": 620 },
    source: {
      sourceUrl:
        "https://roundlab.co.kr/product/%EC%9E%90%EC%9E%91%EB%82%98%EB%AC%B4-%EC%88%98%EB%B6%84-%EC%84%A0%ED%81%AC%EB%A6%BC-50ml/138/",
      pricedAt: "2026-07-31",
      priceNote: "공식몰 판매가",
      imageUrl: "/images/product/real/c-roundlab-birch-sun.jpg",
      imageSource: "https://prod.danawa.com/info/?pcode=11991947",
      officialUrl: "https://roundlab.co.kr",
    },
  },
  {
    id: "c-roundlab-birch-cleanser",
    image: "product-p3.jpg",
    brand: "roundlab",
    name: "자작나무 수분 클렌저 150ml",
    category: "cleansing",
    concerns: ["dry"],
    tags: ["클렌징", "수분", "약산성"],
    price: 11700,
    listPrice: 15000,
    rating: 4.6,
    reviewCount: 8900,
    likes: 3400,
    badges: [],
    keyIngredient: "자작나무 수액",
    volume: "150ml",
    usage: "물에 적신 손에 덜어 거품 내 얼굴을 감싸듯 씻어냅니다.",
    cohortViews: { "40s": 1480, "50s": 1120, "60s": 480 },
    source: {
      sourceUrl:
        "https://roundlab.co.kr/product/%EC%9E%90%EC%9E%91%EB%82%98%EB%AC%B4-%EC%88%98%EB%B6%84-%ED%81%B4%EB%A0%8C%EC%A0%80-150ml/140",
      pricedAt: "2026-07-31",
      priceNote: "공식몰 판매가",
      officialUrl: "https://roundlab.co.kr",
    },
  },
  {
    id: "c-drforhair-bio3",
    image: "product-p7.jpg",
    brand: "drforhair",
    name: "폴리젠 바이오-3 탈모완화 샴푸 500ml",
    category: "scalp-hair",
    concerns: ["scalp-hair"],
    tags: ["두피", "탈모 완화", "대용량"],
    price: 19800,
    listPrice: 32000,
    rating: 4.6,
    reviewCount: 12400,
    likes: 5200,
    badges: ["베스트"],
    keyIngredient: "제품 표시: 탈모 완화 기능성",
    volume: "500ml",
    usage: "두피에 직접 문질러 거품을 내고 2~3분 두었다가 헹굽니다.",
    cohortViews: { "40s": 1920, "50s": 2280, "60s": 1340 },
    source: {
      sourceUrl: "https://www.drforhair.co.kr/goods/goods_view.php?goodsNo=18",
      pricedAt: "2026-07-31",
      priceNote: "공식몰 판매가",
      imageUrl: "/images/product/real/c-drforhair-bio3.jpg",
      imageSource: "https://prod.danawa.com/info/?pcode=30395810",
      officialUrl: "https://www.drforhair.co.kr",
    },
  },
  {
    id: "c-mediheal-madeca",
    actives: [{ key: "panthenol" }],
    image: "product-p9.jpg",
    brand: "mediheal",
    name: "마데카소사이드 에센셜 마스크 흔적 리페어 10매",
    category: "mask",
    concerns: ["dry", "pigment"],
    tags: ["시트 마스크", "진정", "10매"],
    price: 11900,
    listPrice: 20000,
    rating: 4.6,
    reviewCount: 22800,
    likes: 7400,
    badges: ["베스트", "빠른배송"],
    keyIngredient: "마데카소사이드 50ppm",
    volume: "24ml x 10매",
    usage:
      "세안·토너 후 얼굴에 밀착시켜 15~20분 두었다가 뗍니다. 기기를 쓴 날 마무리로도 좋아요.",
    cohortViews: { "40s": 2480, "50s": 1860, "60s": 720 },
    source: {
      sourceUrl:
        "https://medihealshop.com/product/%EB%A7%88%EB%8D%B0%EC%B9%B4%EC%86%8C%EC%82%AC%EC%9D%B4%EB%93%9C-%EC%97%90%EC%84%BC%EC%85%9C-%EB%A7%88%EC%8A%A4%ED%81%AC-%ED%9D%94%EC%A0%81-%EB%A6%AC%ED%8E%98%EC%96%B4-10%EB%A7%A4/1035/",
      pricedAt: "2026-07-31",
      priceNote: "공식몰 판매가",
      imageUrl: "/images/product/real/c-mediheal-madeca.jpg",
      imageSource: "https://medihealshop.com/product/search.html?keyword=%EB%A7%88%EB%8D%B0%EC%B9%B4%EC%86%8C%EC%82%AC%EC%9D%B4%EB%93%9C%20%EC%97%90%EC%84%BC%EC%85%9C",
      officialUrl: "https://medihealshop.com",
    },
  },
  {
    id: "c-iope-aircushion",
    actives: [{ key: "sunscreen" }],
    image: "product-p10.jpg",
    brand: "iope",
    name: "에어쿠션 5.5세대 커버 15g (리필) SPF50/PA+++",
    category: "cover-makeup",
    concerns: ["pigment", "sun"],
    tags: ["기미커버", "쿠션", "자외선"],
    price: 16500,
    listPrice: 22000,
    rating: 4.5,
    reviewCount: 31200,
    likes: 9800,
    badges: ["베스트"],
    keyIngredient: "제품 표시: SPF50/PA+++",
    volume: "15g",
    usage:
      "선크림 다음에 퍼프로 두드려 올립니다. 잡티가 신경 쓰이는 부위만 한 번 더 얹으세요.",
    cohortViews: { "40s": 3100, "50s": 2240, "60s": 860 },
    source: {
      sourceUrl:
        "https://www.amoremall.com/kr/ko/product/detail?onlineProdSn=58764&onlineProdCode=111130001346",
      pricedAt: "2026-07-31",
      priceNote: "공식몰 판매가",
      imageUrl: "/images/product/real/c-iope-aircushion.jpg",
      imageSource: "https://prod.danawa.com/info/?pcode=116003702",
      officialUrl: "https://www.iope.com",
    },
  },

  // ── 화장품: 턴오버 계열 (레티놀 · 산) ──
  // 40대+ 주름·모공 관리의 중심 성분인데 카탈로그에 하나도 없었다. 성분 병용 규칙
  // (src/data/interactions.ts)이 판정할 대상이기도 하다 — 레티놀과 산은 이 앱에서
  // 유일하게 "같이 쓰면 주의"가 걸리는 조합이다.
  {
    id: "c-anua-retinol",
    actives: [{ key: "retinol", pct: 0.3 }, { key: "niacinamide" }],
    image: "product-p4.jpg",
    brand: "anua",
    name: "레티놀 0.3 나이아신 리뉴잉 세럼 30ml",
    category: "skincare",
    concerns: ["wrinkle", "pore"],
    tags: ["주름·탄력", "레티놀", "저녁 전용"],
    price: 27800,
    listPrice: 39000,
    rating: 4.7,
    reviewCount: 9240,
    likes: 4300,
    badges: ["베스트"],
    keyIngredient: "레티놀 0.3%·나이아신아마이드",
    volume: "30ml",
    usage:
      "저녁에만, 세안 후 마른 얼굴에 소량. 처음엔 주 2회로 시작해 자극이 없으면 늘리세요. 쓰는 동안 아침 자외선 차단은 빠뜨리지 마세요.",
    cohortViews: { "40s": 2260, "50s": 1540, "60s": 470 },
    source: {
      sourceUrl:
        "https://anua.kr/product/%EB%A0%88%ED%8B%B0%EB%86%80-03-%EB%82%98%EC%9D%B4%EC%95%84%EC%8B%A0-%EB%A6%AC%EB%89%B4%EC%9E%89-%EC%84%B8%EB%9F%BC/313/",
      pricedAt: "2026-08-02",
      priceNote: "공식몰 판매가 (정가 39,000원)",
      officialUrl: "https://anua.kr",
    },
  },
  {
    id: "c-paulas-bha",
    actives: [{ key: "aha-bha", pct: 2 }],
    image: "product-p3.jpg",
    brand: "paulaschoice",
    name: "스킨 퍼펙팅 2% BHA 리퀴드 118ml",
    category: "cleansing",
    concerns: ["pore"],
    tags: ["모공·각질", "BHA", "각질 정리"],
    price: 39000,
    listPrice: null,
    rating: 4.8,
    reviewCount: 26400,
    likes: 11200,
    badges: ["베스트", "빠른배송"],
    keyIngredient: "살리실산(BHA) 2%",
    volume: "118ml",
    usage:
      "저녁 토너 후 화장솜이나 손에 덜어 얼굴에 얇게. 매일이 아니라 격일로 시작하세요. 각질을 정리한 날은 다음 날 자외선 차단을 더 신경 쓰세요.",
    cohortViews: { "40s": 1980, "50s": 1210, "60s": 380 },
    source: {
      sourceUrl:
        "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000144042",
      pricedAt: "2026-08-02",
      priceNote: "올리브영 판매가",
      imageUrl: "/images/product/real/c-paulas-bha.jpg",
      imageSource: "https://www.paulaschoice.co.kr",
      officialUrl: "https://www.paulaschoice.co.kr",
    },
  },

  // ── 화장품: 기본 단계 (토너 · 크림) ──
  // 「내 루틴」이 단계별로 자리를 채우는데 토너가 카탈로그에 하나도 없어서
  // 아침·저녁 2번 자리가 통째로 비었다. 세럼·기기만 파는 카탈로그는
  // "무엇을 살까"엔 답하지만 "어떤 순서로 쓸까"엔 답할 수 없다.
  {
    id: "c-roundlab-dokdo-toner",
    image: "product-p1.jpg",
    brand: "roundlab",
    name: "1025 독도 토너 200ml",
    category: "skincare",
    concerns: ["dry", "pore"],
    tags: ["건조", "저자극", "토너"],
    price: 11900,
    listPrice: 15000,
    rating: 4.8,
    reviewCount: 41200,
    likes: 19800,
    badges: ["베스트", "빠른배송"],
    keyIngredient: "해양심층수·판테놀",
    volume: "200ml",
    usage:
      "아침·저녁 세안 후 첫 단계에. 화장솜에 적셔 닦아내도 되고 손으로 두드려 흡수시켜도 됩니다.",
    cohortViews: { "40s": 3120, "50s": 2240, "60s": 810 },
    actives: [{ key: "panthenol" }],
    source: {
      sourceUrl: "https://roundlab.co.kr/category/1025-%EB%8F%85%EB%8F%84/100/",
      pricedAt: "2026-08-02",
      priceNote: "공식몰 판매가 (정가 15,000원)",
      buyUrl: "https://roundlab.co.kr/product/1025-%EB%8F%85%EB%8F%84-%ED%86%A0%EB%84%88-200ml/22/",
      imageUrl: "/images/product/real/c-roundlab-dokdo-toner.jpg",
      imageSource: "https://prod.danawa.com/info/?pcode=4926856",
      officialUrl: "https://roundlab.co.kr",
    },
  },
  {
    id: "c-roundlab-dokdo-cream",
    image: "product-p4.jpg",
    brand: "roundlab",
    name: "1025 독도 수분 크림 50ml",
    category: "skincare",
    concerns: ["dry", "wrinkle"],
    tags: ["건조", "저자극", "크림"],
    price: 18000,
    listPrice: 25000,
    rating: 4.7,
    reviewCount: 15600,
    likes: 7100,
    badges: ["베스트"],
    keyIngredient: "해양심층수·세라마이드",
    volume: "50ml",
    usage:
      "아침·저녁 마지막 단계에. 레티놀이나 산을 쓴 날엔 이 단계를 넉넉히 올려 마무리하세요.",
    cohortViews: { "40s": 2280, "50s": 1970, "60s": 890 },
    actives: [{ key: "ceramide" }, { key: "panthenol" }],
    source: {
      sourceUrl: "https://roundlab.co.kr/category/1025-%EB%8F%85%EB%8F%84/100/",
      pricedAt: "2026-08-02",
      priceNote: "공식몰 판매가 (정가 25,000원)",
      buyUrl: "https://roundlab.co.kr/product/1025-%EB%8F%85%EB%8F%84-%EC%88%98%EB%B6%84-%ED%81%AC%EB%A6%BC-50ml/227/",
      imageUrl: "/images/product/real/c-roundlab-dokdo-cream.jpg",
      imageSource: "https://prod.danawa.com/info/?pcode=19019930",
      officialUrl: "https://roundlab.co.kr",
    },
  },
  // ── 2026-08-25 수집분: 창작 상품을 지우며 생긴 빈 자리를 실제 제품으로 채웠다 ──
  // 이너뷰티는 p8 하나뿐이었고 그게 창작이라, 지우는 순간 「이너뷰티」 고민이
  // 처방에서 통째로 비었다. 두피도 샴푸 하나만 남아 「샴푸와 토닉은 둘 중 하나가
  // 아니다」(prescribe.ts extra)는 판단이 성립하지 못했다.
  {
    id: "c-nutree-timezero",
    image: "product-p8.jpg",
    brand: "nutree",
    name: "에버콜라겐 타임제로 30일분",
    category: "inner",
    concerns: ["inner", "dry"],
    tags: ["이너뷰티", "저분자 콜라겐", "30일분"],
    price: 24500,
    listPrice: 39000,
    rating: 4.7,
    reviewCount: 8600,
    likes: 3200,
    badges: ["베스트"],
    // 건강기능식품 표시 그대로 옮긴다. 「피부에 좋다」로 바꿔 쓰지 않는다
    keyIngredient: "저분자콜라겐펩타이드 30mg/g (Gly-Pro-Hyp)",
    volume: "2g × 30포",
    usage:
      "1일 1회, 1포를 그대로 섭취합니다. 표시된 기능성은 「피부 보습에 도움을 줄 수 있음」이고, 먹는 것은 바르는 것보다 느리게 움직이니 8주를 기준으로 보세요.",
    cohortViews: { "40s": 1420, "50s": 1780, "60s": 1120 },
    source: {
      sourceUrl: "https://newtreemall.co.kr/product/detail.html?product_no=223&cate_no=1&display_group=25",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (소비자가 39,000원)",
      officialUrl: "https://newtreemall.co.kr",
    },
  },
  {
    id: "c-nutree-time-biotin",
    image: "product-p8.jpg",
    brand: "nutree",
    name: "에버콜라겐 타임 비오틴 30일분",
    category: "inner",
    concerns: ["inner", "scalp-hair"],
    tags: ["이너뷰티", "콜라겐", "비오틴"],
    price: 28600,
    listPrice: 44000,
    rating: 4.7,
    reviewCount: 6100,
    likes: 2400,
    badges: [],
    keyIngredient: "저분자콜라겐펩타이드 30mg/g + 비오틴 1,000㎍",
    volume: "3g × 30포",
    usage:
      "1일 1회, 1포를 그대로 섭취합니다. 비오틴 쪽 표시 기능성은 「에너지 생성에 필요」이지 모발이 굵어진다는 뜻이 아닙니다 — 두피는 바르는 것과 같이 봐야 해요.",
    cohortViews: { "40s": 1180, "50s": 1460, "60s": 940 },
    source: {
      sourceUrl: "https://newtreemall.co.kr/product/%EC%97%90%EB%B2%84%EC%BD%9C%EB%9D%BC%EA%B2%90-%ED%83%80%EC%9E%84-%EB%B9%84%EC%98%A4%ED%8B%B4-30%EC%9D%BC%EB%B6%84-3g%C3%9730%ED%8F%AC/225/",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (소비자가 44,000원)",
      officialUrl: "https://newtreemall.co.kr",
    },
  },
  {
    id: "c-drforhair-tonic",
    image: "product-p7.jpg",
    brand: "drforhair",
    name: "폴리젠 씨크닝 스칼프 토닉 120ml",
    category: "scalp-hair",
    concerns: ["scalp-hair"],
    tags: ["두피", "토닉", "볼륨"],
    price: 19900,
    listPrice: 21000,
    rating: 4.5,
    reviewCount: 5400,
    likes: 2100,
    badges: [],
    keyIngredient: "브랜드 미공개",
    volume: "120ml",
    usage:
      "머리를 감고 말린 뒤 가르마와 정수리에 분사해 손끝으로 문지릅니다. 샴푸 대신 쓰는 게 아니라 감고 난 다음 자리예요.",
    cohortViews: { "40s": 980, "50s": 1240, "60s": 720 },
    source: {
      sourceUrl: "https://www.drforhair.co.kr/product/detail.html?product_no=1518&cate_no=1&display_group=5",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 21,000원)",
      officialUrl: "https://www.drforhair.co.kr",
    },
  },
  {
    id: "c-drforhair-serum",
    image: "product-p7.jpg",
    brand: "drforhair",
    name: "폴리젠 씨크닝 스칼프 세럼 50ml",
    category: "scalp-hair",
    concerns: ["scalp-hair"],
    tags: ["두피", "정수리", "세럼"],
    price: 29900,
    listPrice: 39000,
    rating: 4.5,
    reviewCount: 3900,
    likes: 1700,
    badges: [],
    keyIngredient: "브랜드 미공개",
    volume: "50ml",
    usage:
      "가르마를 따라 두피에 직접 떨어뜨리고 손끝으로 눌러 폅니다. 모발이 아니라 두피에 닿아야 하는 제형이에요.",
    cohortViews: { "40s": 860, "50s": 1020, "60s": 540 },
    source: {
      sourceUrl: "https://www.drforhair.co.kr/product/detail.html?product_no=1472&cate_no=1&display_group=5",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 39,000원)",
      officialUrl: "https://www.drforhair.co.kr",
    },
  },
  {
    id: "c-anua-pdrn-serum",
    image: "product-p3.jpg",
    brand: "anua",
    name: "PDRN 히알루론산 캡슐 100 세럼 30ml",
    category: "skincare",
    concerns: ["dry", "wrinkle"],
    tags: ["건조", "PDRN", "히알루론산"],
    price: 22500,
    listPrice: 39000,
    rating: 4.7,
    reviewCount: 11200,
    likes: 4600,
    badges: ["빠른배송"],
    // 설문 Q22에서 사람들이 실제로 아는 단어 두 개(PDRN·히알루론산)가 이름에 다 있다.
    // 함량은 브랜드가 공개하지 않아 숫자를 만들지 않는다.
    keyIngredient: "PDRN · 히알루론산 (함량 미공개)",
    volume: "30ml",
    usage: "아침·저녁 토너 다음에 2~3방울. 크림 전 단계입니다.",
    cohortViews: { "40s": 2180, "50s": 1640, "60s": 700 },
    source: {
      sourceUrl: "https://anua.kr/product/detail.html?product_no=359&cate_no=1&display_group=5",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 39,000원)",
      officialUrl: "https://anua.kr",
    },
  },
  {
    id: "c-anua-pdrn-cream",
    image: "product-p4.jpg",
    brand: "anua",
    name: "PDRN 히알루론산 100 수분 크림 50ml",
    category: "skincare",
    concerns: ["dry", "wrinkle"],
    tags: ["건조", "크림", "PDRN"],
    price: 21000,
    listPrice: 32000,
    rating: 4.6,
    reviewCount: 7300,
    likes: 3100,
    badges: [],
    keyIngredient: "PDRN · 히알루론산 (함량 미공개)",
    volume: "50ml",
    usage:
      "저녁 마지막 단계에 얹어 마무리합니다. 레티놀을 쓰는 날엔 이 단계를 거르지 마세요 — 건조가 레티놀을 그만두게 만드는 가장 흔한 이유예요.",
    cohortViews: { "40s": 1740, "50s": 1380, "60s": 640 },
    source: {
      sourceUrl: "https://anua.kr/product/detail.html?product_no=402&cate_no=1&display_group=5",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 32,000원)",
      officialUrl: "https://anua.kr",
    },
  },
  {
    id: "c-roundlab-vita-cream",
    image: "product-p1.jpg",
    brand: "roundlab",
    name: "비타 나이아신 잡티 크림 50ml",
    category: "skincare",
    concerns: ["pigment", "dry"],
    tags: ["기미·잡티", "크림", "나이아신아마이드"],
    price: 24000,
    listPrice: 30000,
    rating: 4.6,
    reviewCount: 4800,
    likes: 2000,
    badges: ["NEW"],
    // 브랜드가 함량을 공개하지 않았다. 이름에 「나이아신」이 있다고 %를 지어내지 않는다
    keyIngredient: "나이아신아마이드 (함량 미공개)",
    volume: "50ml",
    usage:
      "아침·저녁 세럼 다음, 마지막 단계에 얼굴 전체에 폅니다. 레티놀과 달리 아침에 발라도 되는 성분이라 두 번 다 쓸 수 있어요.",
    cohortViews: { "40s": 1320, "50s": 1180, "60s": 520 },
    source: {
      sourceUrl: "https://roundlab.co.kr/product/%EB%B9%84%ED%83%80-%EB%82%98%EC%9D%B4%EC%95%84%EC%8B%A0-%EC%9E%A1%ED%8B%B0-%ED%81%AC%EB%A6%BC-50ml/245/",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 30,000원)",
      officialUrl: "https://roundlab.co.kr",
    },
  },
  // ── 2026-08-25 2차 수집분: 자리가 하나뿐이던 단계를 늘렸다 ──
  // 각질 정리는 BHA 하나, 마스크팩도 하나뿐이라 「한 번 고르면 다음 선택지가 없는」
  // 단계가 있었다. 이중세안(클렌징 오일) 자리는 아예 비어 있었다.
  {
    id: "c-roundlab-dokdo-cleansing-oil",
    image: "product-p3.jpg",
    brand: "roundlab",
    name: "1025 독도 클렌징 오일 200ml",
    category: "cleansing",
    concerns: ["dry", "pigment"],
    tags: ["클렌징", "오일", "이중세안"],
    price: 19500,
    listPrice: 23000,
    rating: 4.6,
    reviewCount: 9800,
    likes: 3600,
    badges: [],
    keyIngredient: "해양심층수",
    volume: "200ml",
    usage:
      "마른 손·마른 얼굴에 굴리듯 녹인 뒤 물로 유화시켜 헹굽니다. 선크림과 쿠션은 물세안만으로 잘 지워지지 않아, 색소 관리 중이라면 저녁 첫 단계가 여기예요.",
    cohortViews: { "40s": 1560, "50s": 1180, "60s": 480 },
    source: {
      sourceUrl: "https://roundlab.co.kr/category/1025-%EB%8F%85%EB%8F%84/100/",
      buyUrl: "https://roundlab.co.kr/product/1025-%EB%8F%85%EB%8F%84-%ED%81%B4%EB%A0%8C%EC%A7%95-%EC%98%A4%EC%9D%BC-200ml/130/",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 23,000원)",
      officialUrl: "https://roundlab.co.kr",
    },
  },
  {
    id: "c-roundlab-dokdo-peeling",
    image: "product-p3.jpg",
    brand: "roundlab",
    name: "1025 독도 필링젤 120ml",
    category: "cleansing",
    concerns: ["pore", "dry"],
    tags: ["각질", "필링", "저자극"],
    price: 13500,
    listPrice: 15000,
    rating: 4.5,
    reviewCount: 6400,
    likes: 2300,
    badges: [],
    keyIngredient: "해양심층수",
    volume: "120ml",
    usage:
      "물기 없는 얼굴에 펴 바르고 부드럽게 굴린 뒤 헹굽니다. 산(BHA)과 같은 날 겹치지 마세요 — 둘 다 각질을 건드립니다.",
    cohortViews: { "40s": 1080, "50s": 860, "60s": 380 },
    source: {
      sourceUrl: "https://roundlab.co.kr/category/1025-%EB%8F%85%EB%8F%84/100/",
      buyUrl: "https://roundlab.co.kr/product/1025-%EB%8F%85%EB%8F%84-%ED%95%84%EB%A7%81%EC%A0%A4-120ml/181/",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 15,000원)",
      officialUrl: "https://roundlab.co.kr",
    },
  },
  {
    id: "c-roundlab-dokdo-mask",
    image: "product-p9.jpg",
    brand: "roundlab",
    name: "1025 독도 수분 워터겔 마스크 10매",
    category: "mask",
    concerns: ["dry"],
    tags: ["시트 마스크", "수분", "10매"],
    price: 22000,
    listPrice: 40000,
    rating: 4.6,
    reviewCount: 5200,
    likes: 2100,
    badges: [],
    keyIngredient: "해양심층수",
    volume: "30ml × 10매",
    usage: "토너 다음에 15~20분. 주 2회면 충분해요.",
    cohortViews: { "40s": 1240, "50s": 980, "60s": 420 },
    source: {
      sourceUrl: "https://roundlab.co.kr/category/1025-%EB%8F%85%EB%8F%84/100/",
      buyUrl: "https://roundlab.co.kr/product/1025-%EB%8F%85%EB%8F%84-%EC%88%98%EB%B6%84-%EC%9B%8C%ED%84%B0%EA%B2%94-%EB%A7%88%EC%8A%A4%ED%81%AC-30ml-10%EB%A7%A4/145/",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 40,000원)",
      officialUrl: "https://roundlab.co.kr",
    },
  },
  {
    id: "c-roundlab-birch-tone-sun",
    actives: [{ key: "sunscreen" }],
    image: "product-p5.jpg",
    brand: "roundlab",
    name: "자작나무 수분 톤업 선크림 50ml",
    category: "suncare",
    concerns: ["sun", "pigment"],
    tags: ["자외선", "톤업", "데일리"],
    price: 22500,
    listPrice: 25000,
    rating: 4.6,
    reviewCount: 8700,
    likes: 3400,
    badges: [],
    keyIngredient: "자작나무 수액",
    volume: "50ml",
    usage:
      "아침 마지막 단계에 폅니다. 톤업 제형이라 이것만으로 화장을 끝내는 날에도 차단 단계가 빠지지 않아요.",
    cohortViews: { "40s": 1680, "50s": 1260, "60s": 520 },
    source: {
      sourceUrl: "https://roundlab.co.kr/",
      buyUrl: "https://roundlab.co.kr/product/%EC%9E%90%EC%9E%91%EB%82%98%EB%AC%B4-%EC%88%98%EB%B6%84-%ED%86%A4%EC%97%85-%EC%84%A0%ED%81%AC%EB%A6%BC-50ml/199/",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 25,000원)",
      officialUrl: "https://roundlab.co.kr",
    },
  },
  {
    id: "c-mediheal-teatree",
    image: "product-p9.jpg",
    brand: "mediheal",
    name: "티트리 에센셜 마스크 진정 수분 10매",
    category: "mask",
    concerns: ["pore", "dry"],
    tags: ["시트 마스크", "진정", "10매"],
    price: 11900,
    listPrice: 20000,
    rating: 4.6,
    reviewCount: 18400,
    likes: 6200,
    badges: ["빠른배송"],
    keyIngredient: "티트리잎추출물",
    volume: "10매",
    usage: "토너 다음에 15~20분. 산이나 레티놀을 쓴 다음 날 얹기 좋아요.",
    cohortViews: { "40s": 1820, "50s": 1240, "60s": 460 },
    source: {
      sourceUrl: "https://medihealshop.com/",
      buyUrl: "https://medihealshop.com/product/%ED%8B%B0%ED%8A%B8%EB%A6%AC-%EC%97%90%EC%84%BC%EC%85%9C-%EB%A7%88%EC%8A%A4%ED%81%AC-%EC%A7%84%EC%A0%95-%EC%88%98%EB%B6%84-10%EB%A7%A4/1396/",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 20,000원)",
      officialUrl: "https://medihealshop.com",
    },
  },
  {
    id: "c-mediheal-teatree-pad",
    image: "product-p3.jpg",
    brand: "mediheal",
    name: "티트리 트러블 진정 토너패드 100매",
    category: "cleansing",
    concerns: ["pore"],
    tags: ["토너패드", "진정", "100매"],
    price: 17900,
    listPrice: 26000,
    rating: 4.6,
    reviewCount: 14200,
    likes: 5100,
    badges: [],
    keyIngredient: "티트리잎추출물",
    volume: "100매",
    usage:
      "세안 후 결을 따라 가볍게 닦아냅니다. 매일 쓰는 각질 관리라 산(BHA)과 같은 날 겹치지 않는 쪽이 편해요.",
    cohortViews: { "40s": 1420, "50s": 980, "60s": 360 },
    source: {
      sourceUrl: "https://medihealshop.com/",
      buyUrl: "https://medihealshop.com/product/%ED%8B%B0%ED%8A%B8%EB%A6%AC-%ED%8A%B8%EB%9F%AC%EB%B8%94-%EC%A7%84%EC%A0%95-%ED%86%A0%EB%84%88%ED%8C%A8%EB%93%9C-100%EB%A7%A4/1675/",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 26,000원)",
      officialUrl: "https://medihealshop.com",
    },
  },
  {
    id: "c-anua-pdrn-mist",
    image: "product-p3.jpg",
    brand: "anua",
    name: "PDRN 히알루론산 수분 캡슐 미스트 100ml",
    category: "skincare",
    concerns: ["dry"],
    tags: ["미스트", "PDRN", "수분"],
    price: 29000,
    listPrice: 35000,
    rating: 4.5,
    reviewCount: 4300,
    likes: 1800,
    badges: ["NEW"],
    keyIngredient: "PDRN · 히알루론산 (함량 미공개)",
    volume: "100ml",
    usage:
      "세안 후 첫 단계로, 또는 낮에 당길 때 얼굴에서 20cm 떨어뜨려 뿌립니다. 뿌린 뒤에는 마르기 전에 다음 단계를 얹어야 오히려 안 당겨요.",
    cohortViews: { "40s": 1120, "50s": 820, "60s": 340 },
    source: {
      sourceUrl: "https://anua.kr/",
      buyUrl: "https://anua.kr/product/detail.html?product_no=466&cate_no=1&display_group=5",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 35,000원)",
      officialUrl: "https://anua.kr",
    },
  },
  {
    id: "c-nutree-time-retinol",
    image: "product-p8.jpg",
    brand: "nutree",
    name: "에버콜라겐 타임레티놀A 30일분",
    category: "inner",
    concerns: ["inner", "wrinkle"],
    tags: ["이너뷰티", "콜라겐", "비타민A"],
    price: 30380,
    listPrice: 49000,
    rating: 4.6,
    reviewCount: 3400,
    likes: 1300,
    badges: [],
    // 「레티놀」이 이름에 있지만 바르는 레티놀이 아니라 **비타민 A**다.
    // 표시 함량을 그대로 옮긴다 — 이름만 보고 바르는 것과 같다고 읽히면 안 된다.
    keyIngredient: "저분자콜라겐펩타이드 30mg/g + 비타민A 700㎍RAE",
    volume: "3g × 30포",
    usage:
      "1일 1회, 1포를 그대로 섭취합니다. 이름의 「레티놀A」는 먹는 비타민A라서, 바르는 레티놀 세럼을 대신하지 않아요 — 둘은 다른 자리입니다.",
    cohortViews: { "40s": 980, "50s": 1180, "60s": 720 },
    source: {
      sourceUrl: "https://newtreemall.co.kr/product/detail.html?product_no=511&cate_no=1&display_group=2",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (소비자가 49,000원 · 시점 할인가는 별도)",
      officialUrl: "https://newtreemall.co.kr",
    },
  },
  // ── 2026-08-25 3차 수집분: 한 자리에 선택지를 둘 이상 만든다 ──
  // 지금까지는 「이 단계엔 이것 하나」였다. 고민이 겹치는 사람(예: 건조+모공)에게
  // 같은 제품이 아침·저녁·양쪽 고민에 계속 나오면 처방이 한 장짜리로 보인다.
  {
    id: "c-anua-cleansing-oil",
    image: "product-p3.jpg",
    brand: "anua",
    name: "어성초 포어 컨트롤 클렌징오일 200ml",
    category: "cleansing",
    concerns: ["pore", "pigment"],
    tags: ["클렌징", "오일", "이중세안"],
    price: 17000,
    listPrice: 22000,
    rating: 4.7,
    reviewCount: 24800,
    likes: 9200,
    badges: ["베스트"],
    keyIngredient: "어성초 추출물",
    volume: "200ml",
    usage:
      "마른 얼굴에 굴려 녹인 뒤 물로 유화시켜 헹굽니다. 선크림·쿠션을 쓴 날은 이 단계가 저녁의 첫 자리예요.",
    cohortViews: { "40s": 2120, "50s": 1420, "60s": 560 },
    source: {
      sourceUrl: "https://anua.kr/product/list.html?cate_no=24",
      buyUrl: "https://anua.kr/product/detail.html?product_no=214&cate_no=24&display_group=1",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 22,000원)",
      officialUrl: "https://anua.kr",
    },
  },
  {
    id: "c-anua-clear-pad",
    image: "product-p3.jpg",
    brand: "anua",
    name: "어성초 77 클리어 패드 70매",
    category: "cleansing",
    concerns: ["pore", "dry"],
    tags: ["토너패드", "진정", "각질"],
    price: 19200,
    listPrice: 28000,
    rating: 4.7,
    reviewCount: 31200,
    likes: 11400,
    badges: ["베스트"],
    keyIngredient: "어성초 추출물 77퍼센트",
    volume: "70매",
    usage:
      "세안 후 결을 따라 가볍게 닦아냅니다. 산(BHA)과 같은 날 겹치지 않는 쪽이 편해요 — 둘 다 각질을 건드립니다.",
    cohortViews: { "40s": 2340, "50s": 1520, "60s": 580 },
    source: {
      sourceUrl: "https://anua.kr/product/list.html?cate_no=24",
      buyUrl: "https://anua.kr/product/detail.html?product_no=66&cate_no=24&display_group=1",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 28,000원)",
      officialUrl: "https://anua.kr",
    },
  },
  {
    id: "c-anua-cleansing-foam",
    image: "product-p3.jpg",
    brand: "anua",
    name: "어성초 쿼세티놀 포어 딥 클렌징 폼 150ml",
    category: "cleansing",
    concerns: ["pore"],
    tags: ["클렌징폼", "모공", "약산성"],
    price: 14000,
    listPrice: null,
    rating: 4.6,
    reviewCount: 12600,
    likes: 4300,
    badges: [],
    keyIngredient: "어성초 추출물",
    volume: "150ml",
    usage: "물에 적신 손에 덜어 거품을 낸 뒤 얼굴을 감싸듯 씻어냅니다.",
    cohortViews: { "40s": 1240, "50s": 880, "60s": 380 },
    source: {
      sourceUrl: "https://anua.kr/product/list.html?cate_no=24",
      buyUrl: "https://anua.kr/product/detail.html?product_no=254&cate_no=24&display_group=1",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가",
      officialUrl: "https://anua.kr",
    },
  },
  {
    id: "c-anua-birch-toner",
    image: "product-p3.jpg",
    brand: "anua",
    name: "자작나무 70 수분 부스팅 토너 250ml",
    category: "skincare",
    concerns: ["dry"],
    tags: ["토너", "수분", "저자극"],
    price: 16800,
    listPrice: 21000,
    rating: 4.7,
    reviewCount: 16800,
    likes: 6200,
    badges: ["빠른배송"],
    keyIngredient: "자작나무 수액 70퍼센트",
    volume: "250ml",
    usage: "아침·저녁 세안 후 첫 단계에. 손으로 두드려 흡수시키거나 화장솜에 적셔 닦아냅니다.",
    cohortViews: { "40s": 1860, "50s": 1320, "60s": 520 },
    source: {
      sourceUrl: "https://anua.kr/product/list.html?cate_no=24",
      buyUrl: "https://anua.kr/product/detail.html?product_no=123&cate_no=24&display_group=1",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 21,000원)",
      officialUrl: "https://anua.kr",
    },
  },
  {
    id: "c-anua-birch-serum",
    image: "product-p3.jpg",
    brand: "anua",
    name: "자작나무 70 수분 부스팅 세럼 30ml",
    category: "skincare",
    concerns: ["dry"],
    tags: ["세럼", "수분", "저자극"],
    price: 21600,
    listPrice: 27000,
    rating: 4.6,
    reviewCount: 9400,
    likes: 3600,
    badges: [],
    keyIngredient: "자작나무 수액 70퍼센트",
    volume: "30ml",
    usage: "아침·저녁 토너 다음에 2~3방울. 가벼운 제형이라 크림 전 단계로 씁니다.",
    cohortViews: { "40s": 1320, "50s": 940, "60s": 400 },
    source: {
      sourceUrl: "https://anua.kr/product/list.html?cate_no=24",
      buyUrl: "https://anua.kr/product/detail.html?product_no=117&cate_no=24&display_group=1",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 27,000원)",
      officialUrl: "https://anua.kr",
    },
  },
  {
    id: "c-anua-birch-cream",
    image: "product-p4.jpg",
    brand: "anua",
    name: "자작나무 70 수분 부스팅 크림 50ml",
    category: "skincare",
    concerns: ["dry"],
    tags: ["크림", "수분", "저자극"],
    price: 24000,
    listPrice: 30000,
    rating: 4.6,
    reviewCount: 8200,
    likes: 3100,
    badges: [],
    keyIngredient: "자작나무 수액 70퍼센트",
    volume: "50ml",
    usage: "마지막 단계에 얹어 앞 단계에서 채운 수분을 덮습니다.",
    cohortViews: { "40s": 1180, "50s": 880, "60s": 380 },
    source: {
      sourceUrl: "https://anua.kr/product/list.html?cate_no=24",
      buyUrl: "https://anua.kr/product/detail.html?product_no=116&cate_no=24&display_group=1",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 30,000원)",
      officialUrl: "https://anua.kr",
    },
  },
  {
    id: "c-laroche-cicaplast",
    actives: [{ key: "panthenol" }],
    image: "product-p4.jpg",
    brand: "laroche",
    name: "시카플라스트 멀티 리페어 크림 B5 100ml",
    category: "skincare",
    concerns: ["dry", "wrinkle"],
    tags: ["크림", "진정", "판테놀"],
    price: 52000,
    listPrice: null,
    rating: 4.8,
    reviewCount: 12400,
    likes: 5200,
    badges: [],
    keyIngredient: "판테놀(B5)",
    volume: "100ml",
    usage:
      "마지막 단계에 얹습니다. 레티놀이나 산을 쓴 다음 날처럼 예민해진 때 자리를 지키는 쪽 크림이에요.",
    cohortViews: { "40s": 1640, "50s": 1280, "60s": 620 },
    source: {
      sourceUrl: "https://www.larocheposay.co.kr/product/list.do",
      buyUrl: "https://www.larocheposay.co.kr/product/view/4711.do",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가",
      officialUrl: "https://www.larocheposay.co.kr",
    },
  },
  {
    id: "c-laroche-fluid",
    actives: [{ key: "sunscreen" }],
    image: "product-p5.jpg",
    brand: "laroche",
    name: "안뗄리오스 선 플루이드 50ml",
    category: "suncare",
    concerns: ["sun", "pigment", "pore"],
    tags: ["자외선", "가벼운 제형", "데일리"],
    price: 37000,
    listPrice: null,
    rating: 4.7,
    reviewCount: 6800,
    likes: 2900,
    badges: [],
    keyIngredient: "브랜드 미공개",
    volume: "50ml",
    usage:
      "아침 마지막 단계에 폅니다. 크림형이 무겁게 느껴지는 계절이나 지성 쪽 피부에 맞는 제형이에요.",
    cohortViews: { "40s": 1420, "50s": 1020, "60s": 420 },
    source: {
      sourceUrl: "https://www.larocheposay.co.kr/product/list.do",
      buyUrl: "https://www.larocheposay.co.kr/product/view/4833.do",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가",
      officialUrl: "https://www.larocheposay.co.kr",
    },
  },
  {
    id: "c-mediheal-pdrn-pad",
    image: "product-p3.jpg",
    brand: "mediheal",
    name: "피디알엔 모공 탄력 토너패드 100매",
    category: "cleansing",
    concerns: ["pore", "wrinkle"],
    tags: ["토너패드", "PDRN", "100매"],
    price: 20400,
    listPrice: 26000,
    rating: 4.6,
    reviewCount: 9600,
    likes: 3700,
    badges: [],
    keyIngredient: "PDRN (함량 미공개)",
    volume: "100매",
    usage: "세안 후 결을 따라 닦아냅니다. 산과 같은 날 겹치지 마세요.",
    cohortViews: { "40s": 1520, "50s": 1080, "60s": 420 },
    source: {
      sourceUrl: "https://medihealshop.com/product/list.html?cate_no=25",
      buyUrl: "https://medihealshop.com/product/%ED%94%BC%EB%94%94%EC%95%8C%EC%97%94-%EB%AA%A8%EA%B3%B5-%ED%83%84%EB%A0%A5-%ED%86%A0%EB%84%88%ED%8C%A8%EB%93%9C-100%EB%A7%A4/1678/",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 26,000원)",
      officialUrl: "https://medihealshop.com",
    },
  },
  {
    id: "c-mediheal-madeca-serum",
    actives: [{ key: "panthenol" }],
    image: "product-p1.jpg",
    brand: "mediheal",
    name: "마데카소사이드 흔적 리페어 세럼 40ml",
    category: "skincare",
    concerns: ["pigment", "dry"],
    tags: ["세럼", "진정", "마데카소사이드"],
    price: 16400,
    listPrice: 22000,
    rating: 4.6,
    reviewCount: 7400,
    likes: 2800,
    badges: [],
    keyIngredient: "마데카소사이드 (함량 미공개)",
    volume: "40ml",
    usage: "저녁 토너 다음에. 고함량 성분이 부담스러운 날 자리를 지키는 쪽 세럼이에요.",
    cohortViews: { "40s": 1240, "50s": 940, "60s": 380 },
    source: {
      sourceUrl: "https://medihealshop.com/product/list.html?cate_no=25",
      buyUrl: "https://medihealshop.com/product/%EB%A7%88%EB%8D%B0%EC%B9%B4%EC%86%8C%EC%82%AC%EC%9D%B4%EB%93%9C-%ED%9D%94%EC%A0%81-%EB%A6%AC%ED%8E%98%EC%96%B4-%EC%84%B8%EB%9F%BC-40ml/955/",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 22,000원)",
      officialUrl: "https://medihealshop.com",
    },
  },
  {
    id: "c-mediheal-pdrn-serum",
    image: "product-p1.jpg",
    brand: "mediheal",
    name: "피디알엔 모공 탄력 세럼 40ml",
    category: "skincare",
    concerns: ["pore", "wrinkle"],
    tags: ["세럼", "PDRN", "모공"],
    price: 14600,
    listPrice: 22000,
    rating: 4.5,
    reviewCount: 6100,
    likes: 2300,
    badges: [],
    keyIngredient: "PDRN (함량 미공개)",
    volume: "40ml",
    usage: "아침·저녁 토너 다음에. 모공은 조이는 것보다 늘어지는 쪽을 함께 봐야 합니다.",
    cohortViews: { "40s": 1180, "50s": 820, "60s": 320 },
    source: {
      sourceUrl: "https://medihealshop.com/product/list.html?cate_no=25",
      buyUrl: "https://medihealshop.com/product/%ED%94%BC%EB%94%94%EC%95%8C%EC%97%94-%EB%AA%A8%EA%B3%B5-%ED%83%84%EB%A0%A5-%EC%84%B8%EB%9F%BC-40ml/1586/",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 22,000원)",
      officialUrl: "https://medihealshop.com",
    },
  },
  // ── 2026-08-25 4차 수집분: LG생활건강몰(글래스라이크·프라엘) · 닥터포헤어 ──
  // 글래스라이크는 기기와 같은 라인으로 설계된 제형이라 「기기와 화장품의 순서」를
  // 말할 때 짝이 분명하다. 프라엘 기기 2종은 스펙 공개분을 못 찾아 specs 없이 넣었다 —
  // 비교표(`comparableDevices`)는 specs가 있는 것만 올라가므로 표는 흐려지지 않는다.
  {
    id: "d-lg-melabeam",
    deviceKinds: ["led"],
    image: "product-p6.jpg",
    brand: "lgpral",
    name: "멜라빔 토닝",
    category: "device",
    concerns: ["pigment"],
    tags: ["색소 케어", "LED", "고가"],
    price: 559000,
    listPrice: null,
    rating: 4.5,
    reviewCount: 620,
    likes: 280,
    badges: ["NEW"],
    keyIngredient: "-",
    volume: "본체 1대",
    usage:
      "세안 후 아무것도 바르지 않은 상태에서 사용합니다. 빛이 닿아야 하는 방식이라 스킨케어는 끝난 다음이에요.",
    cohortViews: { "40s": 620, "50s": 780, "60s": 340 },
    source: {
      sourceUrl: "https://www.lgcaremall.com/product/list/10665",
      buyUrl: "https://www.lgcaremall.com/product/detail/S50066290",
      pricedAt: "2026-08-25",
      priceNote: "LG생활건강몰 판매가 (증정 구성 포함가)",
      officialUrl: "https://lgpralofficial.co.kr/",
      deviceClass: "unknown",
    },
  },
  {
    id: "d-lg-thermashot",
    deviceKinds: ["rf", "ems"],
    image: "product-p2.jpg",
    brand: "lgpral",
    name: "수퍼폼 써마샷 얼티밋",
    category: "device",
    concerns: ["wrinkle", "pore"],
    tags: ["리프팅", "고주파", "고가"],
    price: 599000,
    listPrice: null,
    rating: 4.5,
    reviewCount: 540,
    likes: 240,
    badges: [],
    keyIngredient: "-",
    volume: "본체 1대",
    usage:
      "세안 후 전용 젤이나 앰플을 올린 상태에서 사용합니다. 열이 오르는 방식이라 끝나고 보습을 거르지 마세요.",
    cohortViews: { "40s": 720, "50s": 640, "60s": 260 },
    source: {
      sourceUrl: "https://www.lgcaremall.com/product/list/10665",
      buyUrl: "https://www.lgcaremall.com/product/detail/S50065431",
      pricedAt: "2026-08-25",
      priceNote: "LG생활건강몰 판매가 (증정 구성 포함가)",
      officialUrl: "https://lgpralofficial.co.kr/",
      deviceClass: "unknown",
    },
  },
  {
    id: "c-glasslike-pdrn-ampoule",
    image: "product-p1.jpg",
    brand: "glasslike",
    name: "PDRN 퍼밍 앰플 세럼 90ml",
    category: "skincare",
    concerns: ["wrinkle", "pore"],
    tags: ["세럼", "PDRN", "기기 전용"],
    price: 95000,
    listPrice: null,
    rating: 4.5,
    reviewCount: 840,
    likes: 380,
    badges: ["NEW"],
    keyIngredient: "PDRN (함량 미공개)",
    volume: "90ml",
    usage:
      "토너 다음에 얼굴 전체로. 갈바닉·고주파 기기를 쓰는 날엔 기기 전에 이 단계를 먼저 올립니다.",
    cohortViews: { "40s": 940, "50s": 780, "60s": 320 },
    source: {
      sourceUrl: "https://www.lgcaremall.com/product/list/10665",
      buyUrl: "https://www.lgcaremall.com/product/detail/S50059534",
      pricedAt: "2026-08-25",
      priceNote: "LG생활건강몰 판매가",
      officialUrl: "https://www.lgcaremall.com/product/list/10665",
    },
  },
  {
    id: "c-glasslike-toningshot",
    image: "product-p1.jpg",
    brand: "glasslike",
    name: "트리플 토닝샷 앰플 50ml",
    category: "skincare",
    concerns: ["pigment"],
    tags: ["앰플", "톤 케어", "기기 전용"],
    price: 85000,
    listPrice: null,
    rating: 4.5,
    reviewCount: 610,
    likes: 260,
    badges: [],
    keyIngredient: "브랜드 미공개",
    volume: "50ml",
    usage: "저녁 토너 다음에. 같은 라인 기기를 쓴다면 기기 전 단계입니다.",
    cohortViews: { "40s": 780, "50s": 680, "60s": 280 },
    source: {
      sourceUrl: "https://www.lgcaremall.com/product/list/10665",
      buyUrl: "https://www.lgcaremall.com/product/detail/A50068056",
      pricedAt: "2026-08-25",
      priceNote: "LG생활건강몰 판매가",
      officialUrl: "https://www.lgcaremall.com/product/list/10665",
    },
  },
  {
    id: "c-glasslike-barrier-cream",
    image: "product-p4.jpg",
    brand: "glasslike",
    name: "핑크 글로우 베리어 크림 50ml",
    category: "skincare",
    concerns: ["dry", "wrinkle"],
    tags: ["크림", "장벽", "기기 전용"],
    price: 42000,
    listPrice: null,
    rating: 4.4,
    reviewCount: 520,
    likes: 220,
    badges: [],
    keyIngredient: "브랜드 미공개",
    volume: "50ml",
    usage: "마지막 단계에 얹습니다. 기기를 쓴 날 저녁엔 이 단계를 거르지 마세요.",
    cohortViews: { "40s": 680, "50s": 560, "60s": 240 },
    source: {
      sourceUrl: "https://www.lgcaremall.com/product/list/10665",
      buyUrl: "https://www.lgcaremall.com/product/detail/S50069061",
      pricedAt: "2026-08-25",
      priceNote: "LG생활건강몰 판매가",
      officialUrl: "https://www.lgcaremall.com/product/list/10665",
    },
  },
  {
    id: "c-glasslike-gel-cream",
    image: "product-p4.jpg",
    brand: "glasslike",
    name: "하이드로세라 캡슐 젤크림 100ml",
    category: "skincare",
    concerns: ["dry"],
    tags: ["젤크림", "수분", "기기 전용"],
    price: 55000,
    listPrice: null,
    rating: 4.5,
    reviewCount: 460,
    likes: 200,
    badges: [],
    keyIngredient: "브랜드 미공개",
    volume: "100ml",
    usage: "마지막 단계에. 크림이 무겁게 느껴지는 계절에 자리를 대신합니다.",
    cohortViews: { "40s": 620, "50s": 480, "60s": 200 },
    source: {
      sourceUrl: "https://www.lgcaremall.com/product/list/10665",
      buyUrl: "https://www.lgcaremall.com/product/detail/S50069066",
      pricedAt: "2026-08-25",
      priceNote: "LG생활건강몰 판매가",
      officialUrl: "https://www.lgcaremall.com/product/list/10665",
    },
  },
  {
    id: "c-glasslike-pha-pad",
    actives: [{ key: "aha-bha" }],
    image: "product-p3.jpg",
    brand: "glasslike",
    name: "스킨 리프레싱 PHA 토너 패드 70매",
    category: "cleansing",
    concerns: ["pore", "dry"],
    tags: ["토너패드", "PHA", "각질"],
    price: 35000,
    listPrice: null,
    rating: 4.4,
    reviewCount: 380,
    likes: 160,
    badges: [],
    keyIngredient: "PHA (함량 미공개)",
    volume: "70매",
    usage:
      "세안 후 결을 따라 닦아냅니다. PHA도 산이라 레티놀·BHA와 같은 날 겹치지 마세요.",
    cohortViews: { "40s": 540, "50s": 420, "60s": 180 },
    source: {
      sourceUrl: "https://www.lgcaremall.com/product/list/10665",
      buyUrl: "https://www.lgcaremall.com/product/detail/S50069060",
      pricedAt: "2026-08-25",
      priceNote: "LG생활건강몰 판매가",
      officialUrl: "https://www.lgcaremall.com/product/list/10665",
    },
  },
  {
    id: "c-glasslike-modeling-mask",
    image: "product-p9.jpg",
    brand: "glasslike",
    name: "콜라겐 하이드로 모델링 마스크 4매",
    category: "mask",
    concerns: ["wrinkle", "dry"],
    tags: ["모델링 팩", "콜라겐", "4매"],
    price: 35000,
    listPrice: null,
    rating: 4.5,
    reviewCount: 420,
    likes: 190,
    badges: [],
    keyIngredient: "콜라겐 (함량 미공개)",
    volume: "4매",
    usage: "토너 다음에. 주 1~2회면 충분해요.",
    cohortViews: { "40s": 580, "50s": 500, "60s": 220 },
    source: {
      sourceUrl: "https://www.lgcaremall.com/product/list/10665",
      buyUrl: "https://www.lgcaremall.com/product/detail/S50069064",
      pricedAt: "2026-08-25",
      priceNote: "LG생활건강몰 판매가",
      officialUrl: "https://www.lgcaremall.com/product/list/10665",
    },
  },
  {
    id: "c-drforhair-thickening-shampoo",
    image: "product-p7.jpg",
    brand: "drforhair",
    name: "폴리젠 씨크닝 샴푸 500ml",
    category: "scalp-hair",
    concerns: ["scalp-hair"],
    tags: ["두피", "샴푸", "대용량"],
    price: 19900,
    listPrice: 30000,
    rating: 4.6,
    reviewCount: 21600,
    likes: 8100,
    badges: ["베스트"],
    keyIngredient: "브랜드 미공개",
    volume: "500ml",
    usage: "두피에 직접 문질러 거품을 내고 2~3분 두었다가 헹굽니다.",
    cohortViews: { "40s": 2140, "50s": 2480, "60s": 1180 },
    source: {
      sourceUrl: "https://www.drforhair.co.kr/product/detail.html?product_no=1514&cate_no=1&display_group=5",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (정가 30,000원)",
      officialUrl: "https://www.drforhair.co.kr",
    },
  },
  {
    id: "c-nutree-skinhair",
    image: "product-p8.jpg",
    brand: "nutree",
    name: "에버콜라겐 스킨앤헤어 4주분",
    category: "inner",
    concerns: ["inner", "scalp-hair"],
    tags: ["이너뷰티", "콜라겐", "모발"],
    price: 39000,
    listPrice: 69000,
    rating: 4.6,
    reviewCount: 2900,
    likes: 1100,
    badges: [],
    // 이 제품만 「모발상태(윤기·탄력) 개선」 표시 기능성이 있다. 두피 고민에서
    // 먹는 것을 얹을 근거가 이 한 줄이다 — 다른 콜라겐은 피부 보습까지다.
    keyIngredient: "저분자콜라겐펩타이드 1일 90mg + 비오틴 450㎍",
    volume: "20ml × 28포",
    usage:
      "1일 1회, 1포를 흔들어 그대로 마십니다. 표시 기능성에 「모발상태(윤기·탄력) 개선」이 있어 두피 고민에서 바르는 것과 짝이 되는 쪽이에요.",
    cohortViews: { "40s": 860, "50s": 1040, "60s": 620 },
    source: {
      sourceUrl: "https://newtreemall.co.kr/product/detail.html?product_no=621&cate_no=1&display_group=4",
      pricedAt: "2026-08-25",
      priceNote: "공식몰 판매가 (소비자가 69,000원 · 시점 할인가는 별도)",
      officialUrl: "https://newtreemall.co.kr",
    },
  },
];

// ── 루틴 세트 (차별화 상품) ─────────────────────────
export type Routine = {
  id: string;
  concern: string; // concern slug
  label: string; // "기미 집중"
  title: string; // 고민 언어 카피
  description: string;
  steps: { productId: string; how: string }[];
  why: string; // 왜 이 조합인지 — 성분·역할 궁합 설명
  price: number; // 세트가
  badge: string; // "3단계 루틴"
  level: "입문" | "집중" | "데일리";
  cohortAdds: { "40s": number; "50s": number; "60s": number };
  /** 이미지 파일명 (public/images/routine/) */
  image: string;
};

export const routines: Routine[] = [
  {
    id: "r1",
    image: "routine-r1.jpg",
    concern: "pigment",
    label: "기미 3단계",
    title: "기미가 신경 쓰이기 시작했다면",
    description: "저녁 세럼 → 저녁 크림 → 아침 차단. 색소 관리의 기본 자리를 채우는 3단계",
    steps: [
      { productId: "c-lrp-melab3", how: "저녁 토너 후 2~3방울, 색소 부위에 집중해 폅니다." },
      { productId: "c-roundlab-vita-cream", how: "세럼 위 마지막 단계로 얹어 마무리해요." },
      { productId: "c-laroche-uvmune", how: "아침 마무리는 자외선 차단. 기미 관리의 절반은 선케어예요." },
    ],
    why: "색소 관리에서 실제로 갈리는 건 성분이 아니라 자리입니다. 세럼 한 통만 쓰다 그만두는 이유는 대개 효과가 없어서가 아니라 저녁에 그 위를 덮는 게 없어서 자극이 쌓이기 때문이에요. 그래서 세럼 다음에 나이아신아마이드가 든 크림을 마지막 자리에 두어 하나로 이어 붙였습니다. 그리고 아침 차단이 빠지면 저녁에 옅힌 만큼 낮에 다시 쌓이기 때문에, 선크림은 선택이 아니라 이 세트의 세 번째 구성품입니다.",
    price: 126000,
    badge: "3단계 루틴",
    level: "집중",
    cohortAdds: { "40s": 480, "50s": 620, "60s": 210 },
  },
  {
    id: "r2",
    image: "routine-r2.jpg",
    concern: "wrinkle",
    label: "레티놀 시작",
    title: "레티놀, 그만두지 않고 8주 채우기",
    description: "저녁 레티놀 세럼과 그 위를 덮는 수분 크림. 자극으로 포기하지 않게 만드는 2단계",
    steps: [
      { productId: "c-anua-retinol", how: "저녁에만, 처음엔 이틀에 한 번으로 시작해요." },
      { productId: "c-anua-pdrn-cream", how: "레티놀을 바른 날은 반드시 마지막에 덮어주세요." },
    ],
    why: "레티놀은 주름 쪽에서 근거가 가장 두꺼운 성분인데, 40대가 중간에 그만두는 이유는 효과가 없어서가 아니라 건조하고 각질이 일어나서입니다. 그래서 레티놀은 단품이 아니라 짝으로 사야 합니다 — 위를 덮는 보습이 있어야 매일 쓸 수 있고, 매일 써야 8주 뒤에 판정할 거리가 생겨요. 두 제품이 같은 브랜드라 배송이 한 번에 묶이는 것도 실제로는 도움이 됩니다.",
    price: 48800,
    badge: "2단계 루틴",
    level: "입문",
    cohortAdds: { "40s": 390, "50s": 310, "60s": 150 },
  },
  {
    id: "r3",
    image: "routine-r3.jpg",
    concern: "dry",
    label: "건조 기본",
    title: "발라도 계속 당긴다면, 순서부터",
    description: "수분을 채우는 세럼과 그걸 가두는 크림. 두 가지로 끝내는 2단계",
    steps: [
      { productId: "c-anua-pdrn-serum", how: "아침·저녁 토너 후 2~3방울." },
      { productId: "c-roundlab-dokdo-cream", how: "마지막 단계에 얹어 덮어요. 이 단계가 채운 걸 붙듭니다." },
    ],
    why: "건조가 안 잡히는 사람 대부분은 채우는 걸 안 해서가 아니라 채운 걸 안 덮어서입니다. 수분은 그 자체로는 날아가고, 위를 덮는 유분·장벽 층이 있어야 남아요. 그래서 이 세트는 채우는 자리 하나와 가두는 자리 하나, 딱 두 자리만 씁니다. 건조는 판정이 가장 빠른 고민이라 2주면 답이 나옵니다 — 단계를 늘리지 않는 게 2주를 채우는 데 유리해요.",
    price: 40500,
    badge: "2단계 루틴",
    level: "데일리",
    cohortAdds: { "40s": 350, "50s": 410, "60s": 190 },
  },
  {
    id: "r4",
    image: "routine-r4.jpg",
    concern: "scalp-hair",
    label: "두피 볼륨",
    title: "가늘어진 모발, 감는 순서 안에서",
    description: "탈모완화 샴푸와 감고 난 뒤 쓰는 토닉. 순서가 정해진 2단계",
    steps: [
      { productId: "c-drforhair-bio3", how: "두피에 문질러 거품을 내고 2~3분 두었다가 헹궈요." },
      { productId: "c-drforhair-tonic", how: "말린 뒤 가르마와 정수리에 분사하고 문질러요." },
    ],
    why: "샴푸와 토닉은 둘 중 하나를 고르는 게 아니라 순서가 있는 두 단계입니다. 샴푸는 감을 때 두피를 씻어내는 자리고, 토닉은 감고 말린 뒤 남겨두는 자리예요. 샴푸만 쓰면 두피에 남는 게 없고, 토닉만 쓰면 씻기지 않은 위에 얹게 됩니다. 두피는 얼굴보다 눈에 띄는 데 오래 걸리므로 8주를 기준으로 보세요.",
    price: 39700,
    badge: "2단계 루틴",
    level: "입문",
    cohortAdds: { "40s": 180, "50s": 290, "60s": 240 },
  },

  // ══ 실제 제품 기반 루틴 ═══════════════════════════════
  // 조합 근거는 두 가지뿐이다:
  //  (1) 성분이 서로 다른 경로로 작용해서 겹치는 값이 있는가
  //  (2) 기기와 화장품의 **순서**가 정해져 있는가
  // 특히 (2)가 이 앱의 실질적 정보 가치다 —
  // LED는 빛이 통과해야 하니 바르기 전, 갈바닉·이온 도입은 성분을 밀어 넣으니 바른 후다.
  // 아무 데서도 이 순서를 정리해주지 않는다.
  {
    id: "r5",
    image: "routine-r1.jpg",
    concern: "pigment",
    label: "기미 성분 이중",
    title: "기미엔 성분 하나로는 부족해요",
    description: "경로가 다른 두 성분을 저녁에 겹쳐 쓰고, 아침 차단으로 닫는 3단계",
    steps: [
      { productId: "c-anua-txa", how: "저녁 토너 후 2~3방울. 처음엔 이틀에 한 번으로 시작해요." },
      { productId: "c-medicube-txa-cream", how: "마지막 단계에 캡슐을 섞어 얹어 마무리해요." },
      { productId: "c-laroche-uvmune", how: "아침 마지막은 차단. 이 단계가 빠지면 앞의 둘이 상쇄돼요." },
    ],
    why: "나이아신아마이드는 만들어진 멜라닌이 표피 세포로 넘어가는 단계를 줄이고, 트라넥삼산은 자외선 자극이 멜라닌 생성 신호로 이어지는 앞단을 건드립니다. 같은 색소 고민이지만 손대는 지점이 달라서, 한쪽만 쓰면 나머지 절반이 그대로 남아요. 두 제품 모두 이 조합을 함께 담고 있고 크림 쪽엔 세라마이드·판테놀이 들어 있어 고함량 세럼을 매일 쓸 때의 자극을 받아줍니다. 그리고 색소 관리에서 선크림이 빠지면 옅힌 만큼 다시 쌓이기 때문에, 아침 차단이 선택이 아니라 구성품입니다.",
    price: 77000,
    badge: "3단계 루틴",
    level: "집중",
    cohortAdds: { "40s": 620, "50s": 540, "60s": 210 },
  },
  {
    id: "r6",
    image: "routine-r2.jpg",
    concern: "wrinkle",
    label: "LED 순서",
    title: "LED 마스크, 순서를 거꾸로 쓰고 있었다면",
    description: "세안 → LED 9분 → 세럼. 바르고 쬐면 빛이 막히는 걸 바로잡는 2단계",
    steps: [
      { productId: "d-lg-ledmask", how: "세안 후 아무것도 바르지 않은 상태로 9분. 이게 순서의 핵심이에요." },
      { productId: "c-glasslike-wrinkle", how: "마친 뒤 눈가·입가에 국소로 얹어 마무리해요." },
    ],
    why: "LED는 빛이 피부에 닿아야 작동합니다. 세럼이나 크림을 먼저 바르면 그 층이 빛을 산란시켜 도달하는 양이 줄어요. 그래서 순서는 세안 직후 맨 피부에 LED, 끝난 다음 스킨케어입니다. 반대로 하는 사람이 많은데 기기 설명서에도 크게 안 적혀 있어서 그렇습니다. 마스크형은 손이 자유롭고 1회 9분으로 짧아 저녁 루틴에 끼우기 쉽고, 마친 직후는 흡수가 잘 되는 타이밍이라 이때 국소 제품을 얹는 게 효율이 좋습니다.",
    price: 329000,
    badge: "2단계 루틴",
    level: "집중",
    cohortAdds: { "40s": 480, "50s": 520, "60s": 260 },
  },
  {
    id: "r7",
    image: "routine-r3.jpg",
    concern: "pigment",
    label: "갈바닉 순서",
    title: "갈바닉은 바른 다음에 쓰는 기기예요",
    description: "앰플을 먼저 올리고 기기로 밀어 넣는, 순서가 반대인 2단계",
    steps: [
      { productId: "c-glasslike-vita", how: "토너 후 얼굴 전체에 먼저 발라요. 이 단계가 먼저입니다." },
      { productId: "d-lg-galvanic", how: "앰플을 올린 상태에서 기기를 사용해요." },
    ],
    why: "갈바닉은 약한 전류로 이미 피부 위에 있는 성분을 안쪽으로 밀어 넣는 방식입니다. 그래서 LED와 순서가 정반대예요 — LED는 바르기 전, 갈바닉은 바른 후입니다. 맨 피부에 갈바닉만 쓰면 밀어 넣을 게 없어서 하는 일이 거의 없습니다. 또 밀어 넣기에 유리한 건 물에 잘 녹는 가벼운 제형이라, 두꺼운 크림보다 앰플·세럼 단계에서 쓰는 게 맞습니다. 이 앰플은 같은 기기 라인으로 함께 설계된 제형이라 궁합을 따로 고민할 필요가 없어요.",
    price: 128000,
    badge: "2단계 루틴",
    level: "데일리",
    cohortAdds: { "40s": 410, "50s": 330, "60s": 150 },
  },
  {
    id: "r8",
    image: "routine-r2.jpg",
    concern: "wrinkle",
    label: "고주파 후 장벽",
    title: "고주파 쓴 날은 장벽부터 채워야 해요",
    description: "젤 없이 쓰는 고주파 기기와, 끝난 뒤 수분을 잠그는 크림 2단계",
    steps: [
      { productId: "d-medicube-ultratune", how: "세안 후 바로. 전용 젤이 필요 없어 단계가 하나 줄어요." },
      { productId: "c-medicube-txa-cream", how: "기기를 마친 직후 마무리로. 이 순서가 중요해요." },
    ],
    why: "고주파는 피부 안쪽에 열을 만들어 자극을 주는 방식입니다. 열이 오르면 수분이 빠져나가기 쉬운 상태가 되기 때문에, 쓰고 나서 아무것도 안 바르면 다음 날 오히려 당기고 예민해집니다. 그래서 고주파 기기는 반드시 보습·장벽 제품과 짝을 지어야 하고, 이 크림엔 세라마이드와 판테놀이 들어 있어 그 역할을 합니다. 게다가 이 기기는 별도 전용 젤이 필요 없어서 준비 단계가 없고, 두 제품이 같은 브랜드라 배송도 한 번에 묶입니다.",
    price: 118000,
    badge: "2단계 루틴",
    level: "집중",
    cohortAdds: { "40s": 520, "50s": 430, "60s": 180 },
  },
  {
    id: "r9",
    image: "routine-r1.jpg",
    concern: "pigment",
    label: "기기 입문",
    title: "기기가 처음이면 10만원대에서",
    description: "가벼운 LED 기기와 3만원대 세럼으로, 부담 없이 시작하는 2단계",
    steps: [
      { productId: "d-medicube-mini", how: "세안 후 세럼을 바르고 가볍게 밀착시켜요. 75g으로 가벼워요." },
      { productId: "c-anua-txa", how: "저녁 토너 후 2~3방울. 이틀에 한 번으로 시작해요." },
    ],
    why: "기기를 처음 살 때 가장 흔한 실패는 무거워서 안 쓰게 되는 겁니다. 이 기기는 75g으로 같은 라인의 상위 모델(150g·230g·320g)보다 확실히 가볍고, 기능도 LED 하나로 단순해서 손이 덜 갑니다. 대신 기기 하나로는 색소가 잘 안 움직이기 때문에 성분 쪽을 세럼이 맡습니다. 둘을 합쳐도 15만원 아래라, 몇십만원짜리 기기를 먼저 사서 서랍에 넣어두는 것보다 이쪽이 실제로 8주를 채울 확률이 높습니다.",
    price: 129000,
    badge: "2단계 루틴",
    level: "입문",
    cohortAdds: { "40s": 680, "50s": 490, "60s": 220 },
  },
  {
    id: "r10",
    image: "routine-r4.jpg",
    concern: "pore",
    label: "모공 이중",
    title: "모공은 조이는 것과 붙드는 것 둘 다",
    description: "고함량 나이아신아마이드와 탄력 기기로 두 방향에서 접근하는 2단계",
    steps: [
      { productId: "c-paulas-b3", how: "쓰던 세럼이나 크림에 2~3방울 섞어요. 단계가 늘지 않아요." },
      { productId: "d-medicube-pro", how: "세안 후 전용 젤을 바르고 안쪽에서 바깥쪽으로 밀어 올려요." },
    ],
    why: "40대 이후 모공이 커 보이는 건 구멍이 넓어진 것보다 탄력이 떨어져 세로로 늘어나는 쪽이 큽니다. 그래서 피지·각질만 관리하면 잘 안 바뀝니다. 나이아신아마이드는 모공 주변 피부결과 톤을 함께 다루고, 기기는 늘어지는 쪽을 물리적으로 건드립니다. 이 부스터는 농도가 높은 대신 20ml 소용량이고 기존 제품에 섞어 쓰는 방식이라 루틴 단계가 늘지 않아요 — 단계가 늘면 중간에 포기하기 때문에 이게 실제로 중요합니다.",
    price: 227000,
    badge: "2단계 루틴",
    level: "데일리",
    cohortAdds: { "40s": 560, "50s": 410, "60s": 170 },
  },
  {
    id: "r11",
    image: "routine-r4.jpg",
    concern: "inner",
    label: "안팎 콜라겐",
    title: "먹는 콜라겐은 바르는 것과 같이 봐야 해요",
    description: "하루 한 포와 저녁 크림. 안쪽과 바깥쪽을 같이 채우는 2단계",
    steps: [
      { productId: "c-nutree-timezero", how: "하루 1포. 시간대는 상관없고 거르지 않는 게 전부예요." },
      { productId: "c-anua-pdrn-cream", how: "저녁 마지막 단계에 덮어요." },
    ],
    why: "먹는 콜라겐의 표시 기능성은 「피부 보습에 도움을 줄 수 있음」입니다. 주름이 펴진다는 말이 아니고, 보습이라면 바르는 쪽이 훨씬 빠릅니다. 그래서 이너뷰티만 단독으로 시작하면 8주 동안 아무 변화도 못 느끼고 그만두게 돼요. 안쪽은 느리게 채우고 바깥쪽은 그날 저녁에 채우는 두 속도를 같이 두면, 8주를 채울 확률이 올라갑니다. 이 조합의 값은 성분 궁합이 아니라 그 지속력에 있습니다.",
    price: 45500,
    badge: "2단계 루틴",
    level: "데일리",
    cohortAdds: { "40s": 320, "50s": 480, "60s": 360 },
  },
  {
    id: "r12",
    image: "routine-r3.jpg",
    concern: "sun",
    label: "덧바르기",
    title: "아침에 바른 선크림은 점심이면 없어요",
    description: "아침의 선크림과 낮에 덧바르는 쿠션. 하루를 두 번에 나누는 2단계",
    steps: [
      { productId: "c-roundlab-birch-sun", how: "아침 마지막 단계에 충분한 양을 폅니다." },
      { productId: "c-iope-aircushion", how: "점심 이후 화장 위에 가볍게 덧발라요." },
    ],
    why: "선크림은 시간이 지나면 땀·피지와 함께 지워집니다. 아침에 아무리 잘 발라도 오후엔 남아 있는 양이 크게 줄어요. 그런데 이미 화장한 얼굴에 선크림을 다시 바르기는 어렵기 때문에, 실제로 덧바를 수 있는 건 SPF가 있는 쿠션 쪽입니다. 이 쿠션은 SPF50/PA+++ 표시가 있고 리필이라 부담이 적어요. 아침 한 번으로 끝내는 것보다, 오후에 한 번 더 얹는 쪽이 색소 관리에서 실제로 차이를 만듭니다.",
    price: 39000,
    badge: "2단계 루틴",
    level: "데일리",
    cohortAdds: { "40s": 410, "50s": 350, "60s": 180 },
  },
];

// ── 이미지 경로 헬퍼 ────────────────────────────────
// public/images/ 에 배치된 실사 이미지 (docs/04-photo-brief.md 기준 21장).
// 상품 수가 이미지 수보다 많아 유형별로 재사용한다 — 각 항목의 image 필드가 매핑 결과.
/**
 * 상품 이미지 한 곳. **실사진이 있으면 실사진, 없으면 유형 이미지로 폴백한다.**
 *
 * 카드·상세·검색이 전부 이 함수를 지나므로 여기 한 줄로 전 화면이 바뀐다.
 * 호출부마다 분기하면 실사진이 있는 화면과 없는 화면이 갈린다.
 */
export const productImage = (id: string) => {
  const p = products.find((x) => x.id === id);
  if (!p) return undefined;
  return p.source?.imageUrl ?? `/images/product/${p.image}`;
};

/**
 * **이 제품을 실제로 파는 곳.** 「구매」 버튼 하나가 전부 여기로 간다.
 *
 * 우리는 결제를 받지 않는다. 그래서 「구매」는 우리 체크아웃이 아니라 **판매처로
 * 나가는 문**이다. 문이 없으면 버튼도 없어야 한다 — 없는 주소를 지어내지 않는다.
 *
 * 고르는 순서와 이유:
 *  0. `source.buyUrl` — 상세 페이지를 따로 확인해 둔 경우. 가장 정확하다
 *  1. `source.officialUrl`이 **`sourceUrl`과 같은 호스트**면 `sourceUrl`을 쓴다.
 *     그건 공식몰 안의 **그 제품 상세 페이지**라는 뜻이라, 몰 첫 화면보다 정확하다.
 *     (첫 화면으로 보내면 사람이 거기서 제품을 다시 찾아야 한다 — 40대+에게 특히 나쁘다)
 *  2. 없으면 `source.officialUrl`
 *  3. 없으면 브랜드 공식몰
 *  4. 그것도 없으면 `sourceUrl`(다나와·컬리 등) — 파는 곳인 건 맞다
 */
export const buyUrlOf = (p: Product): string | null => {
  const s = p.source;
  if (s?.buyUrl) return s.buyUrl;
  const official = s?.officialUrl ?? brands.find((b) => b.slug === p.brand)?.officialUrl ?? null;
  const host = (u: string) => {
    try {
      return new URL(u).host.replace(/^www\./, "");
    } catch {
      return null;
    }
  };
  if (s?.sourceUrl && official && host(s.sourceUrl) && host(s.sourceUrl) === host(official)) {
    return s.sourceUrl;
  }
  return official ?? s?.sourceUrl ?? null;
};

/** 이 제품이 브랜드 실사진을 쓰고 있나 — 화면에 📷출처를 붙일지 판단한다 */
export const hasRealPhoto = (p: Product) => Boolean(p.source?.imageUrl);
export const routineImage = (id: string) => {
  const r = routines.find((x) => x.id === id);
  return r ? `/images/routine/${r.image}` : undefined;
};
export const concernImage = (slug: string) => `/images/concern/concern-${slug}.jpg`;
export const heroImages = ["/images/hero/hero-1.jpg", "/images/hero/hero-2.jpg"];

// ── 헬퍼 ──────────────────────────────────────────
export const won = (n: number) => n.toLocaleString("ko-KR");

export const discountRate = (p: { price: number; listPrice: number | null }) =>
  p.listPrice ? Math.round((1 - p.price / p.listPrice) * 100) : null;

export const brandOf = (slug: string) => brands.find((b) => b.slug === slug)!;

/** 스펙·가격이 실측 데이터인 실제 시판 제품 */
export const isReal = (p: Product) => p.source !== undefined;

/**
 * 브랜드명을 뗀 모델명. 실제 제품명은 브랜드를 포함하는 경우가 많아
 * 카드에서 브랜드명 아래 전체명을 그대로 쓰면 두 번 읽힌다.
 */
export const modelLabel = (p: Product) =>
  p.name.replace(brands.find((b) => b.slug === p.brand)!.name, "").trim() || p.name;

/**
 * 비교표에 올릴 디바이스. 비교 내용은 공개된 물리 사양과 가격으로만 한정한다
 * (specs + price + pricedAt). 효능·효과는 어떤 형태로도 비교하지 않는다.
 *
 * 남은 확인 사항: 품목별 의료기기 허가 여부. 의료용으로 허가된 품목은 광고 자체가
 * 사전심의 대상이므로 deviceClass가 "medical"로 확인되면 여기서 제외해야 한다.
 * 실서비스 전 식약처 의료기기 전자민원창구에서 개별 확인 필요.
 */
export const comparableDevices = products.filter(
  (p) => p.category === "device" && p.specs && isReal(p)
);
export const productOf = (id: string) => products.find((p) => p.id === id)!;
export const concernOf = (slug: string) => concerns.find((c) => c.slug === slug)!;

export const routineListPrice = (r: Routine) =>
  r.steps.reduce((sum, s) => sum + productOf(s.productId).price, 0);
