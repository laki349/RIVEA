import Link from "next/link";
import Icon from "@/components/Icon";
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
        <Link
          href="/cart"
          aria-label="장바구니"
          className="flex h-11 w-8 items-center justify-center text-ink"
        >
          <Icon name="bag" size={21} />
        </Link>
      </header>
      <OrderList />
      <TabBar />
    </>
  );
}
