"use client";

import { useState } from "react";
import Link from "next/link";
import { categories, concerns } from "@/data/catalog";
import Icon from "@/components/Icon";
import CartLink from "@/components/CartLink";
import TabBar from "@/components/TabBar";

/**
 * 카테고리 — 2단 브라우징 (좌 제품군 레일 + 우 세부 목록)
 */
export default function CategoryPage() {
  const [selected, setSelected] = useState(categories[0].slug);
  const current = categories.find((c) => c.slug === selected)!;

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-surface px-4 py-[13px]">
        <h1 className="text-[17px] font-bold text-ink">카테고리</h1>
        <div className="flex items-center gap-4 text-ink">
          <Link href="/search" aria-label="검색" className="flex h-11 w-8 items-center justify-center">
            <Icon name="search" size={21} />
          </Link>
          <CartLink />
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* 좌 레일 — 제품군 */}
        <nav className="w-[104px] flex-shrink-0 overflow-y-auto border-r border-hairline bg-bg-tint">
          {categories.map((c) => {
            const active = c.slug === selected;
            return (
              <button
                key={c.slug}
                onClick={() => setSelected(c.slug)}
                className={`block w-full py-[14px] text-left text-[14px] ${
                  active
                    ? "border-l-[3px] border-ink bg-surface pl-[12px] font-bold text-ink"
                    : "pl-[15px] text-soft"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </nav>

        {/* 우 세부 목록 */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center gap-[9px] px-[14px] pb-[10px] pt-[14px]">
            <div className="h-[38px] w-[38px] rounded bg-subtle" />
            <span className="text-[15px] font-bold text-ink">{current.name}</span>
          </div>

          <div className="border-b border-hairline px-[14px] pb-3">
            <Link
              href={`/category/${current.slug}`}
              className="block py-[7px] text-[13px] font-bold text-ink"
            >
              전체보기
            </Link>
            <div className="grid grid-cols-2 gap-x-[10px]">
              {current.sub.map((s) => (
                <Link
                  key={s}
                  href={`/category/${current.slug}?sub=${encodeURIComponent(s)}`}
                  className="py-[9px] text-[13px] text-body"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* 고민별 바로가기 */}
          <div className="flex items-center gap-[9px] px-[14px] pb-[10px] pt-[14px]">
            <div className="h-[38px] w-[38px] rounded bg-subtle" />
            <span className="text-[15px] font-bold text-ink">고민별</span>
          </div>
          <div className="grid grid-cols-2 gap-x-[10px] px-[14px] pb-4">
            {concerns.map((c) => (
              <Link
                key={c.slug}
                href={`/concern/${c.slug}`}
                className="py-[9px] text-[13px] text-body"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </main>

      <TabBar />
    </>
  );
}
