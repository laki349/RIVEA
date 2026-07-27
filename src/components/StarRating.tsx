import { StarIcon } from "./Icons";

export default function StarRating({
  value,
  count,
  size = "sm",
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const s = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-1 text-taupe">
      <StarIcon className={`${s} text-gold`} aria-hidden />
      <span className="text-[13px] font-semibold text-cocoa">{value.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-[12px] text-stone">({count.toLocaleString("ko-KR")})</span>
      )}
    </div>
  );
}
