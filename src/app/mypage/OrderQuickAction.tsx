"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { statusOf, useOrders } from "@/lib/orders";

/**
 * 마이페이지 퀵액션의 주문·배송 칸 — 실제 주문 개수를 보여주고 /orders로 보낸다.
 * (WishQuickAction과 같은 구조)
 */
export default function OrderQuickAction() {
  const orders = useOrders();
  // 배송이 진행 중인 주문이 있으면 점을 찍는다 — 확인할 게 있다는 신호
  const moving = orders.some((o) => {
    const s = statusOf(o);
    return s === "preparing" || s === "shipping";
  });

  return (
    <Link href="/orders" className="relative flex-1 py-[15px] text-center">
      <span className="text-ink">
        <Icon name="truck" size={20} className="mx-auto" />
      </span>
      {moving && (
        <span className="absolute left-[calc(50%+10px)] top-3 h-[5px] w-[5px] rounded-full bg-rose" />
      )}
      <p className="mt-[5px] text-[12px] text-body">주문·배송 {orders.length}</p>
    </Link>
  );
}
