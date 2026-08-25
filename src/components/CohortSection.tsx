"use client";

import { useEffect, useState } from "react";
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
import { displayNameOf, useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/profile";

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

export default function CohortSection({ userName }: { userName?: string }) {
  const [age, setAge] = useState<AgeKey>("50s");
  const [mode, setMode] = useState<"product" | "routine">("product");
  const { user } = useAuth();
  const profile = useProfile();

  /**
   * 프로필에 연령대가 있으면 그 탭으로 연다.
   * `useState` 초기값으로 못 쓰는 이유: 정적 렌더 시점엔 프로필이 빈 값이라
   * 초기값으로 넣으면 서버·클라이언트 렌더가 어긋난다(하이드레이션 불일치).
   * 사용자가 탭을 직접 만지면 그 선택이 이긴다 — `touched`로 구분한다.
   */
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!touched && profile.cohort) setAge(profile.cohort);
  }, [profile.cohort, touched]);
  // 로그인한 회원이면 실제 이름으로 부른다. 게스트·비로그인은 "고객"으로.
  const who = userName ?? (user && !user.isAnonymous ? displayNameOf(user) : "고객");

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
          <h2 className="text-[19px] font-bold text-ink">{current.title}</h2>
          <Link
            href="/pick"
            className="press -my-[8px] flex min-h-[44px] items-center pl-3 text-[15px] text-meta"
          >
            전체보기
          </Link>
        </div>
        <p className="mt-[3px] text-[14px] text-meta">
          {who}님과 비슷한 연령대 · 이번 주 기준
        </p>
      </div>

      {/* 연령대 토글 */}
      <div className="flex gap-[7px] px-4 pb-3">
        {ages.map((a) => (
          <button
            key={a.key}
            onClick={() => {
              setTouched(true);
              setAge(a.key);
            }}
            className={`press min-h-[44px] rounded px-[14px] text-[16px] ${
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
            /* 밑줄은 텍스트 바로 아래 유지하고, 위쪽 여백으로 44px를 채운다 */
            className={`press flex min-h-[44px] items-end pb-[6px] text-[17px] ${
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
                    <span className="absolute bottom-0 left-0 rounded-tr bg-ink px-2 py-[2px] text-[16px] font-bold text-on-ink">
                      {i + 1}
                    </span>
                  </div>
                  <div className="px-[2px] pt-2">
                    <p className="text-[14px] font-bold text-ink">
                      {brandOf(p.brand).name}
                    </p>
                    <p className="mb-1 mt-[2px] truncate text-[14px] text-soft">
                      {p.name}
                    </p>
                    <div className="mb-1 flex items-baseline gap-1">
                      {rate !== null && rate > 0 && (
                        <span className="text-[14px] font-bold text-rose">{rate}%</span>
                      )}
                      <span className="text-[16px] font-bold text-ink">
                        {won(p.price)}
                      </span>
                    </div>
                    <p className="text-[14px] text-meta">
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
                    <span className="absolute bottom-0 left-0 rounded-tr bg-ink px-2 py-[2px] text-[16px] font-bold text-on-ink">
                      {i + 1}
                    </span>
                    <span className="absolute left-2 top-2 rounded-badge bg-ink px-[6px] py-[2px] text-[14px] font-medium text-on-ink">
                      {r.badge}
                    </span>
                  </div>
                  <div className="px-[2px] pt-2">
                    <p className="text-[14px] font-bold text-rose">{r.label}</p>
                    <p className="mb-1 mt-[2px] truncate text-[14px] font-bold text-ink">
                      {r.title}
                    </p>
                    <div className="mb-1 flex items-baseline gap-1">
                      {rate !== null && rate > 0 && (
                        <span className="text-[14px] font-bold text-rose">{rate}%</span>
                      )}
                      <span className="text-[16px] font-bold text-ink">
                        {won(r.price)}
                      </span>
                    </div>
                    <p className="text-[14px] text-meta">
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
