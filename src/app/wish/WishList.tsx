"use client";

import Link from "next/link";
import {
  discountRate,
  productOf,
  routineImage,
  routineListPrice,
  routines,
  won,
} from "@/data/catalog";
import ImageSlot from "@/components/ImageSlot";
import Icon from "@/components/Icon";
import ProductCard from "@/components/ProductCard";
import WishButton from "@/components/WishButton";
import { useWish } from "@/lib/wish";

/**
 * 찜 목록 — localStorage 기반이라 클라이언트에서 렌더한다.
 * 하트를 다시 누르면 목록에서 바로 빠진다(별도 삭제 버튼 없음).
 */
export default function WishList() {
  const items = useWish();

  const wishedProducts = items
    .filter((i) => i.kind === "product")
    .map((i) => productOf(i.id))
    .filter(Boolean);

  const wishedRoutines = items
    .filter((i) => i.kind === "routine")
    .map((i) => routines.find((r) => r.id === i.id))
    .filter((r): r is (typeof routines)[number] => Boolean(r));

  if (items.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <span className="text-rose">
          <Icon name="heart" size={44} />
        </span>
        <p className="mt-4 text-[18px] font-bold text-ink">찜한 상품이 없어요</p>
        <p className="mt-2 text-center text-[16px] leading-[1.6] text-meta">
          마음에 드는 상품의 하트를 눌러 모아두세요.
        </p>
        <Link
          href="/"
          className="mt-6 flex h-12 items-center justify-center rounded-cta border border-ink px-7 text-[17px] font-medium text-ink"
        >
          홈에서 둘러보기
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1">
      {wishedRoutines.length > 0 && (
        <section className="border-b border-hairline px-4 py-4">
          <h2 className="mb-3 text-[17px] font-bold text-ink">
            찜한 루틴 세트 {wishedRoutines.length}
          </h2>
          {wishedRoutines.map((r, i) => {
            const listPrice = routineListPrice(r);
            const rate = discountRate({ price: r.price, listPrice });
            return (
              <div
                key={r.id}
                className={`flex items-center gap-[11px] ${
                  i < wishedRoutines.length - 1 ? "mb-3 border-b border-subtle pb-3" : ""
                }`}
              >
                <Link
                  href={`/routine/${r.id}`}
                  className="flex min-w-0 flex-1 items-center gap-[11px]"
                >
                  <ImageSlot
                    className="h-[68px] w-[68px] flex-shrink-0 rounded"
                    tone="warm"
                    src={routineImage(r.id)}
                    alt={r.title}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-rose">{r.label}</p>
                    <p className="mt-[2px] truncate text-[15px] font-bold text-ink">{r.title}</p>
                    <div className="mt-1 flex items-baseline gap-[5px]">
                      {rate !== null && (
                        <span className="text-[15px] font-bold text-rose">{rate}%</span>
                      )}
                      <span className="text-[17px] font-bold text-ink">{won(r.price)}</span>
                    </div>
                  </div>
                </Link>
                <WishButton kind="routine" id={r.id} variant="row" />
              </div>
            );
          })}
        </section>
      )}

      {wishedProducts.length > 0 && (
        <section className="px-4 py-4">
          <h2 className="mb-3 text-[17px] font-bold text-ink">
            찜한 상품 {wishedProducts.length}
          </h2>
          <div className="grid grid-cols-2 gap-x-[11px] gap-y-2">
            {wishedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
