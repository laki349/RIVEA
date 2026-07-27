import type { Config } from "tailwindcss";
import { primitive, semantic, fontSize, spacing } from "./src/design/tokens";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Brand(primitive) + Alias(semantic) — 단일 소스는 src/design/tokens.ts
        // primitive: text-cocoa, bg-ivory … (기존 클래스 그대로)
        // semantic : text-content, text-heading, bg-surface, border-border, text-accent …
        ...primitive,
        ...semantic,
      },
      fontSize,
      spacing,
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        // 은은하게: 편집숍 느낌은 그림자보다 얇은 실선 테두리에서 나온다.
        soft: "0 1px 2px rgba(59, 44, 34, 0.04)",
        card: "0 4px 16px -8px rgba(59, 44, 34, 0.10)",
        lift: "0 10px 30px -16px rgba(59, 44, 34, 0.16)",
      },
      maxWidth: {
        shell: "1200px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
