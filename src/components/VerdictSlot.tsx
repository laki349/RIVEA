"use client";

import { useEffect, useState } from "react";
import { useShelfEntries } from "@/lib/shelf";
import { pending, useVerdicts } from "@/lib/verdict";
import VerdictCard from "./VerdictCard";

/**
 * 홈의 판정 대기 슬롯 — **한 건만.**
 *
 * 배너가 아니라 슬롯이다(`docs/16` C-2 부품 4). 차이는 이렇다:
 *  - 배너는 항상 있고 광고를 담는다. 그래서 사람이 눈으로 건너뛰는 법을 익힌다
 *  - 슬롯은 **답할 게 있을 때만 나타나고, 답하면 사라진다.** 나타난 것 자체가 정보다
 *
 * 답할 게 없으면 아무것도 그리지 않는다. 빈 상태를 「판정할 것이 없어요」로 채우면
 * 그 순간 배너가 된다.
 *
 * 여러 건이 밀려도 하나만 낸다. 홈에서 세 개를 물으면 성의 없이 눌러버리고,
 * 그렇게 모인 답은 없느니만 못하다. 나머지는 화장대에서 이어 받는다.
 */
export default function VerdictSlot() {
  const entries = useShelfEntries();
  const verdicts = useVerdicts();
  // localStorage를 읽으므로 서버 렌더 결과와 다르다. 마운트 후에만 그린다
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const due = pending(entries, verdicts);
  if (due.length === 0) return null;

  return (
    <section className="border-b border-hairline px-4 py-4">
      <VerdictCard entry={due[0].entry} day={due[0].day} />
      {due.length > 1 && (
        <p className="mt-[8px] text-[13px] text-meta">
          판정할 게 {due.length - 1}건 더 있어요. 화장대에서 이어서 답할 수 있어요.
        </p>
      )}
    </section>
  );
}
