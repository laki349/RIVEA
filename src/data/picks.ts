// ─────────────────────────────────────────────────────────────
// "리베아 Pick" — 고민 하나를 푸는 브랜드 교차 루틴 큐레이션.
// 결제/재고 없음. 각 아이템은 외부 구매 링크(지금은 자리표시자)로 나감.
// 이번 주 검증용: 지인에게 링크 뿌리고 클릭/문의/공유가 나오는지 관찰.
// ─────────────────────────────────────────────────────────────
import { products, brandById, type Product } from "./catalog";
import { resolveConcern } from "./concerns";

export interface PickItem {
  productId: string; // 기존 카탈로그 상품 참조 (이미지·가격 재사용)
  role: string; // 예: "홈 디바이스", "브라이트닝 세럼", "낮 필수 차단"
  why: string; // 왜 이걸 골랐나 (1~2줄)
  buyUrl: string; // 외부 구매 링크. 지금은 "#" (나중에 제휴 링크로 교체)
  buyLabel: string; // 예: "네이버쇼핑에서 보기"
}

export interface RoutineStep {
  when: "아침" | "저녁";
  steps: string[];
}

export interface Pick {
  slug: string;
  concern: string; // 기미
  persona: string; // 50대 초반 · 호르몬성 기미
  title: string;
  promise: string; // 한 줄 약속
  diagnosis: string; // 왜 이 고민인가 (전문성)
  criteria: string; // 이 조합을 고른 기준 (중립성)
  items: PickItem[];
  routine: RoutineStep[];
}

export const picks: Pick[] = [
  {
    slug: "gimi-50",
    concern: "기미",
    persona: "50대 초반 · 호르몬성 기미",
    title: "50대 초반, 호르몬성 기미를 위한 리베아 Pick",
    promise:
      "짙어진 기미를 가리기 전에, 옅게 만들고 더 번지지 않게. 기기 하나와 화장품 두 개로 시작하는 저녁·아침 루틴.",
    diagnosis:
      "50대의 기미는 20대의 자외선 기미와 다릅니다. 폐경 전후 호르몬 변화가 멜라닌을 자극해 생긴 색소라, '가리는 것'보다 '옅게 만들고 재발을 막는 것'이 먼저입니다. 그래서 미백 세럼과 자외선 차단이 한 세트로 움직여야 합니다.",
    criteria:
      "리베아는 특정 브랜드 소속이 아닙니다. 이 조합은 '기미 하나'를 기준으로, 기기는 색소 진정에 강한 곳에서, 세럼은 안정화 비타민C가 있는 곳에서, 차단은 백탁 없이 매일 쓸 수 있는 곳에서. 브랜드를 가리지 않고 역할별로 가장 나은 것만 골랐습니다.",
    items: [
      {
        productId: "p02",
        role: "홈 디바이스 · 저녁",
        why: "레드 LED가 색소가 자리 잡은 피부를 진정시키고 톤을 정돈. 세럼 흡수 전 단계로 씁니다.",
        buyUrl: "#",
        buyLabel: "판매처에서 보기",
      },
      {
        productId: "p24",
        role: "브라이트닝 세럼 · 아침저녁",
        why: "안정화 비타민C로 이미 생긴 기미를 옅게. 기기 쓴 저녁, 그리고 아침에도 발라 꾸준히 관리.",
        buyUrl: "#",
        buyLabel: "판매처에서 보기",
      },
      {
        productId: "p12",
        role: "낮 필수 차단 · 아침",
        why: "기미의 진짜 주범은 자외선. 백탁 없이 톤업까지 되는 차단제로 재발을 막는 게 세럼만큼 중요합니다.",
        buyUrl: "#",
        buyLabel: "판매처에서 보기",
      },
      {
        productId: "p23",
        role: "주 2~3회 진정 · 저녁",
        why: "LED와 세럼으로 예민해진 피부를 가라앉히는 시카 마스크. 자극을 관리해야 꾸준히 갈 수 있어요.",
        buyUrl: "#",
        buyLabel: "판매처에서 보기",
      },
    ],
    routine: [
      {
        when: "아침",
        steps: [
          "순한 세안",
          "브라이트닝 비타 C 세럼 (기미 부위 집중)",
          "톤업 선크림 SPF50+, 반드시 실내에서도",
        ],
      },
      {
        when: "저녁",
        steps: [
          "클렌징",
          "레드 LED 마스크 10분",
          "브라이트닝 비타 C 세럼",
          "주 2~3회: 카밍 시카 진정 마스크로 마무리",
        ],
      },
    ],
  },

  {
    slug: "jureum-50",
    concern: "주름",
    persona: "50대 · 팔자·눈가 주름",
    title: "50대 팔자·눈가 주름을 위한 리베아 Pick",
    promise:
      "깊어진 주름은 하루아침에 안 없어져요. 자극 없이 매일 쌓는 EMS 리프팅과 레티놀 루틴으로 시작하세요.",
    diagnosis:
      "50대의 주름은 콜라겐 감소와 근육 처짐이 겹친 결과라, 표면만 채우는 크림 하나로는 부족합니다. 근육을 자극하는 기기와 진피를 다듬는 레티놀을 함께 써야 변화가 보입니다.",
    criteria:
      "리베아는 특정 브랜드 소속이 아닙니다. 리프팅 기기는 EMS에 강한 곳에서, 세럼은 저자극 레티놀이 있는 곳에서, 눈가는 예민한 부위 전용으로. 역할별로 가장 나은 것만 골랐습니다.",
    items: [
      {
        productId: "p01",
        role: "EMS 리프팅 기기 · 저녁",
        why: "미세전류와 EMS로 처진 근육 라인을 매일 10분 관리. 세럼 흡수 전 단계.",
        buyUrl: "#",
        buyLabel: "판매처에서 보기",
      },
      {
        productId: "p03",
        role: "레티놀 세럼 · 저녁",
        why: "저자극 캡슐 레티놀로 밤사이 주름을 다듬어요. 처음엔 격일로 시작.",
        buyUrl: "#",
        buyLabel: "판매처에서 보기",
      },
      {
        productId: "p18",
        role: "아이 크림 · 아침저녁",
        why: "얇고 예민한 눈가 잔주름 집중. 레티놀이 닿기 어려운 부위를 보완.",
        buyUrl: "#",
        buyLabel: "판매처에서 보기",
      },
      {
        productId: "p10",
        role: "주 2~3회 탄력 팩 · 저녁",
        why: "콜라겐 앰플 시트로 당김을 잡아주는 마무리. 레티놀로 건조해진 날 특히.",
        buyUrl: "#",
        buyLabel: "판매처에서 보기",
      },
    ],
    routine: [
      {
        when: "아침",
        steps: ["세안", "아이 크림 (눈가)", "보습 크림 + 선크림"],
      },
      {
        when: "저녁",
        steps: [
          "클렌징",
          "EMS 리프팅 기기 10분",
          "레티놀 세럼 (격일 → 매일)",
          "아이 크림 · 주 2~3회 콜라겐 팩",
        ],
      },
    ],
  },

  {
    slug: "tanlyeok-50",
    concern: "탄력",
    persona: "50대 초반 · 탄력 저하",
    title: "50대 초반, 무너진 탄력을 위한 리베아 Pick",
    promise:
      "겉과 속을 같이. LED로 콜라겐 생성을 돕고, 바르고 먹는 콜라겐으로 채우는 탄력 루틴이에요.",
    diagnosis:
      "탄력 저하는 콜라겐이 줄면서 피부가 얇아지는 문제라, 바르는 것만으로는 한계가 있습니다. 빛으로 생성을 돕는 기기, 바르는 콜라겐, 먹는 콜라겐을 함께 쓰는 이유예요.",
    criteria:
      "리베아는 특정 브랜드 소속이 아닙니다. 광채·생성은 LED에 강한 곳, 바르는 콜라겐은 고영양 크림, 이너뷰티는 저분자 흡수가 좋은 곳. 브랜드를 가리지 않고 역할별로 골랐습니다.",
    items: [
      {
        productId: "p02",
        role: "LED 마스크 · 저녁",
        why: "파장별 LED로 콜라겐·엘라스틴 생성을 도와 탄력의 바탕을 만들어요.",
        buyUrl: "#",
        buyLabel: "판매처에서 보기",
      },
      {
        productId: "p04",
        role: "콜라겐 크림 · 아침저녁",
        why: "가수분해 콜라겐과 펩타이드로 무너진 탄력을 겉에서 채우는 고영양 크림.",
        buyUrl: "#",
        buyLabel: "판매처에서 보기",
      },
      {
        productId: "p16",
        role: "이너 콜라겐 · 매일",
        why: "흡수 빠른 저분자 콜라겐으로 속부터. 바르는 케어와 같이 가야 효율이 좋아요.",
        buyUrl: "#",
        buyLabel: "판매처에서 보기",
      },
      {
        productId: "p10",
        role: "주 2~3회 탄력 팩 · 저녁",
        why: "콜라겐 시트로 즉각적인 탱탱함. 중요한 일정 전날 특히 좋아요.",
        buyUrl: "#",
        buyLabel: "판매처에서 보기",
      },
    ],
    routine: [
      {
        when: "아침",
        steps: ["세안", "콜라겐 크림", "선크림", "이너 콜라겐 1포"],
      },
      {
        when: "저녁",
        steps: [
          "클렌징",
          "LED 마스크 10분",
          "콜라겐 크림",
          "주 2~3회 콜라겐 시트 팩",
        ],
      },
    ],
  },
];

// 고민 택소노미는 단일 소스(concerns.ts)를 따른다.
// Pick 의 concern 문자열을 표준 고민 slug 로 해석해 매칭.
export const picksByConcernSlug = (slug: string) =>
  picks.filter((p) => resolveConcern(p.concern)?.slug === slug);

export const pickBySlug = (slug: string) => picks.find((p) => p.slug === slug);

export const pickItemProduct = (item: PickItem): Product | undefined =>
  products.find((p) => p.id === item.productId);

export { brandById };
