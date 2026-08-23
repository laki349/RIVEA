"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import Icon from "./Icon";

/** 장바구니 아이콘 + 수량 뱃지 (하이드레이션 후 표시) */
export default function CartLink({ size = 21 }: { size?: number }) {
  const cart = useCart();
  const { isMember } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /**
   * 게스트에게는 숫자를 보여주지 않는다. 장바구니가 회원 전용이 되면서 게스트는
   * 담을 수 없는데, 이 변경 전에 담아둔 게 남아 있으면 배지만 남의 숫자처럼 뜬다.
   * (아이콘은 남긴다 — 누르면 로그인 안내로 이어지는 게 자연스럽다)
   */
  const count = isMember ? cart.reduce((s, i) => s + i.qty, 0) : 0;

  /**
   * 담으면 화면 아래에 토스트가 뜨는데 배지는 조용히 숫자만 바뀌었다 —
   * **방금 담은 것과 장바구니가 이어지지 않았다.** 눈이 아래에 가 있는 동안
   * 위에서 일어난 변화는 못 본다. 늘어날 때만 튀어서 그 자리를 가리킨다.
   * 줄어들 때(삭제·주문)는 조용히 — 사라진 것을 강조할 이유가 없다.
   */
  const [bumping, setBumping] = useState(false);
  const prev = useRef(count);
  useEffect(() => {
    if (count > prev.current) {
      setBumping(true);
      const t = setTimeout(() => setBumping(false), 240);
      prev.current = count;
      return () => clearTimeout(t);
    }
    prev.current = count;
  }, [count]);

  return (
    <Link
      href="/cart"
      aria-label="장바구니"
      className="press relative flex h-11 w-11 items-center justify-center text-ink"
    >
      <Icon name="bag" size={size} />
      {mounted && count > 0 && (
        <span
          /* 글자를 12px로 올리면서 원도 16 → 18px. 안 키우면 숫자가 원 밖으로 밀린다 */
          className={`absolute right-[-3px] top-[2px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-ink px-1 text-[14px] font-bold text-on-ink ${
            bumping ? "animate-bump" : ""
          }`}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
