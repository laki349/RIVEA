import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  brandOf,
  discountRate,
  productImage,
  productOf,
  routineImage,
  routineListPrice,
  routines,
  won,
} from "@/data/catalog";
import ImageSlot from "@/components/ImageSlot";
import AppBar from "@/components/AppBar";
import BuyBar from "@/components/BuyBar";
import TrackRecent from "@/components/TrackRecent";
import ArticleLink from "@/components/ArticleLink";
import { articlesForConcern } from "@/data/magazine";

export function generateStaticParams() {
  return routines.map((r) => ({ id: r.id }));
}

/**
 * 공유용 메타데이터. 루틴은 이 앱의 차별화 상품이라 **절감액을 제목에 넣는다** —
 * 카드만 보고도 단품 합계보다 싸다는 게 읽혀야 공유가 눌린다.
 */
export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const r = routines.find((x) => x.id === params.id);
  if (!r) return {};
  const rate = discountRate({ price: r.price, listPrice: routineListPrice(r) });

  const title = `[${r.badge}] ${r.title}`;
  const description = `${r.description} ${rate ? `${rate}% 절감 ` : ""}${won(r.price)}원 · 리베아`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/routine/${r.id}`,
      images: [{ url: `/images/routine/${r.image}`, alt: r.title }],
    },
  };
}

export default function RoutineDetailPage({ params }: { params: { id: string } }) {
  const routine = routines.find((r) => r.id === params.id);
  if (!routine) notFound();

  const listPrice = routineListPrice(routine);
  const rate = discountRate({ price: routine.price, listPrice });
  const savings = listPrice - routine.price;
  // 이 루틴이 다루는 고민의 기사 중 첫 편
  const routineArticle = articlesForConcern(routine.concern)[0];

  return (
    <>
      {/* 최근 본 상품으로 기록 (렌더 없음) */}
      <TrackRecent kind="routine" id={routine.id} />
      <AppBar
        title={`${routine.label} 루틴`}
        share={{ title: routine.title, text: `${routine.badge} · ${won(routine.price)}원` }}
      />

      <main className="flex-1">
        {/* 갤러리 */}
        <section className="relative border-b border-hairline">
          <ImageSlot
            className="h-[280px] w-full"
            tone="warm"
            src={routineImage(routine.id)}
            alt={routine.title}
          />
          <span className="absolute bottom-[10px] right-3 rounded bg-[rgba(28,24,21,0.55)] px-[9px] py-[3px] text-[14px] text-white">
            1 / {routine.steps.length + 1}
          </span>
        </section>

        {/* 기본 정보 */}
        <section className="border-b border-hairline px-4 py-4">
          <p className="text-[14px] font-bold text-rose">리베아&apos;s PICK · {routine.label}</p>
          <h2 className="mb-[10px] mt-[5px] text-[20px] font-bold leading-[1.4] text-ink">
            {routine.title}
          </h2>
          <div className="flex items-baseline gap-2">
            {savings > 0 && (
              <span className="text-[17px] text-disabled line-through">{won(listPrice)}</span>
            )}
            {rate !== null && rate > 0 && <span className="text-[20px] font-bold text-rose">{rate}%</span>}
            <span className="text-[25px] font-bold text-ink">{won(routine.price)}</span>
          </div>
          {savings > 0 && (
            <span className="mt-[9px] inline-block rounded bg-subtle px-[9px] py-[5px] text-[14px] font-medium text-ink">
              따로 사면 {won(savings)}원 더 비싸요
            </span>
          )}
        </section>

        {/* 왜 이 조합인가요 — 신뢰 근거 */}
        <section className="border-b border-hairline px-4 py-4">
          <h3 className="mb-[10px] text-[18px] font-bold text-ink">왜 이 조합인가요</h3>
          <p className="text-[16px] leading-[1.65] text-soft">{routine.why}</p>

          {/* 위 3문장의 근거 전문 */}
          {routineArticle && (
            <div className="mt-4">
              <ArticleLink article={routineArticle} heading="이 조합의 근거" />
            </div>
          )}
        </section>

        {/* 사용 순서 — 주인공 */}
        <section className="border-b border-hairline px-4 py-4">
          <h3 className="mb-[14px] text-[18px] font-bold text-ink">사용 순서</h3>
          {routine.steps.map((s, i) => {
            const p = productOf(s.productId);
            return (
              <div key={s.productId} className={`flex gap-3 ${i < routine.steps.length - 1 ? "mb-4" : ""}`}>
                <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded bg-ink text-[15px] font-bold text-on-ink">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[16px] font-bold text-ink">{p.name}</p>
                  <p className="mt-[2px] text-[15px] leading-[1.55] text-soft">{s.how}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* 구성품 */}
        <section className="border-b border-hairline px-4 py-4">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="text-[18px] font-bold text-ink">구성품 {routine.steps.length}</h3>
            <span className="text-[14px] text-meta">개별 구매도 가능</span>
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
                <ImageSlot
                  className="h-[52px] w-[52px] flex-shrink-0 rounded"
                  src={productImage(p.id)}
                  alt={p.name}
                />
                <div className="flex-1">
                  <p className="text-[14px] text-meta">{brandOf(p.brand).name}</p>
                  <p className="text-[15px] text-ink">{p.name}</p>
                </div>
                <span className="text-[15px] font-bold text-ink">{won(p.price)}</span>
              </Link>
            );
          })}
        </section>

        {/* 세트를 뒷받침하는 건 리뷰수가 아니라 조합의 이유다 — 위 「왜 이 조합인가요」 */}
      </main>

      {/* 하단 CTA — 세트 담기 실동작 */}
      <BuyBar
        kind="routine"
        id={routine.id}
        price={routine.price}
      />
    </>
  );
}
