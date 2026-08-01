import Link from "next/link";

export default function SectionHeader({
  title,
  href,
  linkLabel = "전체보기",
  sub,
}: {
  title: React.ReactNode;
  href?: string;
  linkLabel?: string;
  sub?: string;
}) {
  return (
    <div className="px-4 pb-3 pt-[18px]">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[17px] font-bold text-ink">{title}</h2>
        {href && (
          /* 누르는 영역 44px. 세로 여백으로 채워서 글자 위치는 그대로 둔다 */
          <Link
            href={href}
            className="press -my-[8px] flex min-h-[44px] items-center pl-3 text-[13px] text-meta"
          >
            {linkLabel}
          </Link>
        )}
      </div>
      {sub && <p className="mt-[3px] text-[12px] text-meta">{sub}</p>}
    </div>
  );
}
