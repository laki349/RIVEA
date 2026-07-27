"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "./Icon";
import CartLink from "./CartLink";

/**
 * 앱바 — 뒤로/제목/우측 액션(검색·장바구니)
 */
export default function AppBar({
  title,
  back = true,
  search = true,
  bold = false,
}: {
  title?: React.ReactNode;
  back?: boolean;
  search?: boolean;
  bold?: boolean;
}) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-surface px-[10px] py-[9px]">
      <div className="flex w-[72px] items-center">
        {back && (
          <button
            onClick={() => router.back()}
            aria-label="뒤로"
            className="flex h-11 w-11 items-center justify-center text-ink"
          >
            <Icon name="chevron-left" size={22} />
          </button>
        )}
      </div>
      <h1 className={`text-[15px] text-ink ${bold ? "font-bold" : "font-medium"}`}>{title}</h1>
      <div className="flex w-[72px] items-center justify-end">
        {search && (
          <Link href="/search" aria-label="검색" className="flex h-11 w-9 items-center justify-center text-ink">
            <Icon name="search" size={20} />
          </Link>
        )}
        <CartLink size={20} />
      </div>
    </header>
  );
}
