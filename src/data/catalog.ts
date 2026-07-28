/**
 * RIVEA 더미 데이터 — 브랜드·고민·상품·루틴세트
 * 실제 콘텐츠 원칙: Lorem 금지, 고민 언어 카피.
 * 이미지: 의도적으로 비워둔 ImageSlot 플레이스홀더 사용.
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
};

export const brands: Brand[] = [
  { slug: "lavid", name: "라비드", tagline: "더마 브라이트닝 전문", since: "2024", rating: 4.8, freeShippingOver: 20000, shippingFee: 2500 },
  { slug: "objet", name: "오브제", tagline: "홈 뷰티 디바이스", since: "2023", rating: 4.7, freeShippingOver: null, shippingFee: 3000 },
  { slug: "selen", name: "셀렌", tagline: "민감 피부 선케어", since: "2024", rating: 4.7, freeShippingOver: 30000, shippingFee: 2500 },
  { slug: "muel", name: "뮤엘", tagline: "탄력 집중 스킨케어", since: "2025", rating: 4.9, freeShippingOver: 20000, shippingFee: 2500 },
  { slug: "onhue", name: "온휴", tagline: "두피·헤어 홈케어", since: "2025", rating: 4.6, freeShippingOver: 25000, shippingFee: 3000 },
  { slug: "vitalab", name: "비타랩", tagline: "이너뷰티 연구소", since: "2024", rating: 4.8, freeShippingOver: 30000, shippingFee: 2500 },
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
};

export const products: Product[] = [
  {
    id: "p1",
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
};

export const routines: Routine[] = [
  {
    id: "r1",
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
];

// ── 이미지 경로 헬퍼 ────────────────────────────────
// public/images/ 에 배치된 실사 이미지 (docs/04-photo-brief.md 기준 21장)
export const productImage = (id: string) => `/images/product/${id.replace("p", "product-p")}.jpg`;
export const routineImage = (id: string) => `/images/routine/routine-${id}.jpg`;
export const concernImage = (slug: string) => `/images/concern/concern-${slug}.jpg`;
export const heroImages = ["/images/hero/hero-1.jpg", "/images/hero/hero-2.jpg"];

// ── 헬퍼 ──────────────────────────────────────────
export const won = (n: number) => n.toLocaleString("ko-KR");

export const discountRate = (p: { price: number; listPrice: number | null }) =>
  p.listPrice ? Math.round((1 - p.price / p.listPrice) * 100) : null;

export const brandOf = (slug: string) => brands.find((b) => b.slug === slug)!;
export const productOf = (id: string) => products.find((p) => p.id === id)!;
export const concernOf = (slug: string) => concerns.find((c) => c.slug === slug)!;

export const routineListPrice = (r: Routine) =>
  r.steps.reduce((sum, s) => sum + productOf(s.productId).price, 0);
