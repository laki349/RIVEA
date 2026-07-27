import Link from "next/link";
import Image from "next/image";
import ImageSlot from "./ImageSlot";
import { media } from "@/data/media";

// 히어로 = 주장(thesis). 세일즈 배너가 아니라 "이번 주의 편집(edit)".
// 마스트헤드 헤어라인 + 풀블리드 도판 + 도판 캡션으로 편집숍의 권위를 연다.
export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-line bg-cream">
      <div className="grid md:grid-cols-2 md:items-stretch">
        {/* 편집 카피 */}
        <div className="flex flex-col justify-center p-7 sm:p-10 md:py-14 md:pl-12 md:pr-10">
          {/* 마스트헤드 — 주간 큐레이션이라는 사실을 인코딩 */}
          <div className="mb-6 flex items-center gap-3 animate-fade-up">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              리베아 편집
            </span>
            <span className="h-px flex-1 bg-gold-soft/60" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone">
              2026 · 여름
            </span>
          </div>

          <h1 className="font-serif text-[2.1rem] font-bold leading-[1.16] text-espresso animate-fade-up sm:text-[2.7rem] md:text-[3rem]">
            나이 들수록,
            <br />더 정성스러운 홈케어
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-taupe animate-fade-up">
            기미를 자연스럽게 덮는 커버, 주름에 끼지 않는 베이스, 집에서 하는
            리프팅까지. 브랜드를 가리지 않고 고민 하나로 골라 비교합니다.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6 animate-fade-up">
            <Link
              href="/pick"
              className="rounded-xl bg-cocoa px-7 py-3.5 text-[15px] font-semibold text-ivory transition hover:bg-espresso"
            >
              리베아 Pick 보기
            </Link>
            <Link
              href="/category/cover"
              className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-cocoa"
            >
              <span className="border-b border-gold pb-0.5 transition group-hover:border-cocoa">
                기미 커버 모아보기
              </span>
              <span aria-hidden className="transition group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* 풀블리드 도판 — 섹션 모서리까지 채운다 */}
        <div className="relative min-h-[260px] sm:min-h-[360px] md:min-h-full">
          {media.hero ? (
            <>
              <Image
                src={media.hero}
                alt="리베아 이번 주 큐레이션 — 커버와 리프팅 홈케어"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover"
              />
              {/* 캡션 가독성용 하단 스크림 */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-espresso/45 to-transparent" />
              {/* 잡지 도판 캡션 */}
              <span className="absolute bottom-4 left-4 rounded-full bg-espresso/70 px-3 py-1 text-[11px] font-medium tracking-wide text-ivory backdrop-blur">
                이번 주 · 커버 &amp; 리프팅 편집
              </span>
            </>
          ) : (
            <div className="p-7 sm:p-10">
              <ImageSlot
                alt="리베아 이번 주 큐레이션"
                ratio="aspect-[4/3]"
                label="배너 이미지 자리"
                sizes="(max-width: 768px) 100vw, 560px"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
