"use client";

import { won } from "@/data/catalog";
import { useOrders } from "@/lib/orders";
import { GOLD_THRESHOLD, earnRate, gradeOf, spentTotal, toNextGrade, useWallet } from "@/lib/wallet";

/**
 * 등급 카드 — 누적 구매액에서 파생한다 (`wallet.ts`).
 * 예전엔 SILVER·"100,000원 더 구매 시 GOLD"가 하드코딩이라 아무리 주문해도 그대로였다.
 */
export default function GradeCard() {
  const orders = useOrders();
  const wallet = useWallet();
  const grade = gradeOf(orders);
  const spent = spentTotal(orders);
  const remain = toNextGrade(orders);

  return (
    <div className="mx-4 mb-4 overflow-hidden rounded border border-line">
      <div className="flex items-center gap-[11px] p-[14px]">
        <span className="flex h-10 w-10 items-center justify-center rounded bg-ink text-[15px] font-bold text-on-ink">
          {grade === "GOLD" ? "G" : "S"}
        </span>
        <div className="flex-1">
          <p className="text-[17px] font-bold text-ink">{grade}</p>
          <p className="mt-[2px] text-[15px] text-meta">
            구매 적립{" "}
            <b className="font-medium text-ink">{(earnRate(grade) * 100).toFixed(1)}% 적립</b> ·
            포인트 <b className="font-medium text-ink">{won(wallet.points)}P</b>
          </p>
        </div>
      </div>
      <p className="border-t border-subtle bg-bg-tint px-[14px] py-[11px] text-[15px] text-body">
        {grade === "GOLD" ? (
          <>
            누적 구매 <b className="font-bold text-ink">{won(spent)}원</b> · 최고 등급이에요
          </>
        ) : spent === 0 ? (
          <>
            첫 주문부터 적립돼요 · <b className="font-bold text-ink">{won(GOLD_THRESHOLD)}원</b>{" "}
            구매 시 GOLD(1.5% 적립)
          </>
        ) : (
          <>
            누적 {won(spent)}원 · <b className="font-bold text-ink">{won(remain)}원</b> 더 구매 시
            GOLD(1.5% 적립) 달성
          </>
        )}
      </p>
    </div>
  );
}
