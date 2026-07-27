import Link from "next/link";
import { ChevronRight } from "./Icons";
import { concerns } from "@/data/concerns";

// Editorial "diagnose by concern" entry — breaks up the product rails
// and gives the edit-shop a point of view.
// 고민 목록·표기는 단일 소스(concerns.ts)를 따르고, 모두 Pick 인덱스의
// 해당 고민 섹션(/pick#slug)으로 일관되게 이동한다.
export default function ConcernFinder() {
  return (
    <section className="overflow-hidden rounded-3xl border border-line-strong bg-champagne/50">
      <div className="p-7 sm:p-10">
        <h2 className="font-serif text-2xl font-semibold text-espresso sm:text-[1.9rem]">
          요즘, 어떤 고민이 있으세요?
        </h2>
        <p className="mt-2 text-[14.5px] text-taupe">
          고민을 고르면 여러 브랜드의 해결책을 한 번에 비교해 드려요.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {concerns.map((c) => (
            <Link
              key={c.slug}
              href={`/pick#${c.slug}`}
              className="group flex items-center justify-between gap-2 rounded-2xl border border-line bg-white/80 px-4 py-4 shadow-soft transition hover:-translate-y-0.5 hover:border-gold-soft hover:bg-white"
            >
              <span className="min-w-0">
                <span className="block font-serif text-[17px] font-bold text-cocoa">
                  {c.name}
                </span>
                <span className="mt-0.5 block truncate text-[12.5px] text-stone">
                  {c.hint}
                </span>
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-taupe transition group-hover:bg-cocoa group-hover:text-ivory">
                <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
