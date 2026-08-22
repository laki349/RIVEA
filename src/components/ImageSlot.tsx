import FadeImg from "./FadeImg";

/**
 * 이미지 슬롯 — src가 있으면 실제 이미지, 없으면 플레이스홀더.
 * 정적 export 환경이라 next/image 최적화 대신 순수 <img> 사용.
 */
export default function ImageSlot({
  label,
  className = "",
  tone = "light",
  src,
  alt = "",
  position = "center",
}: {
  label?: string;
  className?: string;
  tone?: "light" | "warm";
  src?: string;
  alt?: string;
  /** 인물 사진 등 초점이 중앙이 아닐 때 조정 (예: "left 30%") */
  position?: string;
}) {
  const bg = tone === "warm" ? "bg-[#DAD2C7]" : "bg-subtle";

  if (src) {
    return (
      <div className={`overflow-hidden ${bg} ${className}`}>
        {/* 로드되면 플레이스홀더 위로 떠오른다 (FadeImg 주석 참고) */}
        <FadeImg src={src} alt={alt} position={position} />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${bg} ${className}`}>
      {label && (
        <span className={`text-[12px] ${tone === "warm" ? "text-[#A99C8B]" : "text-disabled"}`}>
          {label}
        </span>
      )}
    </div>
  );
}
