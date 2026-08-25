import Link from "next/link";
import Icon from "./Icon";

/**
 * 「아직 없는 기능」 화면.
 *
 * 결제 동선을 닫으면서(2026-08-25) `/cart`·`/checkout`·`/gift`가 갈 곳 없는 화면이 됐다.
 * UI에서 링크는 전부 뺐지만 **주소로는 열린다** — 정적 export라 페이지가 그대로 있고,
 * 브라우저 기록·공유 링크·크롤러가 닿는다.
 *
 * 그 화면들이 「로그인하고 주문해 주세요」라고 말하고 있었다. 우리는 주문을 받지 않는다.
 * 없는 기능을 준비 중이라고 말하는 건 괜찮지만, **있는 것처럼 말하면 안 된다.**
 */
export default function NotYet({ what, why }: { what: string; why: string }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
      <span className="text-disabled">
        <Icon name="bag" size={44} />
      </span>
      <p className="mt-4 text-[19px] font-bold text-ink">{what}</p>
      <p className="mt-[10px] text-[17px] leading-[1.7] text-body">{why}</p>
      <Link
        href="/"
        className="press mt-7 flex h-12 items-center justify-center rounded-cta bg-ink px-7 text-[17px] font-medium text-on-ink"
      >
        둘러보러 가기
      </Link>
    </main>
  );
}
