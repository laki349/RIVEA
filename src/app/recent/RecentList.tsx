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
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import ProductCard from "@/components/ProductCard";
import WishButton from "@/components/WishButton";
import { clearRecent, useRecent } from "@/lib/recent";

/**
 * 최근 본 상품 — localStorage 기반이라 클라이언트에서 렌더한다. (WishList와 같은 구조)
 *
 * 찜과 달리 **본 순서를 지킨다.** 찜은 모아둔 것이고 여기는 지나온 것이라,
 * 순서가 곧 "어디까지 봤는지"다. 그래서 상품·루틴을 종류별로 묶지 않고
 * 하나의 시간순 목록으로 둔다.
 */
export default function RecentList() {
  const items = useRecent();

  if (items.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-24">
        <span className="text-disabled">
          <Icon name="eye" size={44} />
        </span>
        <p className="mt-4 text-[18px] font-bold text-ink">최근 본 상품이 없어요</p>
        <p className="mt-2 text-center text-[17px] leading-[1.6] text-meta">
          둘러본 상품이 여기에 순서대로 쌓여요.
        </p>
        <Link
          href="/"
          className="press mt-6 flex h-12 items-center justify-center rounded-cta border border-ink px-7 text-[17px] font-medium text-ink"
        >
          홈에서 둘러보기
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="flex items-center justify-between px-4 pb-1 pt-4">
        <p className="text-[17px] font-bold text-ink">최근 본 순서예요</p>
        <button onClick={clearRecent} className="press py-1 pl-3 text-[16px] text-meta">
          전체 삭제
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-[11px] gap-y-2 px-4 pb-5 pt-2">
        {items.map((i) =>
          i.kind === "product" ? (
            <ProductCard key={`p-${i.id}`} product={productOf(i.id)} />
          ) : (
            <RoutineTile key={`r-${i.id}`} id={i.id} />
          )
        )}
      </div>
    </main>
  );
}

/**
 * 루틴 타일 — 상품 카드와 같은 그리드 칸에 들어가야 해서 RoutineCard(가로 200px 고정)를
 * 쓰지 못한다. 카드 폭에 맞춘 형태로 따로 그린다.
 */
function RoutineTile({ id }: { id: string }) {
  const r = routines.find((x) => x.id === id);
  if (!r) return null;
  const rate = discountRate({ price: r.price, listPrice: routineListPrice(r) });

  return (
    <div className="relative">
      <Link href={`/routine/${r.id}`} className="press-card block">
        <div className="relative">
          <ImageSlot
            className="h-[150px] w-full rounded"
            tone="warm"
            src={routineImage(r.id)}
            alt={r.title}
          />
          <span className="absolute left-2 top-2 rounded bg-ink px-[7px] py-[3px] text-[14px] font-medium text-on-ink">
            {r.badge}
          </span>
        </div>
        <p className="mt-[7px] text-[14px] font-bold text-rose">{r.label}</p>
        <p className="mt-[2px] line-clamp-2 text-[16px] font-medium leading-[1.35] text-ink">
          {r.title}
        </p>
        <div className="mt-1 flex items-baseline gap-[5px]">
          {rate !== null && rate > 0 && <span className="text-[16px] font-bold text-rose">{rate}%</span>}
          <span className="text-[17px] font-bold text-ink">{won(r.price)}</span>
        </div>
      </Link>
      <div className="absolute bottom-[76px] right-1">
        <WishButton kind="routine" id={r.id} variant="overlay" />
      </div>
    </div>
  );
}
