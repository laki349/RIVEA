/**
 * 이미지 슬롯 — 의도적으로 비워둔 플레이스홀더 (실제 이미지 확보 전까지)
 */
export default function ImageSlot({
  label,
  className = "",
  tone = "light",
}: {
  label?: string;
  className?: string;
  tone?: "light" | "warm";
}) {
  return (
    <div
      className={`flex items-center justify-center ${
        tone === "warm" ? "bg-[#DAD2C7]" : "bg-subtle"
      } ${className}`}
    >
      {label && (
        <span className={`text-[12px] ${tone === "warm" ? "text-[#A99C8B]" : "text-disabled"}`}>
          {label}
        </span>
      )}
    </div>
  );
}
