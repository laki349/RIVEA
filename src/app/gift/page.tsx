import type { Metadata } from "next";
import AppBar from "@/components/AppBar";
import TabBar from "@/components/TabBar";
import NotYet from "@/components/NotYet";


export default function GiftPage() {
  return (
    <>
      <AppBar title={"선물하기는 준비 중이에요"} back />
      <NotYet what={"선물하기는 준비 중이에요"} why={"결제를 받게 되면 열 기능입니다. 지금은 고민을 고르고 루틴을 확인하는 것까지 해보실 수 있어요."} />
      <TabBar />
    </>
  );
}
