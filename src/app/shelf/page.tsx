import type { Metadata } from "next";
import AppBar from "@/components/AppBar";
import TabBar from "@/components/TabBar";
import ShelfManager from "./ShelfManager";

export const metadata: Metadata = {
  title: "내 화장대",
  description: "쓰고 계신 걸 등록해 두면 새로 담는 것과 같이 써도 되는지 알려드려요.",
};

/** 내 화장대 — 저장이 localStorage라 ShelfManager(클라이언트)가 담당 */
export default function ShelfPage() {
  return (
    <>
      <AppBar title="내 화장대" bold search={false} />
      <ShelfManager />
      <TabBar />
    </>
  );
}
