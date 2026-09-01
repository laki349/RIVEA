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
            /* 첫 방문 안내(components/Tour.tsx)가 가리키는 자리 */
            data-tour={t.href === "/pick" ? "tab-pick" : undefined}
            /*
              비활성 라벨이 text-disabled(#B0A89D)였다. 흰 배경에서 2.35:1로
              앱 전체에서 가장 심한 대비 위반이었다. 탭바는 어느 화면에서나
              보이는 유일한 내비게이션이라 여기가 안 읽히면 길을 잃는다.

              라벨을 11 → 13px로 올린 이유도 같다. 아이콘만으로는 40대+ 사용자가
              Pick·찜을 구분하기 어렵고, 그럴 때 읽는 게 이 글자다.
            */
            className={`press flex min-h-[44px] flex-1 flex-col items-center gap-[2px] ${
              active ? "text-ink" : "text-meta"
            }`}
          >
            <Icon name={t.icon} size={21} />
            <span className={`text-[15px] ${active ? "font-medium" : ""}`}>
              {t.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
