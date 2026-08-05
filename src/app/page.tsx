import Link from "next/link";
import { brands, products } from "@/data/catalog";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import TabBar from "@/components/TabBar";
import SectionHeader from "@/components/SectionHeader";
import ProductCard from "@/components/ProductCard";
import ConcernRail from "@/components/ConcernRail";
import HeroCarousel from "@/components/HeroCarousel";
import PickRail from "@/components/PickRail";
import CohortSection from "@/components/CohortSection";
import CartLink from "@/components/CartLink";

export default function HomePage() {
  const best = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);
  const fresh = products.filter((p) => p.badges.includes("NEW"));

  return (
    <>
      {/* 앱바 */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-surface px-4 py-[13px]">
        <Link
          href="/"
          className="flex h-11 items-center text-[20px] font-bold tracking-[0.05em] text-rose"
        >
          RIVEA
        </Link>
        <div className="flex items-center gap-[14px] text-ink">
          {/* 텍스트 라벨 — 아이콘 단독은 40대+ 판별이 어렵고, 유틸리티(검색·장바구니)와 종류가 다름을 드러낸다 */}
          <Link
            href="/magazine"
            className="flex h-11 items-center text-[14px] font-medium text-ink"
          >
            매거진
          </Link>
          <Link href="/search" aria-label="검색" className="flex h-11 w-11 items-center justify-center">
            <Icon name="search" size={21} />
          </Link>
          <CartLink />
        </div>
      </header>

      <main className="flex-1">
        {/* 고민으로 찾기 — 차별화 진입. 내 고민이 앞으로 온다 (lib/profile.ts) */}
        <ConcernRail />

        {/* 히어로 배너 — 자동 전환·스와이프·일시정지 (components/HeroCarousel) */}
        <HeroCarousel />

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
          <PickRail />
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

        {/* 데모 고지 — 실제 판매로 오인하지 않도록 */}
        <section className="border-t border-hairline px-4 py-4">
          <p className="text-[13px] leading-[1.6] text-meta">
            리베아는 준비 중인 서비스예요. 이 화면은 발표용 데모이고 실제 판매·결제는 이뤄지지
            않아요. 리뷰·평점·조회수는 예시 수치입니다.
          </p>
        </section>
      </main>

      <TabBar />
    </>
  );
}
