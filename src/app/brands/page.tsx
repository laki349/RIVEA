import Link from "next/link";
import { brands, products } from "@/data/catalog";
import Icon from "@/components/Icon";
import AppBar from "@/components/AppBar";
import TabBar from "@/components/TabBar";

export default function BrandsPage() {
  return (
    <>
      <AppBar title="브랜드" bold />

      <main className="flex-1">
        <p className="border-b border-hairline px-4 py-[11px] text-[13px] text-meta">
          입점 브랜드 {brands.length}
        </p>
        {brands.map((b) => {
          const count = products.filter((p) => p.brand === b.slug).length;
          return (
            <Link
              key={b.slug}
              href={`/brand/${b.slug}`}
              className="flex items-center gap-[13px] border-b border-subtle px-4 py-[14px]"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded border border-line bg-surface">
                <span className="text-[16px] font-bold text-ink">{b.name.slice(0, 1)}</span>
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-bold text-ink">{b.name}</p>
                <p className="mt-[2px] text-[12px] text-meta">
                  {b.tagline} · 평점 {b.rating} · 상품 {count}
                </p>
              </div>
              <span className="text-disabled">
                <Icon name="chevron-right" size={18} />
              </span>
            </Link>
          );
        })}
      </main>

      <TabBar />
    </>
  );
}
