"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, GridIcon, SearchIcon, UserIcon, SparkleIcon } from "./Icons";

const items = [
  { href: "/", label: "홈", Icon: HomeIcon, match: (p: string) => p === "/" },
  {
    href: "/category/device",
    label: "전체보기",
    Icon: GridIcon,
    match: (p: string) => p.startsWith("/category"),
  },
  {
    href: "/pick",
    label: "리베아 Pick",
    Icon: SparkleIcon,
    match: (p: string) => p.startsWith("/pick"),
  },
  { href: "/search", label: "검색", Icon: SearchIcon, match: (p: string) => p === "/search" },
  { href: "/my", label: "마이", Icon: UserIcon, match: (p: string) => p === "/my" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="주요 메뉴"
    >
      <ul className="mx-auto flex max-w-shell items-stretch">
        {items.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={label} className="flex-1">
              <Link
                href={href}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition ${
                  active ? "text-cocoa" : "text-stone"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className={`h-6 w-6 ${active ? "text-rose" : ""}`} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
