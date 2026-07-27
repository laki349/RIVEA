"use client";

import { useMemo, useState } from "react";
import type { Category, Product } from "@/data/catalog";
import { discountRate } from "@/data/catalog";
import { concernsInProducts, productMatchesConcern } from "@/data/concerns";
import { ProductGrid } from "./ProductCollections";
import { SlidersIcon } from "./Icons";

type Sort = "recommend" | "review" | "priceLow" | "priceHigh" | "discount";

const sortOptions: { key: Sort; label: string }[] = [
  { key: "recommend", label: "추천순" },
  { key: "review", label: "리뷰많은순" },
  { key: "priceLow", label: "낮은가격순" },
  { key: "priceHigh", label: "높은가격순" },
  { key: "discount", label: "할인율순" },
];

export default function CategoryView({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  const [sort, setSort] = useState<Sort>("recommend");
  // concern = 표준 고민 slug (concerns.ts). null = 전체.
  const [concern, setConcern] = useState<string | null>(null);

  const concernList = useMemo(() => concernsInProducts(products), [products]);

  const view = useMemo(() => {
    let list = concern
      ? products.filter((p) => productMatchesConcern(p, concern))
      : [...products];

    switch (sort) {
      case "review":
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "priceLow":
        list.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        list.sort((a, b) => b.price - a.price);
        break;
      case "discount":
        list.sort((a, b) => discountRate(b) - discountRate(a));
        break;
      default:
        list.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
    }
    return list;
  }, [products, sort, concern]);

  return (
    <div className="shell py-6 sm:py-8">
      {/* header */}
      <div className="mb-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gold">
          {category.tagline}
        </p>
        <h1 className="mt-1 font-serif text-2xl font-semibold text-espresso sm:text-3xl">
          {category.name}
        </h1>
        <p className="mt-2 text-sm text-taupe">
          여러 브랜드의 {category.name} 상품을 한눈에 비교하세요 ·{" "}
          <span className="font-semibold text-cocoa">{view.length}</span>개
        </p>
      </div>

      {/* concern filter chips */}
      <div className="no-scrollbar -mx-5 mb-4 flex gap-2 overflow-x-auto px-5">
        <button
          onClick={() => setConcern(null)}
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition ${
            concern === null
              ? "border-cocoa bg-cocoa text-ivory"
              : "border-line-strong bg-white text-taupe hover:border-gold"
          }`}
        >
          전체
        </button>
        {concernList.map((c) => (
          <button
            key={c.slug}
            onClick={() => setConcern(c.slug)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition ${
              concern === c.slug
                ? "border-cocoa bg-cocoa text-ivory"
                : "border-line-strong bg-white text-taupe hover:border-gold"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* sort bar */}
      <div className="mb-6 flex items-center justify-between border-b border-line pb-3">
        <div className="no-scrollbar flex gap-1 overflow-x-auto">
          {sortOptions.map((o) => (
            <button
              key={o.key}
              onClick={() => setSort(o.key)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium transition ${
                sort === o.key
                  ? "bg-cream text-cocoa"
                  : "text-stone hover:text-cocoa"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <span className="ml-2 hidden shrink-0 items-center gap-1 text-[13px] text-stone sm:flex">
          <SlidersIcon className="h-4 w-4" />
          필터
        </span>
      </div>

      {view.length > 0 ? (
        <ProductGrid products={view} />
      ) : (
        <div className="rounded-2xl border border-dashed border-line-strong bg-cream/50 py-16 text-center">
          <p className="font-medium text-cocoa">조건에 맞는 상품이 없어요</p>
          <p className="mt-1 text-sm text-stone">다른 고민 필터를 선택해 보세요.</p>
        </div>
      )}
    </div>
  );
}
