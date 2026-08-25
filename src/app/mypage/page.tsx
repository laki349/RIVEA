import Link from "next/link";
import Icon from "@/components/Icon";
import TabBar from "@/components/TabBar";
import WishQuickAction from "./WishQuickAction";
import ReviewQuickAction from "./ReviewQuickAction";
import ProfileEntry from "./ProfileEntry";
import AccountBlock from "./AccountBlock";

/**
 * href가 있으면 실제로 동작하는 항목. 없으면 아직 미구현.
 *
 * **동작하는 것을 앞에 몰았다.** 예전엔 살아있는 4개가 죽은 6개 사이에 섞여 있어서
 * 「내 화장대」·「재구매 목록」처럼 새로 만든 화면이 목록에 묻혔다. 죽은 항목을
 * 지우지 않기로 한 이상, 최소한 순서로는 갈라놔야 한다.
 */
const menuGroups: { title: string; items: { label: string; href?: string; note?: string }[] }[] = [
  {
    title: "내 관리",
    items: [
      { label: "내 루틴", href: "/my-routine", note: "고민에 맞춘 아침·저녁 순서" },
      { label: "내 화장대", href: "/shelf", note: "쓰고 있는 것과 같이 써도 되는지" },
      // 재구매 목록은 주문에서 파생된다 — 결제를 닫은 지금은 영영 빈 화면이다

    ],
  },
  {
    title: "쇼핑",
    items: [
      // 선물하기는 결제 동선을 타므로 지금은 내린다 (docs/16 「안 하는 것」에도 9/2 이후로 적혀 있다)

      { label: "최근 본 상품", href: "/recent" },
      { label: "내가 쓴 리뷰", href: "/reviews" },
    ],
  },
  {
    title: "고객센터",
    items: [
      { label: "배송지 관리" },
      { label: "1:1 문의" },
      { label: "공지사항" },
      { label: "자주 묻는 질문" },
    ],
  },
  { title: "리워드 · 참여", items: [{ label: "체험단 신청" }, { label: "리뷰 이벤트" }] },
];

export default function MyPage() {
  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-surface px-4 py-[13px]">
        <h1 className="text-[19px] font-bold text-ink">마이페이지</h1>
        <div className="flex items-center gap-4 text-ink">
          <button aria-label="알림" className="flex h-11 w-11 items-center justify-center">
            <Icon name="bell" size={21} />
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* 계정 — 게스트면 로그인 진입점으로 바뀐다 */}
        <AccountBlock />

        {/* 피부 고민 설정 — concern-first 개인화 진입 (lib/profile.ts) */}
        <ProfileEntry />

        {/*
          ⚠️ 등급 카드·주문·쿠폰/포인트를 내렸다 (2026-08-25).
          셋 다 **주문에서 파생**되는데, 결제 동선을 닫아 주문이 생길 수 없다.
          영영 0인 숫자를 등급·잔액이라고 띄우면 그게 또 하나의 거짓 화면이다.
          남긴 건 실제로 동작하는 둘 — 내가 쓴 리뷰와 찜.
        */}
        <div className="flex border-b border-t border-hairline">
          <ReviewQuickAction />
          <WishQuickAction />
        </div>

        {/* 그룹 메뉴 */}
        {menuGroups.map((g, gi) => (
          <div key={g.title} className={gi > 0 ? "border-t border-hairline" : ""}>
            <p className="px-4 pb-2 pt-4 text-[14px] font-medium text-meta">{g.title}</p>
            {g.items.map((item, i) => {
              const border = i < g.items.length - 1 ? "border-b border-subtle" : "";
              const body = (
                <>
                  <span className="flex-1">
                    <span className="block text-[16px] text-ink">{item.label}</span>
                    {item.note && (
                      <span className="mt-[2px] block text-[15px] text-meta">{item.note}</span>
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
