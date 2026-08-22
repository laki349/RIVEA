import type { MetadataRoute } from "next";

/**
 * robots.txt — 빌드 시점에 정적 파일로 생성된다.
 * 개인 화면(장바구니·결제·주문·마이페이지·로그인)은 색인 대상이 아니다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout", "/order/", "/orders", "/mypage", "/login", "/wish"],
    },
    sitemap: "https://rivea-app.web.app/sitemap.xml",
  };
}
