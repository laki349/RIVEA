"use client";

import { useMemo, useState } from "react";
import {
  categories,
  concernImage,
  products,
  routines,
  type Concern,
} from "@/data/catalog";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import AppBar from "@/components/AppBar";
import TabBar from "@/components/TabBar";
import RoutineCard from "@/components/RoutineCard";
import ProductCard from "@/components/ProductCard";
import ArticleLink from "@/components/ArticleLink";
import { articlesForConcern } from "@/data/magazine";

export default function ConcernDetail({ concern }: { concern: Concern }) {
  const [cat, setCat] = useState<string | null>(null);

  const concernArticles = articlesForConcern(concern.slug);
  const concernRoutines = routines.filter((r) => r.concern === concern.slug);
  const concernProducts = useMemo(() => {
    let l = products.filter((p) => p.concerns.includes(concern.slug));
    if (cat) l = l.filter((p) => p.category === cat);
    return l;
  }, [concern.slug, cat]);

  // 이 고민 상품들이 속한 카테고리만 필터 칩으로
  const cats = categories.filter((c) =>
    products.some((p) => p.concerns.includes(concern.slug) && p.category === c.slug)
  );

  return (
    <>
      <AppBar title={concern.name} bold />

      <main className="flex-1">
        {/* 고민 무드 */}
        <ImageSlot
          className="h-[140px] w-full border-b border-hairline"
          tone="warm"
          src={concernImage(concern.slug)}
          alt={concern.name}
          position="center 35%"
        />

        {/* 인트로 + 관리 포인트 */}
        <section className="border-b border-hairline px-4 py-4">
          <h2 className="text-[20px] font-bold leading-[1.4] text-ink">{concern.question}</h2>
          <p className="mt-2 text-[16px] leading-[1.65] text-body">{concern.intro}</p>
          <div className="mt-3">
            {concern.tips.map((t) => (
              <p key={t.bold} className="flex items-start gap-[9px] py-[6px] text-[16px] leading-[1.5] text-ink">
                <span className="mt-[1px] flex-shrink-0">
                  <Icon name="check" size={17} />
                </span>
                <span>
                  {t.rest.split(t.bold)[0]}
                  <b className="font-bold">{t.bold}</b>
                  {t.rest.split(t.bold)[1]}
                </span>
              </p>
            ))}
          </div>

        </section>

        {/*
          「이런 경우예요」 — 고를 때 불편 1위가 「이게 나한테 맞는 건지 모르겠다」 50%였다
          (docs/15). 고민 이름만으론 그 절반을 못 넘는다. 자기 확인 문장이 먼저 와야
          「내 얘기다」가 성립하고, 그 다음에야 아래 상품이 의미를 갖는다.
          ⚠️ 진단이 아니다. 증상을 단정하지 않고 관찰 가능한 상황으로만 쓴다.
        */}
        <section className="border-b border-hairline bg-subtle px-4 py-4">
          <h3 className="mb-[9px] text-[18px] font-bold text-ink">이런 경우예요</h3>
          {concern.youIf.map((line) => (
            <p
              key={line}
              className="flex items-start gap-[9px] py-[5px] text-[16px] leading-[1.55] text-body"
            >
              <span className="mt-[1px] flex-shrink-0 text-ink">
                <Icon name="check" size={17} />
              </span>
              <span>{line}</span>
            </p>
          ))}
          <p className="mt-[8px] text-[15px] leading-[1.55] text-meta">
            해당하는 게 하나도 없으면 다른 고민일 수 있어요. 진단이 아니라 방향을 잡는 문장입니다.
          </p>
        </section>

        {/*
          「언제 판정하나」 — 쓰는 중 불편 1위가 「효과가 있는 건지 모르겠다」 72%로
          설문 전체 최대 신호다(docs/15). 시점을 처음부터 말하지 않으면 방치·폐기(56%)로 간다.
          파는 쪽이 먼저 「아직 판단하지 마세요」를 말하는 게 이 앱의 각도다.
        */}
        <section className="border-b border-hairline px-4 py-4">
          <div className="mb-[7px] flex flex-wrap items-center gap-2">
            <h3 className="text-[18px] font-bold text-ink">언제 판정하나</h3>
            <span className="rounded bg-ink px-[7px] py-[2px] text-[15px] font-medium text-on-ink">
              {concern.verdictAt.weeks}주
            </span>
          </div>
          <p className="text-[16px] leading-[1.6] text-body">{concern.verdictAt.what}</p>
        </section>

        {/*
          아는 단어로 말을 건다 — 성분 병용 개념은 30/32가 모르지만 성분 「단어」는 안다
          (설문 Q22 실측). 개념을 가르치려 들지 않고, 아는 단어를 입구로 쓴다.
        */}
        {concern.knownWords.length > 0 && (
          <section className="border-b border-hairline px-4 py-4">
            <h3 className="mb-[9px] text-[18px] font-bold text-ink">이 고민에서 자주 듣는 성분</h3>
            <div className="flex flex-wrap gap-[6px]">
              {concern.knownWords.map((w) => (
                <span
                  key={w}
                  className="rounded border border-line px-[10px] py-[5px] text-[16px] text-body"
                >
                  {w}
                </span>
              ))}
            </div>
            <p className="mt-[9px] text-[15px] leading-[1.55] text-meta">
              성분별 근거와 판정 시점은 각 상품 상세의 「성분이 하는 일」에 있어요.
            </p>
          </section>
        )}

        <section className="border-b border-hairline px-4 py-4">
          {/* 매거진 — 위 요약의 근거 전문 */}
          {concernArticles.length > 0 && (
            <div className="mt-4">
              <ArticleLink article={concernArticles[0]} heading="이 고민, 더 자세히" />
            </div>
          )}
        </section>

        {/* 추천 루틴 — 가로 스크롤 (여러 개 수용) */}
        {concernRoutines.length > 0 && (
          <section className="border-b border-hairline">
            <div className="flex items-baseline justify-between px-4 pb-3 pt-4">
              <h3 className="text-[18px] font-bold text-ink">
                이 고민엔, 이 루틴 <span className="text-rose">{concernRoutines.length}</span>
              </h3>
              <span className="text-[15px] text-meta">전체보기 ›</span>
            </div>
            <div className="rail flex gap-[11px] pb-4 pl-4 pr-4">
              {concernRoutines.map((r) => (
                <RoutineCard key={r.id} routine={r} />
              ))}
            </div>
          </section>
        )}

        {/* 관련 단품 */}
        <section>
          <h3 className="px-4 pb-[10px] pt-4 text-[18px] font-bold text-ink">
            {concern.name} 단품
          </h3>
          <div className="rail flex gap-[6px] whitespace-nowrap px-4 pb-3">
            <button
              onClick={() => setCat(null)}
              className={`min-h-[34px] rounded border px-[11px] text-[15px] ${
                cat === null ? "border-ink text-ink" : "border-line text-body"
              }`}
            >
              전체
            </button>
            {cats.map((c) => (
              <button
                key={c.slug}
                onClick={() => setCat(c.slug)}
                className={`min-h-[34px] rounded border px-[11px] text-[15px] ${
                  cat === c.slug ? "border-ink text-ink" : "border-line text-body"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-[3px] border-t border-hairline">
            {concernProducts.map((p, i) => (
              <div key={p.id} className={i % 2 === 0 ? "border-r-[3px] border-surface" : ""}>
                <ProductCard product={p} imageClassName="h-[160px]" />
              </div>
            ))}
          </div>
        </section>
      </main>

      <TabBar />
    </>
  );
}
