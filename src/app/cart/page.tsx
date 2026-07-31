"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { won } from "@/data/catalog";
import {
  removeFromCart,
  removeMany,
  setAllChecked,
  setQty,
  toggleChecked,
  useCart,
} from "@/lib/cart";
import {
  groupLabel,
  groupLines,
  lineAmount,
  toLine,
  totalsOf,
} from "@/lib/lines";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import AppBar from "@/components/AppBar";

export default function CartPage() {
  const cart = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 선택은 스토어에 있다 — 결제 화면이 같은 선택을 읽고, 새로고침해도 유지된다
  const lines = useMemo(
    () => cart.map((i) => ({ ...toLine(i), checked: i.checked })),
    [cart]
  );
  const groups = useMemo(() => groupLines(lines), [lines]);
  const selectedLines = lines.filter((l) => l.checked);

  const { itemTotal, shipping: shipTotal } = totalsOf(selectedLines);
  const total = itemTotal + shipTotal;

  const allChecked = lines.length > 0 && lines.every((l) => l.checked);
  const toggleAll = () => setAllChecked(!allChecked);

  const removeSelected = () => {
    removeMany(selectedLines.map((l) => ({ kind: l.kind, id: l.id })));
  };

  if (!mounted) {
    return (
      <>
        <AppBar title="장바구니" bold search={false} />
        <main className="flex-1" />
      </>
    );
  }

  if (lines.length === 0) {
    return (
      <>
        <AppBar title="장바구니" bold search={false} />
        <main className="flex flex-1 flex-col items-center justify-center px-4 pb-24">
          <span className="text-disabled">
            <Icon name="bag" size={44} />
          </span>
          <p className="mt-4 text-[16px] font-bold text-ink">아직 담은 상품이 없어요</p>
          <p className="mt-2 text-center text-[14px] leading-[1.6] text-meta">
            고민에 맞는 루틴부터 둘러보실래요?
          </p>
          <Link
            href="/pick"
            className="mt-6 flex h-12 items-center justify-center rounded-cta bg-ink px-7 text-[15px] font-medium text-on-ink"
          >
            리베아&apos;s Pick 보러가기
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <AppBar title={`장바구니 ${lines.length}`} bold search={false} />

      {/* 전체선택 */}
      <div className="flex items-center gap-2 border-b border-hairline px-4 py-[11px]">
        <button onClick={toggleAll} className="flex items-center gap-2">
          <Check on={allChecked} />
          <span className="text-[13px] text-ink">
            전체선택 ({selectedLines.length}/{lines.length})
          </span>
        </button>
        <span className="flex-1" />
        <button onClick={removeSelected} className="py-1 text-[13px] text-meta">
          선택삭제
        </button>
      </div>

      <main className="flex-1">
        {groups.map(({ group, lines: gl }) => {
          const label = groupLabel(group);
          return (
            <section key={group} className="border-b border-hairline pb-4">
              <div className="flex items-center gap-[7px] px-4 pb-1 pt-[14px]">
                <span className="text-[14px] font-bold text-ink">{label.name}</span>
                <span className="text-[12px] text-meta">· {label.ship}</span>
              </div>
              {gl.map((l) => (
                <div key={l.key} className="flex gap-[11px] px-4 pt-3">
                  <button
                    onClick={() => toggleChecked(l.kind, l.id)}
                    aria-label={l.checked ? "선택 해제" : "선택"}
                    className="mt-1 flex-shrink-0"
                  >
                    <Check on={l.checked} />
                  </button>
                  <ImageSlot
                    className="h-16 w-16 flex-shrink-0 rounded"
                    tone={l.kind === "routine" ? "warm" : "light"}
                    src={l.image}
                    alt={l.name}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] leading-[1.4] text-ink">{l.name}</p>
                      <button
                        onClick={() => removeFromCart(l.kind, l.id)}
                        aria-label="삭제"
                        className="p-1 text-disabled"
                      >
                        <Icon name="plus" size={15} className="rotate-45" />
                      </button>
                    </div>
                    <p className="mt-[2px] text-[12px] text-meta">{l.option}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded border border-line">
                        <button
                          onClick={() => setQty(l.kind, l.id, l.qty - 1)}
                          aria-label="수량 감소"
                          className="flex h-[30px] w-[30px] items-center justify-center text-body"
                        >
                          <Icon name="minus" size={15} />
                        </button>
                        <span className="flex h-[30px] w-[32px] items-center justify-center border-x border-line text-[13px] text-ink">
                          {l.qty}
                        </span>
                        <button
                          onClick={() => setQty(l.kind, l.id, l.qty + 1)}
                          aria-label="수량 증가"
                          className="flex h-[30px] w-[30px] items-center justify-center text-body"
                        >
                          <Icon name="plus" size={15} />
                        </button>
                      </div>
                      <span className="text-[15px] font-bold text-ink">
                        {won(lineAmount(l))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          );
        })}

        {/* 금액 요약 */}
        <section className="border-b border-hairline px-4 py-4">
          <div className="flex justify-between py-[5px] text-[13px]">
            <span className="text-meta">상품금액</span>
            <span className="text-ink">{won(itemTotal)}</span>
          </div>
          <div className="flex justify-between py-[5px] text-[13px]">
            <span className="text-meta">배송비</span>
            <span className="text-ink">{shipTotal === 0 ? "무료" : won(shipTotal)}</span>
          </div>
          <div className="mt-[6px] flex justify-between border-t border-hairline pt-[9px]">
            <span className="text-[14px] font-bold text-ink">결제예정금액</span>
            <span className="text-[18px] font-bold text-ink">{won(total)}</span>
          </div>
        </section>
      </main>

      {/* 주문 CTA */}
      <div className="sticky bottom-0 z-40 border-t border-line bg-surface px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
        <button
          onClick={() => router.push("/checkout")}
          disabled={selectedLines.length === 0}
          className="press h-[52px] w-full rounded-cta bg-ink text-[16px] font-medium text-on-ink disabled:opacity-40"
        >
          {won(total)}원 주문하기
        </button>
      </div>
    </>
  );
}

function Check({ on }: { on: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 items-center justify-center rounded border ${
        on ? "border-ink bg-ink text-on-ink" : "border-line-strong bg-surface text-transparent"
      }`}
    >
      <Icon name="check" size={13} />
    </span>
  );
}
