"use client";

import Link from "next/link";
import StarRating from "./StarRating";
import { useReviews } from "@/lib/reviews";

/**
 * 상품 상세에 내가 쓴 리뷰를 먼저 보여준다.
 *
 * 리뷰를 쓰고 나서 그 상품에 다시 들어왔는데 내 글이 없으면 "저장이 안 됐나" 싶어진다.
 * 데모 리뷰 수(product.reviewCount)에는 더하지 않는다 — 그 숫자는 내 것이 아니다.
 */
export default function MyReview({ productId }: { productId: string }) {
  const mine = useReviews().filter((r) => r.productId === productId);
  if (mine.length === 0) return null;

  return (
    <div className="mb-3 space-y-2">
      {mine.map((r) => (
        <div key={r.id} className="rounded border border-line px-3 py-[11px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StarRating value={r.rating} size={14} />
              <span className="text-[15px] font-medium text-ink">내가 쓴 리뷰</span>
            </div>
            <Link
              href={`/orders/detail?no=${r.orderNo}`}
              className="press py-1 pl-3 text-[15px] text-meta"
            >
              수정
            </Link>
          </div>
          <p className="mt-[5px] whitespace-pre-line text-[15px] leading-[1.6] text-body">
            {r.text}
          </p>
        </div>
      ))}
    </div>
  );
}
