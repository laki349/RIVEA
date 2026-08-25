"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Icon from "./Icon";

/**
 * 「이 기록 계속 보시려면」 — 로그인을 권하는 **유일한** 자리.
 *
 * ## 왜 입구가 아니라 여기인가 (2026-08-25, 운영자 결정)
 *
 * 전에는 첫 진입 시퀀스 끝이 로그인 패널이었다. 인스타 링크로 들어온 사람이
 * 앱을 보기 전에 로그인 화면을 먼저 만났다는 뜻이다. 그건 문이지 권유가 아니다.
 *
 * 로그인은 **사용자에게 값이 생긴 다음**에 물어야 한다. 그 시점이 정확히 여기다 —
 * 화장대에 무언가 등록하면 14·28일 뒤에 판정할 거리가 생기고, 그때 돌아와야 한다.
 * 돌아올 이유가 없는 사람에게 계정을 권하면 우리 편의를 파는 것이고,
 * 돌아올 이유가 있는 사람에게 권하면 그 사람의 기록을 지켜주는 것이다.
 *
 * ⚠️ **겁을 주지 않는다.** "지워집니다"가 아니라 "이 브라우저에만 있어요"까지만 쓴다.
 *    사실이 그렇고, 그 사실만으로 충분히 설득된다.
 *
 * ⚠️ 한 번 닫으면 이 브라우저에서 다시 뜨지 않는다. 화장대는 자주 여는 화면이라
 *    매번 뜨면 그게 광고가 된다.
 */
const DISMISS_KEY = "rivea-keep-dismissed";

export default function KeepPrompt({ count }: { count: number }) {
  const { ready, isMember } = useAuth();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(true);

  // SSR에서 localStorage를 읽지 않는다. 마운트 뒤에 판단한다
  useEffect(() => {
    try {
      setHidden(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setHidden(false);
    }
  }, []);

  const close = () => {
    setHidden(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // 저장이 막혀도 이번 세션에선 닫힌다
    }
  };

  if (!ready || isMember || hidden) return null;

  return (
    <section className="border-b border-hairline bg-subtle px-4 py-4">
      <div className="flex items-start gap-[10px]">
        <span className="mt-[2px] text-ink">
          <Icon name="check" size={17} />
        </span>
        <div className="flex-1">
          <p className="text-[17px] font-bold leading-[1.4] text-ink">
            {count}개를 등록하셨어요. 14일 뒤에 판정해드릴게요
          </p>
          <p className="mt-[5px] text-[16px] leading-[1.6] text-body">
            지금 이 기록은 <b className="font-bold">이 브라우저에만</b> 남습니다. 계정을
            만들어두시면 폰을 바꿔도 그대로 이어져요.
          </p>
          <div className="mt-[11px] flex gap-[8px]">
            <Link
              href={`/login?next=${encodeURIComponent(pathname)}`}
              className="press flex h-11 flex-1 items-center justify-center rounded-cta bg-ink text-[17px] font-medium text-on-ink"
            >
              계정 만들기
            </Link>
            <button
              onClick={close}
              className="press h-11 rounded-cta border border-line px-4 text-[17px] font-medium text-body"
            >
              괜찮아요
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
