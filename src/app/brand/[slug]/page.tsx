import { notFound } from "next/navigation";
import { brands, products } from "@/data/catalog";
import { activeInfo } from "@/data/actives";
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
  // 우리가 실제로 아는 값만 센다
  const gradedCount = new Set(
    list.flatMap((p) => (p.actives ?? []).map((a) => a.key)).filter((k) => activeInfo[k]?.evidence)
  ).size;
  const lastPriced = list
    .map((p) => p.source?.pricedAt)
    .filter(Boolean)
    .sort()
    .slice(-1)[0];

  return (
    <>
      <AppBar title={brand.name} bold />

      <main className="flex-1">
        {/* 브랜드 헤더 */}
        <section className="border-b border-hairline px-4 pb-4 pt-5">
          <div className="flex items-center gap-[13px]">
            <div className="flex h-[56px] w-[56px] items-center justify-center rounded border border-line bg-surface">
              <span className="text-[21px] font-bold text-ink">{brand.name.slice(0, 1)}</span>
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-ink">{brand.name}</h2>
              <p className="mt-[2px] text-[15px] text-meta">{brand.tagline}</p>
            </div>
          </div>
        </section>

        {/*
          ⚠️ 「신뢰지표」 4칸을 전부 갈아엎었다 (2026-08-25).
          전에는 브랜드 평점 · 입점 연도 · 누적 리뷰 · 무료배송이었는데 **네 개 다 창작**이었다.
          라로슈포제·헤라 같은 실존 기업의 입점 연도와 배송 정책을 지어낸 것이라
          리뷰수를 지어낸 것보다 성격이 나쁘다. 우리가 실제로 아는 값으로만 바꾼다.
        */}
        <section className="flex border-b border-hairline">
          <div className="flex-1 border-r border-hairline py-[14px] text-center">
            <p className="text-[19px] font-bold text-ink">{list.length}</p>
            <p className="mt-[3px] text-[14px] text-meta">취급 상품</p>
          </div>
          <div className="flex-1 border-r border-hairline py-[14px] text-center">
            <p className="text-[19px] font-bold text-ink">{gradedCount}</p>
            <p className="mt-[3px] text-[14px] text-meta">근거 확인 성분</p>
          </div>
          <div className="flex-1 py-[14px] text-center">
            <p className="text-[19px] font-bold text-ink">{lastPriced || "-"}</p>
            <p className="mt-[3px] text-[14px] text-meta">가격 확인</p>
          </div>
        </section>

        {/* 상품 */}
        <section>
          <div className="flex items-baseline justify-between px-4 pb-[10px] pt-4">
            <h3 className="text-[18px] font-bold text-ink">전체 상품 {list.length}</h3>
            <span className="text-[15px] text-meta">인기순</span>
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
