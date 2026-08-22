import { Suspense } from "react";
import OrderComplete from "./OrderComplete";

/** 주문 완료 — 본문은 저장된 주문(?no=)을 읽는 클라이언트 컴포넌트가 담당 */
export default function OrderCompletePage() {
  return (
    <>
      <header className="flex items-center justify-center border-b border-hairline bg-surface px-4 py-[13px]">
        <h1 className="text-[15px] font-bold text-ink">주문 완료</h1>
      </header>
      <Suspense fallback={<main className="flex-1" />}>
        <OrderComplete />
      </Suspense>
    </>
  );
}
