import type { Metadata } from "next";
import AppBar from "@/components/AppBar";
import TabBar from "@/components/TabBar";
import RoutinePlan from "./RoutinePlan";

export const metadata: Metadata = {
  title: "내 루틴",
  description: "고른 고민으로 아침·저녁 순서를 짜드려요.",
};

/** 내 루틴 — 계산이 프로필(localStorage)에 달려 있어 RoutinePlan이 클라이언트에서 담당 */
export default function MyRoutinePage() {
  return (
    <>
      <AppBar title="내 루틴" bold search={false} />
      <RoutinePlan />
      <TabBar />
    </>
  );
}
