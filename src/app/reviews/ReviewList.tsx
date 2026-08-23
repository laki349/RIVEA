"use client";

import Link from "next/link";
import { brandOf, productImage, productOf } from "@/data/catalog";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import StarRating from "@/components/StarRating";
import { deleteReview, useReviews } from "@/lib/reviews";

/** 내가 쓴 리뷰 — localStorage 기반이라 클라이언트에서 렌더한다 */
export default function ReviewList() {
  const reviews = useReviews();

  if (reviews.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-24">
        <span className="text-disabled">
          <Icon name="message" size={44} />
        </span>
        <p className="mt-4 text-[18px] font-bold text-ink">아직 쓴 리뷰가 없어요</p>
        <p className="mt-2 text-center text-[17px] leading-[1.6] text-meta">
          배송이 끝난 주문에서 리뷰를 쓸 수 있어요.
        </p>
        <Link
          href="/orders"
          className="press mt-6 flex h-12 items-center justify-center rounded-cta border border-ink px-7 text-[17px] font-medium text-ink"
        >
          주문 내역 보기
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1">
      {reviews.map((r) => {
        const p = productOf(r.productId);
        if (!p) return null;
        const d = new Date(r.at);
        return (
          <section key={r.id} className="border-b border-hairline px-4 py-4">
            <Link href={`/product/${p.id}`} className="press-card flex gap-[11px]">
              <ImageSlot
                className="h-[56px] w-[56px] flex-shrink-0 rounded"
                src={productImage(p.id)}
                alt={p.name}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] text-meta">{brandOf(p.brand).name}</p>
                <p className="truncate text-[16px] text-ink">{p.name}</p>
              </div>
            </Link>

            <div className="mt-[10px] flex items-center gap-2">
              <StarRating value={r.rating} size={15} />
              <span className="text-[15px] text-meta">
                {d.getFullYear()}.{String(d.getMonth() + 1).padStart(2, "0")}.
                {String(d.getDate()).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-[6px] whitespace-pre-line text-[17px] leading-[1.6] text-body">
              {r.text}
            </p>

            <div className="mt-2 flex justify-end">
              {/* 수정은 주문 상세에서 — 어떤 주문의 리뷰인지 함께 보여야 맥락이 산다 */}
              <Link
                href={`/orders/detail?no=${r.orderNo}`}
                className="press py-1 pl-3 text-[16px] text-meta"
              >
                수정
              </Link>
              <button
                onClick={() => deleteReview(r.id)}
                className="press py-1 pl-4 text-[16px] text-meta"
              >
                삭제
              </button>
            </div>
          </section>
        );
      })}
    </main>
  );
}
