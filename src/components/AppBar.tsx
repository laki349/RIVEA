"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "./Icon";
import CartLink from "./CartLink";
import ShareButton from "./ShareButton";

/**
 * 앱바 — 뒤로/제목/우측 액션(공유·검색·장바구니)
 *
 * 좌우 폭을 같게 잡아 제목을 가운데 두는 구조라, 아이콘이 하나 늘면
 * 양쪽 폭도 같이 늘려야 제목이 밀리지 않는다.
 */
export default function AppBar({
  title,
  back = true,
  search = true,
  bold = false,
  share,
}: {
  title?: React.ReactNode;
  back?: boolean;
  search?: boolean;
  bold?: boolean;
  /** 있으면 공유 버튼을 띄운다 (상품·루틴 상세) */
  share?: { title: string; text?: string };
}) {
  const router = useRouter();
  const side = share ? "w-[108px]" : "w-[72px]";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-surface px-[10px] py-[9px]">
      <div className={`flex ${side} items-center`}>
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
      <h1 className={`text-[17px] text-ink ${bold ? "font-bold" : "font-medium"}`}>{title}</h1>
      <div className={`flex ${side} items-center justify-end`}>
        {share && <ShareButton title={share.title} text={share.text} />}
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
