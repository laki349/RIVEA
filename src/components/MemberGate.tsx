"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Icon from "./Icon";

/**
 * 장바구니·결제는 **회원 전용**이다.
 *
 * 왜 게스트에게 열어두면 안 되나: 게스트로 결제하면 배송지를 받을 데가 없다.
 * 실제로 결제 화면에 데모 고정값(`김서연 · 010-1234-5678`)이 그대로 떠 있었고,
 * 이름이 남의 이름으로 보이는 화면은 **버그가 아니라 신뢰 사고다.** 주문 조회·
 * 취소·리뷰·재구매가 전부 계정에 매여 있는데 게스트 주문은 그 어디에도 닿지 못한다.
 *
 * 둘러보기는 그대로 열어둔다. 찜·화장대·고민 프로필은 게스트도 쓸 수 있다 —
 * 로그인의 대가를 **돈이 오가는 지점에서만** 받는다. 앱에 들어오자마자 회원가입을
 * 요구하면 40대+는 대개 거기서 나간다.
 */

/** 게이트에 걸린 동작을 감쌀 때 쓴다. `guard(fn)`는 회원일 때만 fn을 실행한다 */
export function useMemberGate() {
  const { ready, isMember } = useAuth();
  const [asking, setAsking] = useState(false);

  const guard = useCallback(
    (fn: () => void) => {
      if (isMember) {
        fn();
        return;
      }
      setAsking(true);
    },
    [isMember]
  );

  const close = useCallback(() => setAsking(false), []);

  return { ready, isMember, guard, asking, close };
}

/** 담기·주문을 눌렀는데 게스트일 때 올라오는 시트 */
export function LoginSheet({ onClose, what }: { onClose: () => void; what: string }) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
      <button
        onClick={onClose}
        aria-label="닫기"
        className="animate-fade-in absolute inset-0 bg-ink/40"
      />
      <div className="animate-sheet-up relative w-full rounded-t-[14px] bg-surface px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-5">
        <span className="text-ink">
          <Icon name="bag" size={26} />
        </span>
        <h2 className="mt-3 text-[21px] font-bold leading-[1.35] text-ink">
          로그인하고 {what}
        </h2>
        <p className="mt-2 text-[17px] leading-[1.6] text-body">
          주문 내역·배송 조회·재구매를 이어서 보려면 계정이 필요해요. 지금까지 보신
          것과 찜·화장대는 그대로 남아 있어요.
        </p>

        <div className="mt-5 flex flex-col gap-[10px]">
          <Link
            href={`/login?next=${encodeURIComponent(pathname)}`}
            className="press flex h-[52px] items-center justify-center rounded-cta bg-ink text-[18px] font-medium text-on-ink"
          >
            로그인 · 회원가입
          </Link>
          <button
            onClick={onClose}
            className="press h-12 rounded-cta border border-line text-[17px] font-medium text-body"
          >
            더 둘러볼게요
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 화면 전체가 회원 전용일 때 (`/cart`, `/checkout`).
 * 시트가 아니라 화면으로 막는 이유: 시트는 뒤에 남의 장바구니처럼 보이는 화면을
 * 비춰주고, 그 화면은 게스트에게 존재하지 않아야 한다.
 */
export function MemberOnlyScreen({
  title,
  body,
  next,
}: {
  title: string;
  body: string;
  next: string;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
      <span className="text-disabled">
        <Icon name="bag" size={44} />
      </span>
      <p className="mt-4 text-[18px] font-bold text-ink">{title}</p>
      <p className="mt-2 text-[17px] leading-[1.6] text-meta">{body}</p>
      <Link
        href={`/login?next=${encodeURIComponent(next)}`}
        className="press mt-6 flex h-12 items-center justify-center rounded-cta bg-ink px-7 text-[17px] font-medium text-on-ink"
      >
        로그인 · 회원가입
      </Link>
      <Link href="/" className="press mt-2 flex h-11 items-center text-[17px] text-body">
        더 둘러볼게요
      </Link>
    </main>
  );
}
