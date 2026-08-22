import type { Metadata } from "next";
import AppBar from "@/components/AppBar";
import TabBar from "@/components/TabBar";
import RepurchaseList from "./RepurchaseList";

export const metadata: Metadata = {
  title: "다 쓸 때쯤",
  description: "받으신 날과 용량으로 다 쓰실 때쯤을 알려드려요.",
};

/** 재구매 목록 — 주문(localStorage) 기반이라 RepurchaseList가 클라이언트에서 담당 */
export default function RepurchasePage() {
  return (
    <>
      <AppBar title="다 쓸 때쯤" bold search={false} />
      <RepurchaseList />
      <TabBar />
    </>
  );
}
