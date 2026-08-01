"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { useWish } from "@/lib/wish";

/**
 * 마이페이지 퀵액션의 찜 칸 — 실제 찜 개수를 보여주고 /wish로 보낸다.
 */
export default function WishQuickAction() {
  const count = useWish().length;

  return (
    <Link href="/wish" className="relative flex-1 py-[15px] text-center">
      <span className="text-ink">
        <Icon name="heart" size={20} className="mx-auto" />
      </span>
      <p className="mt-[5px] text-[12px] text-body">찜 {count}</p>
    </Link>
  );
}
