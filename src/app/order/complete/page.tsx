"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";

export default function OrderCompletePage() {
  const [orderNo, setOrderNo] = useState("");

  useEffect(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    setOrderNo(
      `RV${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
    );
  }, []);

  return (
    <>
      <header className="flex items-center justify-center border-b border-hairline bg-surface px-4 py-[13px]">
        <h1 className="text-[15px] font-bold text-ink">주문 완료</h1>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
        <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-ink text-on-ink">
          <Icon name="check" size={30} />
        </span>
        <p className="mt-5 text-[19px] font-bold text-ink">주문이 완료됐어요</p>
        <p className="mt-2 text-[14px] leading-[1.6] text-body">
          입점 브랜드에서 꼼꼼히 포장해<br />평균 2~3일 안에 도착해요.
        </p>
        {orderNo && (
          <p className="mt-4 rounded bg-subtle px-4 py-2 text-[13px] text-body">
            주문번호 <b className="font-bold text-ink">{orderNo}</b>
          </p>
        )}
        <div className="mt-8 flex w-full max-w-[320px] flex-col gap-[10px]">
          <Link
            href="/mypage"
            className="flex h-12 items-center justify-center rounded-cta border border-ink text-[15px] font-medium text-ink"
          >
            주문 내역 보기
          </Link>
          <Link
            href="/"
            className="flex h-12 items-center justify-center rounded-cta bg-ink text-[15px] font-medium text-on-ink"
          >
            홈으로
          </Link>
        </div>
      </main>
    </>
  );
}
