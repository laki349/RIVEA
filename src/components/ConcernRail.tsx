"use client";

import Link from "next/link";
import { concernImage, concerns } from "@/data/catalog";
import ImageSlot from "./ImageSlot";
import Icon from "./Icon";
import { sortByProfile, useProfile } from "@/lib/profile";

/**
 * 고민으로 찾기 — 이 앱의 전략적 관문.
 *
 * 프로필이 있으면 고른 고민을 **앞으로 당긴다. 빼지는 않는다** — 나머지가 사라지면
 * 둘러보기가 막히고, 고민을 하나만 고른 사용자에게는 앱이 텅 빈 것처럼 보인다.
 *
 * 프로필이 없으면 설정 진입점을 레일 끝에 둔다. 홈 상단에 배너로 얹으면
 * 상품 흐름을 끊고, 레일 안에 있으면 같은 손동작(옆으로 넘기기)에서 만난다.
 */
export default function ConcernRail() {
  const profile = useProfile();
  const ordered = sortByProfile(concerns, (c) => c.slug, profile.concerns);
  const personalized = profile.concerns.length > 0;

  return (
    <section className="border-b border-hairline pb-[14px] pt-[13px]">
      <div className="flex items-baseline justify-between px-4 pb-[11px]">
        <h2 className="text-[17px] font-bold text-ink">고민으로 찾기</h2>
        {personalized && (
          <Link href="/profile" className="py-1 pl-3 text-[13px] text-meta">
            내 고민 기준 · 변경
          </Link>
        )}
      </div>
      <div className="rail flex gap-[14px] px-4">
        {ordered.map((c) => (
          <Link
            key={c.slug}
            href={`/concern/${c.slug}`}
            className="press w-[56px] flex-shrink-0 text-center"
          >
            <ImageSlot
              className="h-[56px] w-[56px] rounded"
              src={concernImage(c.slug)}
              alt={c.name}
            />
            <p
              className={`mt-[6px] whitespace-nowrap text-[13px] ${
                profile.concerns.includes(c.slug) ? "font-bold text-ink" : "text-ink"
              }`}
            >
              {c.name}
            </p>
          </Link>
        ))}
        {!personalized && (
          <Link href="/profile" className="press w-[56px] flex-shrink-0 text-center">
            <span className="flex h-[56px] w-[56px] items-center justify-center rounded border border-dashed border-line-strong text-rose">
              <Icon name="sparkle" size={22} />
            </span>
            <p className="mt-[6px] whitespace-nowrap text-[13px] text-body">내 고민</p>
          </Link>
        )}
      </div>
    </section>
  );
}
