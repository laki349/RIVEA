"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { brandOf, productOf, routines, won } from "@/data/catalog";
import { clearCart, useCart } from "@/lib/cart";
import Icon from "@/components/Icon";
import AppBar from "@/components/AppBar";

const payments = ["신용·체크카드", "간편결제 (카카오·네이버·토스)", "무통장 입금"];

export default function CheckoutPage() {
  const cart = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [payment, setPayment] = useState(0);
  const [useCoupon, setUseCoupon] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [agreed, setAgreed] = useState(false); // 기본 해제 (다크패턴 금지)
  useEffect(() => setMounted(true), []);

  const lines = useMemo(
    () =>
      cart.map((i) => {
        if (i.kind === "product") {
          const p = productOf(i.id);
          return {
            key: `p-${i.id}`,
            brand: brandOf(p.brand).name,
            name: p.name,
            option: `${p.tags[0] ?? p.volume} · ${i.qty}개`,
            amount: p.price * i.qty,
          };
        }
        const r = routines.find((x) => x.id === i.id)!;
        return {
          key: `r-${i.id}`,
          brand: "리베아 루틴 세트",
          name: `[세트] ${r.title}`,
          option: `${r.badge} · ${i.qty}개`,
          amount: r.price * i.qty,
        };
      }),
    [cart]
  );

  const itemTotal = lines.reduce((s, l) => s + l.amount, 0);
  const shipping = itemTotal >= 50000 || itemTotal === 0 ? 0 : 3000;
  const couponCut = useCoupon ? Math.min(10000, itemTotal) : 0;
  const pointCut = usePoints ? Math.min(3200, itemTotal - couponCut) : 0;
  const total = itemTotal + shipping - couponCut - pointCut;

  const pay = () => {
    if (!agreed || lines.length === 0) return;
    clearCart();
    router.push("/order/complete");
  };

  if (!mounted) {
    return (
      <>
        <AppBar title="주문/결제" bold search={false} />
        <main className="flex-1" />
      </>
    );
  }

  return (
    <>
      <AppBar title="주문/결제" bold search={false} />

      <main className="flex-1">
        {/* 배송지 */}
        <section className="border-b border-hairline px-4 py-4">
          <div className="mb-[9px] flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-ink">배송지</h2>
            <button className="text-[13px] text-meta">변경 ›</button>
          </div>
          <p className="text-[14px] font-medium text-ink">김서연 · 010-1234-5678</p>
          <p className="mt-[3px] text-[13px] leading-[1.5] text-body">
            서울시 마포구 월드컵북로 000, 101동 1001호
          </p>
          <button className="mt-[9px] rounded border border-line px-[10px] py-[5px] text-[12px] text-body">
            배송 요청사항 선택 ›
          </button>
        </section>

        {/* 주문상품 */}
        <section className="border-b border-hairline px-4 py-4">
          <h2 className="mb-[11px] text-[15px] font-bold text-ink">주문상품 {lines.length}</h2>
          {lines.length === 0 ? (
            <p className="text-[13px] text-meta">주문할 상품이 없어요. 장바구니에서 담아주세요.</p>
          ) : (
            lines.map((l, i) => (
              <div key={l.key} className={i < lines.length - 1 ? "mb-[14px]" : ""}>
                <p className="mb-2 text-[13px] font-bold text-ink">{l.brand}</p>
                <div className="flex gap-[11px]">
                  <div className="h-[52px] w-[52px] flex-shrink-0 rounded bg-subtle" />
                  <div className="flex-1">
                    <p className="text-[13px] text-ink">{l.name}</p>
                    <p className="mt-[2px] text-[12px] text-meta">{l.option}</p>
                  </div>
                  <span className="text-[13px] font-bold text-ink">{won(l.amount)}</span>
                </div>
              </div>
            ))
          )}
        </section>

        {/* 쿠폰·포인트 */}
        <section className="border-b border-hairline px-4 py-1">
          <button
            onClick={() => setUseCoupon((v) => !v)}
            className="flex w-full items-center justify-between border-b border-subtle py-[14px]"
          >
            <span className="flex items-center gap-2 text-[14px] text-ink">
              <Check on={useCoupon} /> 신규가입 쿠폰 10,000원
            </span>
            <span className="text-[13px] text-meta">보유 2장</span>
          </button>
          <button
            onClick={() => setUsePoints((v) => !v)}
            className="flex w-full items-center justify-between py-[14px]"
          >
            <span className="flex items-center gap-2 text-[14px] text-ink">
              <Check on={usePoints} /> 리베아 포인트 전액 사용
            </span>
            <span className="text-[13px] text-meta">보유 3,200P</span>
          </button>
        </section>

        {/* 결제수단 */}
        <section className="border-b border-hairline px-4 py-4">
          <h2 className="mb-[11px] text-[15px] font-bold text-ink">결제수단</h2>
          {payments.map((p, i) => (
            <button key={p} onClick={() => setPayment(i)} className="flex w-full items-center gap-[9px] py-[6px]">
              <span
                className={`box-border h-[18px] w-[18px] rounded-full ${
                  payment === i ? "border-[5px] border-ink" : "border-[1.5px] border-line-strong"
                }`}
              />
              <span className={`text-[14px] ${payment === i ? "text-ink" : "text-body"}`}>{p}</span>
            </button>
          ))}
          <p className="mt-2 text-[12px] text-meta">
            지금은 시연 단계라 실제 결제는 일어나지 않아요.
          </p>
        </section>

        {/* 결제금액 */}
        <section className="border-b border-hairline px-4 py-4">
          <h2 className="mb-[10px] text-[15px] font-bold text-ink">결제금액</h2>
          <Row label="상품금액" value={won(itemTotal)} />
          <Row label="배송비" value={shipping === 0 ? "무료" : won(shipping)} />
          {couponCut > 0 && <Row label="쿠폰 할인" value={`-${won(couponCut)}`} rose />}
          {pointCut > 0 && <Row label="포인트 사용" value={`-${won(pointCut)}`} rose />}
          <div className="mt-[6px] flex justify-between border-t border-hairline pt-[10px]">
            <span className="text-[15px] font-bold text-ink">최종 결제금액</span>
            <span className="text-[19px] font-bold text-ink">{won(total)}</span>
          </div>
        </section>

        {/* 동의 — 기본 해제 */}
        <button onClick={() => setAgreed((v) => !v)} className="flex w-full items-start gap-2 px-4 py-[14px] text-left">
          <Check on={agreed} />
          <span className="text-[12px] leading-[1.5] text-meta">
            주문 내용을 확인했으며, 결제·개인정보 제공에 동의합니다.
          </span>
        </button>
      </main>

      <div className="sticky bottom-0 z-40 border-t border-line bg-surface px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
        <button
          onClick={pay}
          disabled={!agreed || lines.length === 0}
          className="h-[52px] w-full rounded-cta bg-ink text-[16px] font-medium text-on-ink disabled:opacity-40"
        >
          {won(total)}원 결제하기
        </button>
      </div>
    </>
  );
}

function Row({ label, value, rose }: { label: string; value: string; rose?: boolean }) {
  return (
    <div className="flex justify-between py-1 text-[13px]">
      <span className="text-meta">{label}</span>
      <span className={rose ? "text-rose" : "text-ink"}>{value}</span>
    </div>
  );
}

function Check({ on }: { on: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border ${
        on ? "border-ink bg-ink text-on-ink" : "border-line-strong bg-surface text-transparent"
      }`}
    >
      <Icon name="check" size={13} />
    </span>
  );
}
