import Link from "next/link";
import AppBar from "@/components/AppBar";
import Icon from "@/components/Icon";

/**
 * 장바구니 — 아직 담은 상품 없음(설계된 빈 상태).
 * 담기 기능 붙으면 브랜드별 배송 그룹 목록으로 교체.
 */
export default function CartPage() {
  return (
    <>
      <AppBar title="장바구니" bold search={false} />
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-24">
        <span className="text-disabled">
          <Icon name="bag" size={44} />
        </span>
        <p className="mt-4 text-[16px] font-bold text-ink">아직 담은 상품이 없어요</p>
        <p className="mt-2 text-center text-[14px] leading-[1.6] text-meta">
          고민에 맞는 루틴부터 둘러보실래요?
        </p>
        <Link
          href="/pick"
          className="mt-6 flex h-12 items-center justify-center rounded-cta bg-ink px-7 text-[15px] font-medium text-on-ink"
        >
          리베아&apos;s Pick 보러가기
        </Link>
      </main>
    </>
  );
}
