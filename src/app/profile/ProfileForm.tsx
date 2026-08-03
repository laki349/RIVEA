"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { concernImage, concerns } from "@/data/catalog";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import {
  AGE_LABELS,
  clearProfile,
  hasProfile,
  setCohort,
  toggleConcern,
  useProfile,
} from "@/lib/profile";

/**
 * 피부 고민·연령대 설정.
 *
 * 저장 버튼이 없다 — 고르는 즉시 저장된다. 40대+ 대상에서 "고르고 → 저장 누르기"는
 * 한 단계가 늘어나는 만큼 이탈이 생기고, 되돌리기 쉬운 설정에는 확인 단계가 필요 없다.
 * 대신 지금 무엇이 반영됐는지 하단에 문장으로 보여준다.
 */
export default function ProfileForm() {
  const profile = useProfile();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // localStorage를 읽기 전엔 "선택 없음"과 구분되지 않아 칩이 깜빡인다
  if (!mounted) return <main className="flex-1" />;

  const picked = profile.concerns;

  return (
    <main className="flex-1">
      <section className="border-b border-hairline px-4 pb-5 pt-[18px]">
        <h2 className="text-[19px] font-bold text-ink">어떤 점이 가장 신경 쓰이세요?</h2>
        <p className="mt-2 text-[15px] leading-[1.6] text-body">
          고르신 고민을 홈 맨 앞에 두고, 맞는 루틴을 먼저 보여드려요.
          <br />
          여러 개 고르셔도 되고, 먼저 고른 순서대로 반영돼요.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-[10px]">
          {concerns.map((c) => {
            const on = picked.includes(c.slug);
            const order = picked.indexOf(c.slug) + 1;
            return (
              <button
                key={c.slug}
                onClick={() => toggleConcern(c.slug)}
                aria-pressed={on}
                className={`press flex flex-col items-center rounded border px-1 pb-[10px] pt-[10px] ${
                  on ? "border-ink bg-bg-tint" : "border-line bg-surface"
                }`}
              >
                <span className="relative">
                  <ImageSlot
                    className="h-[56px] w-[56px] rounded"
                    src={concernImage(c.slug)}
                    alt={c.name}
                  />
                  {on && (
                    <span className="animate-pop absolute -right-[5px] -top-[5px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-ink text-[12px] font-bold text-on-ink">
                      {order}
                    </span>
                  )}
                </span>
                <span
                  className={`mt-[7px] text-center text-[14px] leading-[1.3] ${
                    on ? "font-bold text-ink" : "text-body"
                  }`}
                >
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-b border-hairline px-4 pb-5 pt-[18px]">
        <h2 className="text-[19px] font-bold text-ink">연령대를 알려주세요</h2>
        <p className="mt-2 text-[15px] leading-[1.6] text-body">
          같은 연령대에서 많이 보는 상품을 기본으로 보여드려요.
        </p>
        <div className="mt-4 flex gap-2">
          {AGE_LABELS.map((a) => {
            const on = profile.cohort === a.key;
            return (
              <button
                key={a.key}
                onClick={() => setCohort(on ? null : a.key)}
                aria-pressed={on}
                className={`press h-12 flex-1 rounded border text-[15px] ${
                  on
                    ? "border-ink bg-ink font-medium text-on-ink"
                    : "border-line bg-surface text-body"
                }`}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 지금 무엇이 반영됐는지 — 설정이 어디에 쓰이는지 안 보이면 다시 안 온다 */}
      <section className="px-4 py-5">
        {hasProfile(profile) ? (
          <>
            <p className="text-[15px] leading-[1.7] text-ink">
              {picked.length > 0 && (
                <>
                  홈에서{" "}
                  <b className="font-bold">
                    {picked
                      .map((s) => concerns.find((c) => c.slug === s)!.name)
                      .join(" · ")}
                  </b>
                  를 먼저 보여드려요.
                  <br />
                </>
              )}
              {profile.cohort && (
                <>
                  연령대 인기는{" "}
                  <b className="font-bold">
                    {AGE_LABELS.find((a) => a.key === profile.cohort)!.label}
                  </b>{" "}
                  기준으로 열려요.
                </>
              )}
            </p>
            <div className="mt-5 flex flex-col gap-[10px]">
              {/* 루틴을 먼저 준다. 홈 정렬은 이미 적용돼 있어 확인할 게 없고,
                  고민을 고른 직후에 가장 궁금한 건 "그래서 어떻게 쓰냐"다 */}
              <button
                onClick={() => router.push("/my-routine")}
                className="flex h-12 items-center justify-center gap-1 rounded-cta bg-ink text-[15px] font-medium text-on-ink"
              >
                내 루틴 보기
                <Icon name="chevron-right" size={17} />
              </button>
              <button
                onClick={() => router.push("/")}
                className="h-12 rounded-cta border border-line text-[15px] font-medium text-body"
              >
                홈에서 확인하기
              </button>
              <button
                onClick={clearProfile}
                className="h-12 rounded-cta border border-line text-[15px] font-medium text-body"
              >
                설정 지우기
              </button>
            </div>
          </>
        ) : (
          <p className="text-[15px] leading-[1.7] text-meta">
            아직 고른 고민이 없어요. 하나만 골라도 홈이 달라져요.
          </p>
        )}
      </section>
    </main>
  );
}
