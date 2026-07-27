import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  products,
  productById,
  brandById,
  categoryBySlug,
  productsByCategory,
  discountRate,
  formatKRW,
} from "@/data/catalog";
import { concernBySlug, productConcernSlugs } from "@/data/concerns";
import ImageSlot from "@/components/ImageSlot";
import StarRating from "@/components/StarRating";
import PurchasePanel from "@/components/PurchasePanel";
import SectionHeader from "@/components/SectionHeader";
import { ProductGrid } from "@/components/ProductCollections";
import { ChevronRight, TruckIcon, ShieldIcon, SparkleIcon } from "@/components/Icons";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const p = productById(params.id);
  return { title: p ? `${p.name} — 마춰케어` : "상품 — 마춰케어" };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = productById(params.id);
  if (!product) notFound();

  const brand = brandById(product.brandId);
  const category = categoryBySlug(product.category);
  const off = discountRate(product);

  // Marketplace comparison: same category, other brands
  const compare = productsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="shell py-5 sm:py-8">
      {/* breadcrumb */}
      <nav className="mb-5 flex items-center gap-1 text-[13px] text-stone" aria-label="위치">
        <Link href="/" className="transition hover:text-cocoa">홈</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="transition hover:text-cocoa">
              {category.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}
        <span className="truncate text-taupe">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* gallery */}
        <div>
          <ImageSlot
            src={product.image}
            alt={product.name}
            ratio="aspect-square"
            label="상품 대표 이미지"
            sizes="(max-width: 1024px) 100vw, 560px"
            priority
          />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <ImageSlot
                key={i}
                src={product.gallery?.[i]}
                alt={`${product.name} 상세 컷 ${i + 1}`}
                ratio="aspect-square"
                label=""
                rounded="rounded-xl"
                sizes="140px"
                compact
              />
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          <Link
            href={`/category/${product.category}`}
            className="text-[13px] font-semibold text-gold"
          >
            {brand?.name}
          </Link>
          <h1 className="mt-2 font-serif text-2xl font-semibold leading-snug text-espresso sm:text-[1.75rem]">
            {product.name}
          </h1>

          <div className="mt-3">
            <StarRating value={product.rating} count={product.reviewCount} size="md" />
          </div>

          <p className="mt-4 text-[15px] leading-relaxed text-taupe">
            {product.summary}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {productConcernSlugs(product).map((slug) => {
              const concern = concernBySlug(slug);
              if (!concern) return null;
              return (
                <Link
                  key={slug}
                  href={`/pick#${slug}`}
                  className="rounded-full bg-cream px-3 py-1 text-[12.5px] font-medium text-taupe transition hover:bg-champagne hover:text-cocoa"
                >
                  #{concern.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-6 border-t border-line pt-5">
            <div className="flex items-baseline gap-2">
              {off > 0 && (
                <span className="text-2xl font-bold text-rose">{off}%</span>
              )}
              <span className="text-2xl font-bold text-espresso tabular-nums">
                {formatKRW(product.price)}
              </span>
            </div>
            {off > 0 && (
              <span className="text-sm text-stone line-through tabular-nums">
                {formatKRW(product.listPrice)}
              </span>
            )}
          </div>

          {/* benefits */}
          <ul className="mt-5 space-y-2 rounded-2xl bg-cream/60 p-4 text-[13.5px] text-taupe">
            <li className="flex items-center gap-2">
              <TruckIcon className="h-5 w-5 text-gold" /> 무료배송 · 평일 오후 2시 이전 당일 출고
            </li>
            <li className="flex items-center gap-2">
              <ShieldIcon className="h-5 w-5 text-gold" /> {brand?.name} 공식 정품 · 7일 무료 반품
            </li>
            <li className="flex items-center gap-2">
              <SparkleIcon className="h-5 w-5 text-gold" /> 구매 시 적립 {Math.round(product.price * 0.03).toLocaleString("ko-KR")}P
            </li>
          </ul>

          <div className="mt-6">
            <PurchasePanel product={product} />
          </div>
        </div>
      </div>

      {/* detail section */}
      <section className="mt-14">
        <SectionHeader title="상세 정보" eyebrow="Detail" />
        <div className="space-y-4">
          <ImageSlot
            src={product.detailImages?.[0]}
            alt={`${product.name} 상세 설명 1`}
            ratio="aspect-[16/7]"
            label="상세 이미지 자리"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <ImageSlot
            src={product.detailImages?.[1]}
            alt={`${product.name} 상세 설명 2`}
            ratio="aspect-[16/9]"
            label="상세 이미지 자리"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
      </section>

      {/* marketplace comparison */}
      {compare.length > 0 && (
        <section className="mt-14">
          <SectionHeader
            eyebrow="Compare"
            title="같은 고민, 다른 브랜드"
            href={`/category/${product.category}`}
            hrefLabel="더 비교하기"
          />

          {/* quick compare table (desktop) */}
          <div className="mb-8 hidden overflow-hidden rounded-2xl border border-line sm:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream/70 text-taupe">
                <tr>
                  <th className="px-4 py-3 font-medium">상품</th>
                  <th className="px-4 py-3 font-medium">브랜드</th>
                  <th className="px-4 py-3 font-medium">평점</th>
                  <th className="px-4 py-3 text-right font-medium">가격</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-line bg-champagne/30">
                  <td className="px-4 py-3 font-semibold text-espresso">
                    {product.name}
                    <span className="ml-2 rounded-full bg-cocoa px-2 py-0.5 text-[11px] text-ivory">
                      지금 보는 상품
                    </span>
                  </td>
                  <td className="px-4 py-3 text-taupe">{brand?.name}</td>
                  <td className="px-4 py-3 text-cocoa">{product.rating.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-espresso tabular-nums">
                    {formatKRW(product.price)}
                  </td>
                </tr>
                {compare.map((p) => (
                  <tr key={p.id} className="border-t border-line transition hover:bg-cream/40">
                    <td className="px-4 py-3">
                      <Link href={`/product/${p.id}`} className="text-cocoa hover:text-espresso">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-taupe">{brandById(p.brandId)?.name}</td>
                    <td className="px-4 py-3 text-cocoa">{p.rating.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-espresso tabular-nums">
                      {formatKRW(p.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ProductGrid products={compare} />
        </section>
      )}
    </div>
  );
}
