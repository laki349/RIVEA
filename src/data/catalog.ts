// ─────────────────────────────────────────────────────────────
// Dummy catalog data for the Mature Care marketplace prototype.
// A real build would fetch this from each partner brand's API.
// ─────────────────────────────────────────────────────────────

export type IconKey =
  | "device"
  | "skincare"
  | "cover"
  | "wrinkle"
  | "mask"
  | "suncare"
  | "cleansing"
  | "inner";

export interface Category {
  slug: string;
  name: string;
  tagline: string;
  icon: IconKey;
}

export interface Brand {
  id: string;
  name: string;
  handle: string;
  blurb: string;
  origin: string;
  since: number;
  logo?: string; // /public path, 1:1 (원형 크롭). 없으면 MC 모노그램 표시
}

export interface Product {
  id: string;
  name: string;
  brandId: string;
  category: string; // category slug
  price: number;
  listPrice: number; // before discount
  rating: number;
  reviewCount: number;
  tags: string[];
  badge?: "베스트" | "신상" | "단독" | "앵콜";
  concerns: string[]; // 피부 고민
  summary: string;
  image?: string; // 대표 이미지 /public 경로, 1:1 (썸네일·상세 대표). 없으면 플레이스홀더
  gallery?: string[]; // 상세 추가 컷 1:1, 최대 4장
  detailImages?: string[]; // 상세 설명 이미지 (16:7 / 16:9 등 와이드)
}

export const categories: Category[] = [
  { slug: "device", name: "뷰티 디바이스", tagline: "집에서 하는 관리", icon: "device" },
  { slug: "skincare", name: "스킨케어", tagline: "탄력·보습 집중", icon: "skincare" },
  { slug: "cover", name: "커버 메이크업", tagline: "기미·잡티 커버", icon: "cover" },
  { slug: "wrinkle", name: "주름 안착 케어", tagline: "끼지 않는 화장", icon: "wrinkle" },
  { slug: "mask", name: "마스크·팩", tagline: "하루의 마무리", icon: "mask" },
  { slug: "suncare", name: "선케어", tagline: "자외선 차단", icon: "suncare" },
  { slug: "cleansing", name: "클렌징", tagline: "순한 세안", icon: "cleansing" },
  { slug: "inner", name: "이너뷰티", tagline: "속부터 채우는", icon: "inner" },
];

export const brands: Brand[] = [
  { id: "lumea", name: "루메아", handle: "@lumea", blurb: "피부과 협업 홈 디바이스", origin: "서울", since: 2016 },
  { id: "maison-r", name: "메종로즈", handle: "@maisonrose", blurb: "성숙한 피부를 위한 안티에이징", origin: "파리", since: 2009 },
  { id: "hansu", name: "한수", handle: "@hansu", blurb: "한방 발효 스킨케어", origin: "제주", since: 2004 },
  { id: "veil", name: "베일", handle: "@veil", blurb: "커버와 케어를 동시에", origin: "서울", since: 2018 },
  { id: "atelier-n", name: "아틀리에느", handle: "@ateliern", blurb: "미니멀 클린 뷰티", origin: "부산", since: 2020 },
  { id: "golden-h", name: "골든아워", handle: "@goldenhour", blurb: "빛나는 성숙미 메이크업", origin: "밀라노", since: 2012 },
  { id: "sooda", name: "수다", handle: "@sooda", blurb: "저자극 순수 세안", origin: "서울", since: 2015 },
  { id: "vitagen", name: "비타젠", handle: "@vitagen", blurb: "이너뷰티 뉴트리션", origin: "서울", since: 2011 },
];

export const products: Product[] = [
  {
    id: "p01",
    name: "리프트 프로 EMS 마이크로커런트 디바이스",
    brandId: "lumea",
    category: "device",
    price: 189000,
    listPrice: 269000,
    rating: 4.8,
    reviewCount: 2412,
    tags: ["탄력", "리프팅", "홈케어"],
    badge: "베스트",
    concerns: ["처짐", "탄력저하"],
    summary: "미세전류와 EMS로 얼굴 라인을 매일 10분 관리하는 홈 리프팅 디바이스.",
  },
  {
    id: "p02",
    name: "레드 LED 마스크 7색 광채 테라피",
    brandId: "lumea",
    category: "device",
    price: 249000,
    listPrice: 349000,
    rating: 4.7,
    reviewCount: 1783,
    tags: ["광채", "진정", "LED"],
    badge: "단독",
    concerns: ["칙칙함", "탄력저하"],
    summary: "파장별 7색 LED로 광채와 진정을 동시에. 무선 착용형 마스크.",
  },
  {
    id: "p03",
    name: "레티놀 0.3 리뉴얼 나이트 세럼",
    brandId: "maison-r",
    category: "skincare",
    price: 62000,
    listPrice: 78000,
    rating: 4.6,
    reviewCount: 3120,
    tags: ["주름", "탄력", "야간케어"],
    badge: "베스트",
    concerns: ["주름", "탄력저하"],
    summary: "저자극 캡슐 레티놀로 밤사이 주름을 다듬는 안티에이징 세럼.",
  },
  {
    id: "p04",
    name: "콜라겐 탄력 크림 딥 리페어",
    brandId: "maison-r",
    category: "skincare",
    price: 54000,
    listPrice: 72000,
    rating: 4.5,
    reviewCount: 1985,
    tags: ["탄력", "보습", "고영양"],
    concerns: ["탄력저하", "건조"],
    summary: "가수분해 콜라겐과 펩타이드로 무너진 탄력을 채우는 고영양 크림.",
  },
  {
    id: "p05",
    name: "발효 자음 에센스 토너",
    brandId: "hansu",
    category: "skincare",
    price: 38000,
    listPrice: 45000,
    rating: 4.7,
    reviewCount: 2760,
    tags: ["보습", "결정돈", "한방"],
    badge: "앵콜",
    concerns: ["건조", "칙칙함"],
    summary: "한방 발효 성분이 겉돌지 않고 스며들어 속당김을 잡아주는 에센스 토너.",
  },
  {
    id: "p06",
    name: "세븐데이 커버 파운데이션 (기미 집중)",
    brandId: "veil",
    category: "cover",
    price: 41000,
    listPrice: 49000,
    rating: 4.6,
    reviewCount: 4210,
    tags: ["커버", "지속력", "촉촉"],
    badge: "베스트",
    concerns: ["기미", "잡티"],
    summary: "얇게 발려도 기미·잡티를 자연스럽게 덮고 하루 종일 촉촉하게 밀착.",
  },
  {
    id: "p07",
    name: "핀포인트 컨실러 다크스팟 커버",
    brandId: "veil",
    category: "cover",
    price: 24000,
    listPrice: 29000,
    rating: 4.4,
    reviewCount: 1560,
    tags: ["커버", "핀포인트"],
    concerns: ["기미", "잡티"],
    summary: "짙은 기미와 다크스팟을 한 번에 가리는 고커버 스틱 컨실러.",
  },
  {
    id: "p08",
    name: "노 크리즈 소프트 매트 쿠션",
    brandId: "golden-h",
    category: "wrinkle",
    price: 39000,
    listPrice: 46000,
    rating: 4.7,
    reviewCount: 3380,
    tags: ["주름안착", "매트", "밀착"],
    badge: "단독",
    concerns: ["주름", "모공"],
    summary: "눈가·팔자 주름 사이에 끼지 않고 매끈하게 안착하는 소프트 매트 쿠션.",
  },
  {
    id: "p09",
    name: "스무딩 프라이머 라인필러",
    brandId: "golden-h",
    category: "wrinkle",
    price: 32000,
    listPrice: 38000,
    rating: 4.5,
    reviewCount: 1240,
    tags: ["주름안착", "메이크업베이스"],
    concerns: ["주름", "모공"],
    summary: "주름과 모공을 메워 파운데이션이 갈라지지 않게 잡아주는 베이스.",
  },
  {
    id: "p10",
    name: "콜라겐 탄력 시트 마스크 (10매)",
    brandId: "hansu",
    category: "mask",
    price: 28000,
    listPrice: 39000,
    rating: 4.6,
    reviewCount: 5120,
    tags: ["탄력", "보습", "데일리"],
    badge: "베스트",
    concerns: ["탄력저하", "건조"],
    summary: "밀착력 좋은 텐셀 시트에 콜라겐 앰플을 가득 담은 데일리 팩.",
  },
  {
    id: "p11",
    name: "오버나이트 재생 슬리핑 팩",
    brandId: "atelier-n",
    category: "mask",
    price: 34000,
    listPrice: 41000,
    rating: 4.5,
    reviewCount: 1670,
    tags: ["재생", "보습", "야간케어"],
    concerns: ["건조", "칙칙함"],
    summary: "자는 동안 얇은 막을 만들어 다음 날 광채 피부로 깨우는 슬리핑 팩.",
  },
  {
    id: "p12",
    name: "톤업 세이프 선크림 SPF50+ PA++++",
    brandId: "atelier-n",
    category: "suncare",
    price: 26000,
    listPrice: 31000,
    rating: 4.6,
    reviewCount: 2890,
    tags: ["자외선차단", "톤업", "백탁없음"],
    badge: "신상",
    concerns: ["칙칙함", "기미"],
    summary: "백탁 없이 은은한 톤업까지. 기미 예방을 위한 데일리 고차단 선크림.",
  },
  {
    id: "p13",
    name: "미네랄 무기자차 선스틱",
    brandId: "atelier-n",
    category: "suncare",
    price: 21000,
    listPrice: 25000,
    rating: 4.4,
    reviewCount: 940,
    tags: ["자외선차단", "휴대"],
    concerns: ["기미"],
    summary: "덧바르기 편한 무기자차 선스틱. 화장 위에도 밀리지 않게.",
  },
  {
    id: "p14",
    name: "저자극 아미노 클렌징 폼",
    brandId: "sooda",
    category: "cleansing",
    price: 18000,
    listPrice: 22000,
    rating: 4.7,
    reviewCount: 3560,
    tags: ["약산성", "저자극", "보습"],
    badge: "베스트",
    concerns: ["건조", "민감"],
    summary: "세안 후에도 당기지 않는 약산성 아미노 클렌저. 매일 순하게.",
  },
  {
    id: "p15",
    name: "딥 모이스처 클렌징 밤",
    brandId: "sooda",
    category: "cleansing",
    price: 23000,
    listPrice: 28000,
    rating: 4.6,
    reviewCount: 2010,
    tags: ["클렌징", "보습", "메이크업제거"],
    concerns: ["건조", "민감"],
    summary: "짙은 커버 메이크업도 부드럽게 녹여내는 밤 타입 클렌저.",
  },
  {
    id: "p16",
    name: "이너 콜라겐 저분자 파우더 (30포)",
    brandId: "vitagen",
    category: "inner",
    price: 45000,
    listPrice: 59000,
    rating: 4.5,
    reviewCount: 4780,
    tags: ["이너뷰티", "탄력", "저분자"],
    badge: "앵콜",
    concerns: ["탄력저하"],
    summary: "흡수 빠른 저분자 콜라겐으로 속부터 채우는 데일리 이너뷰티.",
  },
  {
    id: "p17",
    name: "안티옥시 비타민 이너샷 (14병)",
    brandId: "vitagen",
    category: "inner",
    price: 39000,
    listPrice: 49000,
    rating: 4.4,
    reviewCount: 1320,
    tags: ["이너뷰티", "항산화"],
    concerns: ["칙칙함"],
    summary: "비타민C와 항산화 성분을 마시는 이너뷰티 샷.",
  },
  {
    id: "p18",
    name: "인텐시브 아이 리페어 크림",
    brandId: "maison-r",
    category: "skincare",
    price: 48000,
    listPrice: 58000,
    rating: 4.5,
    reviewCount: 1490,
    tags: ["눈가", "주름", "탄력"],
    concerns: ["주름", "건조"],
    summary: "얇고 예민한 눈가를 위한 고영양 아이 크림. 잔주름 집중 케어.",
  },
  {
    id: "p19",
    name: "글로우 리프트 초음파 클렌징 디바이스",
    brandId: "lumea",
    category: "device",
    price: 98000,
    listPrice: 139000,
    rating: 4.5,
    reviewCount: 860,
    tags: ["클렌징", "각질", "홈케어"],
    badge: "신상",
    concerns: ["모공", "칙칙함"],
    summary: "초음파 진동으로 모공 속 노폐물까지 부드럽게 밀어내는 클렌징 기기.",
  },
  {
    id: "p20",
    name: "실크 커버 톤밸런싱 BB",
    brandId: "veil",
    category: "cover",
    price: 29000,
    listPrice: 34000,
    rating: 4.3,
    reviewCount: 1180,
    tags: ["커버", "톤보정", "가벼움"],
    concerns: ["기미", "잡티"],
    summary: "가볍게 톤을 정돈하면서 잡티를 자연스럽게 눌러주는 데일리 BB.",
  },
  {
    id: "p21",
    name: "히알루론 수분 물광 앰플",
    brandId: "hansu",
    category: "skincare",
    price: 33000,
    listPrice: 42000,
    rating: 4.6,
    reviewCount: 2240,
    tags: ["보습", "물광", "진정"],
    concerns: ["건조"],
    summary: "5중 히알루론산으로 속건조를 채워 물광 피부로 가꾸는 앰플.",
  },
  {
    id: "p22",
    name: "라인 스무더 넥·데콜테 크림",
    brandId: "maison-r",
    category: "wrinkle",
    price: 36000,
    listPrice: 44000,
    rating: 4.4,
    reviewCount: 720,
    tags: ["목주름", "탄력", "보습"],
    concerns: ["주름", "탄력저하"],
    summary: "얼굴만큼 신경 써야 할 목·데콜테를 위한 탄력 집중 크림.",
  },
  {
    id: "p23",
    name: "카밍 시카 진정 마스크 (5매)",
    brandId: "atelier-n",
    category: "mask",
    price: 16000,
    listPrice: 21000,
    rating: 4.5,
    reviewCount: 1990,
    tags: ["진정", "저자극", "데일리"],
    concerns: ["민감", "건조"],
    summary: "예민해진 피부를 가라앉히는 시카 진정 시트 마스크.",
  },
  {
    id: "p24",
    name: "브라이트닝 비타 C 스팟 세럼",
    brandId: "veil",
    category: "skincare",
    price: 37000,
    listPrice: 46000,
    rating: 4.5,
    reviewCount: 2630,
    tags: ["미백", "기미", "브라이트닝"],
    badge: "신상",
    concerns: ["기미", "칙칙함"],
    summary: "안정화 비타민C로 칙칙함과 기미 부위를 집중 케어하는 세럼.",
  },
];

// 이미지 경로를 파일명 규칙(public/images)으로 자동 연결.
// 개별 항목에 image/logo를 직접 지정하면 그 값이 우선됩니다.
products.forEach((p) => {
  if (!p.image) p.image = `/images/${p.id}.webp`;
});
brands.forEach((b) => {
  if (!b.logo) b.logo = `/images/brand-${b.id}.webp`;
});

// ── Helpers ──────────────────────────────────────────────────
export const brandById = (id: string) => brands.find((b) => b.id === id);
export const categoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);
export const productById = (id: string) => products.find((p) => p.id === id);
export const productsByCategory = (slug: string) =>
  products.filter((p) => p.category === slug);

export const discountRate = (p: Product) =>
  Math.round((1 - p.price / p.listPrice) * 100);

export const formatKRW = (n: number) => n.toLocaleString("ko-KR") + "원";
