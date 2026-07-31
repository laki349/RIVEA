"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  categories,
  concerns,
  products,
  won,
  type Category,
} from "@/data/catalog";
import Icon from "@/components/Icon";
import ProductCard from "@/components/ProductCard";
import TabBar from "@/components/TabBar";
import AppBar from "@/components/AppBar";

type SortKey = "popular" | "reviews" | "priceAsc" | "priceDesc";
const sorts: { key: SortKey; label: string }[] = [
  { key: "popular", label: "인기순" },
  { key: "reviews", label: "리뷰많은순" },
  { key: "priceAsc", label: "낮은가격순" },
  { key: "priceDesc", label: "높은가격순" },
];

export default function ProductList({ slug }: { slug: Category }) {
  // 정적 export 호환: 서버에서 searchParams를 읽지 않고 클라이언트에서 읽는다.
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const category = categories.find((c) => c.slug === slug)!;

  /**
   * 필터·정렬을 컴포넌트 state가 아니라 **URL**에 둔다.
   *
   * 예전엔 useState라, 「낮은가격순 + 기미」로 걸러 상품을 보고 뒤로 오면
   * 전부 처음으로 돌아갔다. 커머스에서 가장 짜증나는 지점이다.
   * URL에 있으면 뒤로가기가 그대로 복원하고, **그 목록을 그대로 공유**할 수도 있다.
   *
   * `replace`를 쓰는 이유: `push`면 필터를 만질 때마다 히스토리가 쌓여
   * 뒤로가기를 그 횟수만큼 눌러야 목록을 빠져나간다.
   * `scroll: false`가 없으면 필터를 바꿀 때마다 맨 위로 튄다.
   */
  const sub = searchParams.get("sub") ?? "전체";
  const concern = searchParams.get("concern");
  const sort = (searchParams.get("sort") as SortKey | null) ?? "popular";

  const setParam = (key: string, value: string | null, isDefault: boolean) => {
    const next = new URLSearchParams(searchParams.toString());
    // 기본값은 URL에서 뺀다 — 주소가 길어지면 공유할 때 부담스럽다
    if (value === null || isDefault) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const setSub = (v: string) => setParam("sub", v, v === "전체");
  const setConcern = (v: string | null) => setParam("concern", v, false);
  const setSort = (v: SortKey) => setParam("sort", v, v === "popular");

  const [sheet, setSheet] = useState<"concern" | "sort" | null>(null);

  /**
   * 카테고리를 바꾸면 새 페이지가 로드되면서 레일 스크롤이 0으로 돌아간다.
   * 앞쪽 카테고리는 원래 왼쪽이라 티가 안 나지만, 두피·이너뷰티처럼 끝쪽을 고르면
   * **고른 항목이 화면 밖으로 밀려나** 상단바가 앞으로 당겨진 것처럼 보인다.
   * 활성 항목을 가운데로 맞추되, 앞쪽 항목은 clamp에 걸려 예전 그대로 왼쪽에 남는다.
   *
   * 부드러운 스크롤을 쓰지 않는 이유: 페이지가 막 뜬 시점의 자동 이동은
   * 사용자가 하지 않은 동작이라 "왜 움직이지?"가 된다. 즉시 맞춘다.
   */
  const railRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const rail = railRef.current;
    const active = activeRef.current;
    if (!rail || !active) return;
    const centered = active.offsetLeft - (rail.clientWidth - active.clientWidth) / 2;
    rail.scrollLeft = Math.max(0, centered);
  }, [slug]);
  /**
   * 시트는 화면 절반을 덮는데 하드 컷으로 튀어나왔다 — 어디서 왔는지 알 수 없으면
   * 사용자는 그게 "새 화면"인지 "겹친 것"인지 모른다. 아래에서 올라오면 그 자체가 설명이다.
   * 닫힐 때도 애니메이션을 보여주려면 언마운트를 200ms 늦춰야 한다.
   */
  const [closing, setClosing] = useState(false);
  const closeSheet = () => {
    setClosing(true);
    setTimeout(() => {
      setSheet(null);
      setClosing(false);
    }, 200);
  };

  const list = useMemo(() => {
    let l = products.filter((p) => p.category === slug);
    if (concern) l = l.filter((p) => p.concerns.includes(concern));
    switch (sort) {
      case "popular":
        l = [...l].sort((a, b) => b.likes - a.likes);
        break;
      case "reviews":
        l = [...l].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "priceAsc":
        l = [...l].sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        l = [...l].sort((a, b) => b.price - a.price);
        break;
    }
    return l;
  }, [slug, concern, sort]);

  const concernName = concern ? concerns.find((c) => c.slug === concern)?.name : null;

  return (
    <>
      <AppBar title={category.name} bold />

      {/*
        1단 — 대분류 (가로 스크롤, 선택만 세로바+굵게)

        모든 항목이 같은 `border-l-2 pl-3` 상자를 갖는다. 예전엔 선택된 것만
        이 상자를 얻어서 **고를 때마다 폭이 14px씩 밀렸다** — 왼쪽 항목을 고르면
        오른쪽 전체가 따라 움직였다. 비활성은 테두리만 투명하게 둔다.
      */}
      <nav
        ref={railRef}
        className="rail flex items-center gap-[5px] whitespace-nowrap border-b border-hairline py-3 pl-0 pr-4"
      >
        {categories.map((c) =>
          c.slug === slug ? (
            <span
              key={c.slug}
              ref={activeRef}
              className="border-l-2 border-ink pl-3 text-[14px] font-bold text-ink"
            >
              {c.name}
            </span>
          ) : (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="border-l-2 border-transparent pl-3 text-[14px] text-meta"
            >
              {c.name}
            </Link>
          )
        )}
      </nav>

      {/* 2단 — 소분류 (연회색 띠) */}
      <nav className="rail flex items-center gap-4 whitespace-nowrap border-b border-hairline bg-[#F5F4F1] px-[14px] py-[11px]">
        {["전체", ...category.sub].map((s) => (
          <button
            key={s}
            onClick={() => setSub(s)}
            className={`text-[13px] ${sub === s ? "font-bold text-ink" : "text-meta"}`}
          >
            {s}
          </button>
        ))}
      </nav>

      {/* 필터·정렬 줄 */}
      <div className="flex items-center justify-between border-b border-hairline px-[14px] py-[10px]">
        <div className="flex gap-[6px]">
          <button
            onClick={() => setSheet("concern")}
            className={`flex min-h-[34px] items-center gap-[3px] rounded border px-[10px] text-[12px] ${
              concern ? "border-ink font-medium text-ink" : "border-line text-body"
            }`}
          >
            {concernName ?? "고민"} <Icon name="chevron-down" size={13} />
          </button>
          <button className="flex min-h-[34px] items-center gap-[3px] rounded border border-line px-[10px] text-[12px] text-body">
            성분 <Icon name="chevron-down" size={13} />
          </button>
          <button className="flex min-h-[34px] items-center gap-[3px] rounded border border-line px-[10px] text-[12px] text-body">
            가격 <Icon name="chevron-down" size={13} />
          </button>
        </div>
        <button
          onClick={() => setSheet("sort")}
          className="flex min-h-[34px] items-center gap-[2px] text-[13px] font-medium text-ink"
        >
          {sorts.find((s) => s.key === sort)!.label} <Icon name="chevron-down" size={14} />
        </button>
      </div>

      {/* 개수 */}
      <p className="border-b border-hairline px-[14px] py-[9px] text-[13px] text-meta">
        총 {won(list.length)}개
      </p>

      {/* 그리드 */}
      <main className="flex-1">
        {list.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <p className="text-[15px] font-bold text-ink">조건에 맞는 상품이 아직 없어요</p>
            <p className="mt-2 text-[13px] text-meta">필터를 바꾸거나 다른 고민을 선택해 보세요.</p>
            <button
              onClick={() => setConcern(null)}
              className="mt-5 h-11 rounded border border-ink px-5 text-[14px] font-medium text-ink"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-[3px]">
            {list.map((p, i) => (
              <div key={p.id} className={i % 2 === 0 ? "border-r-[3px] border-surface" : ""}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/*
        상품 목록에만 탭바가 없어서, 한참 둘러본 뒤 홈으로 가려면
        뒤로가기를 여러 번 눌러야 했다. 다른 13개 화면에는 이미 있다.
      */}
      <TabBar />

      {/* 바텀시트 */}
      {sheet && (
        <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-app flex-col justify-end">
          <button
            aria-label="닫기"
            onClick={closeSheet}
            className={`flex-1 bg-[rgba(28,24,21,0.45)] ${
              closing ? "animate-fade-out" : "animate-fade-in"
            }`}
          />
          <div
            className={`rounded-t-[8px] bg-surface px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-4 ${
              closing ? "animate-sheet-down" : "animate-sheet-up"
            }`}
          >
            <p className="pb-3 text-[15px] font-bold text-ink">
              {sheet === "concern" ? "고민 선택" : "정렬"}
            </p>
            {sheet === "concern" ? (
              <div className="flex flex-wrap gap-2 pb-2">
                <button
                  onClick={() => {
                    setConcern(null);
                    closeSheet();
                  }}
                  className={`min-h-[40px] rounded border px-[14px] text-[13px] ${
                    concern === null ? "border-ink bg-ink text-on-ink" : "border-line text-body"
                  }`}
                >
                  전체
                </button>
                {concerns.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => {
                      setConcern(c.slug);
                      closeSheet();
                    }}
                    className={`min-h-[40px] rounded border px-[14px] text-[13px] ${
                      concern === c.slug ? "border-ink bg-ink text-on-ink" : "border-line text-body"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="pb-2">
                {sorts.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => {
                      setSort(s.key);
                      closeSheet();
                    }}
                    className={`flex min-h-[46px] w-full items-center justify-between text-[14px] ${
                      sort === s.key ? "font-bold text-ink" : "text-body"
                    }`}
                  >
                    {s.label}
                    {sort === s.key && <Icon name="check" size={17} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
