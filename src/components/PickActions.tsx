"use client";

// 구매 링크 클릭 & 공유 — 이번 주 검증의 측정 지점.
// 지금은 콘솔 로깅만. 나중에 GA/Plausible 등으로 교체하면
// "어떤 Pick에서 어떤 상품 클릭이 나왔는지"가 그대로 지표가 됩니다.
import { ChevronRight } from "./Icons";

function track(event: string, detail: Record<string, string>) {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("[rebea-track]", event, detail);
  }
}

export function BuyLink({
  href,
  label,
  pick,
  product,
}: {
  href: string;
  label: string;
  pick: string;
  product: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("buy_click", { pick, product })}
      className="inline-flex items-center gap-1 rounded-lg bg-cocoa px-4 py-2 text-[13.5px] font-semibold text-ivory transition hover:bg-espresso"
    >
      {label}
      <ChevronRight className="h-4 w-4" />
    </a>
  );
}

export function ShareButton({ pick, title }: { pick: string; title: string }) {
  async function onShare() {
    track("share_click", { pick });
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("링크를 복사했어요. 카톡에 붙여넣어 보내보세요.");
      }
    } catch {
      /* 사용자가 취소 */
    }
  }
  return (
    <button
      type="button"
      onClick={onShare}
      className="rounded-xl border border-line-strong bg-white px-5 py-2.5 text-[14px] font-semibold text-cocoa transition hover:border-gold"
    >
      이 Pick 공유하기
    </button>
  );
}
