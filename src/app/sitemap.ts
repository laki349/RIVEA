import type { MetadataRoute } from "next";
import { brands, concerns, products, routines } from "@/data/catalog";
import { articles } from "@/data/magazine";

const BASE = "https://rivea-app.web.app";

/**
 * sitemap.xml — 빌드 시점에 정적 파일로 생성된다(정적 export와 호환).
 *
 * 공유·검색으로 유입되는 페이지만 넣는다. 장바구니·결제·주문내역·마이페이지는
 * 개인 화면이라 색인 대상이 아니다(robots.ts에서 크롤링도 막는다).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/category", "/pick", "/brands", "/magazine", "/gift", "/shelf", "/my-routine"];

  return [
    ...staticPaths.map((path) => ({
      url: `${BASE}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    // 상품·루틴이 공유의 주 대상이라 우선순위를 높게 둔다
    ...products.map((p) => ({
      url: `${BASE}/product/${p.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...routines.map((r) => ({
      url: `${BASE}/routine/${r.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...concerns.map((c) => ({
      url: `${BASE}/concern/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...brands.map((b) => ({
      url: `${BASE}/brand/${b.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...articles.map((a) => ({
      url: `${BASE}/magazine/${a.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
