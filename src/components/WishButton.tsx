"use client";

import { useEffect, useRef, useState } from "react";
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

  /**
   * 찜 상태는 한 프레임에 바뀐다 — 하트가 톡 튀지 않으면 탭이 먹었는지 알 수 없다.
   * 오버레이 하트는 카드 구석 19px이라 특히 놓치기 쉽다.
   *
   * 켤 때만 튄다(끌 때는 조용히). 그리고 **첫 렌더에서는 튀지 않는다** —
   * 이미 찜한 상품 목록을 열 때 하트 열 개가 동시에 튀면 그건 피드백이 아니라 소음이다.
   */
  const [popping, setPopping] = useState(false);
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!wished) return;
    setPopping(true);
    const t = setTimeout(() => setPopping(false), 260);
    return () => clearTimeout(t);
  }, [wished]);

  const popClass = popping ? "animate-pop" : "";

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
        <span className={popClass}>
          <Icon name={wished ? "heart-fill" : "heart"} size={19} />
        </span>
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
        <span className={popClass}>
          <Icon name={wished ? "heart-fill" : "heart"} size={20} />
        </span>
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
      <span className={popClass}>
        <Icon name={wished ? "heart-fill" : "heart"} size={23} />
      </span>
      <span className="mt-[2px] text-[14px] font-medium">
        {won(baseLikes + (wished ? 1 : 0))}
      </span>
    </button>
  );
}
