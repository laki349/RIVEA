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
  400: "#B0A89D", // 아이콘·보더 등 비텍스트 전용. 흰 배경 텍스트로 쓰면 2.35:1로 AA 미달
  500: "#8B8279", // ⚠️ 텍스트 금지 — 흰 배경에서 3.56:1. 남겨둔 건 비텍스트 용도뿐
  600: "#6B635C", // 카드 상품명 등 보조 + 메타/캡션 (5.9:1)
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
        /**
         * meta가 warm-500(#8B8279)에서 warm-600으로 내려왔다.
         * 흰 배경에서 3.56:1이라 AA(4.5:1)를 못 넘겼고, 이 앱은 40대+ 대상이라
         * 가독성이 취향이 아니라 전제다 (docs/03 "AA 확보").
         *
         * 결과적으로 meta와 soft가 같은 값이 됐다. 회색 텍스트 단계를
         * 4개(meta·soft·body·ink)에서 3개로 줄인 셈인데, 원래도 meta와 soft를
         * 눈으로 구분하기 어려웠으므로 위계가 손해 보지 않는다.
         */
        meta: warm[600], // 5.9:1
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

      /**
       * ── 모션 토큰 ────────────────────────────────
       * 이 앱에서 모션은 세 가지 일만 한다.
       *  ① 탭이 먹었다는 확인 (모바일엔 hover가 없다)
       *  ② 상태가 바뀐 곳 가리키기 (찜·장바구니 수)
       *  ③ 어디서 왔는지 알려주기 (시트·토스트의 공간 관계)
       * 장식은 넣지 않는다. transform·opacity만 애니메이션한다.
       */
      transitionDuration: {
        tap: "120ms", // 눌림 피드백 — 즉각적이어야 한다
        state: "200ms", // 상태 변화
        sheet: "260ms", // 화면 절반을 덮는 전환
      },
      transitionTimingFunction: {
        // 들어올 때 감속, 나갈 때 가속 — 물리적으로 자연스러운 방향
        enter: "cubic-bezier(0.16, 1, 0.3, 1)",
        exit: "cubic-bezier(0.4, 0, 1, 1)",
      },
      keyframes: {
        // 찜 하트 — 눌렀다는 확인. 한 프레임에 바뀌면 놓친다
        pop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.28)" },
          "100%": { transform: "scale(1)" },
        },
        // 장바구니 배지 — 담은 것과 장바구니를 잇는다
        bump: {
          "0%": { transform: "scale(1)" },
          "35%": { transform: "scale(1.35)" },
          "100%": { transform: "scale(1)" },
        },
        // 토스트·새로 열린 단계 — 아래에서 살짝 올라오며 나타난다
        rise: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fall: {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(6px)" },
        },
        // 바텀 시트 — 어디서 왔는지 보여준다
        "sheet-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "sheet-down": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(100%)" },
        },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-out": { from: { opacity: "1" }, to: { opacity: "0" } },
      },
      animation: {
        pop: "pop 260ms cubic-bezier(0.16, 1, 0.3, 1)",
        bump: "bump 240ms cubic-bezier(0.16, 1, 0.3, 1)",
        rise: "rise 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        fall: "fall 150ms cubic-bezier(0.4, 0, 1, 1) forwards",
        "sheet-up": "sheet-up 260ms cubic-bezier(0.16, 1, 0.3, 1)",
        "sheet-down": "sheet-down 200ms cubic-bezier(0.4, 0, 1, 1) forwards",
        "fade-in": "fade-in 200ms ease-out",
        "fade-out": "fade-out 200ms ease-in forwards",
      },
    },
  },
  plugins: [],
};
export default config;
