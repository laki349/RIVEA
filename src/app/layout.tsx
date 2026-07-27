import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RIVEA — 리베아",
  description:
    "중년 여성의 피부·두피 고민을 축으로, 여러 브랜드의 홈케어 기기와 화장품을 한곳에서. 리베아.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="font-sans text-ink">
        {/* 모바일 프레임 — 데스크탑에서도 중앙 고정 (에이블리·지그재그 식) */}
        <div className="mx-auto flex min-h-dvh w-full max-w-app flex-col bg-page shadow-[0_0_24px_rgba(28,24,21,0.06)]">
          {children}
        </div>
      </body>
    </html>
  );
}
