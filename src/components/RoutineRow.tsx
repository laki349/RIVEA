import Link from "next/link";
import type { Pick } from "@/data/picks";
import { pickItemProduct } from "@/data/picks";
import ImageSlot from "./ImageSlot";
import { ChevronRight } from "./Icons";

// 가로로 길쭉한 루틴 바 — 한 줄이 루틴 하나.
// 안에 제품 4개를 작은 사각형으로 [a][+][b][+][c][+][d] 나란히 두고,
// 옆에 제목·설명. 행 전체가 탭 영역(고민 상세로 이동).
export default function RoutineRow({ pick }: { pick: Pick }) {
  return (
    <Link
      href={`/pick/${pick.slug}`}
      className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-soft transition hover:border-gold-soft hover:shadow-card sm:gap-4 sm:p-4"
    >
      {/* 제품 4개 사각형 나란히 (a + b + c + d) */}
      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
        {pick.items.slice(0, 4).map((item, i) => {
          const product = pickItemProduct(item);
          return (
            <div key={item.productId} className="flex items-center gap-0.5 sm:gap-1.5">
              {i > 0 && (
                <span className="text-[11px] font-semibold text-stone sm:text-[13px]">
                  +
                </span>
              )}
              <span className="block h-9 w-9 sm:h-14 sm:w-14">
                <ImageSlot
                  src={product?.image}
                  alt={product?.name}
                  ratio="aspect-square"
                  label=""
                  rounded="rounded-lg"
                  sizes="56px"
                  compact
                />
              </span>
            </div>
          );
        })}
      </div>

      {/* 제목 + 설명 */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[13.5px] font-semibold text-cocoa sm:text-[15px]">
          {pick.title.replace("를 위한 리베아 Pick", "")}
        </h3>
        <p className="mt-0.5 truncate text-[12px] text-taupe">
          기기+화장품 {pick.items.length}종 · 브랜드 교차
        </p>
      </div>

      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-taupe transition group-hover:bg-cocoa group-hover:text-ivory">
        <ChevronRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
