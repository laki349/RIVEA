"use client";

import { useState } from "react";
import Link from "next/link";
import {
  discountRate,
  productOf,
  routineImage,
  routineListPrice,
  routines,
  won,
} from "@/data/catalog";
import Icon from "@/components/Icon";
import CartLink from "@/components/CartLink";
import ImageSlot from "@/components/ImageSlot";
import TabBar from "@/components/TabBar";

const levels = ["전체", "입문", "집중", "데일리"] as const;

/**
 * 리베아's Pick — 루틴 세트 큐레이션 (풀블리드 카드, 선 구분)
 */
export default function PickPage() {
  const [level, setLevel] = useState<(typeof levels)[number]>("전체");

  const list = level === "전체" ? routines : routines.filter((r) => r.level === level);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-surface px-4 py-3">
        <div>
          <h1 className="text-[18px] font-bold tracking-[0.02em] text-ink">
            리베아&apos;s <span className="text-rose">Pick</span>
          </h1>
          <p className="mt-[2px] text-[12px] text-meta">에디터가 고른 홈케어 루틴</p>
        </div>
        <div className="flex items-center gap-4 text-ink">
          <Link href="/search" aria-label="검색" className="flex h-11 w-11 items-center justify-center">
            <Icon name="search" size={21} />
          </Link>
          <CartLink />
        </div>
      </header>

      {/* 레벨 필터 */}
      <div className="rail flex gap-[6px] whitespace-nowrap border-b border-hairline px-[14px] py-[11px]">
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`min-h-[36px] rounded border px-[11px] text-[13px] ${
              level === l ? "border-ink text-ink" : "border-line text-body"
            }`}
          >
            {l === "전체" ? "전체" : l}
          </button>
        ))}
      </div>

      <main className="flex-1">
        {list.map((r) => {
          const listPrice = routineListPrice(r);
          const rate = discountRate({ price: r.price, listPrice });
          return (
            <Link key={r.id} href={`/routine/${r.id}`} className="block border-b border-hairline">
              <div className="relative">
                <ImageSlot
                  className="h-[200px] w-full"
                  tone="warm"
                  src={routineImage(r.id)}
                  alt={r.title}
                />
                <span className="absolute left-3 top-[10px] rounded-badge bg-ink px-2 py-1 text-[12px] font-medium text-on-ink">
                  {r.badge}
                </span>
              </div>
              <div className="px-4 pb-4 pt-[14px]">
                <p className="text-[12px] font-bold tracking-[0.03em] text-rose">
                  리베아&apos;s PICK · {r.label}
                </p>
                <h2 className="mb-[6px] mt-[5px] text-[18px] font-bold leading-[1.4] text-ink">
                  {r.title}
                </h2>
                <p className="text-[13px] leading-[1.55] text-soft">{r.description}</p>
                <div className="mb-3 mt-[11px] flex flex-wrap gap-[6px]">
                  {r.steps.map((s) => (
                    <span
                      key={s.productId}
                      className="rounded border border-line px-2 py-[3px] text-[12px] text-body"
                    >
                      {categoryLabel(productOf(s.productId).category)}
                    </span>
                  ))}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[14px] text-disabled line-through">{won(listPrice)}</span>
                  {rate !== null && <span className="text-[16px] font-bold text-rose">{rate}%</span>}
                  <span className="text-[19px] font-bold text-ink">{won(r.price)}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </main>

      <TabBar />
    </>
  );
}

function categoryLabel(cat: string) {
  const map: Record<string, string> = {
    skincare: "세럼",
    device: "디바이스",
    suncare: "선크림",
    "scalp-hair": "두피 토닉",
    inner: "이너뷰티",
    mask: "마스크",
    cleansing: "클렌징",
    "cover-makeup": "커버",
  };
  return map[cat] ?? cat;
}
