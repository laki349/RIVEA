import type { Metadata } from "next";
import { picksByConcernSlug } from "@/data/picks";
import { concerns } from "@/data/concerns";
import RoutineRow from "@/components/RoutineRow";
import { SparkleIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "리베아 Pick — 고민별 기기＋화장품 루틴",
};

export default function PickIndexPage() {
  return (
    <div className="shell max-w-3xl py-6 sm:py-10">
      {/* 헤더 */}
      <header>
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-gold-soft bg-white/70 px-3 py-1 text-[12px] font-semibold tracking-wide text-gold">
          <SparkleIcon className="h-4 w-4" /> 리베아 Pick
        </p>
        <h1 className="font-serif text-[1.9rem] font-bold leading-tight text-espresso sm:text-4xl">
          고민을 고르면, 루틴이 보여요
        </h1>
        <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-taupe">
          기기와 화장품을 브랜드 넘나들며 역할별로 골라, 실제로 같이 쓰는 한 줄
          루틴으로 묶었어요.
        </p>
      </header>

      {/* 고민 칩 메뉴 — 섹션으로 이동 */}
      <nav
        className="no-scrollbar sticky top-[68px] z-20 -mx-5 mt-6 flex gap-2 overflow-x-auto border-b border-line bg-ivory/90 px-5 py-3 backdrop-blur"
        aria-label="고민 메뉴"
      >
        {concerns.map((concern) => {
          const count = picksByConcernSlug(concern.slug).length;
          return (
            <a
              key={concern.slug}
              href={`#${concern.slug}`}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13.5px] font-medium transition ${
                count > 0
                  ? "border-line-strong bg-white text-cocoa hover:border-gold"
                  : "border-line bg-cream/60 text-stone"
              }`}
            >
              {concern.name}
              {count > 0 && (
                <span className="ml-1 text-[11px] font-semibold text-gold">
                  {count}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* 고민별 섹션 */}
      <div className="mt-8 space-y-10">
        {concerns.map((concern) => {
          const items = picksByConcernSlug(concern.slug);
          return (
            <section key={concern.slug} id={concern.slug} className="scroll-mt-32">
              <div className="mb-4 flex items-baseline gap-2">
                <h2 className="text-xl font-semibold text-espresso">
                  #{concern.name}
                </h2>
                {items.length > 0 && (
                  <span className="text-[13px] text-stone">
                    루틴 {items.length}개
                  </span>
                )}
              </div>

              {items.length > 0 ? (
                <div className="space-y-3">
                  {items.map((pick) => (
                    <RoutineRow key={pick.slug} pick={pick} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-line-strong bg-cream/40 px-5 py-8 text-center">
                  <p className="text-[13.5px] font-medium text-cocoa">
                    {concern.name} 루틴을 준비 중이에요
                  </p>
                  <p className="mt-1 text-[12px] text-stone">곧 공개됩니다</p>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
