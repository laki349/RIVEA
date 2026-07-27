"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

const tabs = [
  { href: "/", label: "홈", icon: "home" as const },
  { href: "/category", label: "카테고리", icon: "grid" as const },
  { href: "/pick", label: "Pick", icon: "sparkle" as const },
  { href: "/wish", label: "찜", icon: "heart" as const },
  { href: "/mypage", label: "마이", icon: "user" as const },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-40 flex border-t border-line bg-surface pb-[max(11px,env(safe-area-inset-bottom))] pt-[9px]">
      {tabs.map((t) => {
        const active =
          t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex min-h-[44px] flex-1 flex-col items-center gap-[2px] ${
              active ? "text-ink" : "text-disabled"
            }`}
          >
            <Icon name={t.icon} size={21} />
            <span className={`text-[11px] ${active ? "font-medium" : ""}`}>
              {t.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
