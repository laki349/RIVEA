"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { won } from "@/data/catalog";
import { arrivalRange, orderSummary, useOrder } from "@/lib/orders";
import Icon from "@/components/Icon";

/**
 * 주문 완료.
 *
 * 예전엔 이 화면이 주문번호를 직접 만들어 찍고 버렸다 — 그래서 사용자가 자기 주문을
 * 다시 볼 방법이 없었다. 지금은 결제 화면이 저장한 주문(?no=)을 **읽기만** 한다.
 */
export default function OrderComplete() {
  const searchParams = useSearchParams();
  const no = searchParams.get("no");
  const order = useOrder(no);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
      <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-ink text-on-ink">
        <Icon name="check" size={30} />
      </span>
      <p className="mt-5 text-[19px] font-bold text-ink">주문이 완료됐어요</p>

      {order ? (
        <>
          <p className="mt-2 text-[15px] leading-[1.6] text-body">
            입점 브랜드에서 꼼꼼히 포장해
            <br />
            <b className="font-medium text-ink">{arrivalRange(order)}</b>에 도착할 예정이에요.
          </p>
          <div className="mt-4 w-full max-w-[320px] rounded bg-subtle px-4 py-3">
            <div className="flex justify-between text-[14px]">
              <span className="text-meta">주문번호</span>
              <b className="font-bold text-ink">{order.no}</b>
            </div>
            <div className="mt-[5px] flex justify-between gap-3 text-[14px]">
              <span className="flex-shrink-0 text-meta">주문상품</span>
              <span className="truncate text-ink">{orderSummary(order)}</span>
            </div>
            <div className="mt-[5px] flex justify-between text-[14px]">
              <span className="text-meta">결제금액</span>
              <b className="font-bold text-ink">{won(order.total)}원</b>
            </div>
          </div>
        </>
      ) : (
        // 주문번호 없이 이 주소로 직접 들어온 경우 (공유·새로고침 등)
        <p className="mt-2 text-[15px] leading-[1.6] text-body">
          {mounted && no
            ? "주문 내역에서 자세한 내용을 확인하실 수 있어요."
            : "입점 브랜드에서 꼼꼼히 포장해 평균 2~3일 안에 도착해요."}
        </p>
      )}

      <div className="mt-8 flex w-full max-w-[320px] flex-col gap-[10px]">
        <Link
          href={order ? `/orders/detail?no=${order.no}` : "/orders"}
          className="flex h-12 items-center justify-center rounded-cta border border-ink text-[15px] font-medium text-ink"
        >
          {order ? "주문 상세 보기" : "주문 내역 보기"}
        </Link>
        <Link
          href="/"
          className="flex h-12 items-center justify-center rounded-cta bg-ink text-[15px] font-medium text-on-ink"
        >
          홈으로
        </Link>
      </div>
    </main>
  );
}
