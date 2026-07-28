"use client";

import { useMemo, useState } from "react";
import {
  categories,
  concernImage,
  products,
  routines,
  type Concern,
} from "@/data/catalog";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import AppBar from "@/components/AppBar";
import TabBar from "@/components/TabBar";
import RoutineCard from "@/components/RoutineCard";
import ProductCard from "@/components/ProductCard";

export default function ConcernDetail({ concern }: { concern: Concern }) {
  const [cat, setCat] = useState<string | null>(null);

  const concernRoutines = routines.filter((r) => r.concern === concern.slug);
  const concernProducts = useMemo(() => {
    let l = products.filter((p) => p.concerns.includes(concern.slug));
    if (cat) l = l.filter((p) => p.category === cat);
    return l;
  }, [concern.slug, cat]);

  // 이 고민 상품들이 속한 카테고리만 필터 칩으로
  const cats = categories.filter((c) =>
    products.some((p) => p.concerns.includes(concern.slug) && p.category === c.slug)
  );

  return (
    <>
      <AppBar title={concern.name} bold />

      <main className="flex-1">
        {/* 고민 무드 */}
        <ImageSlot
          className="h-[140px] w-full border-b border-hairline"
          tone="warm"
          src={concernImage(concern.slug)}
          alt={concern.name}
          position="center 35%"
        />

        {/* 인트로 + 관리 포인트 */}
        <section className="border-b border-hairline px-4 py-4">
          <h2 className="text-[18px] font-bold leading-[1.4] text-ink">{concern.question}</h2>
          <p className="mt-2 text-[14px] leading-[1.65] text-body">{concern.intro}</p>
          <div className="mt-3">
            {concern.tips.map((t) => (
              <p key={t.bold} className="flex items-start gap-[9px] py-[6px] text-[14px] leading-[1.5] text-ink">
                <span className="mt-[1px] flex-shrink-0">
                  <Icon name="check" size={17} />
                </span>
                <span>
                  {t.rest.split(t.bold)[0]}
                  <b className="font-bold">{t.bold}</b>
                  {t.rest.split(t.bold)[1]}
                </span>
              </p>
            ))}
          </div>
        </section>

        {/* 추천 루틴 — 가로 스크롤 (여러 개 수용) */}
        {concernRoutines.length > 0 && (
          <section className="border-b border-hairline">
            <div className="flex items-baseline justify-between px-4 pb-3 pt-4">
              <h3 className="text-[16px] font-bold text-ink">
                이 고민엔, 이 루틴 <span className="text-rose">{concernRoutines.length}</span>
              </h3>
              <span className="text-[13px] text-meta">전체보기 ›</span>
            </div>
            <div className="rail flex gap-[11px] pb-4 pl-4 pr-4">
              {concernRoutines.map((r) => (
                <RoutineCard key={r.id} routine={r} />
              ))}
            </div>
          </section>
        )}

        {/* 관련 단품 */}
        <section>
          <h3 className="px-4 pb-[10px] pt-4 text-[16px] font-bold text-ink">
            {concern.name} 단품
          </h3>
          <div className="rail flex gap-[6px] whitespace-nowrap px-4 pb-3">
            <button
              onClick={() => setCat(null)}
              className={`min-h-[34px] rounded border px-[11px] text-[13px] ${
                cat === null ? "border-ink text-ink" : "border-line text-body"
              }`}
            >
              전체
            </button>
            {cats.map((c) => (
              <button
                key={c.slug}
                onClick={() => setCat(c.slug)}
                className={`min-h-[34px] rounded border px-[11px] text-[13px] ${
                  cat === c.slug ? "border-ink text-ink" : "border-line text-body"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-[3px] border-t border-hairline">
            {concernProducts.map((p, i) => (
              <div key={p.id} className={i % 2 === 0 ? "border-r-[3px] border-surface" : ""}>
                <ProductCard product={p} imageClassName="h-[160px]" showRating={false} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <TabBar />
    </>
  );
}
