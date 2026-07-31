import { notFound } from "next/navigation";
import { brands, products, won } from "@/data/catalog";
import AppBar from "@/components/AppBar";
import ProductCard from "@/components/ProductCard";
import TabBar from "@/components/TabBar";

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export default function BrandPage({ params }: { params: { slug: string } }) {
  const brand = brands.find((b) => b.slug === params.slug);
  if (!brand) notFound();

  const list = products.filter((p) => p.brand === brand.slug);
  const reviewTotal = list.reduce((s, p) => s + p.reviewCount, 0);

  return (
    <>
      <AppBar title={brand.name} bold />

      <main className="flex-1">
        {/* 브랜드 헤더 */}
        <section className="border-b border-hairline px-4 pb-4 pt-5">
          <div className="flex items-center gap-[13px]">
            <div className="flex h-[56px] w-[56px] items-center justify-center rounded border border-line bg-surface">
              <span className="text-[19px] font-bold text-ink">{brand.name.slice(0, 1)}</span>
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-ink">{brand.name}</h2>
              <p className="mt-[2px] text-[13px] text-meta">{brand.tagline}</p>
            </div>
          </div>
        </section>

        {/* 신뢰지표 — 중개형의 이탈 방지 장치 */}
        <section className="flex border-b border-hairline">
          <div className="flex-1 border-r border-hairline py-[14px] text-center">
            <p className="text-[17px] font-bold text-ink">{brand.rating}</p>
            <p className="mt-[3px] text-[12px] text-meta">브랜드 평점</p>
          </div>
          <div className="flex-1 border-r border-hairline py-[14px] text-center">
            <p className="text-[17px] font-bold text-ink">{brand.since}년</p>
            <p className="mt-[3px] text-[12px] text-meta">입점</p>
          </div>
          <div className="flex-1 border-r border-hairline py-[14px] text-center">
            <p className="text-[17px] font-bold text-ink">{won(reviewTotal)}</p>
            <p className="mt-[3px] text-[12px] text-meta">누적 리뷰</p>
          </div>
          <div className="flex-1 py-[14px] text-center">
            <p className="text-[17px] font-bold text-ink">
              {brand.freeShippingOver ? `${Math.round(brand.freeShippingOver / 10000)}만원↑` : "유료"}
            </p>
            <p className="mt-[3px] text-[12px] text-meta">무료배송</p>
          </div>
        </section>

        {/* 상품 */}
        <section>
          <div className="flex items-baseline justify-between px-4 pb-[10px] pt-4">
            <h3 className="text-[16px] font-bold text-ink">전체 상품 {list.length}</h3>
            <span className="text-[13px] text-meta">인기순</span>
          </div>
          <div className="grid grid-cols-2 gap-[3px] border-t border-hairline">
            {list.map((p, i) => (
              <div key={p.id} className={i % 2 === 0 ? "border-r-[3px] border-surface" : ""}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <TabBar />
    </>
  );
}
