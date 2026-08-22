"use client";

import { useState } from "react";

/**
 * "몇 개 쓰세요?" → 확인할 조합 수.
 *
 * 랜딩 첫 화면이 텍스트만이면 끝까지 안 내려간다. 그래서 **읽는 화면을 한 번 만지게 한다.**
 * 그리고 이건 장식이 아니다:
 *
 *  ① 조합 수는 nC2 = n(n-1)/2다. **지어낸 숫자가 아니라 계산**이라 반박당하지 않는다.
 *     4개면 6가지, 6개면 15가지. 자기 숫자를 누르는 순간 남 얘기가 자기 얘기가 된다.
 *  ② 아래 폼 1단계(제품 적기)의 예습이 된다. 여기서 이미 "내가 몇 개 쓰는지"를 세어봤으니
 *     폼에서 손이 멈추지 않는다.
 *
 * 기본값을 4로 둔 건, 안 누르고 지나가는 사람도 "6가지"라는 숫자는 보게 하려는 것이다.
 *
 * ⚠️ 화장품법 13조. 효능·효과를 말하지 않는다. 조합의 **개수**만 말한다.
 */

const OPTIONS = [2, 3, 4, 5, 6] as const;
const combos = (n: number) => (n * (n - 1)) / 2;

export default function ComboCounter() {
  const [n, setN] = useState<number>(4);
  const isMax = n === 6;

  return (
    <section className="border-b border-line px-5 py-9">
      <h2 className="text-[17px] font-bold leading-[1.45] text-ink">
        지금 얼굴에 몇 가지 바르고 계세요?
      </h2>

      <div role="radiogroup" aria-label="사용 중인 제품 개수" className="mt-4 flex gap-2">
        {OPTIONS.map((v) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={n === v}
            aria-label={v === 6 ? "6개 이상" : `${v}개`}
            onClick={() => setN(v)}
            className={`press h-11 flex-1 rounded border text-[16px] font-medium tabular-nums transition-colors duration-state ${
              n === v ? "border-ink bg-ink text-on-ink" : "border-line text-body"
            }`}
          >
            {v === 6 ? "6+" : v}
          </button>
        ))}
      </div>

      {/* 숫자가 바뀌는 자리 — 높이를 고정해 레이아웃이 흔들리지 않게 한다 */}
      <p aria-live="polite" className="mt-6 text-[19px] font-bold leading-[1.5] text-ink">
        확인할 조합이{" "}
        <span className="tabular-nums">{combos(n)}</span>가지입니다
        {isMax && <span className="text-meta"> (6개 기준)</span>}
      </p>
      <p className="mt-2 text-[16px] leading-[1.7] text-body">
        그중에 같이 쓰면 안 되는 게 섞여 있는지, 확인해 보신 적 있으세요?
      </p>
    </section>
  );
}
