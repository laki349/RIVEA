"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { useReviews } from "@/lib/reviews";

/**
 * 퀵액션의 리뷰 칸 — 실제로 쓴 리뷰 개수. (WishQuickAction과 같은 구조)
 * 여기가 앱에 마지막까지 남아 있던 하드코딩("리뷰 0")이었다.
 */
export default function ReviewQuickAction() {
  const count = useReviews().length;

  return (
    <Link href="/reviews" className="press relative flex-1 py-[15px] text-center">
      <span className="text-ink">
        <Icon name="message" size={20} className="mx-auto" />
      </span>
      <p className="mt-[5px] text-[12px] text-body">리뷰 {count}</p>
    </Link>
  );
}
