import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthScope from "@/components/auth/AuthScope";
import Onboarding from "@/components/auth/Onboarding";

/**
 * `metadataBase`가 반드시 있어야 한다. og:image는 절대 URL이어야 카톡·문자에서
 * 미리보기가 뜨는데, 이 값이 없으면 상대경로(`/images/...`)로 나가서 카드가 비어 보인다.
 * 정적 export라 배포 도메인을 코드에 적어 넣는다.
 *
 * `title.template`: 하위 페이지가 title만 정하면 뒤에 " · 리베아"가 붙는다.
 * 이걸 안 두면 87페이지가 전부 같은 제목이 되어 검색·공유에서 구분되지 않는다.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://rivea-app.web.app"),
  title: {
    default: "RIVEA — 리베아",
    template: "%s · 리베아",
  },
  description:
    "중년 여성의 피부·두피 고민을 축으로, 여러 브랜드의 홈케어 기기와 화장품을 한곳에서. 리베아.",
  openGraph: {
    siteName: "리베아",
    locale: "ko_KR",
    type: "website",
  },
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
        {/* 장바구니·찜·주문의 저장 위치를 로그인 계정에 맞춘다 (렌더 없음) */}
        <AuthScope />
        {/* 모바일 프레임 — 데스크탑에서도 중앙 고정 (에이블리·지그재그 식) */}
        <div className="mx-auto flex min-h-dvh w-full max-w-app flex-col bg-page shadow-[0_0_24px_rgba(28,24,21,0.06)]">
          {children}
        </div>
        {/* 첫 진입 시퀀스 — 인증되면 스스로 사라진다 */}
        <Onboarding />
      </body>
    </html>
  );
}
