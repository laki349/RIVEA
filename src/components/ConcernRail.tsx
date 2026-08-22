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
 * 설정 진입점은 **제목 오른쪽에 항상** 둔다. 예전엔 미설정일 때만 레일 *끝*에
 * 타일로 있었는데, 고민이 7개라 화면에 4~5개만 보이고 그 타일은 끝까지 밀어야
 * 나왔다 — 이 앱의 핵심 관문이 스크롤 뒤에 숨어 있었던 셈이다.
 * 설정 여부에 따라 문구만 바뀐다.
 */
export default function ConcernRail() {
  const profile = useProfile();
  const ordered = sortByProfile(concerns, (c) => c.slug, profile.concerns);
  const personalized = profile.concerns.length > 0;

  return (
    <section className="border-b border-hairline pb-[14px] pt-[13px]">
      <div className="flex items-baseline justify-between px-4 pb-[11px]">
        <h2 className="text-[17px] font-bold text-ink">고민으로 찾기</h2>
        <Link
          href="/profile"
          className={`press flex items-center py-1 pl-3 text-[13px] ${
            personalized ? "text-meta" : "font-medium text-ink"
          }`}
        >
          {personalized ? "내 고민 기준 · 변경" : "내 고민 설정하기"}
          <Icon name="chevron-right" size={14} />
        </Link>
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
      </div>
    </section>
  );
}
