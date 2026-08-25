/**
 * RIVEA 매거진 — 성분·연령·기기 근거 콘텐츠
 *
 * 역할: 번들(루틴 세트)이 "왜 같이 쓰는지"에 대한 신뢰를 만드는 레이어.
 * 상품 상세·고민 상세·루틴 상세에서 컨텍스트로 진입하고, /magazine이 색인이다.
 *
 * 카피 원칙 (화장품법 표시·광고 준수):
 * - "관리 / 도움 / 경향 / 완화" 계열만 쓴다.
 * - "치료 / 제거 / 없어진다 / 재생" 같은 의약품 표현은 쓰지 않는다.
 * - 개인차가 있다는 점을 본문에 남긴다.
 */
export type Article = {
  slug: string;
  /** 칩에 노출되는 분류 라벨 */
  kind: "성분" | "연령" | "디바이스" | "이너뷰티";
  /** 매거진 색인의 섹션 배치 — ingredient는 포스터 레일, guide는 타이포 블록 */
  section: "ingredient" | "guide";
  title: string;
  dek: string; // 리드문 — 목록과 컨텍스트 링크에서 함께 보인다
  readMinutes: number;
  concerns: string[]; // concern slug — 고민·루틴 상세 매칭용
  /** 상품의 keyIngredient에 이 중 하나가 포함되면 상품 상세에 우선 노출 */
  ingredientMatch?: string[];
  productIds: string[];
  routineIds: string[];
  /** 기본은 첫 고민의 사진을 쓴다. 주제가 고민 사진과 안 맞을 때만 지정. */
  image?: string;
  /** guide 섹션 타이포 블록에 들어가는 주제어 (사진 없이 카드를 세운다) */
  block?: { ko: string; en: string };
  body: { heading: string; paragraphs: string[] }[];
};

export const articles: Article[] = [
  {
    slug: "niacinamide-40s",
    kind: "성분",
    section: "ingredient",
    title: "나이아신아마이드, 40대엔 왜 5%를 고르나",
    dek: "같은 성분인데 2%와 5%가 왜 다른 값을 받는지, 농도를 올리면 늘 좋은지 정리했습니다.",
    readMinutes: 4,
    concerns: ["pigment"],
    ingredientMatch: ["나이아신아마이드"],
    productIds: ["c-paulas-b3", "c-anua-txa", "c-roundlab-vita-cream"],
    routineIds: ["r1"],
    image: "/images/magazine/mag-niacinamide.jpg",
    body: [
      {
        heading: "이 성분이 하는 일",
        paragraphs: [
          "나이아신아마이드는 비타민B3 계열 성분입니다. 피부에서 멜라닌이 만들어지는 것 자체를 막는 방식이 아니라, 이미 만들어진 멜라닌이 피부 표면 쪽으로 옮겨가는 과정에 관여하는 것으로 알려져 있습니다.",
          "그래서 체감 방식이 다릅니다. 하루아침에 톤이 밝아지는 성분이 아니라, 꾸준히 쓰는 동안 새로 올라오는 잡티가 눈에 덜 띄게 관리되는 쪽입니다. 보통 8주 이상 기준으로 이야기합니다.",
        ],
      },
      {
        heading: "2%와 5%의 실제 차이",
        paragraphs: [
          "시중 제품은 대개 2%에서 10% 사이입니다. 2%대는 보습과 피부결 관리 쪽에 무게가 있고, 5% 부근부터 색소 관리 목적의 배합으로 보는 경우가 많습니다.",
          "40대 이후에 5% 부근을 고르는 이유는 나이가 아니라 누적량입니다. 이 시기의 잡티는 최근에 생긴 것보다 20~30대에 받은 자외선이 시간차를 두고 올라온 경우가 많아서, 이미 자리 잡은 색소를 상대해야 하기 때문입니다.",
        ],
      },
      {
        heading: "농도를 올리면 계속 좋아지나",
        paragraphs: [
          "그렇지 않습니다. 10% 이상 고농도에서는 따끔거림이나 홍조를 느끼는 사람이 늘어납니다. 특히 레티놀이나 각질 제거 성분을 같이 쓰고 있으면 자극이 겹칩니다.",
          "처음 쓴다면 5% 부근에서 시작해 저녁에만 쓰고, 2주 정도 피부 반응을 보는 편이 안전합니다. 자극이 없으면 아침까지 늘리는 순서를 권합니다. 개인차가 크므로 붉어짐이 이어지면 사용을 줄이고 전문가와 상담하세요.",
        ],
      },
      {
        heading: "같이 쓰면 좋은 것, 겹치면 부담되는 것",
        paragraphs: [
          "자외선 차단제와의 조합은 사실상 필수입니다. 색소 관리 제품을 쓰면서 자외선을 막지 않으면, 옅어지는 속도와 새로 쌓이는 속도가 상쇄됩니다.",
          "반대로 같은 저녁에 레티놀·AHA·BHA를 한꺼번에 얹는 조합은 권하지 않습니다. 요일을 나눠 쓰는 편이 낫습니다.",
        ],
      },
    ],
  },
  {
    slug: "ceramide-barrier",
    kind: "성분",
    section: "ingredient",
    title: "발라도 계속 당기는 건, 채우는 문제가 아닙니다",
    dek: "수분을 넣는 것과 가두는 것은 다릅니다. 세라마이드가 왜 이 시기에 자주 언급되는지.",
    readMinutes: 4,
    concerns: ["dry"],
    ingredientMatch: ["세라마이드"],
    productIds: ["c-medicube-txa-cream", "c-anua-pdrn-cream", "c-roundlab-dokdo-cream"],
    routineIds: ["r3"],
    image: "/images/magazine/mag-ceramide.jpg",
    body: [
      {
        heading: "수분을 넣는 것과 가두는 것",
        paragraphs: [
          "보습 제품을 열심히 쓰는데도 오후가 되면 당긴다는 이야기를 이 시기에 자주 듣습니다. 대개 넣는 양이 부족한 게 아니라, 넣은 수분이 빠져나가는 속도가 빨라진 경우입니다.",
          "피부 가장 바깥층은 벽돌과 시멘트 구조에 자주 비유됩니다. 각질세포가 벽돌이고, 그 사이를 메우는 지질이 시멘트입니다. 세라마이드는 그 시멘트의 주요 구성 성분 중 하나입니다.",
        ],
      },
      {
        heading: "나이가 들면 시멘트가 줄어듭니다",
        paragraphs: [
          "세라마이드는 나이가 들면서 감소하는 경향이 있고, 잦은 세안이나 뜨거운 물, 건조한 실내 환경도 줄어드는 데 영향을 줍니다.",
          "시멘트가 부족하면 히알루론산 같은 수분 성분을 넣어도 오래 머무르지 않습니다. 그래서 이 시기에는 '채우는 성분'보다 '가두는 성분'을 먼저 점검하는 편이 순서에 맞습니다.",
        ],
      },
      {
        heading: "세안부터 손봐야 하는 이유",
        paragraphs: [
          "세정력이 강한 클렌저는 피지와 함께 지질도 함께 씻어냅니다. 좋은 보습 제품을 쓰면서 세안에서 계속 지질을 덜어내면 제자리걸음이 됩니다.",
          "세안 후 얼굴이 뽀득한 느낌이 든다면 그 신호일 수 있습니다. 미지근한 물, 순한 클렌저, 그리고 세안 직후 3분 안에 보습을 얹는 순서가 기본입니다.",
        ],
      },
      {
        heading: "함께 보면 좋은 성분",
        paragraphs: [
          "세라마이드는 콜레스테롤, 지방산과 함께 있을 때 장벽 구성에 더 자연스럽게 맞물리는 것으로 알려져 있습니다. 성분표에서 이 조합이 함께 보이면 참고할 만합니다.",
          "판테놀이나 마데카소사이드 같은 진정 계열은 예민해진 시기에 함께 쓰기 좋습니다. 다만 건조가 아니라 가려움이나 붉은기가 지속된다면 화장품 선택 문제가 아닐 수 있으니 진료를 권합니다.",
        ],
      },
    ],
  },
  {
    slug: "uv-daily-indoor",
    kind: "성분",
    section: "ingredient",
    title: "실내에서도 선크림이 필요한가",
    dek: "창을 통과하는 자외선의 정체와, 무기자차·유기자차를 고르는 기준을 정리했습니다.",
    readMinutes: 4,
    concerns: ["sun", "pigment"],
    ingredientMatch: ["징크옥사이드", "티타늄디옥사이드"],
    productIds: ["c-laroche-uvmune", "c-roundlab-birch-sun", "c-iope-aircushion"],
    routineIds: ["r12", "r1"],
    image: "/images/magazine/mag-uv.jpg",
    body: [
      {
        heading: "UVA와 UVB는 다르게 움직입니다",
        paragraphs: [
          "자외선은 크게 UVA와 UVB로 나뉩니다. UVB는 짧은 시간에 피부를 붉게 만드는 쪽이고, 유리창에 상당 부분 차단됩니다.",
          "문제는 UVA입니다. 파장이 길어 피부 깊은 층까지 도달하고, 일반 유리창을 상당 부분 통과하는 것으로 알려져 있습니다. 색소와 탄력 저하에 더 관련이 있다고 이야기되는 쪽이 이 UVA입니다.",
          "그래서 창가에서 일하거나 운전을 오래 하는 경우, 실내라도 자외선 관리가 의미가 있습니다.",
        ],
      },
      {
        heading: "SPF와 PA는 각각 무엇을 말하나",
        paragraphs: [
          "SPF 숫자는 주로 UVB 차단 정도를 나타냅니다. PA 뒤의 + 개수는 UVA 차단 정도를 나타냅니다.",
          "즉 SPF만 높고 PA 표기가 낮으면 UVA 쪽은 상대적으로 약할 수 있습니다. 색소가 고민이라면 SPF 숫자만 보지 말고 PA 표기를 함께 확인하는 편이 맞습니다.",
        ],
      },
      {
        heading: "무기자차와 유기자차",
        paragraphs: [
          "무기자차는 징크옥사이드·티타늄디옥사이드처럼 물리적으로 빛을 반사·산란시키는 성분을 씁니다. 자극이 덜한 편이라 예민한 피부에 자주 권해지고, 대신 백탁이 남거나 무겁게 느껴질 수 있습니다.",
          "유기자차는 자외선을 흡수해 열로 바꾸는 성분을 씁니다. 발림이 가볍고 백탁이 적은 대신, 사람에 따라 눈이 시리거나 자극을 느끼는 경우가 있습니다.",
          "어느 쪽이 낫다기보다 피부 반응과 사용 상황에 맞추는 문제입니다. 매일 바를 수 있는 제형이 결국 가장 효과적인 제품입니다.",
        ],
      },
      {
        heading: "양과 덧바르기",
        paragraphs: [
          "권장량은 얼굴 기준 손가락 두 마디 정도로 이야기되는데, 실제로는 그보다 훨씬 적게 바르는 경우가 많습니다. 표기된 차단 지수는 권장량을 발랐을 때 기준입니다.",
          "야외 활동이 길면 2~3시간마다 덧바르는 것이 기본입니다. 메이크업 위에는 선쿠션이나 선스틱이 현실적인 대안입니다.",
        ],
      },
    ],
  },
  {
    slug: "collagen-decline-45",
    kind: "연령",
    section: "guide",
    title: "45세 전후, 관리 순서가 바뀌는 이유",
    dek: "30대까지 통했던 '채우는 관리'가 왜 덜 먹히기 시작하는지, 무엇을 먼저 바꿔야 하는지.",
    readMinutes: 5,
    concerns: ["wrinkle", "pore"],
    productIds: ["c-anua-retinol", "d-medicube-pro", "c-nutree-timezero"],
    routineIds: ["r2"],
    image: "/images/magazine/mag-age45.jpg",
    block: { ko: "45세 전후", en: "Age 45 Turning Point" },
    body: [
      {
        heading: "무너지는 건 수분이 아니라 지지력",
        paragraphs: [
          "40대 중반에 흔히 듣는 말이 '보습을 예전보다 열심히 하는데 더 처져 보인다'입니다. 원인이 수분이 아닌 경우가 많습니다.",
          "피부 속에서 구조를 잡아주는 콜라겐과 엘라스틴은 20대 중반부터 서서히 줄고, 여성의 경우 폐경 전후로 감소 속도가 더 빨라지는 것으로 알려져 있습니다. 지지력이 약해지면 수분을 채워도 형태가 유지되지 않습니다.",
        ],
      },
      {
        heading: "그래서 순서가 바뀝니다",
        paragraphs: [
          "30대까지는 '채우기'가 중심이었습니다. 수분, 보습, 진정 순서였죠. 45세 전후로는 여기에 '끌어올리기'가 하나 더 붙습니다.",
          "발라서 채우는 관리(펩타이드·콜라겐 계열)와 물리적으로 자극을 주는 관리(EMS·리프팅 디바이스)는 하는 일이 다릅니다. 앞의 것은 재료를 넣는 쪽이고, 뒤의 것은 이미 처진 라인을 움직이는 쪽입니다.",
          "성분만 쓰면 현 상태를 지키는 데 가깝고, 자극만 주면 재료가 부족합니다. 이 시기에 두 가지를 같이 권하는 이유입니다.",
        ],
      },
      {
        heading: "모공이 세로로 길어졌다면",
        paragraphs: [
          "이 시기 모공 변화는 피지 문제와 다릅니다. 20대 모공이 둥글게 넓어지는 쪽이라면, 40대 이후는 탄력이 떨어져 세로로 늘어나는 형태가 흔합니다.",
          "그래서 각질·피지 관리만 반복하면 잘 달라지지 않습니다. 모공이 신경 쓰인다면 탄력 관리를 같은 비중으로 넣어야 합니다.",
        ],
      },
      {
        heading: "아침·저녁 역할을 나누면 부담이 줄어요",
        paragraphs: [
          "두 가지를 다 하려면 시간이 늘어난다고 느끼기 쉽습니다. 저녁에 성분을 채우고 아침에 짧게 자극을 주는 식으로 나누면 한 번에 걸리는 시간이 줄어듭니다.",
          "얼굴만 하고 목을 빼는 경우가 많은데, 턱선과 목은 나이가 먼저 드러나는 구간입니다. 같은 제품으로 목까지 이어서 쓰는 편이 좋습니다.",
          "변화는 보통 8주에서 12주 사이에 이야기합니다. 2주 만에 판단하고 제품을 계속 바꾸는 게 가장 흔한 실패 패턴입니다.",
        ],
      },
    ],
  },
  {
    slug: "home-device-basics",
    kind: "디바이스",
    section: "guide",
    title: "홈 디바이스, 사기 전에 확인할 네 가지",
    dek: "EMS와 LED는 하는 일이 다릅니다. 내 고민에 맞는 종류와 현실적인 사용 빈도를 정리했습니다.",
    readMinutes: 5,
    concerns: ["wrinkle", "pigment", "scalp-hair"],
    // 기기 상세에서는 고민 기사보다 이 글이 먼저 걸리도록
    ingredientMatch: ["EMS", "LED"],
    productIds: ["d-medicube-x2", "d-lg-ledmask", "d-medicube-mini"],
    routineIds: ["r6", "r7", "r9"],
    image: "/images/magazine/mag-device.jpg",
    block: { ko: "EMS와 LED", en: "Know Your Device" },
    body: [
      {
        heading: "EMS와 LED는 다른 기기입니다",
        paragraphs: [
          "홈 디바이스를 하나로 묶어 생각하기 쉽지만, 가장 많이 팔리는 두 종류는 목적이 다릅니다.",
          "EMS는 미세전류로 물리적인 자극을 주는 방식이라 탄력·턱선 쪽 관리에 씁니다. LED는 특정 파장의 빛을 쬐는 방식이고, 붉은빛(660nm 대역)은 색소·피부결 관리 목적으로 많이 쓰입니다.",
          "즉 기미가 고민이면 EMS를 사도 방향이 어긋납니다. 기기를 고르기 전에 내 고민이 '처짐'인지 '색소'인지부터 정해야 합니다.",
        ],
      },
      {
        heading: "빈도는 많을수록 좋지 않아요",
        paragraphs: [
          "매일 오래 쓰면 빨라진다고 생각하기 쉬운데, 제품마다 권장 빈도가 정해져 있는 이유가 있습니다. LED는 주 3회 5분, EMS는 주 5회 3분 정도가 흔한 기준입니다.",
          "권장 빈도를 넘기면 효과가 비례해서 늘지 않고, 대신 건조함이나 예민함이 올라올 수 있습니다. 설명서의 빈도를 지키는 게 가장 안전합니다.",
        ],
      },
      {
        heading: "전용 젤을 빼면 안 되는 경우",
        paragraphs: [
          "EMS 계열은 전류가 피부에 고르게 전달되도록 전용 젤이나 수분감 있는 제품을 함께 씁니다. 마른 피부에 그냥 대면 전달이 고르지 않고 따끔할 수 있습니다.",
          "LED는 젤이 필수는 아니지만, 세럼을 먼저 흡수시킨 뒤에 쓰는 순서를 권하는 제품이 많습니다. 기기와 화장품을 세트로 묶는 이유가 여기 있습니다.",
        ],
      },
      {
        heading: "이런 경우엔 쓰기 전에 확인하세요",
        paragraphs: [
          "심장 관련 기기를 사용 중이거나, 임신 중이거나, 시술을 받은 직후라면 사용 전에 반드시 전문가와 상담해야 합니다. 얼굴에 염증이나 상처가 있는 구간은 피합니다.",
          "홈 디바이스는 병원 시술을 대체하는 기기가 아닙니다. 일상 관리의 강도를 조금 올려주는 도구로 보는 편이 기대치가 맞습니다.",
        ],
      },
    ],
  },
  {
    slug: "inner-beauty-8weeks",
    kind: "이너뷰티",
    section: "guide",
    title: "먹는 콜라겐, 8주를 기준으로 보는 이유",
    dek: "분자 크기와 섭취 시점 이야기가 왜 나오는지, 무엇을 기대하고 무엇을 기대하지 않아야 하는지.",
    readMinutes: 4,
    concerns: ["inner", "wrinkle"],
    ingredientMatch: ["저분자콜라겐펩타이드", "비오틴"],
    productIds: ["c-nutree-timezero", "c-nutree-time-biotin"],
    routineIds: ["r11"],
    image: "/images/magazine/mag-inner.jpg",
    block: { ko: "8주 기준", en: "Inner Beauty Timeline" },
    body: [
      {
        heading: "먹은 콜라겐이 그대로 피부로 가지는 않습니다",
        paragraphs: [
          "가장 흔한 오해가 '콜라겐을 먹으면 그 콜라겐이 피부의 콜라겐이 된다'는 생각입니다. 실제로는 소화 과정에서 잘게 분해된 뒤 흡수됩니다.",
          "그래서 최근 제품들이 강조하는 지점이 분자 크기입니다. 저분자·펩타이드 형태로 미리 잘라 놓으면 흡수 단계에서 유리하다고 보는 것입니다. 이 부분은 연구가 이어지는 영역이고, 제품마다 근거의 강도가 다릅니다.",
        ],
      },
      {
        heading: "왜 8주라고 말하나",
        paragraphs: [
          "피부는 한 번에 바뀌지 않고 주기를 두고 교체됩니다. 이너뷰티 제품의 체감 기간을 이야기할 때 최소 8주, 넉넉히 12주를 기준으로 두는 이유입니다.",
          "2주 먹고 효과가 없다고 판단해 다른 제품으로 바꾸는 패턴이 가장 흔합니다. 제품을 자주 바꾸면 어느 것이 맞았는지도 알 수 없게 됩니다.",
        ],
      },
      {
        heading: "같이 먹으면 도움이 되는 것",
        paragraphs: [
          "비타민C는 체내에서 콜라겐이 만들어지는 과정에 관여하는 것으로 알려져 있어 함께 언급되는 경우가 많습니다.",
          "섭취 시점은 크게 구애받지 않아도 되지만, 하루 한 번을 빠뜨리지 않는 쪽이 시점보다 중요합니다. 식후처럼 기억하기 쉬운 시점에 고정하는 편이 낫습니다.",
        ],
      },
      {
        heading: "기대치를 정리해두면 좋습니다",
        paragraphs: [
          "이너뷰티는 바르는 관리를 대체하지 않습니다. 안에서 재료를 보태는 쪽이고, 바르는 관리와 방향이 다릅니다. 둘을 같이 이야기하는 이유입니다.",
          "특정 질환이 있거나 약을 복용 중이라면 건강기능식품도 상호작용을 확인해야 합니다. 임신·수유 중이거나 알레르기가 있는 경우에는 원료를 확인하고 전문가와 상담하세요.",
        ],
      },
    ],
  },
];

// ── 발행 정보 ──────────────────────────────────────
// 실제로 지난 호가 쌓이면 아카이브 드롭다운을 붙인다. 지금은 1호뿐이라 넣지 않는다.
export const issue = { vol: 1, period: "2026년 7월", cadence: "격주 발행" };

// ── 헬퍼 ──────────────────────────────────────────
export const articleOf = (slug: string) => articles.find((a) => a.slug === slug);

/** 이미지 자산이 따로 없어서 고민 사진을 재사용한다(주제가 일치하는 범위에서). */
export const articleImage = (a: Article) =>
  a.image ?? (a.concerns[0] ? `/images/concern/concern-${a.concerns[0]}.jpg` : undefined);

export const articlesInSection = (s: Article["section"]) =>
  articles.filter((a) => a.section === s);

/** 고민 상세·루틴 상세용 — 해당 고민을 다루는 기사 */
export const articlesForConcern = (slug: string) =>
  articles.filter((a) => a.concerns.includes(slug));

/** 상품 상세용 — 핵심성분이 겹치거나 고민이 겹치는 기사 (성분 우선) */
export const articlesForProduct = (p: { keyIngredient: string; concerns: string[] }) => {
  const byIngredient = articles.filter((a) =>
    a.ingredientMatch?.some((m) => p.keyIngredient.includes(m))
  );
  const byConcern = articles.filter(
    (a) => !byIngredient.includes(a) && a.concerns.some((c) => p.concerns.includes(c))
  );
  return [...byIngredient, ...byConcern];
};
