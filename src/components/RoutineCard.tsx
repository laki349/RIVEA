import Link from "next/link";
import { discountRate, routineImage, routineListPrice, won, type Routine } from "@/data/catalog";
import ImageSlot from "./ImageSlot";

/**
 * 루틴 세트 카드 — 가로 스크롤 레일용 (200px, 각진 보더 카드)
 */
export default function RoutineCard({ routine }: { routine: Routine }) {
  const listPrice = routineListPrice(routine);
  const rate = discountRate({ price: routine.price, listPrice });

  return (
    <Link
      href={`/routine/${routine.id}`}
      className="press-card block w-[200px] flex-shrink-0 overflow-hidden rounded border border-hairline"
    >
      <div className="relative">
        <ImageSlot
          className="h-[110px] w-full"
          tone="warm"
          src={routineImage(routine.id)}
          alt={routine.title}
        />
        <span className="absolute left-2 top-2 rounded-badge bg-ink px-[7px] py-[3px] text-[14px] font-medium text-on-ink">
          {routine.badge}
        </span>
      </div>
      <div className="px-3 pb-[13px] pt-[11px]">
        <p className="text-[14px] font-bold text-rose">{routine.label}</p>
        <p className="mb-2 mt-1 h-[45px] overflow-hidden text-[16px] font-bold leading-[1.4] text-ink">
          {routine.title}
        </p>
        <div className="flex items-baseline gap-[5px]">
          {rate !== null && rate > 0 && <span className="text-[15px] font-bold text-rose">{rate}%</span>}
          <span className="text-[18px] font-bold text-ink">{won(routine.price)}</span>
        </div>
      </div>
    </Link>
  );
}
