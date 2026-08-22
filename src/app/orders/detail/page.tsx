import { Suspense } from "react";
import OrderDetail from "./OrderDetail";

/**
 * 주문 상세 — 정적 export라 [no] 동적 라우트 대신 ?no= 쿼리로 받는다.
 * useSearchParams는 Suspense 경계가 필요하다 (category/[slug]와 같은 처리).
 */
export default function OrderDetailPage() {
  return (
    <Suspense fallback={null}>
      <OrderDetail />
    </Suspense>
  );
}
