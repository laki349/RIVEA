"use client";

import { useState } from "react";
import Link from "next/link";
import {
  brandOf,
  discountRate,
  productImage,
  products,
  routineImage,
  routines,
  routineListPrice,
  won,
} from "@/data/catalog";
import ImageSlot from "./ImageSlot";

/**
 * 연령대 인기 모듈 — "50대가 지금 많이 봐요"
 * 카피 존중형("또래" 금지, 연령 명시). 연령 토글 + 제품|루틴 전환.
 */
type AgeKey = "40s" | "50s" | "60s";
const ages: { key: AgeKey; label: string; title: string }[] = [
  { key: "40s", label: "40대", title: "40대가 지금 많이 봐요" },
  { key: "50s", label: "50대", title: "50대가 지금 많이 봐요" },
  { key: "60s", label: "60대 이상", title: "60대가 지금 많이 봐요" },
];

export default function CohortSection({ userName = "김서연" }: { userName?: string }) {
  const [age, setAge] = useState<AgeKey>("50s");
  const [mode, setMode] = useState<"product" | "routine">("product");

  const current = ages.find((a) => a.key === age)!;

  const rankedProducts = [...products]
    .sort((a, b) => b.cohortViews[age] - a.cohortViews[age])
    .slice(0, 5);
  const rankedRoutines = [...routines]
    .sort((a, b) => b.cohortAdds[age] - a.cohortAdds[age])
    .slice(0, 5);

  return (
    <section className="border-b border-hairline bg-bg-tint">
      <div className="px-4 pb-3 pt-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[17px] font-bold text-ink">{current.title}</h2>
          <Link href="/pick" className="py-1 pl-3 text-[13px] text-meta">
            전체보기
          </Link>
        </div>
        <p className="mt-[3px] text-[12px] text-meta">
          {userName}님과 비슷한 연령대 · 이번 주 기준
        </p>
      </div>

      {/* 연령대 토글 */}
      <div className="flex gap-[7px] px-4 pb-3">
        {ages.map((a) => (
          <button
            key={a.key}
            onClick={() => setAge(a.key)}
            className={`min-h-[34px] rounded px-[14px] text-[13px] ${
              age === a.key
                ? "bg-ink font-medium text-on-ink"
                : "border border-line bg-surface text-body"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* 제품 | 루틴 전환 */}
      <div className="flex gap-[18px] px-4 pb-3">
        {(["product", "routine"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`pb-[6px] text-[14px] ${
              mode === m
                ? "border-b-2 border-ink font-bold text-ink"
                : "text-meta"
            }`}
          >
            {m === "product" ? "제품" : "루틴"}
          </button>
        ))}
      </div>

      {/* 랭킹 레일 */}
      <div className="rail flex gap-[11px] pb-4 pl-4 pr-4">
        {mode === "product"
          ? rankedProducts.map((p, i) => {
              const rate = discountRate(p);
              return (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="w-[140px] flex-shrink-0"
                >
                  <div className="relative">
                    <ImageSlot
                      className="h-[140px] w-full rounded"
                      src={productImage(p.id)}
                      alt={p.name}
                    />
                    <span className="absolute bottom-0 left-0 rounded-tr bg-ink px-2 py-[2px] text-[14px] font-bold text-on-ink">
                      {i + 1}
                    </span>
                  </div>
                  <div className="px-[2px] pt-2">
                    <p className="text-[12px] font-bold text-ink">
                      {brandOf(p.brand).name}
                    </p>
                    <p className="mb-1 mt-[2px] truncate text-[12px] text-soft">
                      {p.name}
                    </p>
                    <div className="mb-1 flex items-baseline gap-1">
                      {rate !== null && (
                        <span className="text-[12px] font-bold text-rose">{rate}%</span>
                      )}
                      <span className="text-[14px] font-bold text-ink">
                        {won(p.price)}
                      </span>
                    </div>
                    <p className="text-[11px] text-meta">
                      이번 주 {won(p.cohortViews[age])}명이 봤어요
                    </p>
                  </div>
                </Link>
              );
            })
          : rankedRoutines.map((r, i) => {
              const listPrice = routineListPrice(r);
              const rate = discountRate({ price: r.price, listPrice });
              return (
                <Link
                  key={r.id}
                  href={`/routine/${r.id}`}
                  className="w-[160px] flex-shrink-0"
                >
                  <div className="relative">
                    <ImageSlot
                      className="h-[140px] w-full rounded"
                      tone="warm"
                      src={routineImage(r.id)}
                      alt={r.title}
                    />
                    <span className="absolute bottom-0 left-0 rounded-tr bg-ink px-2 py-[2px] text-[14px] font-bold text-on-ink">
                      {i + 1}
                    </span>
                    <span className="absolute left-2 top-2 rounded-badge bg-ink px-[6px] py-[2px] text-[10px] font-medium text-on-ink">
                      {r.badge}
                    </span>
                  </div>
                  <div className="px-[2px] pt-2">
                    <p className="text-[11px] font-bold text-rose">{r.label}</p>
                    <p className="mb-1 mt-[2px] truncate text-[12px] font-bold text-ink">
                      {r.title}
                    </p>
                    <div className="mb-1 flex items-baseline gap-1">
                      {rate !== null && (
                        <span className="text-[12px] font-bold text-rose">{rate}%</span>
                      )}
                      <span className="text-[14px] font-bold text-ink">
                        {won(r.price)}
                      </span>
                    </div>
                    <p className="text-[11px] text-meta">
                      이번 주 {won(r.cohortAdds[age])}명이 담았어요
                    </p>
                  </div>
                </Link>
              );
            })}
      </div>
    </section>
  );
}
