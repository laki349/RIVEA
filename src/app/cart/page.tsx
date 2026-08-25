import type { Metadata } from "next";
import AppBar from "@/components/AppBar";
import TabBar from "@/components/TabBar";
import NotYet from "@/components/NotYet";


export default function CartPage() {
  return (
    <>
      <AppBar title={"장바구니는 아직 없어요"} back />
      <NotYet what={"장바구니는 아직 없어요"} why={"리베아는 결제를 받지 않아요. 구매는 각 상품에서 브랜드 공식몰로 바로 나가시면 됩니다. 담아두고 싶으시면 찜을 써주세요."} />
      <TabBar />
    </>
  );
}
