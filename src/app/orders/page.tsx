import Link from "next/link";
import CartLink from "@/components/CartLink";
import TabBar from "@/components/TabBar";
import OrderList from "./OrderList";

/**
 * 주문 내역 — 목록은 localStorage 기반이라 OrderList(클라이언트)가 담당. (/wish와 같은 구조)
 */
export default function OrdersPage() {
  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-surface px-4 py-[13px]">
        <h1 className="text-[17px] font-bold text-ink">주문·배송</h1>
        <CartLink />
      </header>
      <OrderList />
      <TabBar />
    </>
  );
}
