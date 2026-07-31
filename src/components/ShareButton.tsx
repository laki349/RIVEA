"use client";

import { useState } from "react";
import Icon from "./Icon";

/**
 * 공유 버튼 — 상품·루틴 상세에서 링크를 보낸다.
 *
 * 폰에서는 `navigator.share`로 OS 공유 시트(카톡·문자·메모)를 띄우고,
 * 지원하지 않는 브라우저(주로 데스크탑)에서는 **클립보드 복사로 폴백**한다.
 * 카카오 SDK를 쓰지 않은 이유: JS 키를 클라이언트에 박아야 하고 도메인 등록이 필요한데,
 * OS 공유 시트가 이미 카톡을 포함하고 정적 배포에 추가 설정이 없다.
 *
 * 카톡에서 미리보기 카드가 뜨는 건 이 버튼이 아니라 각 페이지의 og 태그
 * (`generateMetadata`)가 하는 일이다. 여기서는 링크만 넘긴다.
 */
export default function ShareButton({
  title,
  text,
  label = "공유",
}: {
  title: string;
  /** 공유 시트에 함께 들어가는 한 줄 설명 */
  text?: string;
  label?: string;
}) {
  const [toast, setToast] = useState("");

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return; // 공유 시트가 결과를 알려주므로 토스트를 겹치지 않는다
      }
      await navigator.clipboard.writeText(url);
      flash("링크를 복사했어요");
    } catch (e) {
      // 사용자가 공유 시트를 닫은 것은 실패가 아니다
      if ((e as { name?: string })?.name === "AbortError") return;
      flash("링크 복사에 실패했어요");
    }
  };

  const flash = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <>
      {toast && (
        <div className="pointer-events-none fixed bottom-[92px] left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-2 whitespace-nowrap rounded bg-ink px-4 py-[11px] text-[14px] text-on-ink shadow-[0_4px_16px_rgba(28,24,21,0.25)]">
            <Icon name="check" size={15} />
            {toast}
          </div>
        </div>
      )}
      <button
        onClick={share}
        aria-label={label}
        className="flex h-11 w-9 items-center justify-center text-ink"
      >
        <Icon name="share" size={20} />
      </button>
    </>
  );
}
