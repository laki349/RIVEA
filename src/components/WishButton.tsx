"use client";

import { toggleWish, useIsWished } from "@/lib/wish";
import { won } from "@/data/catalog";
import Icon from "./Icon";

/**
 * 찜 하트 버튼 — 세 자리에서 쓰인다.
 * overlay: 카드 이미지 위 (흰 하트, Link 안이므로 네비게이션을 막는다)
 * bar: 상세 하단 BuyBar (찜 수 표시)
 * row: 흰 배경 목록 행 (찜 목록 등)
 */
export default function WishButton({
  kind,
  id,
  variant,
  baseLikes = 0,
}: {
  kind: "product" | "routine";
  id: string;
  variant: "overlay" | "bar" | "row";
  baseLikes?: number;
}) {
  const wished = useIsWished(kind, id);

  const onClick = (e: React.MouseEvent) => {
    // 카드 오버레이는 <Link> 내부에 있어서 클릭이 이동으로 새지 않게 막는다.
    e.preventDefault();
    e.stopPropagation();
    toggleWish(kind, id);
  };

  const label = wished ? "찜 해제" : "찜";

  if (variant === "overlay") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-pressed={wished}
        className={`absolute bottom-2 right-2 flex h-11 w-11 items-end justify-end ${
          wished ? "text-rose" : "text-white"
        }`}
      >
        <Icon name={wished ? "heart-fill" : "heart"} size={19} />
      </button>
    );
  }

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-pressed={wished}
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center ${
          wished ? "text-rose" : "text-disabled"
        }`}
      >
        <Icon name={wished ? "heart-fill" : "heart"} size={20} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={wished}
      className="flex flex-col items-center text-rose"
    >
      <Icon name={wished ? "heart-fill" : "heart"} size={23} />
      <span className="mt-[2px] text-[11px] font-medium">
        {won(baseLikes + (wished ? 1 : 0))}
      </span>
    </button>
  );
}
