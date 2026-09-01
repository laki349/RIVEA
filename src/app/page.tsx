import Link from "next/link";
import { products } from "@/data/catalog";
import { activeInfo } from "@/data/actives";
import Icon from "@/components/Icon";
import TabBar from "@/components/TabBar";
import SectionHeader from "@/components/SectionHeader";
import ProductCard from "@/components/ProductCard";
import ConcernRail from "@/components/ConcernRail";
import HeroCarousel from "@/components/HeroCarousel";
import PickRail from "@/components/PickRail";
import VerdictSlot from "@/components/VerdictSlot";

export default function HomePage() {
  /**
   * ⚠️ 「베스트」를 「근거가 두꺼운 것부터」로 바꿨다 (2026-08-25).
   *
   * 전에는 `reviewCount` 내림차순이었는데 그 리뷰수는 **우리가 지어낸 값**이다.
   * 창작한 숫자로 순위를 매기면 그 순위 자체가 창작이고, 홈 첫 화면에서 그걸 하면
   * 뒤에 있는 근거표까지 같이 의심받는다.
   *
   * 대신 **동료심사 논문 등급(A)이 붙은 성분을 가진 제품**을 앞에 둔다. 이건 실제 값이고,
   * 상세 안쪽에 접혀 있던 이 앱의 유일한 차별점을 첫 화면으로 끌어올린다.
   */
  const graded = products
    .filter((p) => (p.actives ?? []).some((a) => activeInfo[a.key]?.evidence?.grade === "A"))
    .slice(0, 4);

  return (
    <>
      {/* 앱바 */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-surface px-4 py-[13px]">
        <Link
          href="/"
          className="flex h-11 items-center text-[22px] font-bold tracking-[0.05em] text-rose"
        >
          RIVEA
        </Link>
        <div className="flex items-center gap-[14px] text-ink">
          {/* 텍스트 라벨 — 아이콘 단독은 40대+ 판별이 어렵고, 유틸리티(검색·장바구니)와 종류가 다름을 드러낸다 */}
          <Link
            href="/magazine"
            className="flex h-11 items-center text-[16px] font-medium text-ink"
          >
            매거진
          </Link>
          <Link href="/search" aria-label="검색" className="flex h-11 w-11 items-center justify-center">
            <Icon name="search" size={21} />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* 고민으로 찾기 — 차별화 진입. 내 고민이 앞으로 온다 (lib/profile.ts) */}
        {/*
          판정 대기 — 고민 레일 바로 아래. 답할 게 있을 때만 나타난다.
          위치를 여기로 잡은 이유: 히어로 위면 광고 자리라 건너뛰고,
          더 내려가면 스크롤하지 않는 사람에게 영영 안 보인다.
        */}
        <VerdictSlot />

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

        {/*
          연령대 인기 모듈(`CohortSection`)을 내렸다 — `cohortViews`가 전부 창작이었다.
          「이번 주 3,120명이 봤어요」는 우리가 셀 수 없는 숫자다.
        */}

        {/* 근거가 두꺼운 것부터 — 창작 순위 대신 실제 값으로 정렬한다 */}
        <section>
          <div className="px-4 pb-3 pt-5">
            <h2 className="text-[20px] font-bold text-ink">근거가 두꺼운 성분부터</h2>
            <p className="mt-[5px] text-[16px] leading-[1.6] text-soft">
              메타분석·대규모 임상까지 확인된 성분이 든 제품입니다.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-[3px]">
            {graded.map((p, i) => (
              <div key={p.id} className={i % 2 === 0 ? "border-r-[3px] border-surface" : ""}>
                <ProductCard product={p} imageClassName="h-[168px]" />
              </div>
            ))}
          </div>
        </section>

        {/*
          ⚠️ 「신상」 레일을 내렸다 (2026-09-01).

          바로 위에서 「근거가 두꺼운 성분부터」로 순서의 기준을 세워놓고, 그다음 줄에서
          **근거와 무관한 「새로 들어온 순서」**를 또 하나의 기준으로 내놓고 있었다.
          기준이 두 개면 사용자는 둘 다 안 믿는다. 신상은 `/category`에 NEW 뱃지로 남아 있다.
        */}

        {/*
          ⚠️ 「브랜드」 레일을 내렸다 (2026-09-01).

          이 앱의 축은 concern-first다 — 「세럼」이 아니라 「기미·잡티」로 찾게 한다.
          브랜드로 찾기는 **그 반대축**이고, 홈 마지막에 24개를 깔아두면 「고민으로 찾기」로
          세운 관문을 스스로 흐린다.

          게다가 타일이 이니셜 한 글자였다(「글」·「셀」·「듀」). 40대+ 사용자에게 그 글자는
          브랜드를 알려주지 않는다 — 아래 이름을 읽어야 아는, 정보 없는 도형이었다.

          브랜드로 찾는 길은 남아 있다 — `/brands` 전용 페이지, 상품 카드의 브랜드명,
          상품 상세의 브랜드 링크.
        */}

        {/* 데모 고지 — 실제 판매로 오인하지 않도록 */}
        <section className="border-t border-hairline px-4 py-4">
          <p className="text-[15px] leading-[1.6] text-meta">
            리베아는 준비 중인 서비스입니다. 결제를 받지 않고, 구매는 각 브랜드 공식몰에서
            진행돼요. 아직 리뷰·평점을 모으지 않습니다. 상품 가격은 표시된 확인 시점 기준이라
            지금과 다를 수 있어요.
          </p>
        </section>
      </main>

      <TabBar />
    </>
  );
}
