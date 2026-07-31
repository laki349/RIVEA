import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthScope from "@/components/auth/AuthScope";
import ServiceWorker from "@/components/ServiceWorker";
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
  /* 홈 화면에 추가했을 때 아이콘·전체화면으로 뜨게 하는 부분 (app/manifest.ts) */
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    // iOS는 매니페스트 아이콘을 안 보고 이 링크만 본다
    apple: [{ url: "/icons/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "리베아",
    // 흰 배경 앱이라 상태바 글자는 어둡게
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /**
   * `viewportFit: "cover"`가 있어야 `env(safe-area-inset-*)`에 실제 값이 들어온다.
   * 없으면 전부 0이라, 탭바·구매바에 걸어둔 하단 여백이 홈 인디케이터에 먹힌다.
   * 브라우저에서는 티가 안 나고 **설치해서 전체화면으로 띄웠을 때 드러난다.**
   */
  viewportFit: "cover",
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="font-sans text-ink">
        {/* 장바구니·찜·주문의 저장 위치를 로그인 계정에 맞춘다 (렌더 없음) */}
        <AuthScope />
        {/* 오프라인에서도 앱 껍데기가 열리게 (프로덕션에서만 등록) */}
        <ServiceWorker />
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
