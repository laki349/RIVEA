import Link from "next/link";
import Icon from "@/components/Icon";
import TabBar from "@/components/TabBar";
import WishQuickAction from "./WishQuickAction";

const quickActions = [
  { icon: "truck" as const, label: "주문·배송" },
  { icon: "message" as const, label: "리뷰 0" },
  { icon: "ticket" as const, label: "쿠폰 2", dot: true },
  { icon: "coin" as const, label: "포인트" },
];

const menuGroups: { title: string; items: string[] }[] = [
  { title: "쇼핑", items: ["최근 본 상품", "재구매 목록", "배송지 관리"] },
  { title: "고객센터", items: ["1:1 문의", "공지사항", "자주 묻는 질문"] },
  { title: "리워드 · 참여", items: ["체험단 신청", "리뷰 이벤트"] },
];

export default function MyPage() {
  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-surface px-4 py-[13px]">
        <h1 className="text-[17px] font-bold text-ink">마이페이지</h1>
        <div className="flex items-center gap-4 text-ink">
          <button aria-label="알림" className="flex h-11 w-8 items-center justify-center">
            <Icon name="bell" size={21} />
          </button>
          <Link href="/cart" aria-label="장바구니" className="flex h-11 w-8 items-center justify-center">
            <Icon name="bag" size={21} />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* 인사 */}
        <div className="flex items-center justify-between px-4 pb-[14px] pt-[18px]">
          <div>
            <p className="text-[19px] font-bold text-ink">김서연님 안녕하세요</p>
            <p className="mt-[3px] text-[13px] text-meta">seo****@gmail.com</p>
          </div>
          <span className="text-disabled">
            <Icon name="chevron-right" size={19} />
          </span>
        </div>

        {/* 피부 고민 설정 — concern-first 개인화 진입 */}
        <Link
          href="/category"
          className="mx-4 mb-[14px] flex items-center gap-[9px] rounded border border-line px-[14px] py-[13px]"
        >
          <span className="text-rose">
            <Icon name="sparkle" size={18} />
          </span>
          <span className="flex-1 text-[14px] font-medium text-ink">내 피부 고민 설정하기</span>
          <span className="text-disabled">
            <Icon name="chevron-right" size={17} />
          </span>
        </Link>

        {/* 등급 카드 */}
        <div className="mx-4 mb-4 overflow-hidden rounded border border-line">
          <div className="flex items-center gap-[11px] p-[14px]">
            <span className="flex h-10 w-10 items-center justify-center rounded bg-ink text-[13px] font-bold text-on-ink">
              S
            </span>
            <div className="flex-1">
              <p className="text-[15px] font-bold text-ink">SILVER</p>
              <p className="mt-[2px] text-[12px] text-meta">
                구매 적립 <b className="font-medium text-ink">1% 적립</b> · 쿠폰팩
              </p>
            </div>
            <button className="rounded border border-ink px-[11px] py-[6px] text-[12px] font-medium text-ink">
              쿠폰 받기
            </button>
          </div>
          <p className="border-t border-subtle bg-bg-tint px-[14px] py-[11px] text-[12px] text-body">
            <b className="font-bold text-ink">100,000원</b> 더 구매 시 GOLD(1.5% 적립) 달성
          </p>
        </div>

        {/* 퀵액션 */}
        <div className="flex border-b border-hairline border-t">
          {quickActions.map((a) => (
            <button key={a.label} className="relative flex-1 py-[15px] text-center">
              <span className="text-ink">
                <Icon name={a.icon} size={20} className="mx-auto" />
              </span>
              {a.dot && (
                <span className="absolute left-[calc(50%+10px)] top-3 h-[5px] w-[5px] rounded-full bg-rose" />
              )}
              <p className="mt-[5px] text-[11px] text-body">{a.label}</p>
            </button>
          ))}
          <WishQuickAction />
        </div>

        {/* 그룹 메뉴 */}
        {menuGroups.map((g, gi) => (
          <div key={g.title} className={gi > 0 ? "border-t border-hairline" : ""}>
            <p className="px-4 pb-2 pt-4 text-[12px] font-medium text-meta">{g.title}</p>
            {g.items.map((item, i) => (
              <button
                key={item}
                className={`flex w-full items-center justify-between px-4 py-[13px] text-left ${
                  i < g.items.length - 1 ? "border-b border-subtle" : ""
                }`}
              >
                <span className="text-[14px] text-ink">{item}</span>
                <span className="text-disabled">
                  <Icon name="chevron-right" size={17} />
                </span>
              </button>
            ))}
          </div>
        ))}
        <div className="h-4" />
      </main>

      <TabBar />
    </>
  );
}
