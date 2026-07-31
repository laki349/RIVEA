"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { won } from "@/data/catalog";
import { groupLabel, groupLines } from "@/lib/lines";
import {
  arrivalRange,
  cancelOrder,
  isCancellable,
  orderDateLabel,
  statusLabel,
  statusOf,
  useOrder,
  type OrderStatus,
} from "@/lib/orders";
import { revertOrder } from "@/lib/wallet";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import AppBar from "@/components/AppBar";

const STEPS: OrderStatus[] = ["paid", "preparing", "shipping", "delivered"];

/**
 * 주문 상세.
 *
 * 정적 export라 /orders/[no] 동적 라우트를 쓸 수 없어 ?no= 쿼리로 받는다
 * (category/[slug]의 useSearchParams 패턴과 같음).
 */
export default function OrderDetail() {
  const searchParams = useSearchParams();
  const no = searchParams.get("no");
  const order = useOrder(no);
  const [mounted, setMounted] = useState(false);
  const [asking, setAsking] = useState(false);
  useEffect(() => setMounted(true), []);

  // localStorage를 읽기 전엔 "없음"과 구분할 수 없다 — 빈 화면으로 넘긴다
  if (!mounted) {
    return (
      <>
        <AppBar title="주문 상세" bold search={false} />
        <main className="flex-1" />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <AppBar title="주문 상세" bold search={false} />
        <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
          <span className="text-disabled">
            <Icon name="truck" size={44} />
          </span>
          <p className="mt-4 text-[16px] font-bold text-ink">주문을 찾을 수 없어요</p>
          <p className="mt-2 text-[15px] leading-[1.6] text-meta">
            주문은 주문하신 기기에만 저장돼요.
            <br />
            다른 기기나 시크릿 창에서는 보이지 않아요.
          </p>
          <Link
            href="/orders"
            className="mt-6 flex h-12 items-center justify-center rounded-cta border border-ink px-7 text-[15px] font-medium text-ink"
          >
            주문 내역으로
          </Link>
        </main>
      </>
    );
  }

  const status = statusOf(order);
  const cancelled = status === "cancelled";
  const groups = groupLines(order.lines);
  const stepIndex = STEPS.indexOf(status);

  return (
    <>
      <AppBar title="주문 상세" bold search={false} />

      <main className="flex-1">
        {/* 상태 */}
        <section className="border-b border-hairline px-4 py-4">
          <p className={`text-[19px] font-bold ${cancelled ? "text-meta" : "text-ink"}`}>
            {statusLabel[status]}
          </p>
          <p className="mt-[3px] text-[14px] text-body">
            {cancelled
              ? "취소가 접수됐어요. 결제 취소는 카드사에 따라 3~5일 걸려요."
              : status === "delivered"
                ? "배송이 완료됐어요."
                : `${arrivalRange(order)} 도착 예정`}
          </p>

          {!cancelled && (
            <div className="mt-[14px] flex">
              {STEPS.map((s, i) => (
                <div key={s} className="flex-1">
                  <div className="flex items-center">
                    <span
                      className={`h-[9px] w-[9px] flex-shrink-0 rounded-full ${
                        i <= stepIndex ? "bg-ink" : "bg-line-strong"
                      }`}
                    />
                    {i < STEPS.length - 1 && (
                      <span
                        className={`h-[1px] flex-1 ${i < stepIndex ? "bg-ink" : "bg-line"}`}
                      />
                    )}
                  </div>
                  <p
                    className={`mt-[6px] text-[12px] ${
                      i <= stepIndex ? "font-medium text-ink" : "text-meta"
                    }`}
                  >
                    {statusLabel[s]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 주문 정보 */}
        <section className="border-b border-hairline px-4 py-4">
          <Row label="주문번호" value={order.no} />
          <Row label="주문일시" value={orderDateLabel(order)} />
          <Row label="결제수단" value={order.payment} />
        </section>

        {/* 주문상품 */}
        <section className="border-b border-hairline px-4 py-4">
          <h2 className="mb-[11px] text-[15px] font-bold text-ink">
            주문상품 {order.lines.length}
          </h2>
          {groups.map((g, gi) => (
            <div key={g.group} className={gi < groups.length - 1 ? "mb-[14px]" : ""}>
              <p className="mb-2 text-[13px] font-bold text-ink">{groupLabel(g.group).name}</p>
              {g.lines.map((l) => (
                <Link
                  key={l.key}
                  href={l.kind === "product" ? `/product/${l.id}` : `/routine/${l.id}`}
                  className="flex gap-[11px] pb-2"
                >
                  <ImageSlot
                    className="h-[56px] w-[56px] flex-shrink-0 rounded"
                    tone={l.kind === "routine" ? "warm" : "light"}
                    src={l.image}
                    alt={l.name}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] text-ink">{l.name}</p>
                    <p className="mt-[2px] text-[13px] text-meta">
                      {l.option} · {l.qty}개
                    </p>
                  </div>
                  <span className="text-[14px] font-bold text-ink">{won(l.amount)}</span>
                </Link>
              ))}
            </div>
          ))}
        </section>

        {/* 배송지 */}
        <section className="border-b border-hairline px-4 py-4">
          <h2 className="mb-[9px] text-[15px] font-bold text-ink">배송지</h2>
          <p className="text-[14px] font-medium text-ink">
            {order.receiver.name} · {order.receiver.phone}
          </p>
          <p className="mt-[3px] text-[14px] leading-[1.5] text-body">{order.receiver.address}</p>
        </section>

        {/* 결제금액 */}
        <section className="border-b border-hairline px-4 py-4">
          <h2 className="mb-[10px] text-[15px] font-bold text-ink">결제금액</h2>
          <Row label="상품금액" value={`${won(order.itemTotal)}원`} />
          <Row label="배송비" value={order.shipping === 0 ? "무료" : `${won(order.shipping)}원`} />
          {order.couponCut > 0 && (
            <Row label="쿠폰 할인" value={`-${won(order.couponCut)}원`} rose />
          )}
          {order.pointCut > 0 && (
            <Row label="포인트 사용" value={`-${won(order.pointCut)}원`} rose />
          )}
          {!cancelled && order.earned > 0 && (
            <Row label="포인트 적립" value={`+${won(order.earned)}P`} />
          )}
          <div className="mt-[6px] flex justify-between border-t border-hairline pt-[10px]">
            <span className="text-[15px] font-bold text-ink">
              {cancelled ? "취소 금액" : "총 결제금액"}
            </span>
            <span className="text-[19px] font-bold text-ink">{won(order.total)}원</span>
          </div>
        </section>

        {/* 취소 */}
        {isCancellable(order) && (
          <div className="px-4 py-4">
            {asking ? (
              <div className="rounded border border-line p-[14px]">
                <p className="text-[15px] font-medium text-ink">이 주문을 취소할까요?</p>
                <p className="mt-1 text-[14px] leading-[1.5] text-body">
                  브랜드가 상품을 넘기기 전까지만 바로 취소할 수 있어요.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setAsking(false)}
                    className="h-12 flex-1 rounded-cta border border-line text-[15px] font-medium text-body"
                  >
                    유지하기
                  </button>
                  <button
                    onClick={() => {
                      cancelOrder(order.no);
                      // 쓴 쿠폰·포인트는 돌려주고 적립분은 회수한다
                      revertOrder({
                        pointCut: order.pointCut,
                        couponCut: order.couponCut,
                        earned: order.earned ?? 0,
                      });
                      setAsking(false);
                    }}
                    className="h-12 flex-1 rounded-cta bg-ink text-[15px] font-medium text-on-ink"
                  >
                    주문 취소
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAsking(true)}
                className="h-12 w-full rounded-cta border border-line text-[15px] font-medium text-body"
              >
                주문 취소
              </button>
            )}
          </div>
        )}
        <div className="h-2" />
      </main>
    </>
  );
}

function Row({ label, value, rose }: { label: string; value: string; rose?: boolean }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-[14px]">
      <span className="text-meta">{label}</span>
      <span className={rose ? "text-rose" : "text-ink"}>{value}</span>
    </div>
  );
}
