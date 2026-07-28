import Link from "next/link";
import { articleImage, articlesInSection, issue, type Article } from "@/data/magazine";
import { heroImages, routines } from "@/data/catalog";
import AppBar from "@/components/AppBar";
import TabBar from "@/components/TabBar";
import ImageSlot from "@/components/ImageSlot";
import RoutineCard from "@/components/RoutineCard";

/**
 * 매거진 색인 — 호(Vol.) 단위 발행 구조.
 * 섹션마다 카드 형태를 달리해 위계를 만든다(포스터 레일 / 타이포 블록 / 루틴 레일).
 * 영문 키커 + 국문 제목 순서: 40대+ 가독성 때문에 국문을 주 제목으로 둔다.
 */
function SectionHead({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="px-4 pt-6">
      <p className="text-[11px] font-bold tracking-[0.16em] text-meta">{kicker}</p>
      <h2 className="mt-[3px] text-[19px] font-bold text-ink">{title}</h2>
      <div className="mt-[10px] border-t border-ink" />
      {sub && <p className="mt-[9px] text-[13px] text-meta">{sub}</p>}
    </div>
  );
}

/** 성분 섹션 — 포스터형 카드 (사진이 주인공) */
function PosterCard({ article }: { article: Article }) {
  return (
    <Link href={`/magazine/${article.slug}`} className="w-[150px] flex-shrink-0">
      <ImageSlot
        className="h-[196px] w-full rounded"
        tone="warm"
        src={articleImage(article)}
        alt={article.title}
        position="center 35%"
      />
      <p className="mt-[9px] text-[14px] font-bold leading-[1.4] text-ink">{article.title}</p>
      <p className="mt-[6px] flex items-center gap-[6px] text-[12px] text-meta">
        <span className="rounded bg-subtle px-[6px] py-[2px] font-medium text-ink">
          {article.kind}
        </span>
        {article.readMinutes}분
      </p>
    </Link>
  );
}

/**
 * 가이드 섹션 — 표지 사진 위에 주제어를 얹는 블록 카드.
 * 표지 6장이 모두 밝은 톤이라, 평면 톤을 덮으면 사진이 죽는다.
 * 그래서 앱 히어로와 같은 하단 그라데이션 스크림을 써서 흰 글자 대비를 확보한다.
 * (표지 이미지는 하단 절반을 비워서 생성했으므로 이 처리에 맞물린다 — docs/06-magazine-cover-brief.md)
 */
function BlockCard({ article }: { article: Article }) {
  return (
    <Link href={`/magazine/${article.slug}`} className="w-[196px] flex-shrink-0">
      <div className="relative h-[132px] overflow-hidden rounded">
        <ImageSlot
          className="h-full w-full"
          tone="warm"
          src={articleImage(article)}
          alt={article.title}
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[rgba(28,24,21,0.78)] via-[rgba(28,24,21,0.28)] to-transparent p-[13px]">
          <p className="text-[21px] font-bold leading-[1.2] text-white">
            {article.block?.ko ?? article.kind}
          </p>
          {article.block?.en && (
            <p className="mt-[4px] text-[11px] leading-[1.3] text-white/75">{article.block.en}</p>
          )}
        </div>
      </div>
      <p className="mt-[9px] text-[14px] font-bold leading-[1.4] text-ink">{article.title}</p>
      <p className="mt-[5px] text-[12px] leading-[1.55] text-meta">{article.dek}</p>
    </Link>
  );
}

export default function MagazinePage() {
  const ingredients = articlesInSection("ingredient");
  const guides = articlesInSection("guide");

  return (
    <>
      <AppBar title="매거진" bold />

      <main className="flex-1">
        {/* 호 표지 — 풀블리드 */}
        <section className="relative border-b border-hairline">
          <ImageSlot
            className="h-[240px] w-full"
            tone="warm"
            src={heroImages[1]}
            alt={`RIVEA 매거진 Vol. ${issue.vol}`}
            position="center 30%"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(28,24,21,0.78)] to-transparent px-4 pb-4 pt-12">
            <p className="text-[11px] font-bold tracking-[0.18em] text-white/80">
              RIVEA MAGAZINE
            </p>
            <p className="mt-[5px] text-[32px] font-bold leading-[1.1] text-white">
              Vol. {issue.vol}
            </p>
            <p className="mt-[7px] text-[14px] text-white/85">
              성분과 나이 · {issue.period} · {issue.cadence}
            </p>
          </div>
        </section>

        {/* 매거진의 역할 한 줄 */}
        <section className="border-b border-hairline px-4 py-4">
          <p className="text-[15px] leading-[1.65] text-body">
            성분과 나이에 따라 관리 방법이 왜 달라지는지, 근거를 정리해 두었어요.
            검색하지 않아도 되도록.
          </p>
        </section>

        {/* 성분 이야기 — 포스터 레일 */}
        <SectionHead
          kicker="INGREDIENT"
          title="성분 이야기"
          sub={`성분 하나를 제대로 알면 제품 고르는 기준이 생겨요 · ${ingredients.length}편`}
        />
        <div className="rail flex gap-[13px] px-4 pb-5 pt-[14px]">
          {ingredients.map((a) => (
            <PosterCard key={a.slug} article={a} />
          ))}
        </div>

        {/* 나이별 가이드 — 타이포 블록 레일 */}
        <SectionHead
          kicker="GUIDE"
          title="나이별 가이드"
          sub={`같은 고민도 나이에 따라 순서가 달라져요 · ${guides.length}편`}
        />
        <div className="rail flex gap-[13px] px-4 pb-5 pt-[14px]">
          {guides.map((a) => (
            <BlockCard key={a.slug} article={a} />
          ))}
        </div>

        {/* 이번 호 루틴 — 커머스 브리지 */}
        <SectionHead
          kicker="ROUTINE"
          title="이번 호 루틴"
          sub="이번 호에서 다룬 관리법을 세트로 묶었어요"
        />
        <div className="rail flex gap-[11px] px-4 pb-6 pt-[14px]">
          {routines.map((r) => (
            <RoutineCard key={r.id} routine={r} />
          ))}
        </div>
      </main>

      <TabBar />
    </>
  );
}
