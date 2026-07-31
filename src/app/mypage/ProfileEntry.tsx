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

  return (
    <Link
      href="/profile"
      className="mx-4 mb-[14px] flex items-center gap-[9px] rounded border border-line px-[14px] py-[13px]"
    >
      <span className="text-rose">
        <Icon name="sparkle" size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium text-ink">
          {set ? "내 피부 고민" : "내 피부 고민 설정하기"}
        </span>
        <span className="mt-[2px] block truncate text-[14px] text-meta">
          {set ? summary : "고른 고민을 홈 맨 앞에 보여드려요"}
        </span>
      </span>
      <span className="text-disabled">
        <Icon name="chevron-right" size={17} />
      </span>
    </Link>
  );
}
