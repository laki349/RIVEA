import type { Metadata } from "next";
import TabBar from "@/components/TabBar";
import ReviewList from "./ReviewList";

export const metadata: Metadata = { title: "내가 쓴 리뷰" };

/** 내가 쓴 리뷰 — 목록은 localStorage 기반이라 ReviewList(클라이언트)가 담당 */
export default function ReviewsPage() {
  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-surface px-4 py-[13px]">
        <h1 className="text-[19px] font-bold text-ink">내가 쓴 리뷰</h1>
      </header>
      <ReviewList />
      <TabBar />
    </>
  );
}
