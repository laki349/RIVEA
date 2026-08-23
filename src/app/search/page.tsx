"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { brandOf, brands, concerns, products } from "@/data/catalog";
import Icon from "@/components/Icon";
import ProductCard from "@/components/ProductCard";

const RECENT_KEY = "rivea-recent-search";

function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function SearchPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => setRecent(loadRecent()), []);

  const saveRecent = (term: string) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 8);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* 무시 */
    }
  };

  const clearRecent = () => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      /* 무시 */
    }
  };

  const query = q.trim();
  const results = useMemo(() => {
    if (!query) return [];
    const t = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(t) ||
        brandOf(p.brand).name.includes(t) ||
        p.tags.some((tag) => tag.includes(t)) ||
        p.keyIngredient.toLowerCase().includes(t)
    );
  }, [query]);

  const matchedBrands = useMemo(() => {
    if (!query) return [];
    return brands.filter((b) => b.name.includes(query));
  }, [query]);

  return (
    <>
      {/* 검색 바 */}
      <header className="sticky top-0 z-40 flex items-center gap-2 border-b border-hairline bg-surface px-[10px] py-[9px]">
        <button
          onClick={() => router.back()}
          aria-label="뒤로"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center text-ink"
        >
          <Icon name="chevron-left" size={22} />
        </button>
        <div className="flex h-[42px] flex-1 items-center gap-2 rounded border border-ink px-3">
          <Icon name="search" size={17} className="flex-shrink-0 text-meta" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query) saveRecent(query);
            }}
            placeholder="고민·상품·브랜드 검색"
            className="w-full bg-transparent text-[17px] text-ink outline-none placeholder:text-disabled"
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="지우기" className="flex-shrink-0 p-1 text-disabled">
              <Icon name="plus" size={16} className="rotate-45" />
            </button>
          )}
        </div>
        <div className="w-1" />
      </header>

      <main className="flex-1">
        {query === "" ? (
          <>
            {/* 최근 검색어 */}
            {recent.length > 0 && (
              <section className="border-b border-hairline px-4 pb-4 pt-4">
                <div className="mb-[10px] flex items-baseline justify-between">
                  <h2 className="text-[16px] font-bold text-ink">최근 검색어</h2>
                  <button onClick={clearRecent} className="text-[14px] text-meta">
                    전체삭제
                  </button>
                </div>
                <div className="flex flex-wrap gap-[6px]">
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => setQ(r)}
                      className="min-h-[34px] rounded border border-line px-[11px] text-[15px] text-body"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* 인기 고민 */}
            <section className="px-4 pb-4 pt-4">
              <h2 className="mb-[10px] text-[16px] font-bold text-ink">인기 고민</h2>
              <div className="flex flex-wrap gap-[6px]">
                {concerns.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/concern/${c.slug}`}
                    className="flex min-h-[34px] items-center rounded border border-line px-[11px] text-[15px] text-body"
                  >
                    # {c.name}
                  </Link>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* 브랜드 매치 */}
            {matchedBrands.map((b) => (
              <Link
                key={b.slug}
                href={`/brand/${b.slug}`}
                className="flex items-center gap-[11px] border-b border-hairline px-4 py-3"
                onClick={() => saveRecent(query)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded border border-line">
                  <span className="text-[16px] font-bold text-ink">{b.name.slice(0, 1)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-[16px] font-bold text-ink">{b.name}</p>
                  <p className="text-[14px] text-meta">브랜드관 바로가기</p>
                </div>
                <Icon name="chevron-right" size={17} className="text-disabled" />
              </Link>
            ))}

            {/* 상품 결과 */}
            {results.length === 0 ? (
              <div className="px-4 py-16 text-center">
                <p className="text-[17px] font-bold text-ink">
                  &lsquo;{query}&rsquo; 검색 결과가 없어요
                </p>
                <p className="mt-2 text-[15px] leading-[1.6] text-meta">
                  고민 이름(기미, 주름)이나 브랜드로 검색해 보세요.
                </p>
              </div>
            ) : (
              <>
                <p className="border-b border-hairline px-4 py-[9px] text-[15px] text-meta">
                  상품 {results.length}
                </p>
                <div className="grid grid-cols-2 gap-[3px]" onClick={() => saveRecent(query)}>
                  {results.map((p, i) => (
                    <div key={p.id} className={i % 2 === 0 ? "border-r-[3px] border-surface" : ""}>
                      <ProductCard product={p} imageClassName="h-[160px]" />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}
