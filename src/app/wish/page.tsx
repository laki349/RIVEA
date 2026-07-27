import Link from "next/link";
import Icon from "@/components/Icon";
import TabBar from "@/components/TabBar";

/**
 * 찜 — 설계된 빈 상태. 찜 기능 붙으면 상품 그리드로 교체.
 */
export default function WishPage() {
  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-surface px-4 py-[13px]">
        <h1 className="text-[17px] font-bold text-ink">찜</h1>
        <Link href="/cart" aria-label="장바구니" className="flex h-11 w-8 items-center justify-center text-ink">
          <Icon name="bag" size={21} />
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <span className="text-rose">
          <Icon name="heart" size={44} />
        </span>
        <p className="mt-4 text-[16px] font-bold text-ink">찜한 상품이 없어요</p>
        <p className="mt-2 text-center text-[14px] leading-[1.6] text-meta">
          마음에 드는 상품의 하트를 눌러 모아두세요.
        </p>
        <Link
          href="/"
          className="mt-6 flex h-12 items-center justify-center rounded-cta border border-ink px-7 text-[15px] font-medium text-ink"
        >
          홈에서 둘러보기
        </Link>
      </main>
      <TabBar />
    </>
  );
}
