"use client";

import { useState } from "react";
import { type Product, formatKRW } from "@/data/catalog";

export default function PurchasePanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const total = product.price * qty;

  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-cocoa">수량</span>
        <div className="flex items-center rounded-full border border-line-strong">
          <button
            type="button"
            aria-label="수량 줄이기"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-cocoa transition hover:bg-cream disabled:text-stone"
            disabled={qty <= 1}
          >
            −
          </button>
          <span className="w-10 text-center text-[15px] font-semibold tabular-nums text-espresso">
            {qty}
          </span>
          <button
            type="button"
            aria-label="수량 늘리기"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-cocoa transition hover:bg-cream"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
        <span className="text-sm text-taupe">총 상품금액</span>
        <span className="text-xl font-bold text-espresso tabular-nums">
          {formatKRW(total)}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="rounded-xl border border-cocoa bg-white py-3 text-[15px] font-semibold text-cocoa transition hover:bg-cream"
        >
          장바구니
        </button>
        <button
          type="button"
          className="rounded-xl bg-cocoa py-3 text-[15px] font-semibold text-ivory transition hover:bg-espresso"
        >
          바로 구매
        </button>
      </div>

      {/* mobile sticky bar */}
      <div
        className="fixed inset-x-0 bottom-16 z-30 border-t border-line bg-ivory/95 p-3 backdrop-blur md:hidden"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-shell items-center gap-2 px-2">
          <button
            type="button"
            className="flex-1 rounded-xl border border-cocoa bg-white py-3 text-[15px] font-semibold text-cocoa"
          >
            장바구니
          </button>
          <button
            type="button"
            className="flex-[1.4] rounded-xl bg-cocoa py-3 text-[15px] font-semibold text-ivory"
          >
            {formatKRW(total)} 구매
          </button>
        </div>
      </div>
    </div>
  );
}
