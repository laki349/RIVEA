/**
 * Design tokens — 단일 소스(single source of truth).
 *
 * 레이어 모델 (UI/UX 리서치의 Brand→Alias→Mapped 원칙):
 *   1) primitive : 브랜드 원시값(hex). "무슨 색"인지.
 *   2) semantic  : 의미/용도(alias). "어디에 쓰는 색"인지. → 컴포넌트는 이걸 참조한다.
 *   3) (mapped)  : tailwind.config.ts 가 위 둘을 클래스로 노출 (text-content, bg-surface …).
 *
 * 톤을 바꾸고 싶으면 primitive 한 곳만 고치면 semantic·전체 화면이 자동 반영된다.
 */

// ── 1) BRAND / PRIMITIVE ──────────────────────────────────────────────
// 키 이름은 기존 tailwind.config 과 동일하게 유지 (기존 클래스 호환).
export const primitive = {
  ivory: "#FBF7F0", // 페이지 배경 — 웜 아이보리
  cream: "#F5EDE1", // 보조 서페이스
  champagne: "#EBDFCB", // 샴페인 베이지
  sand: "#E3D4BC", // 진한 베이지 / 강조 보더
  cocoa: "#3B2C22", // 본문 브라운
  espresso: "#2A211B", // 제목용 짙은 차콜
  taupe: "#6E5F52", // 보조 텍스트
  stone: "#9B8B7C", // 흐린 3차 텍스트
  rose: "#B4808A", // 앤티크 로즈 (액센트)
  "rose-soft": "#D8B7BC",
  gold: "#A8874E", // 앤티크 골드
  "gold-soft": "#C9AE7E",
  line: "#E6DBCA", // 얇은 실선
  "line-strong": "#D8C9B2",
  white: "#FFFFFF",
} as const;

// ── 2) ALIAS / SEMANTIC ───────────────────────────────────────────────
// 원시값을 직접 쓰지 말고 "용도"로 참조한다. 40대+ 가독성 위해 대비를 넉넉히.
export const semantic = {
  // surfaces
  bg: primitive.ivory, // 페이지 배경
  surface: primitive.cream, // 카드/섹션 배경
  "surface-2": primitive.champagne, // 한 단계 더 들어간 면
  "surface-card": primitive.white, // 상품 카드 등 밝은 카드
  // content (text) — 위계 4단계
  heading: primitive.espresso, // 제목
  content: primitive.cocoa, // 본문 (기본)
  "content-muted": primitive.taupe, // 보조 설명
  "content-subtle": primitive.stone, // 캡션/메타 (남용 주의)
  "on-accent": primitive.ivory, // 액센트 배경 위 글자
  // lines
  border: primitive.line,
  "border-strong": primitive["line-strong"],
  // accents — 화면의 5~10%만
  accent: primitive.rose, // 주요 강조 (CTA 보조, 하이라이트)
  "accent-soft": primitive["rose-soft"],
  highlight: primitive.gold, // 프리미엄 골드 포인트
  "highlight-soft": primitive["gold-soft"],
} as const;

// ── 3) TYPOGRAPHY SCALE ───────────────────────────────────────────────
// 형식: [fontSize, { lineHeight, letterSpacing?, fontWeight? }]
// 원칙: 폰트 패밀리는 통일, 위계는 크기·굵기·색으로. 40대+ 타깃이라 본문 하한을 15px로.
type FontDef = [
  string,
  { lineHeight: string; letterSpacing?: string; fontWeight?: string }
];

export const fontSize: Record<string, FontDef> = {
  // 디스플레이/제목 (serif). 뷰포트에 따라 유동(clamp).
  display: ["clamp(2rem, 1.4rem + 3vw, 2.75rem)", { lineHeight: "1.12", letterSpacing: "-0.02em", fontWeight: "600" }], // 32→44
  h1: ["clamp(1.6rem, 1.2rem + 1.8vw, 2rem)", { lineHeight: "1.18", letterSpacing: "-0.02em", fontWeight: "600" }], // 26→32
  h2: ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "600" }], // 24
  h3: ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }], // 20
  h4: ["1.0625rem", { lineHeight: "1.4", fontWeight: "600" }], // 17
  // 본문/캡션 (sans)
  "body-lg": ["1.0625rem", { lineHeight: "1.65" }], // 17 — 리드 문단
  body: ["1rem", { lineHeight: "1.6" }], // 16 — 기본
  "body-sm": ["0.9375rem", { lineHeight: "1.55" }], // 15 — 40대+ 하한
  caption: ["0.8125rem", { lineHeight: "1.45", letterSpacing: "0.01em" }], // 13 — 라벨/메타, 남용 금지
};

// ── 4) SPACING (섹션 리듬) ─────────────────────────────────────────────
export const spacing = {
  section: "clamp(3rem, 8vw, 5rem)", // 섹션 상하 여백
  "section-sm": "clamp(2rem, 5vw, 3rem)",
  gutter: "clamp(1.25rem, 4vw, 2rem)", // 좌우 안전 여백
};
