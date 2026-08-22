import type { Metadata } from "next";
import CartLink from "@/components/CartLink";
import TabBar from "@/components/TabBar";
import RecentList from "./RecentList";

export const metadata: Metadata = {
  title: "최근 본 상품",
};

/** 최근 본 상품 — 목록은 localStorage 기반이라 RecentList(클라이언트)가 담당 */
export default function RecentPage() {
  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-surface px-4 py-[13px]">
        <h1 className="text-[17px] font-bold text-ink">최근 본 상품</h1>
        <CartLink />
      </header>
      <RecentList />
      <TabBar />
    </>
  );
}
