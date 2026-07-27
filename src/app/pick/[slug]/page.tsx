import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { picks, pickBySlug, pickItemProduct } from "@/data/picks";
import { brandById, formatKRW } from "@/data/catalog";
import ImageSlot from "@/components/ImageSlot";
import { BuyLink, ShareButton } from "@/components/PickActions";
import { CheckIcon, ChevronRight } from "@/components/Icons";

export function generateStaticParams() {
  return picks.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const p = pickBySlug(params.slug);
  return { title: p ? `${p.title} — 리베아` : "리베아 Pick" };
}

export default function PickPage({ params }: { params: { slug: string } }) {
  const pick = pickBySlug(params.slug);
  if (!pick) notFound();

  const total = pick.items.reduce((sum, it) => {
    const p = pickItemProduct(it);
    return sum + (p?.price ?? 0);
  }, 0);

  return (
    <div className="shell max-w-3xl py-6 sm:py-10">
      {/* 1. 헤더 */}
      <header>
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-gold-soft bg-white/70 px-3 py-1 text-[12px] font-semibold tracking-wide text-gold">
          리베아 Pick · #{pick.concern}
        </p>
        <h1 className="font-serif text-[1.9rem] font-bold leading-tight text-espresso sm:text-4xl">
          {pick.title}
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-taupe">
          {pick.promise}
        </p>
      </header>

      {/* 2. 왜 이 고민인가 */}
      <section className="mt-10 rounded-2xl border border-line bg-cream/50 p-6">
        <h2 className="text-lg font-semibold text-espresso">왜 이 고민인가</h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-taupe">
          {pick.diagnosis}
        </p>
      </section>

      {/* 3. 고른 기준 (중립성) */}
      <section className="mt-4 rounded-2xl border border-gold-soft/60 bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-espresso">
          <CheckIcon className="h-5 w-5 text-gold" />이 조합을 고른 기준
        </h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-taupe">
          {pick.criteria}
        </p>
      </section>

      {/* 4. The Pick — 브랜드 교차 조합 */}
      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gold">
              The Pick
            </p>
            <h2 className="text-2xl font-semibold text-espresso">
              기기 + 화장품 {pick.items.length}종 조합
            </h2>
          </div>
          <span className="text-[13px] text-stone">브랜드 교차 큐레이션</span>
        </div>

        <ol className="space-y-4">
          {pick.items.map((item, i) => {
            const product = pickItemProduct(item);
            const brand = product ? brandById(product.brandId) : undefined;
            return (
              <li
                key={item.productId}
                className="flex gap-4 rounded-2xl border border-line bg-white p-4 shadow-soft sm:p-5"
              >
                <div className="relative w-24 shrink-0 sm:w-28">
                  <span className="absolute -left-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-cocoa text-[12px] font-bold text-ivory">
                    {i + 1}
                  </span>
                  <ImageSlot
                    src={product?.image}
                    alt={product?.name}
                    ratio="aspect-square"
                    label=""
                    rounded="rounded-xl"
                    sizes="120px"
                    compact
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-medium text-taupe">
                    {item.role}
                  </span>
                  <p className="mt-1.5 text-[12px] font-semibold text-gold">
                    {brand?.name}
                  </p>
                  <h3 className="text-[15px] font-semibold leading-snug text-cocoa">
                    {product?.name}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-taupe">
                    {item.why}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-[15px] font-bold text-espresso tabular-nums">
                      {product ? formatKRW(product.price) : ""}
                    </span>
                    <BuyLink
                      href={item.buyUrl}
                      label={item.buyLabel}
                      pick={pick.slug}
                      product={item.productId}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* 5. 루틴 순서 */}
      <section className="mt-12">
        <h2 className="mb-5 text-2xl font-semibold text-espresso">
          어떻게 같이 쓰나, 하루 루틴
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {pick.routine.map((r) => (
            <div
              key={r.when}
              className="rounded-2xl border border-line bg-white p-5"
            >
              <p className="mb-3 inline-flex rounded-full bg-cocoa px-3 py-1 text-[12px] font-semibold text-ivory">
                {r.when}
              </p>
              <ol className="space-y-2.5">
                {r.steps.map((s, i) => (
                  <li key={i} className="flex gap-2.5 text-[14px] text-cocoa">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cream text-[11px] font-bold text-taupe">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* 6. 세트로 한 번에 */}
      <section className="mt-12 rounded-2xl bg-cocoa p-6 text-ivory sm:p-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gold-soft">
          리베아 Pick 세트
        </p>
        <h2 className="mt-1 font-serif text-2xl font-semibold text-ivory">
          이 {pick.items.length}종, 한 번에 시작하기
        </h2>
        <p className="mt-2 text-[14px] text-champagne">
          아래에서 각 제품을 판매처로 바로 이동해 담을 수 있어요. 예상 합계{" "}
          <span className="font-bold text-ivory tabular-nums">
            {formatKRW(total)}
          </span>
        </p>
        <div className="mt-5 space-y-2">
          {pick.items.map((item) => {
            const product = pickItemProduct(item);
            return (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-3 rounded-xl bg-espresso/60 px-4 py-3"
              >
                <span className="min-w-0 truncate text-[14px] text-champagne">
                  {product?.name}
                </span>
                <BuyLink
                  href={item.buyUrl}
                  label="보기"
                  pick={pick.slug}
                  product={item.productId}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. 공유 + 다른 고민 */}
      <section className="mt-12 text-center">
        <h2 className="text-xl font-semibold text-espresso">
          도움이 됐다면, 주변에도
        </h2>
        <p className="mt-2 text-[14px] text-taupe">
          같은 고민을 가진 분에게 이 Pick을 보내주세요.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <ShareButton pick={pick.slug} title={pick.title} />
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full px-5 py-2.5 text-[14px] font-semibold text-taupe transition hover:text-cocoa"
          >
            내 고민은 다른데요
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mx-auto mt-10 max-w-md text-[12px] leading-relaxed text-stone">
          * 리베아는 브랜드로부터 대가를 받지 않고 역할별로 제품을 고릅니다. 구매는
          각 판매처에서 이루어지며, 현재는 검증용 프로토타입입니다.
        </p>
      </section>
    </div>
  );
}
