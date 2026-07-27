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
          <Link href={href} className="py-1 pl-3 text-[13px] text-meta">
            {linkLabel}
          </Link>
        )}
      </div>
      {sub && <p className="mt-[3px] text-[12px] text-meta">{sub}</p>}
    </div>
  );
}
