"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/data/catalog";
import { SearchIcon, BagIcon, HeartIcon, SparkleIcon } from "./Icons";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/90 backdrop-blur supports-[backdrop-filter]:bg-ivory/75">
      <div className="shell">
        {/* top row */}
        <div className="flex items-center gap-4 py-3.5">
          <Link href="/" className="flex shrink-0 items-baseline gap-2">
            <span className="font-serif text-2xl font-semibold tracking-tight text-espresso">
              리베아
            </span>
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.2em] text-gold sm:inline">
              Rebea
            </span>
          </Link>

          {/* search — the primary CTA of a marketplace */}
          <form
            action="#"
            className="group ml-1 flex flex-1 items-center gap-2 rounded-full border border-line-strong bg-white px-4 py-2.5 text-taupe shadow-soft transition focus-within:border-gold"
            role="search"
          >
            <SearchIcon className="h-5 w-5 text-stone" />
            <input
              type="search"
              placeholder="기미 커버, 리프팅 디바이스 검색"
              aria-label="상품 검색"
              className="w-full bg-transparent text-[15px] text-cocoa outline-none placeholder:text-stone"
            />
            <span className="hidden shrink-0 rounded-full bg-cream px-2.5 py-1 text-[11px] font-medium text-taupe sm:inline">
              전 상품 무료배송
            </span>
          </form>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label="찜한 상품"
              className="hidden h-11 w-11 items-center justify-center rounded-full text-cocoa transition hover:bg-cream sm:flex"
            >
              <HeartIcon className="h-6 w-6" />
            </button>
            <button
              type="button"
              aria-label="장바구니"
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-cocoa transition hover:bg-cream"
            >
              <BagIcon className="h-6 w-6" />
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-semibold text-white">
                2
              </span>
            </button>
          </div>
        </div>

        {/* category strip — desktop */}
        <nav className="hidden items-center gap-1 pb-1 md:flex" aria-label="카테고리">
          <Link
            href="/pick"
            className={`mr-1 flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
              pathname.startsWith("/pick")
                ? "bg-gold text-white"
                : "bg-cream text-gold hover:bg-gold hover:text-white"
            }`}
          >
            <SparkleIcon className="h-4 w-4" />
            리베아 Pick
          </Link>
          {categories.map((c) => {
            const href = `/category/${c.slug}`;
            const active = pathname === href;
            return (
              <Link
                key={c.slug}
                href={href}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-cocoa text-ivory"
                    : "text-taupe hover:bg-cream hover:text-cocoa"
                }`}
              >
                {c.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
