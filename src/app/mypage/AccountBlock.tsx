"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { displayNameOf, maskEmail, signOut, useAuth } from "@/lib/auth";

/**
 * 마이페이지 계정 영역.
 * 게스트면 이 자리가 로그인 진입점이 된다 (게스트로 둘러본 뒤 여기서 로그인).
 */
export default function AccountBlock() {
  const { user, ready, isGuest } = useAuth();

  // 상태 확인 전엔 높이만 잡아둔다 (레이아웃 흔들림 방지)
  if (!ready) {
    return <div className="h-[74px]" />;
  }

  if (!user || isGuest) {
    return (
      <Link
        href="/login"
        className="flex items-center justify-between px-4 pb-[14px] pt-[18px]"
      >
        <div>
          <p className="text-[19px] font-bold text-ink">로그인하기</p>
          <p className="mt-[3px] text-[13px] leading-[1.5] text-meta">
            지금은 게스트예요 · 담아둔 장바구니·찜·주문은 그대로 옮겨져요
          </p>
        </div>
        <span className="flex-shrink-0 text-disabled">
          <Icon name="chevron-right" size={19} />
        </span>
      </Link>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 pb-[14px] pt-[18px]">
      <div className="min-w-0">
        <p className="truncate text-[19px] font-bold text-ink">
          {displayNameOf(user)}님 안녕하세요
        </p>
        <p className="mt-[3px] text-[13px] text-meta">{maskEmail(user.email)}</p>
      </div>
      <button
        onClick={() => signOut()}
        className="ml-3 min-h-[44px] flex-shrink-0 rounded border border-line px-[11px] text-[13px] font-medium text-soft"
      >
        로그아웃
      </button>
    </div>
  );
}
