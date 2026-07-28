"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";
import { won } from "@/data/catalog";
import Icon from "./Icon";
import WishButton from "./WishButton";

/**
 * 하단 구매 바 — 담기 실동작 + 토스트.
 * product: 찜 + 장바구니 + 바로구매 / routine: 찜 + 세트가 + 세트 담기
 */
export default function BuyBar({
  kind,
  id,
  likes,
  price,
}: {
  kind: "product" | "routine";
  id: string;
  likes: number;
  price: number;
}) {
  const router = useRouter();
  const [toast, setToast] = useState(false);

  const add = () => {
    addToCart(kind, id);
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  };

  const buyNow = () => {
    addToCart(kind, id);
    router.push("/checkout");
  };

  return (
    <>
      {toast && (
        <div className="pointer-events-none fixed bottom-[92px] left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded bg-ink px-4 py-[11px] text-[13px] text-on-ink shadow-[0_4px_16px_rgba(28,24,21,0.25)]">
            <Icon name="check" size={15} />
            장바구니에 담았어요
            <button
              onClick={() => router.push("/cart")}
              className="pointer-events-auto ml-1 font-bold underline underline-offset-2"
            >
              보러가기
            </button>
          </div>
        </div>
      )}

      <div className="sticky bottom-0 z-40 flex items-center gap-3 border-t border-line bg-surface px-4 pb-[max(11px,env(safe-area-inset-bottom))] pt-[11px]">
        <WishButton kind={kind} id={id} variant="bar" baseLikes={likes} />

        {kind === "product" ? (
          <>
            <button
              onClick={add}
              className="h-[50px] flex-1 rounded-cta border border-ink text-[15px] font-medium text-ink"
            >
              장바구니
            </button>
            <button
              onClick={buyNow}
              className="h-[50px] flex-1 rounded-cta bg-ink text-[15px] font-medium text-on-ink"
            >
              바로구매
            </button>
          </>
        ) : (
          <>
            <div className="flex-shrink-0">
              <p className="text-[11px] text-meta">세트가</p>
              <p className="text-[17px] font-bold leading-[1.1] text-ink">{won(price)}</p>
            </div>
            <button
              onClick={add}
              className="h-[52px] flex-1 rounded-cta bg-ink text-[16px] font-medium text-on-ink"
            >
              세트 담기
            </button>
          </>
        )}
      </div>
    </>
  );
}
