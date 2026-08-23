"use client";

import { useState } from "react";
import {
  STOP_REASONS,
  answer as saveAnswer,
  question,
  type Checkpoint,
  type StopReason,
} from "@/lib/verdict";
import type { ShelfEntry } from "@/lib/shelf";

/**
 * 판정 카드 — 「28일 됐어요. 계속 쓸까요?」
 *
 * 배너가 아니라 카드다. 배너는 광고처럼 읽혀서 넘긴다. 이건 답을 받아야 하는 질문이다.
 *
 * 세 갈래로만 받는다: 계속 / 그만 / 모르겠다.
 *  - **「모르겠다」를 반드시 둔다.** 없으면 모르는 사람이 아무거나 누르고,
 *    그 순간 데이터가 거짓이 된다. 「효과 모르겠다」 72%가 이 앱의 출발점인데
 *    그 답을 못 하게 만들면 앞뒤가 안 맞는다
 *  - 「그만」은 이유 1탭까지 받는다. **이유가 없으면 그만둔 이유를 우리가 지어내게 된다**
 */
export default function VerdictCard({
  entry,
  day,
  onDone,
}: {
  entry: ShelfEntry;
  day: Checkpoint;
  onDone?: () => void;
}) {
  const [asking, setAsking] = useState(false);
  const q = question(day, entry.name);

  const answer = (a: "continue" | "unsure") => {
    saveAnswer(entry.id, day, a);
    onDone?.();
  };
  const stop = (reason: StopReason) => {
    saveAnswer(entry.id, day, "stop", reason);
    onDone?.();
  };

  return (
    <div className="border border-ink bg-surface p-4">
      <p className="mb-[6px] inline-block bg-ink px-[7px] py-[2px] text-[14px] font-medium text-on-ink">
        {day}일째 · 판정
      </p>
      <h3 className="text-[19px] font-bold leading-[1.4] text-ink">{q.title}</h3>
      <p className="mt-[6px] text-[16px] leading-[1.6] text-body">{q.note}</p>

      {!asking ? (
        <div className="mt-[14px] flex gap-[6px]">
          <button
            onClick={() => answer("continue")}
            className="press h-[46px] flex-1 rounded-cta bg-ink text-[17px] font-medium text-on-ink"
          >
            계속 쓸게요
          </button>
          <button
            onClick={() => setAsking(true)}
            className="press h-[46px] flex-1 rounded-cta border border-ink text-[17px] font-medium text-ink"
          >
            그만할게요
          </button>
          <button
            onClick={() => answer("unsure")}
            className="press h-[46px] flex-1 rounded-cta border border-line text-[17px] text-body"
          >
            모르겠어요
          </button>
        </div>
      ) : (
        <div className="mt-[14px]">
          <p className="mb-[8px] text-[16px] font-medium text-ink">어떤 이유였어요?</p>
          <div className="flex flex-wrap gap-[6px]">
            {STOP_REASONS.map((r) => (
              <button
                key={r.key}
                onClick={() => stop(r.key)}
                className="press min-h-[44px] rounded-cta border border-ink px-[14px] text-[17px] text-ink"
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setAsking(false)}
            className="press mt-[8px] min-h-[44px] text-[16px] text-meta underline"
          >
            뒤로
          </button>
        </div>
      )}
    </div>
  );
}
