"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import Icon from "./Icon";

/** 장바구니 아이콘 + 수량 뱃지 (하이드레이션 후 표시) */
export default function CartLink({ size = 21 }: { size?: number }) {
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <Link href="/cart" aria-label="장바구니" className="relative flex h-11 w-8 items-center justify-center text-ink">
      <Icon name="bag" size={size} />
      {mounted && count > 0 && (
        <span className="absolute right-[-2px] top-[3px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold text-on-ink">
          {count}
        </span>
      )}
    </Link>
  );
}
