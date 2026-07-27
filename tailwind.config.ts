import type { Config } from "tailwindcss";

/**
 * RIVEA 디자인 토큰 (docs/03-design-system.md)
 * Brand(원시값) → 여기서 Alias(의미)로 매핑 → 컴포넌트는 Alias만 사용.
 * 컴포넌트에 raw hex 직접 사용 금지.
 */

// ── Brand (원시값) ──────────────────────────────
const warm = {
  0: "#FFFFFF", // 페이지 배경 + 표면 (순수 흰색 확정)
  100: "#F2EEE7", // 이미지 슬롯/스켈레톤/서브틀 필
  150: "#ECE7DF", // 얇은 구분선 (섹션 내부)
  200: "#E5DFD6", // 보더/디바이더
  300: "#D0C8BD", // 강한 보더
  400: "#B0A89D", // 비활성
  500: "#8B8279", // 메타/캡션 (본문 금지)
  600: "#6B635C", // 카드 상품명 등 보조
  700: "#4A443E", // 보조 텍스트(본문급)
  900: "#1C1815", // 잉크 — 주 텍스트/주 버튼
};
const riveaRose = "#C13B54"; // 유일 유채색: 로고·세일 숫자·찜 하트

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Alias (의미 토큰) — 컴포넌트는 이것만 ──
        page: warm[0],
        surface: warm[0],
        subtle: warm[100],
        hairline: warm[150],
        line: warm[200],
        "line-strong": warm[300],
        disabled: warm[400],
        meta: warm[500],
        soft: warm[600],
        body: warm[700],
        ink: warm[900],
        "on-ink": warm[0],
        rose: riveaRose, // 로고 + 세일 + 찜 전용
        "bg-tint": "#FAF8F4", // 연령 인기 섹션 등 특별 코너 배경
      },
      borderRadius: {
        // 각진 기조: 기본 4px. 둥근 사각형 금지.
        DEFAULT: "4px",
        badge: "4px",
        // 하단 CTA만 예외
        cta: "14px",
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "sans-serif",
        ],
      },
      maxWidth: {
        app: "430px", // 모바일 프레임 폭
      },
    },
  },
  plugins: [],
};
export default config;
