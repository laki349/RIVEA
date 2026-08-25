"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { displayNameOf, maskEmail, signOut, useAuth } from "@/lib/auth";

/**
 * 마이페이지 계정 영역.
 * 게스트면 이 자리가 로그인 진입점이 된다 (게스트로 둘러본 뒤 여기서 로그인).
 */
export default function AccountBlock() {
  const { user, ready, isGuest } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

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
          <p className="text-[21px] font-bold text-ink">로그인하기</p>
          <p className="mt-[3px] text-[15px] leading-[1.5] text-meta">
            지금은 게스트예요 · 찜과 화장대는 그대로 옮겨져요
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
        <p className="truncate text-[21px] font-bold text-ink">
          {displayNameOf(user)}님 안녕하세요
        </p>
        <p className="mt-[3px] text-[15px] text-meta">{maskEmail(user.email)}</p>
      </div>
      {/*
        로그아웃은 Firebase 응답을 기다린다. 예전엔 await 없이 호출해서
        회선이 느리면 아무 일도 안 일어난 것처럼 보였고, 사용자는 다시 눌렀다.
        스피너 대신 문구를 바꾸고 비활성화한다 — 회전하는 물체는
        모션 최소화 사용자에게 남는 유일한 움직임이 되기 쉽다.
      */}
      <button
        onClick={async () => {
          setSigningOut(true);
          try {
            await signOut();
          } finally {
            setSigningOut(false);
          }
        }}
        disabled={signingOut}
        className="press ml-3 min-h-[44px] flex-shrink-0 rounded border border-line px-[11px] text-[15px] font-medium text-soft transition-opacity duration-tap disabled:opacity-55"
      >
        {signingOut ? "로그아웃 중…" : "로그아웃"}
      </button>
    </div>
  );
}
