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
 * 고르는 즉시 저장된다 — "고르고 → 저장 누르기"는 한 단계가 늘어나는 만큼 이탈이 생기고,
 * 되돌리기 쉬운 설정에는 확인 단계가 필요 없다.
 *
 * 그래도 **끝내는 버튼은 필요하다.** 즉시 저장이라 기술적으로는 필요 없지만,
 * 사용자는 "이제 다 됐나?"를 확인하고 싶어 하고 나갈 길이 보여야 한다.
 * 그래서 저장 버튼이 아니라 **완료 버튼**을 하단에 고정한다 — 페이지 끝에 두면
 * 스크롤해야 보이고, 스크롤해야 보이는 출구는 출구가 아니다.
 */
export default function ProfileForm() {
  const profile = useProfile();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // localStorage를 읽기 전엔 "선택 없음"과 구분되지 않아 칩이 깜빡인다
  if (!mounted) return <main className="flex-1" />;

  const picked = profile.concerns;

  const done = picked.length > 0;

  return (
    <>
      <main className="flex-1 pb-2">
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
            {/* 이동 버튼은 하단 고정 바로 옮겼다. 여기 남는 건 파괴적 동작 하나뿐이라
                실수로 눌리지 않게 스크롤 끝에 두는 게 맞다 */}
            <button
              onClick={clearProfile}
              className="press mt-5 h-12 w-full rounded-cta border border-line text-[15px] font-medium text-body"
            >
              설정 지우기
            </button>
          </>
        ) : (
          <p className="text-[15px] leading-[1.7] text-meta">
            아직 고른 고민이 없어요. 하나만 골라도 홈이 달라져요.
          </p>
        )}
      </section>
      </main>

      {/* 완료 — 항상 보인다. 고른 개수를 같이 띄워 "반영됐다"를 버튼에서 알린다 */}
      <div className="sticky bottom-0 z-40 border-t border-line bg-surface px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
        {done ? (
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/")}
              className="press h-[52px] flex-1 rounded-cta border border-ink text-[15px] font-medium text-ink"
            >
              설정 완료
            </button>
            <button
              onClick={() => router.push("/my-routine")}
              className="press flex h-[52px] flex-1 items-center justify-center gap-1 rounded-cta bg-ink text-[15px] font-medium text-on-ink"
            >
              내 루틴 보기
              <Icon name="chevron-right" size={17} />
            </button>
          </div>
        ) : (
          <button
            disabled
            className="h-[52px] w-full rounded-cta bg-ink text-[16px] font-medium text-on-ink opacity-40"
          >
            고민을 하나 이상 골라주세요
          </button>
        )}
        <p className="mt-2 text-center text-[13px] text-meta">
          {done ? `고민 ${picked.length}개가 저장됐어요` : "고르는 즉시 저장돼요"}
        </p>
      </div>
    </>
  );
}
