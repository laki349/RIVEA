import Link from "next/link";
import { ChevronRight } from "./Icons";

export default function SectionHeader({
  title,
  href,
  hrefLabel = "더보기",
}: {
  eyebrow?: string; // 더 이상 렌더하지 않음 (영어 대문자 꼬리표 제거)
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="text-xl font-semibold text-espresso sm:text-2xl">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-0.5 text-sm font-medium text-taupe transition hover:text-cocoa"
        >
          {hrefLabel}
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
