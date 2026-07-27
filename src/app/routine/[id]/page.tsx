import Link from "next/link";
import { notFound } from "next/navigation";
import {
  brandOf,
  discountRate,
  productOf,
  routineListPrice,
  routines,
  won,
} from "@/data/catalog";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import AppBar from "@/components/AppBar";

export function generateStaticParams() {
  return routines.map((r) => ({ id: r.id }));
}

export default function RoutineDetailPage({ params }: { params: { id: string } }) {
  const routine = routines.find((r) => r.id === params.id);
  if (!routine) notFound();

  const listPrice = routineListPrice(routine);
  const rate = discountRate({ price: routine.price, listPrice });
  const savings = listPrice - routine.price;

  return (
    <>
      <AppBar title={`${routine.label} 루틴`} />

      <main className="flex-1">
        {/* 갤러리 */}
        <section className="relative border-b border-hairline">
          <ImageSlot className="h-[280px] w-full" tone="warm" label="구성 세트 이미지" />
          <span className="absolute bottom-[10px] right-3 rounded bg-[rgba(28,24,21,0.55)] px-[9px] py-[3px] text-[12px] text-white">
            1 / {routine.steps.length + 1}
          </span>
        </section>

        {/* 기본 정보 */}
        <section className="border-b border-hairline px-4 py-4">
          <p className="text-[12px] font-bold text-rose">리베아&apos;s PICK · {routine.label}</p>
          <h2 className="mb-[10px] mt-[5px] text-[18px] font-bold leading-[1.4] text-ink">
            {routine.title}
          </h2>
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] text-disabled line-through">{won(listPrice)}</span>
            {rate !== null && <span className="text-[18px] font-bold text-rose">{rate}%</span>}
            <span className="text-[23px] font-bold text-ink">{won(routine.price)}</span>
          </div>
          <span className="mt-[9px] inline-block rounded bg-subtle px-[9px] py-[5px] text-[12px] font-medium text-ink">
            따로 사면 {won(savings)}원 더 비싸요
          </span>
        </section>

        {/* 사용 순서 — 주인공 */}
        <section className="border-b border-hairline px-4 py-4">
          <h3 className="mb-[14px] text-[16px] font-bold text-ink">사용 순서</h3>
          {routine.steps.map((s, i) => {
            const p = productOf(s.productId);
            return (
              <div key={s.productId} className={`flex gap-3 ${i < routine.steps.length - 1 ? "mb-4" : ""}`}>
                <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded bg-ink text-[13px] font-bold text-on-ink">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[14px] font-bold text-ink">{p.name}</p>
                  <p className="mt-[2px] text-[13px] leading-[1.55] text-soft">{s.how}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* 구성품 */}
        <section className="border-b border-hairline px-4 py-4">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="text-[16px] font-bold text-ink">구성품 {routine.steps.length}</h3>
            <span className="text-[12px] text-meta">개별 구매도 가능</span>
          </div>
          {routine.steps.map((s, i) => {
            const p = productOf(s.productId);
            return (
              <Link
                key={s.productId}
                href={`/product/${p.id}`}
                className={`flex items-center gap-[11px] ${
                  i < routine.steps.length - 1 ? "mb-3 border-b border-subtle pb-3" : ""
                }`}
              >
                <ImageSlot className="h-[52px] w-[52px] flex-shrink-0 rounded" />
                <div className="flex-1">
                  <p className="text-[12px] text-meta">{brandOf(p.brand).name}</p>
                  <p className="text-[13px] text-ink">{p.name}</p>
                </div>
                <span className="text-[13px] font-bold text-ink">{won(p.price)}</span>
              </Link>
            );
          })}
        </section>

        {/* 리뷰 자리 (세트 리뷰는 추후) */}
        <section className="px-4 py-4">
          <p className="text-[13px] leading-[1.6] text-meta">
            구성품 리뷰 {won(routine.steps.reduce((s, st) => s + productOf(st.productId).reviewCount, 0))}
            건이 이 세트를 뒷받침해요. 개별 상품에서 확인해 보세요.
          </p>
        </section>
      </main>

      {/* 하단 CTA — 찜 + 세트가 + 세트 담기 */}
      <div className="sticky bottom-0 z-40 flex items-center gap-[14px] border-t border-line bg-surface px-4 pb-[max(11px,env(safe-area-inset-bottom))] pt-[11px]">
        <button className="flex flex-col items-center text-rose" aria-label="찜">
          <Icon name="heart" size={23} />
          <span className="mt-[2px] text-[11px] font-medium">
            {won(Object.values(routine.cohortAdds).reduce((a, b) => a + b, 0))}
          </span>
        </button>
        <div className="flex-shrink-0">
          <p className="text-[11px] text-meta">세트가</p>
          <p className="text-[17px] font-bold leading-[1.1] text-ink">{won(routine.price)}</p>
        </div>
        <Link
          href="/cart"
          className="flex h-[52px] flex-1 items-center justify-center rounded-cta bg-ink text-[16px] font-medium text-on-ink"
        >
          세트 담기
        </Link>
      </div>
    </>
  );
}
