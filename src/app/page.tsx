import Link from "next/link";
import { brands, concernImage, concerns, heroImages, products, routines } from "@/data/catalog";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import TabBar from "@/components/TabBar";
import SectionHeader from "@/components/SectionHeader";
import ProductCard from "@/components/ProductCard";
import RoutineCard from "@/components/RoutineCard";
import CohortSection from "@/components/CohortSection";
import CartLink from "@/components/CartLink";

export default function HomePage() {
  const best = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);
  const fresh = products.filter((p) => p.badges.includes("NEW"));

  return (
    <>
      {/* 앱바 */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-surface px-4 py-[13px]">
        <Link href="/" className="text-[20px] font-bold tracking-[0.05em] text-rose">
          RIVEA
        </Link>
        <div className="flex items-center gap-4 text-ink">
          <Link href="/search" aria-label="검색" className="flex h-11 w-8 items-center justify-center">
            <Icon name="search" size={21} />
          </Link>
          <CartLink />
        </div>
      </header>

      <main className="flex-1">
        {/* 고민으로 찾기 — 차별화 진입 */}
        <section className="border-b border-hairline pb-[14px] pt-[13px]">
          <h2 className="px-4 pb-[11px] text-[13px] font-bold text-ink">고민으로 찾기</h2>
          <div className="rail flex gap-[14px] px-4">
            {concerns.map((c) => (
              <Link key={c.slug} href={`/concern/${c.slug}`} className="w-[56px] flex-shrink-0 text-center">
                <ImageSlot
                  className="h-[56px] w-[56px] rounded"
                  src={concernImage(c.slug)}
                  alt={c.name}
                />
                <p className="mt-[6px] whitespace-nowrap text-[12px] text-ink">{c.name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 히어로 — 추천 제품 (풀블리드, 선으로만 구분) */}
        <section className="relative border-b border-hairline">
          <ImageSlot
            className="h-[280px] w-full"
            tone="warm"
            src={heroImages[0]}
            alt="가을, 무너진 탄력을 되돌리는 셀렉션"
            position="center 30%"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(28,24,21,0.74)] to-transparent px-4 pb-4 pt-10">
            <p className="text-[22px] font-bold leading-[1.3] text-white">
              가을, 무너진 탄력을
              <br />
              되돌리는 셀렉션
            </p>
            <p className="mt-[6px] text-[13px] text-[#EDE7DF]">에디터 추천 24 · 최대 30% 쿠폰</p>
          </div>
          <span className="absolute right-3 top-3 rounded bg-[rgba(28,24,21,0.55)] px-[9px] py-[3px] text-[12px] text-white">
            3 / 12
          </span>
        </section>

        {/* 리베아's Pick — 루틴 섹션 */}
        <section className="border-b border-hairline">
          <SectionHeader
            title={
              <>
                리베아&apos;s <span className="text-rose">Pick</span>
              </>
            }
            href="/pick"
          />
          <div className="rail flex gap-[11px] pb-4 pl-4 pr-4">
            {routines.map((r) => (
              <RoutineCard key={r.id} routine={r} />
            ))}
          </div>
        </section>

        {/* 연령대 인기 — 사회적 증거 모듈 */}
        <CohortSection />

        {/* 베스트 */}
        <section>
          <SectionHeader title="베스트" href="/category" linkLabel="더보기" />
          <div className="grid grid-cols-2 gap-[3px]">
            {best.map((p, i) => (
              <div key={p.id} className={i % 2 === 0 ? "border-r-[3px] border-surface" : ""}>
                <ProductCard product={p} rank={i + 1} imageClassName="h-[168px]" />
              </div>
            ))}
          </div>
        </section>

        {/* 신상 */}
        <section className="border-t border-hairline">
          <SectionHeader title="신상" href="/category" linkLabel="더보기" />
          <div className="rail flex gap-[11px] pb-4 pl-4 pr-4">
            {fresh.map((p) => (
              <div key={p.id} className="w-[150px] flex-shrink-0">
                <ProductCard product={p} imageClassName="h-[150px] rounded" showRating={false} />
              </div>
            ))}
          </div>
        </section>

        {/* 브랜드 */}
        <section className="border-t border-hairline pb-5">
          <SectionHeader title="브랜드" href="/brands" />
          <div className="rail flex gap-[14px] px-4">
            {brands.map((b) => (
              <Link key={b.slug} href={`/brand/${b.slug}`} className="w-[64px] flex-shrink-0 text-center">
                <div className="flex h-[64px] w-[64px] items-center justify-center rounded border border-line bg-surface">
                  <span className="text-[15px] font-bold text-ink">{b.name.slice(0, 1)}</span>
                </div>
                <p className="mt-[6px] whitespace-nowrap text-[12px] text-ink">{b.name}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <TabBar />
    </>
  );
}
