import Link from "next/link";
import Icon from "./Icon";
import type { Article } from "@/data/magazine";

/**
 * 컨텍스트 매거진 링크 — 고민·루틴·상품 상세에서 관련 기사로 보낸다.
 * 매거진의 실제 트래픽은 상단 바 색인이 아니라 이 링크에서 나온다.
 */
export default function ArticleLink({
  article,
  heading,
}: {
  article: Article;
  /** 이 자리에서 왜 이 기사를 권하는지 한 줄 (예: "이 성분 더 알아보기") */
  heading: string;
}) {
  return (
    <Link
      href={`/magazine/${article.slug}`}
      className="block border border-line px-[14px] py-[13px]"
    >
      <p className="flex items-center gap-[6px] text-[14px] font-bold text-rose">
        <Icon name="sparkle" size={14} />
        {heading}
      </p>
      <p className="mt-[7px] text-[17px] font-bold leading-[1.4] text-ink">{article.title}</p>
      <p className="mt-[5px] text-[15px] leading-[1.6] text-soft">{article.dek}</p>
      <p className="mt-[9px] flex items-center gap-1 text-[14px] text-meta">
        매거진 · {article.kind} · {article.readMinutes}분
        <Icon name="chevron-right" size={13} />
      </p>
    </Link>
  );
}
