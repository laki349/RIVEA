"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

/**
 * 하단 토스트 — 담기·복사 같은 "됐다" 신호.
 *
 * 전에는 BuyBar와 ShareButton이 각자 같은 마크업을 갖고 있었고,
 * 둘 다 **깜빡 나타났다 깜빡 사라졌다**. 시야 가장자리에서 일어나는 하드 컷은
 * 놓치기 쉽고, 봤더라도 "방금 뭐가 지나갔지?"로 남는다.
 *
 * 들어올 때는 아래에서 올라오며(감속), 나갈 때는 짧게 가라앉는다(가속).
 * 사라지는 애니메이션을 위해 언마운트를 150ms 늦춘다 — 안 그러면 퇴장이 안 보인다.
 */
export default function Toast({
  message,
  duration = 2200,
  onDone,
  action,
}: {
  message: string;
  /** 표시 시간(ms). 이 시간이 지나면 퇴장 애니메이션이 시작된다 */
  duration?: number;
  onDone: () => void;
  action?: { label: string; onClick: () => void };
}) {
  const [leaving, setLeaving] = useState(false);

  /**
   * onDone을 ref에 담는 이유: 호출부가 `onDone={() => setToast(false)}` 처럼
   * 인라인 함수를 넘기면 부모가 다시 렌더될 때마다 **함수 신원이 바뀐다.**
   * 그걸 의존성에 두면 타이머가 매번 처음부터 다시 시작해서,
   * 담기 직후처럼 부모가 자주 렌더되는 자리에서는 토스트가 안 사라진다.
   */
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const hide = setTimeout(() => setLeaving(true), duration);
    const remove = setTimeout(() => done.current(), duration + 150);
    return () => {
      clearTimeout(hide);
      clearTimeout(remove);
    };
  }, [duration]);

  return (
    <div className="pointer-events-none fixed bottom-[92px] left-1/2 z-50 -translate-x-1/2">
      <div
        className={`flex items-center gap-2 whitespace-nowrap rounded bg-ink px-4 py-[11px] text-[16px] text-on-ink shadow-[0_4px_16px_rgba(28,24,21,0.25)] ${
          leaving ? "animate-fall" : "animate-rise"
        }`}
      >
        <Icon name="check" size={15} />
        {message}
        {action && (
          <button
            onClick={action.onClick}
            className="pointer-events-auto ml-1 font-bold underline underline-offset-2"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
