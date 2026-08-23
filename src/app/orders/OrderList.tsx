"use client";

import Link from "next/link";
import { won } from "@/data/catalog";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import {
  arrivalRange,
  orderDateLabel,
  statusLabel,
  statusOf,
  useOrders,
  type Order,
} from "@/lib/orders";

/**
 * 주문 내역 — localStorage 기반이라 클라이언트에서 렌더한다. (WishList와 같은 구조)
 */
export default function OrderList() {
  const orders = useOrders();

  if (orders.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-24">
        <span className="text-disabled">
          <Icon name="truck" size={44} />
        </span>
        <p className="mt-4 text-[18px] font-bold text-ink">주문한 상품이 없어요</p>
        <p className="mt-2 text-center text-[17px] leading-[1.6] text-meta">
          고민에 맞는 루틴부터 둘러보실래요?
        </p>
        <Link
          href="/pick"
          className="mt-6 flex h-12 items-center justify-center rounded-cta bg-ink px-7 text-[17px] font-medium text-on-ink"
        >
          리베아&apos;s Pick 보러가기
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1">
      {orders.map((o) => (
        <OrderCard key={o.no} order={o} />
      ))}
      <p className="px-4 py-5 text-[15px] leading-[1.6] text-meta">
        발표용 데모라 실제 결제·배송은 이뤄지지 않아요. 주문은 이 브라우저에만 저장됩니다.
      </p>
    </main>
  );
}

function OrderCard({ order }: { order: Order }) {
  const status = statusOf(order);
  const cancelled = status === "cancelled";

  return (
    <section className="border-b border-hairline px-4 py-4">
      <div className="flex items-center justify-between">
        <span className="text-[15px] text-meta">{orderDateLabel(order)}</span>
        <Link
          href={`/orders/detail?no=${order.no}`}
          className="flex h-11 items-center gap-[2px] text-[15px] text-body"
        >
          상세 보기
          <Icon name="chevron-right" size={15} />
        </Link>
      </div>

      <p className={`text-[18px] font-bold ${cancelled ? "text-meta" : "text-ink"}`}>
        {statusLabel[status]}
      </p>
      {!cancelled && status !== "delivered" && (
        <p className="mt-[2px] text-[15px] text-body">{arrivalRange(order)} 도착 예정</p>
      )}

      <Link href={`/orders/detail?no=${order.no}`} className="mt-3 block">
        {order.lines.map((l) => (
          <div key={l.key} className="flex items-center gap-[11px] pb-2">
            <ImageSlot
              className="h-[56px] w-[56px] flex-shrink-0 rounded"
              tone={l.kind === "routine" ? "warm" : "light"}
              src={l.image}
              alt={l.name}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] text-ink">{l.name}</p>
              <p className="mt-[2px] text-[15px] text-meta">
                {won(l.price)}원 · {l.qty}개
              </p>
            </div>
          </div>
        ))}
      </Link>

      <div className="mt-1 flex items-baseline justify-between border-t border-subtle pt-[10px]">
        <span className="text-[16px] text-meta">
          결제금액 · 주문번호 {order.no}
        </span>
        <span className={`text-[18px] font-bold ${cancelled ? "text-meta line-through" : "text-ink"}`}>
          {won(order.total)}원
        </span>
      </div>
    </section>
  );
}
