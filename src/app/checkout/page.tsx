import type { Metadata } from "next";
import AppBar from "@/components/AppBar";
import TabBar from "@/components/TabBar";
import NotYet from "@/components/NotYet";


export default function CheckoutPage() {
  return (
    <>
      <AppBar title={"주문·결제를 받지 않아요"} back />
      <NotYet what={"주문·결제를 받지 않아요"} why={"리베아는 중개만 합니다. 결제와 배송은 브랜드 공식몰에서 진행돼요. 상품 화면에서 바로 나가실 수 있습니다."} />
      <TabBar />
    </>
  );
}
