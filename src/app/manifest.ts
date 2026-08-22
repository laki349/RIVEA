import type { MetadataRoute } from "next";

/**
 * PWA 매니페스트 — 빌드 시점에 `/manifest.webmanifest`로 생성된다(정적 export 호환).
 *
 * 이게 없으면 홈 화면에 추가해도 **주소창 달린 웹페이지**로 뜬다.
 * 있으면 아이콘이 생기고 전체화면으로 열린다. 발표에서 심사위원 폰에
 * 설치해 보여줄 수 있는지가 여기서 갈린다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RIVEA — 리베아",
    short_name: "리베아",
    description:
      "중년 여성의 피부·두피 고민을 축으로, 여러 브랜드의 홈케어 기기와 화장품을 한곳에서.",
    lang: "ko",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    // 앱 배경은 순수 흰색이다(docs/03). 스플래시가 본 화면과 이어지게 맞춘다
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // 안드로이드가 원형·둥근사각으로 잘라내는 용도. R 글리프가 안전영역(80%) 안에 있다
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
