import Link from "next/link";
import Icon from "@/components/Icon";
import CartLink from "@/components/CartLink";
import TabBar from "@/components/TabBar";
import WishQuickAction from "./WishQuickAction";
import OrderQuickAction from "./OrderQuickAction";
import WalletQuickActions from "./WalletQuickActions";
import ReviewQuickAction from "./ReviewQuickAction";
import GradeCard from "./GradeCard";
import ProfileEntry from "./ProfileEntry";
import AccountBlock from "./AccountBlock";

/** href가 있으면 실제로 동작하는 항목. 없으면 아직 미구현 (docs/05 §5 죽은 UI 참고) */
const menuGroups: { title: string; items: { label: string; href?: string; note?: string }[] }[] = [
  {
    title: "쇼핑",
    items: [
      { label: "선물하기", href: "/gift", note: "어머니께 대신 골라드려요" },
      { label: "최근 본 상품", href: "/recent" },
      { label: "재구매 목록", href: "/repurchase", note: "다 쓸 때쯤 알려드려요" },
      { label: "배송지 관리" },
    ],
  },
  {
    title: "고객센터",
    items: [{ label: "1:1 문의" }, { label: "공지사항" }, { label: "자주 묻는 질문" }],
  },
  { title: "리워드 · 참여", items: [{ label: "체험단 신청" }, { label: "리뷰 이벤트" }] },
];

export default function MyPage() {
  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-surface px-4 py-[13px]">
        <h1 className="text-[17px] font-bold text-ink">마이페이지</h1>
        <div className="flex items-center gap-4 text-ink">
          <button aria-label="알림" className="flex h-11 w-11 items-center justify-center">
            <Icon name="bell" size={21} />
          </button>
          <CartLink />
        </div>
      </header>

      <main className="flex-1">
        {/* 계정 — 게스트면 로그인 진입점으로 바뀐다 */}
        <AccountBlock />

        {/* 피부 고민 설정 — concern-first 개인화 진입 (lib/profile.ts) */}
        <ProfileEntry />

        {/* 등급 카드 — 누적 구매액에서 파생 */}
        <GradeCard />

        {/* 퀵액션 */}
        <div className="flex border-b border-hairline border-t">
          <OrderQuickAction />
          <ReviewQuickAction />
          <WalletQuickActions />
          <WishQuickAction />
        </div>

        {/* 그룹 메뉴 */}
        {menuGroups.map((g, gi) => (
          <div key={g.title} className={gi > 0 ? "border-t border-hairline" : ""}>
            <p className="px-4 pb-2 pt-4 text-[12px] font-medium text-meta">{g.title}</p>
            {g.items.map((item, i) => {
              const border = i < g.items.length - 1 ? "border-b border-subtle" : "";
              const body = (
                <>
                  <span className="flex-1">
                    <span className="block text-[14px] text-ink">{item.label}</span>
                    {item.note && (
                      <span className="mt-[2px] block text-[13px] text-meta">{item.note}</span>
                    )}
                  </span>
                  <span className="text-disabled">
                    <Icon name="chevron-right" size={17} />
                  </span>
                </>
              );
              return item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex w-full items-center justify-between px-4 py-[13px] text-left ${border}`}
                >
                  {body}
                </Link>
              ) : (
                <button
                  key={item.label}
                  className={`flex w-full items-center justify-between px-4 py-[13px] text-left ${border}`}
                >
                  {body}
                </button>
              );
            })}
          </div>
        ))}
        <div className="h-4" />
      </main>

      <TabBar />
    </>
  );
}
