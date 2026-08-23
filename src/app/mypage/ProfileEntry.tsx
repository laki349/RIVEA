"use client";

import Link from "next/link";
import { concerns } from "@/data/catalog";
import Icon from "@/components/Icon";
import { AGE_LABELS, hasProfile, useProfile } from "@/lib/profile";

/**
 * 마이페이지의 피부 프로필 진입점.
 * 예전엔 `/category`로 던지고 끝이었다 — 설정하러 들어갔는데 카테고리 목록이 나왔다.
 * 설정돼 있으면 **무엇이 설정됐는지 여기서 바로 읽힌다**(들어가 보지 않아도 확인 가능).
 */
export default function ProfileEntry() {
  const profile = useProfile();
  const set = hasProfile(profile);

  const summary = [
    ...profile.concerns.map((s) => concerns.find((c) => c.slug === s)?.name).filter(Boolean),
    profile.cohort ? AGE_LABELS.find((a) => a.key === profile.cohort)!.label : null,
  ]
    .filter(Boolean)
    .join(" · ");

  // 고민이 설정돼 있으면 「내 루틴」으로 보낸다. 홈 정렬은 이미 적용돼 있고,
  // 사용자가 다음에 얻을 게 더 큰 쪽은 아침·저녁 순서다.
  return (
    <Link
      href={set ? "/my-routine" : "/profile"}
      className="mx-4 mb-[14px] flex items-center gap-[9px] rounded border border-line px-[14px] py-[13px]"
    >
      <span className="text-rose">
        <Icon name="sparkle" size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-medium text-ink">
          {set ? "내 루틴 보기" : "내 피부 고민 설정하기"}
        </span>
        <span className="mt-[2px] block truncate text-[16px] text-meta">
          {set ? `${summary} · 아침·저녁 순서` : "고민을 고르면 아침·저녁 순서를 짜드려요"}
        </span>
      </span>
      <span className="text-disabled">
        <Icon name="chevron-right" size={17} />
      </span>
    </Link>
  );
}
