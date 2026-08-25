import Link from "next/link";
import { notFound } from "next/navigation";
import { articleImage, articles } from "@/data/magazine";
import { productOf, routines, won } from "@/data/catalog";
import AppBar from "@/components/AppBar";
import TabBar from "@/components/TabBar";
import ImageSlot from "@/components/ImageSlot";
import ProductCard from "@/components/ProductCard";
import RoutineCard from "@/components/RoutineCard";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const related = article.productIds.map(productOf);
  const relatedRoutines = article.routineIds
    .map((id) => routines.find((r) => r.id === id))
    .filter((r): r is (typeof routines)[number] => Boolean(r));

  return (
    <>
      <AppBar title="매거진" />

      <main className="flex-1">
        <ImageSlot
          className="h-[180px] w-full border-b border-hairline"
          tone="warm"
          src={articleImage(article)}
          alt={article.title}
          position="center 35%"
        />

        {/* 제목부 */}
        <header className="border-b border-hairline px-4 py-4">
          <p className="text-[14px] font-bold text-rose">{article.kind}</p>
          {/* AppBar가 h1을 쓰므로 본문 제목은 h2 (앱 전체 규칙) */}
          <h2 className="mt-[6px] text-[23px] font-bold leading-[1.35] text-ink">
            {article.title}
          </h2>
          <p className="mt-[9px] text-[17px] leading-[1.65] text-body">{article.dek}</p>
          <p className="mt-3 text-[14px] text-meta">읽는 데 {article.readMinutes}분</p>
        </header>

        {/* 본문 — 긴 글이라 16px / 행간 1.75 */}
        <article className="px-4 py-5">
          {article.body.map((s, i) => (
            <section key={s.heading} className={i > 0 ? "mt-7" : ""}>
              <h3 className="mb-[10px] text-[19px] font-bold leading-[1.4] text-ink">
                {s.heading}
              </h3>
              {s.paragraphs.map((p, pi) => (
                <p
                  key={pi}
                  className={`text-[18px] leading-[1.75] text-body ${pi > 0 ? "mt-[14px]" : ""}`}
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>

        {/* 고지 — 화장품법 표시·광고 관련 */}
        <p className="mx-4 mb-5 border-t border-subtle pt-4 text-[14px] leading-[1.65] text-meta">
          이 글은 일반적인 화장품·홈케어 기기 관리 정보이며, 질병의 진단·치료를 목적으로 하지
          않습니다. 효과와 사용감은 개인에 따라 다를 수 있습니다.
        </p>

        {/* 커머스 브리지 — 읽고 나서 바로 이어지게 */}
        {relatedRoutines.length > 0 && (
          <section className="border-t border-hairline">
            <h3 className="px-4 pb-3 pt-4 text-[18px] font-bold text-ink">
              이 글에서 다룬 루틴
            </h3>
            <div className="rail flex gap-[11px] pb-4 pl-4 pr-4">
              {relatedRoutines.map((r) => (
                <RoutineCard key={r.id} routine={r} />
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="border-t border-hairline">
            <h3 className="px-4 pb-[10px] pt-4 text-[18px] font-bold text-ink">
              함께 언급된 상품
            </h3>
            <div className="grid grid-cols-2 gap-[3px] border-t border-hairline">
              {related.map((p, i) => (
                <div key={p.id} className={i % 2 === 0 ? "border-r-[3px] border-surface" : ""}>
                  <ProductCard product={p} imageClassName="h-[160px]" />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="border-t border-hairline px-4 py-4">
          <Link
            href="/magazine"
            className="flex h-12 items-center justify-center rounded-cta border border-ink text-[17px] font-medium text-ink"
          >
            매거진 목록으로
          </Link>
        </div>
      </main>

      <TabBar />
    </>
  );
}
