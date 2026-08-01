/**
 * RIVEA 카탈로그 — 브랜드·고민·상품·루틴세트
 *
 * ⚠️ 이 앱은 **랩 발표용 데모**다. 실제 판매하지 않는다 (홈 하단에 고지).
 *
 * 상품은 두 출처가 섞여 있고, 화면에서는 구분 없이 하나로 어우러진다.
 *
 * 1) 데모 브랜드 (source 없음) — 가상 입점사. 전부 창작.
 * 2) 실제 시판 제품 (source 있음) — 모델명·가격·물리 스펙은 공개 정보를 실측 수집.
 *    `source`에 수집 출처(sourceUrl)·확인 시점(pricedAt)·가격 성격(priceNote)을 남긴다.
 *    발표 때 "이 숫자 어디서 났나"에 답할 수 있어야 하므로 지우지 말 것.
 *    평점·리뷰수·조회수는 데모값이다 (실제 집계가 아님).
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
export type Concern = {
  slug: string;
  name: string;
  question: string; // "왜 지금 ~?"
  intro: string;
  tips: { bold: string; rest: string }[];
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
  { slug: "lavid", name: "라비드", tagline: "더마 브라이트닝 전문", since: "2024", rating: 4.8, freeShippingOver: 20000, shippingFee: 2500 },
  { slug: "objet", name: "오브제", tagline: "홈 뷰티 디바이스", since: "2023", rating: 4.7, freeShippingOver: null, shippingFee: 3000 },
  { slug: "selen", name: "셀렌", tagline: "민감 피부 선케어", since: "2024", rating: 4.7, freeShippingOver: 30000, shippingFee: 2500 },
  { slug: "muel", name: "뮤엘", tagline: "탄력 집중 스킨케어", since: "2025", rating: 4.9, freeShippingOver: 20000, shippingFee: 2500 },
  { slug: "onhue", name: "온휴", tagline: "두피·헤어 홈케어", since: "2025", rating: 4.6, freeShippingOver: 25000, shippingFee: 3000 },
  { slug: "vitalab", name: "비타랩", tagline: "이너뷰티 연구소", since: "2024", rating: 4.8, freeShippingOver: 30000, shippingFee: 2500 },

  // ── 실제 시판 브랜드 (제품 스펙·가격이 실측) ──
  { slug: "medicube", name: "메디큐브", tagline: "에이피알 홈뷰티 디바이스", since: "2023", rating: 4.7, freeShippingOver: 30000, shippingFee: 3000, isReal: true, officialUrl: "https://themedicube.co.kr/age-r/main.html" },
  { slug: "lgpral", name: "LG 프라엘", tagline: "LG 뷰티 디바이스", since: "2023", rating: 4.6, freeShippingOver: 50000, shippingFee: 4000, isReal: true, officialUrl: "https://lgpralofficial.co.kr/" },
  { slug: "glasslike", name: "글래스라이크", tagline: "기기 전용 스킨케어", since: "2025", rating: 4.5, freeShippingOver: 30000, shippingFee: 3000, isReal: true, officialUrl: "https://www.lgcaremall.com/product/list/10665" },
  { slug: "cellreturn", name: "셀리턴", tagline: "LED·PEMF 웰니스 디바이스", since: "2024", rating: 4.6, freeShippingOver: null, shippingFee: 5000, isReal: true, officialUrl: "https://cellreturnmall.co.kr/" },
  { slug: "dualsonic", name: "듀얼소닉", tagline: "홈 초음파 리프팅", since: "2024", rating: 4.5, freeShippingOver: null, shippingFee: 5000, isReal: true, officialUrl: "https://dualsonic.com/" },
  { slug: "anua", name: "아누아", tagline: "성분 함량 공개 스킨케어", since: "2025", rating: 4.8, freeShippingOver: 20000, shippingFee: 2500, isReal: true },
  { slug: "paulaschoice", name: "폴라초이스", tagline: "성분 중심 더마 스킨케어", since: "2024", rating: 4.7, freeShippingOver: 30000, shippingFee: 2500, isReal: true },
  { slug: "laroche", name: "라로슈포제", tagline: "민감 피부 더마", since: "2024", rating: 4.7, freeShippingOver: 30000, shippingFee: 2500, isReal: true },
  { slug: "roundlab", name: "라운드랩", tagline: "자작나무 수분 라인", since: "2025", rating: 4.7, freeShippingOver: 30000, shippingFee: 3000, isReal: true, officialUrl: "https://roundlab.co.kr" },
  { slug: "drforhair", name: "닥터포헤어", tagline: "두피·탈모 케어 전문", since: "2025", rating: 4.6, freeShippingOver: 30000, shippingFee: 3000, isReal: true, officialUrl: "https://www.drforhair.co.kr" },
  { slug: "mediheal", name: "메디힐", tagline: "데일리 시트 마스크", since: "2025", rating: 4.6, freeShippingOver: 20000, shippingFee: 3000, isReal: true, officialUrl: "https://medihealshop.com" },
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
  {
    id: "p1",
    actives: [{ key: "niacinamide", pct: 5 }],
    image: "product-p1.jpg",
    brand: "lavid",
    name: "멜라 리페어 세럼 30ml",
    category: "skincare",
    concerns: ["pigment"],
    tags: ["기미·잡티", "미백", "톤업"],
    price: 48000,
    listPrice: 60000,
    rating: 4.8,
    reviewCount: 15499,
    likes: 6100,
    badges: ["빠른배송", "베스트"],
    keyIngredient: "나이아신아마이드 5%",
    volume: "30ml",
    usage: "저녁 세안 후, 토너 다음 단계에 2~3방울을 얼굴 전체에 펴 바릅니다. 기미가 신경 쓰이는 부위엔 한 번 더.",
    cohortViews: { "40s": 1820, "50s": 2340, "60s": 940 },
  },
  {
    id: "p2",
    deviceKinds: ["ems", "microcurrent"],
    image: "product-p2.jpg",
    brand: "objet",
    name: "리프팅 EMS 디바이스",
    category: "device",
    concerns: ["wrinkle", "pore"],
    tags: ["주름·탄력", "리프팅"],
    price: 178000,
    listPrice: null,
    rating: 4.7,
    reviewCount: 9894,
    likes: 4200,
    badges: ["단독"],
    keyIngredient: "미세전류 EMS",
    volume: "본체+젤",
    usage: "아침 세안 후 전용 젤을 바르고 턱선에서 귀 방향으로 3분간 밀어 올립니다. 주 5회 권장.",
    cohortViews: { "40s": 1560, "50s": 1910, "60s": 720 },
  },
  {
    id: "p3",
    actives: [{ key: "arbutin" }, { key: "vitaminC" }],
    image: "product-p3.jpg",
    brand: "selen",
    name: "비타 브라이트닝 앰플 50ml",
    category: "skincare",
    concerns: ["pigment", "dry"],
    tags: ["기미·잡티", "비타민C"],
    price: 39000,
    listPrice: null,
    rating: 4.7,
    reviewCount: 8210,
    likes: 3100,
    badges: [],
    keyIngredient: "알부틴·비타민C",
    volume: "50ml",
    usage: "아침·저녁 토너 후 3~4방울. 산화 방지를 위해 개봉 후 3개월 내 사용.",
    cohortViews: { "40s": 1240, "50s": 1480, "60s": 610 },
  },
  {
    id: "p4",
    actives: [{ key: "peptide" }],
    image: "product-p4.jpg",
    brand: "muel",
    name: "콜라겐 탄력 앰플 30ml",
    category: "skincare",
    concerns: ["wrinkle"],
    tags: ["주름·탄력", "콜라겐"],
    price: 42000,
    listPrice: 60000,
    rating: 4.9,
    reviewCount: 11320,
    likes: 5400,
    badges: ["빠른배송"],
    keyIngredient: "저분자 콜라겐·펩타이드",
    volume: "30ml",
    usage: "저녁 세럼 단계에 2~3방울. 흡수 후 크림으로 마무리하면 탄력감이 오래갑니다.",
    cohortViews: { "40s": 1690, "50s": 1350, "60s": 830 },
  },
  {
    id: "p5",
    actives: [{ key: "sunscreen" }],
    image: "product-p5.jpg",
    brand: "selen",
    name: "데일리 선크림 SPF50+ 50ml",
    category: "suncare",
    concerns: ["sun", "pigment"],
    tags: ["자외선", "무기자차"],
    price: 22000,
    listPrice: null,
    rating: 4.6,
    reviewCount: 20310,
    likes: 7800,
    badges: ["베스트", "빠른배송"],
    keyIngredient: "징크옥사이드",
    volume: "50ml",
    usage: "외출 20분 전, 마지막 단계에 충분한 양을. 야외활동 시 2~3시간마다 덧바릅니다.",
    cohortViews: { "40s": 2010, "50s": 1770, "60s": 990 },
  },
  {
    id: "p6",
    deviceKinds: ["led"],
    image: "product-p6.jpg",
    brand: "objet",
    name: "LED 색소 케어 디바이스",
    category: "device",
    concerns: ["pigment"],
    tags: ["기미·잡티", "LED"],
    price: 62000,
    listPrice: 89000,
    rating: 4.5,
    reviewCount: 4120,
    likes: 2200,
    badges: ["NEW"],
    keyIngredient: "660nm 레드 LED",
    volume: "본체",
    usage: "세럼 위에 5분간 밀착 케어. 주 3회면 충분해요.",
    cohortViews: { "40s": 890, "50s": 1120, "60s": 480 },
  },
  {
    id: "p7",
    actives: [{ key: "panthenol" }],
    image: "product-p7.jpg",
    brand: "onhue",
    name: "두피 볼륨 앰플 토닉",
    category: "scalp-hair",
    concerns: ["scalp-hair"],
    tags: ["두피·헤어", "볼륨"],
    price: 34000,
    listPrice: 42000,
    rating: 4.6,
    reviewCount: 5230,
    likes: 1900,
    badges: ["NEW"],
    keyIngredient: "덱스판테놀·비오틴",
    volume: "100ml",
    usage: "샴푸 후 타월 드라이한 두피에 분사, 손끝으로 마사지. 매일 사용.",
    cohortViews: { "40s": 720, "50s": 1040, "60s": 660 },
  },
  {
    id: "p8",
    actives: [{ key: "collagen" }],
    image: "product-p8.jpg",
    brand: "vitalab",
    name: "저분자 콜라겐 젤리스틱 30포",
    category: "inner",
    concerns: ["inner", "wrinkle"],
    tags: ["이너뷰티", "콜라겐"],
    price: 29000,
    listPrice: 36000,
    rating: 4.8,
    reviewCount: 13980,
    likes: 5100,
    badges: ["베스트"],
    keyIngredient: "피쉬콜라겐 3,000mg",
    volume: "30포",
    usage: "하루 1포, 시간 상관없이. 최소 8주 꾸준히.",
    cohortViews: { "40s": 1330, "50s": 1620, "60s": 1080 },
  },

  // ══ 실제 시판 제품 ══════════════════════════════════
  // 가격·스펙은 2026-07-30 실측 수집 (source.sourceUrl 참조).
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
      pricedAt: "2026-07-30",
      priceNote: "공식몰 판매가",
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
    concerns: ["sun", "pigment"],
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
      officialUrl: "https://www.iope.com",
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
    label: "기미 집중",
    title: "기미가 신경 쓰이기 시작했다면",
    description: "저녁 10분, 세럼→디바이스→선크림으로 잡티 케어의 기본을 잡는 세트",
    steps: [
      { productId: "p1", how: "세안·토너 후 2~3방울, 기미 부위에 집중해 흡수시켜요." },
      { productId: "p6", how: "세럼 위에 5분간 밀착 케어. 주 3회면 충분해요." },
      { productId: "p5", how: "아침 마무리는 자외선 차단. 기미 관리의 절반은 선케어예요." },
    ],
    why: "나이아신아마이드 세럼은 이미 생긴 색소를 옅히고, LED 디바이스는 그 흡수를 돕는 순서로 함께 써야 효과가 배가돼요. 그런데 새로 생기는 색소를 막지 않으면 옅힌 만큼 다시 쌓이기 때문에, 자외선 차단이 반드시 세트에 들어갑니다. 셋 중 하나만 쓰면 '지우는 것'과 '막는 것' 중 한쪽이 빕니다.",
    price: 95000,
    badge: "3단계 루틴",
    level: "집중",
    cohortAdds: { "40s": 480, "50s": 620, "60s": 210 },
  },
  {
    id: "r2",
    image: "routine-r2.jpg",
    concern: "wrinkle",
    label: "탄력 데일리",
    title: "아침마다 무너지는 탄력, 짧게",
    description: "바쁜 아침 3분, EMS 리프팅과 콜라겐 앰플 두 단계로 끝내는 데일리 세트",
    steps: [
      { productId: "p4", how: "저녁 세럼 단계에 2~3방울, 목 라인까지." },
      { productId: "p2", how: "아침 전용 젤 위에 3분, 턱선에서 귀 방향으로." },
    ],
    why: "콜라겐 앰플은 저녁에 피부 안쪽 지지력을 채우는 역할이고, EMS 디바이스는 아침에 그 지지력을 물리적으로 끌어올리는 역할이에요. 성분만 바르면 탄력이 '유지'되는 정도지만, 자극이 없으면 이미 처진 라인은 잘 안 올라옵니다. 발라서 채우고 자극으로 끌어올리는 아침·저녁 역할 분담이 이 세트의 핵심이에요.",
    price: 187000,
    badge: "2단계 루틴",
    level: "데일리",
    cohortAdds: { "40s": 390, "50s": 310, "60s": 150 },
  },
  {
    id: "r3",
    image: "routine-r3.jpg",
    concern: "pigment",
    label: "기미 입문",
    title: "처음 기미 케어, 부담 없이 시작",
    description: "세럼과 선크림, 딱 두 가지로 시작하는 입문 세트",
    steps: [
      { productId: "p3", how: "아침·저녁 토너 후 3~4방울." },
      { productId: "p5", how: "아침 마지막 단계에 충분한 양을." },
    ],
    why: "비타민C 앰플은 디바이스 없이도 톤을 관리할 수 있는 가장 가벼운 시작점이고, 선크림은 어떤 기미 관리든 빠지면 안 되는 기본기예요. 아직 디바이스까지 부담스러운 입문 단계라면, 이 두 가지만으로도 '더 진해지는 걸 막는' 절반의 관리는 됩니다.",
    price: 52000,
    badge: "2단계 루틴",
    level: "입문",
    cohortAdds: { "40s": 350, "50s": 410, "60s": 190 },
  },
  {
    id: "r4",
    image: "routine-r4.jpg",
    concern: "scalp-hair",
    label: "두피 볼륨",
    title: "가늘어진 모발, 두피부터",
    description: "샴푸 후 앰플 토닉과 이너뷰티로 안팎에서 채우는 두피 루틴",
    steps: [
      { productId: "p7", how: "샴푸 후 두피에 분사하고 마사지, 매일." },
      { productId: "p8", how: "하루 1포, 최소 8주 꾸준히." },
    ],
    why: "두피 앰플은 모근 주변 환경을 바깥에서 관리하는 방법이고, 이너뷰티 콜라겐은 모발이 자라는 안쪽 조건을 채우는 방법이에요. 바르는 것만으로는 이미 가늘어진 모발 자체를 바꾸기 어렵기 때문에, 안팎을 같이 채워야 8주 뒤 변화를 체감할 확률이 높아집니다.",
    price: 58000,
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
      { productId: "p5", how: "아침 마지막은 차단. 이 단계가 빠지면 앞의 둘이 상쇄돼요." },
    ],
    why: "나이아신아마이드는 만들어진 멜라닌이 표피 세포로 넘어가는 단계를 줄이고, 트라넥삼산은 자외선 자극이 멜라닌 생성 신호로 이어지는 앞단을 건드립니다. 같은 색소 고민이지만 손대는 지점이 달라서, 한쪽만 쓰면 나머지 절반이 그대로 남아요. 두 제품 모두 이 조합을 함께 담고 있고 크림 쪽엔 세라마이드·판테놀이 들어 있어 고함량 세럼을 매일 쓸 때의 자극을 받아줍니다. 그리고 색소 관리에서 선크림이 빠지면 옅힌 만큼 다시 쌓이기 때문에, 아침 차단이 선택이 아니라 구성품입니다.",
    price: 66000,
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
];

// ── 이미지 경로 헬퍼 ────────────────────────────────
// public/images/ 에 배치된 실사 이미지 (docs/04-photo-brief.md 기준 21장).
// 상품 수가 이미지 수보다 많아 유형별로 재사용한다 — 각 항목의 image 필드가 매핑 결과.
export const productImage = (id: string) => {
  const p = products.find((x) => x.id === id);
  return p ? `/images/product/${p.image}` : undefined;
};
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
