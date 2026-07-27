import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import CategoryGrid from "@/components/CategoryGrid";
import SectionHeader from "@/components/SectionHeader";
import { ProductRail } from "@/components/ProductCollections";
import BrandRail from "@/components/BrandRail";
import PromoBanner from "@/components/PromoBanner";
import ConcernFinder from "@/components/ConcernFinder";
import ReviewHighlight from "@/components/ReviewHighlight";
import { products } from "@/data/catalog";

export default function HomePage() {
  const recommended = products.slice(0, 8);
  const best = products.filter((p) => p.badge === "베스트");
  const fresh = products.filter((p) => p.badge === "신상" || p.badge === "단독");

  return (
    // 여백 리듬 = 밀고(tight) 당기기(breath). 등간격 space-y 를 버리고
    // 기능적 순간(고민 찾기·베스트·리뷰) 앞에서만 크게 숨을 준다.
    <div className="shell py-6 sm:py-8">
      <Hero />

      {/* 히어로에 바짝 붙는 신뢰 띠 */}
      <div className="mt-6">
        <TrustBar />
      </div>

      <section className="mt-14">
        <SectionHeader title="무엇을 찾고 계신가요?" />
        <CategoryGrid />
      </section>

      <section className="mt-14">
        <SectionHeader title="회원님을 위한 추천" href="/category/skincare" />
        <ProductRail products={recommended} />
      </section>

      {/* ── breath ── 고민 찾기: 홈의 핵심 순간, 크게 띄운다 */}
      <div className="mt-24">
        <ConcernFinder />
      </div>

      <div className="mt-16">
        <PromoBanner
          eyebrow="Editor's pick"
          title="기미가 신경 쓰이는 날, 커버 메이크업"
          desc="얇게 발려도 자연스럽게 덮이고 하루 종일 촉촉하게 밀착되는 커버 아이템을 모았어요."
          href="/category/cover"
          cta="커버 메이크업 보기"
        />
      </div>

      {/* ── breath ── 이번 주 베스트 */}
      <section className="mt-24">
        <SectionHeader title="이번 주 베스트" href="/category/device" />
        <ProductRail products={best} />
      </section>

      <section className="mt-24">
        <SectionHeader title="먼저 써본 분들의 이야기" />
        <ReviewHighlight />
      </section>

      <section className="mt-16">
        <SectionHeader
          title="입점 브랜드"
          href="/category/skincare"
          hrefLabel="전체 브랜드"
        />
        <BrandRail />
      </section>

      <section className="mt-16">
        <SectionHeader title="새로 들어왔어요" href="/category/suncare" />
        <ProductRail products={fresh} />
      </section>
    </div>
  );
}
