"use client";

import Link from "next/link";
import { productOf, type ActiveKey, type Product } from "@/data/catalog";
import { activeInfo } from "@/data/actives";
import { findInteractions } from "@/data/interactions";
import { useOnShelf, useShelfEntries, toggleShelfProduct } from "@/lib/shelf";
import Icon from "./Icon";

/**
 * 이 상품과 **내 화장대**가 부딪히는지 — 상품 상세에서.
 *
 * 장바구니에서 알려주는 것과 다른 자리다. 장바구니는 이미 담기로 결정한 다음이고,
 * **여기는 결정하기 전**이다. 사기 전에 아는 것과 사고 나서 아는 것은 값이 다르다.
 *
 * "사지 마세요"라고 하지 않는다. 나눠 쓰면 되는 일이고, 못 사게 만드는 안내는
 * 사용자에게도 브랜드에게도 손해다.
 */
export default function ShelfConflict({ productId }: { productId: string }) {
  const shelf = useShelfEntries();
  const onShelf = useOnShelf(productId);
  const p = productOf(productId) as Product | undefined;
  if (!p) return null;

  const mine = p.actives?.map((a) => a.key) ?? [];

  // 이 상품의 성분 × 화장대 성분에서만 걸리는 규칙 (화장대끼리의 조합은 여기 관심이 아니다)
  const shelfKeys = new Set(shelf.flatMap((e) => e.actives));
  const notes = findInteractions([...mine, ...Array.from(shelfKeys)])
    .filter((n) => n.kind !== "fine")
    .filter(
      (n) =>
        (mine.includes(n.pair[0]) && shelfKeys.has(n.pair[1])) ||
        (mine.includes(n.pair[1]) && shelfKeys.has(n.pair[0]))
    );

  // 화장대가 비어 있으면 등록을 권한다 — 성분이 있는 상품에서만 (권할 이유가 있을 때만)
  if (shelf.length === 0) {
    if (mine.length === 0) return null;
    return (
      <section className="border-b border-hairline px-4 py-4">
        <Link href="/shelf" className="press-card flex items-center gap-[9px]">
          <span className="text-ink">
            <Icon name="info" size={17} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[16px] font-medium text-ink">
              쓰고 있는 걸 등록해 두셨어요?
            </span>
            <span className="mt-[2px] block text-[15px] leading-[1.5] text-meta">
              이 제품과 같이 써도 되는지 알려드려요.
            </span>
          </span>
          <span className="text-disabled">
            <Icon name="chevron-right" size={17} />
          </span>
        </Link>
      </section>
    );
  }

  if (notes.length === 0) {
    return (
      <section className="border-b border-hairline px-4 py-4">
        <p className="flex items-center gap-[6px] text-[16px] text-body">
          <span className="text-ink">
            <Icon name="check" size={15} />
          </span>
          화장대에 있는 것들과 부딪히는 게 없어요.
        </p>
        <ShelfToggle productId={productId} on={onShelf} />
      </section>
    );
  }

  return (
    <section className="border-b border-hairline px-4 py-4">
      <h3 className="text-[17px] font-bold text-ink">화장대에 있는 것과 함께 쓸 때</h3>
      <div className="mt-[10px] space-y-2">
        {notes.map((n) => {
          // 화장대 쪽 성분이 어느 물건인지 — 사용자가 자기 물건을 뒤지지 않게
          const theirs = n.pair.filter((k) => !mine.includes(k));
          const from = shelf.filter((e) => theirs.some((k) => e.actives.includes(k)));
          return (
            <div key={n.title} className="rounded border border-line-strong px-3 py-[11px]">
              <div className="flex items-center gap-[6px]">
                <span className="text-ink">
                  <Icon name="info" size={14} />
                </span>
                <span className="text-[15px] font-medium text-meta">
                  {n.kind === "caution" ? "나눠 쓰기" : "같이 챙기기"}
                </span>
              </div>
              <p className="mt-[5px] text-[17px] font-medium leading-[1.45] text-ink">
                {n.title}
              </p>
              <p className="mt-[4px] text-[16px] leading-[1.6] text-body">{n.why}</p>
              <p className="mt-[6px] text-[16px] leading-[1.6] text-ink">{n.how}</p>
              {from.length > 0 && (
                <p className="mt-[9px] border-t border-hairline pt-[8px] text-[15px] leading-[1.6] text-meta">
                  <b className="font-medium text-body">
                    {theirs.map((k) => activeInfo[k]?.name ?? k).join(" · ")}
                  </b>{" "}
                  {from.map((e) => e.name).join(", ")} (쓰고 계신 것)
                </p>
              )}
            </div>
          );
        })}
      </div>
      <ShelfToggle productId={productId} on={onShelf} />
    </section>
  );
}

/** 이 제품도 이미 쓰고 있다면 — 상세에서 바로 화장대에 넣게 한다 */
function ShelfToggle({ productId, on }: { productId: string; on: boolean }) {
  return (
    <button
      onClick={() => toggleShelfProduct(productId)}
      className="press mt-3 flex h-11 w-full items-center justify-center gap-[6px] rounded border border-line text-[16px] font-medium text-body"
    >
      <span className={on ? "text-ink" : "text-disabled"}>
        <Icon name={on ? "check" : "plus"} size={15} />
      </span>
      {on ? "화장대에 있어요" : "이건 이미 쓰고 있어요"}
    </button>
  );
}
