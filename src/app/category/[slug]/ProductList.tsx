"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  categories,
  concerns,
  products,
  won,
  type Category,
} from "@/data/catalog";
import Icon from "@/components/Icon";
import ProductCard from "@/components/ProductCard";
import AppBar from "@/components/AppBar";

type SortKey = "popular" | "reviews" | "priceAsc" | "priceDesc";
const sorts: { key: SortKey; label: string }[] = [
  { key: "popular", label: "인기순" },
  { key: "reviews", label: "리뷰많은순" },
  { key: "priceAsc", label: "낮은가격순" },
  { key: "priceDesc", label: "높은가격순" },
];

export default function ProductList({
  slug,
  initialSub,
}: {
  slug: Category;
  initialSub?: string;
}) {
  const category = categories.find((c) => c.slug === slug)!;
  const [sub, setSub] = useState(initialSub ?? "전체");
  const [concern, setConcern] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("popular");
  const [sheet, setSheet] = useState<"concern" | "sort" | null>(null);

  const list = useMemo(() => {
    let l = products.filter((p) => p.category === slug);
    if (concern) l = l.filter((p) => p.concerns.includes(concern));
    switch (sort) {
      case "popular":
        l = [...l].sort((a, b) => b.likes - a.likes);
        break;
      case "reviews":
        l = [...l].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "priceAsc":
        l = [...l].sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        l = [...l].sort((a, b) => b.price - a.price);
        break;
    }
    return l;
  }, [slug, concern, sort]);

  const concernName = concern ? concerns.find((c) => c.slug === concern)?.name : null;

  return (
    <>
      <AppBar title={category.name} bold />

      {/* 1단 — 대분류 (가로 스크롤, 선택만 세로바+굵게) */}
      <nav className="rail flex items-center gap-[18px] whitespace-nowrap border-b border-hairline py-3 pl-[14px] pr-4">
        {categories.map((c) =>
          c.slug === slug ? (
            <span
              key={c.slug}
              className="border-l-2 border-ink pl-3 text-[14px] font-bold text-ink"
            >
              {c.name}
            </span>
          ) : (
            <Link key={c.slug} href={`/category/${c.slug}`} className="text-[14px] text-meta">
              {c.name}
            </Link>
          )
        )}
      </nav>

      {/* 2단 — 소분류 (연회색 띠) */}
      <nav className="rail flex items-center gap-4 whitespace-nowrap border-b border-hairline bg-[#F5F4F1] px-[14px] py-[11px]">
        {["전체", ...category.sub].map((s) => (
          <button
            key={s}
            onClick={() => setSub(s)}
            className={`text-[13px] ${sub === s ? "font-bold text-ink" : "text-meta"}`}
          >
            {s}
          </button>
        ))}
      </nav>

      {/* 필터·정렬 줄 */}
      <div className="flex items-center justify-between border-b border-hairline px-[14px] py-[10px]">
        <div className="flex gap-[6px]">
          <button
            onClick={() => setSheet("concern")}
            className={`flex min-h-[34px] items-center gap-[3px] rounded border px-[10px] text-[12px] ${
              concern ? "border-ink font-medium text-ink" : "border-line text-body"
            }`}
          >
            {concernName ?? "고민"} <Icon name="chevron-down" size={13} />
          </button>
          <button className="flex min-h-[34px] items-center gap-[3px] rounded border border-line px-[10px] text-[12px] text-body">
            성분 <Icon name="chevron-down" size={13} />
          </button>
          <button className="flex min-h-[34px] items-center gap-[3px] rounded border border-line px-[10px] text-[12px] text-body">
            가격 <Icon name="chevron-down" size={13} />
          </button>
        </div>
        <button
          onClick={() => setSheet("sort")}
          className="flex min-h-[34px] items-center gap-[2px] text-[13px] font-medium text-ink"
        >
          {sorts.find((s) => s.key === sort)!.label} <Icon name="chevron-down" size={14} />
        </button>
      </div>

      {/* 개수 */}
      <p className="border-b border-hairline px-[14px] py-[9px] text-[13px] text-meta">
        총 {won(list.length)}개
      </p>

      {/* 그리드 */}
      <main className="flex-1">
        {list.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <p className="text-[15px] font-bold text-ink">조건에 맞는 상품이 아직 없어요</p>
            <p className="mt-2 text-[13px] text-meta">필터를 바꾸거나 다른 고민을 선택해 보세요.</p>
            <button
              onClick={() => setConcern(null)}
              className="mt-5 h-11 rounded border border-ink px-5 text-[14px] font-medium text-ink"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-[3px]">
            {list.map((p, i) => (
              <div key={p.id} className={i % 2 === 0 ? "border-r-[3px] border-surface" : ""}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 바텀시트 */}
      {sheet && (
        <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-app flex-col justify-end">
          <button
            aria-label="닫기"
            onClick={() => setSheet(null)}
            className="flex-1 bg-[rgba(28,24,21,0.45)]"
          />
          <div className="rounded-t-[8px] bg-surface px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-4">
            <p className="pb-3 text-[15px] font-bold text-ink">
              {sheet === "concern" ? "고민 선택" : "정렬"}
            </p>
            {sheet === "concern" ? (
              <div className="flex flex-wrap gap-2 pb-2">
                <button
                  onClick={() => {
                    setConcern(null);
                    setSheet(null);
                  }}
                  className={`min-h-[40px] rounded border px-[14px] text-[13px] ${
                    concern === null ? "border-ink bg-ink text-on-ink" : "border-line text-body"
                  }`}
                >
                  전체
                </button>
                {concerns.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => {
                      setConcern(c.slug);
                      setSheet(null);
                    }}
                    className={`min-h-[40px] rounded border px-[14px] text-[13px] ${
                      concern === c.slug ? "border-ink bg-ink text-on-ink" : "border-line text-body"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="pb-2">
                {sorts.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => {
                      setSort(s.key);
                      setSheet(null);
                    }}
                    className={`flex min-h-[46px] w-full items-center justify-between text-[14px] ${
                      sort === s.key ? "font-bold text-ink" : "text-body"
                    }`}
                  >
                    {s.label}
                    {sort === s.key && <Icon name="check" size={17} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
