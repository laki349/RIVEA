import { brands } from "@/data/catalog";
import ImageSlot from "./ImageSlot";

export default function BrandRail() {
  return (
    <div className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
      {brands.map((b) => (
        <div
          key={b.id}
          className="flex w-64 shrink-0 items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-soft transition hover:border-gold-soft sm:w-auto"
        >
          <ImageSlot
            src={b.logo}
            alt={`${b.name} 로고`}
            label=""
            rounded="rounded-full"
            className="h-14 w-14 shrink-0"
            sizes="56px"
            compact
          />
          <div className="min-w-0">
            <p className="truncate font-serif text-[15px] font-semibold text-espresso">
              {b.name}
            </p>
            <p className="truncate text-[12.5px] text-taupe">{b.blurb}</p>
            <p className="mt-0.5 text-[11px] text-stone">
              {b.origin} · since {b.since}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
