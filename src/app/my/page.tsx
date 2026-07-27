import Link from "next/link";
import ImageSlot from "@/components/ImageSlot";
import { HeartIcon, BagIcon, TruckIcon, ShieldIcon, ChevronRight } from "@/components/Icons";

const menu = [
  { label: "주문 · 배송 조회", Icon: TruckIcon },
  { label: "찜한 상품", Icon: HeartIcon },
  { label: "장바구니", Icon: BagIcon },
  { label: "정품 보장 · 반품 안내", Icon: ShieldIcon },
];

export default function MyPage() {
  return (
    <div className="shell py-8">
      <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft">
        <ImageSlot label="" rounded="rounded-full" className="h-16 w-16 shrink-0" compact />
        <div>
          <p className="font-serif text-lg font-semibold text-espresso">
            반가워요, 게스트님
          </p>
          <p className="text-sm text-taupe">로그인하고 적립 혜택을 받아보세요</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { n: "0", l: "적립금" },
          { n: "2", l: "장바구니" },
          { n: "0", l: "찜" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-line bg-cream/50 py-5 text-center">
            <p className="text-xl font-bold text-espresso tabular-nums">{s.n}</p>
            <p className="mt-0.5 text-[12.5px] text-taupe">{s.l}</p>
          </div>
        ))}
      </div>

      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {menu.map(({ label, Icon }) => (
          <li key={label}>
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-cream/50"
            >
              <Icon className="h-5 w-5 text-gold" />
              <span className="flex-1 text-[14.5px] text-cocoa">{label}</span>
              <ChevronRight className="h-4 w-4 text-stone" />
            </button>
          </li>
        ))}
      </ul>

      <Link
        href="/"
        className="mt-8 block text-center text-sm text-stone underline-offset-4 hover:underline"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
