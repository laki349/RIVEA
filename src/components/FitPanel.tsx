"use client";

import { SKIN_SIGNALS, setSignals, useProfile, type SkinSignal } from "@/lib/profile";
import { weightsFrom } from "@/lib/fit";
import { track } from "@/lib/events";
import Icon from "./Icon";

/**
 * 「이 루틴이 내 피부에 맞을까요?」 — 고민과 **다른 축**을 받는 자리.
 *
 * ## 왜 처방 아래인가
 *
 * 고민 다음에 바로 물으면 관문이 하나 더 생긴다. 그건 2026-08-25에 입구에서 로그인을
 * 걷어낸 것과 정확히 같은 실수다. **값을 먼저 보여주고 입력을 받는다** — 처방을 본
 * 사람만 「어, 이게 나한테 맞나?」를 묻게 되고, 그때가 답할 이유가 생긴 시점이다.
 *
 * ## 왜 타입을 안 묻나
 *
 * 「건성/지성/복합성」은 안 맞는 사람을 만든다. 40대+에 흔한 「당기면서 번들거림」이
 * 4분법 어디에도 없고, 이 프로젝트는 강제 단일선택으로 이미 데였다(설문 72%).
 * 그래서 **복수 선택**이고, 고른 것들이 타입 이름으로 합쳐지지 않는다 —
 * 곧장 처방 조정값이 된다 (`lib/fit.ts`).
 *
 * 아무것도 안 고르면 처방은 **이 기능이 없을 때와 똑같다.** 그게 「모르겠다」의 자리다.
 */
export default function FitPanel() {
  const profile = useProfile();
  const chosen = profile.signals;
  const on = chosen.length > 0;
  // 자극을 낮추면 **근거가 두꺼운 성분이 빠질 수 있다.** 그건 공짜가 아니라 교환이고,
  // 교환이라는 사실을 말하지 않으면 앱이 유리한 절반만 보여주는 게 된다.
  const gentle = weightsFrom(chosen).gentle > 0;

  const toggle = (key: SkinSignal) => {
    const next = chosen.includes(key) ? chosen.filter((k) => k !== key) : [...chosen, key];
    setSignals(next);
    // 몇 %가 이걸 실제로 쓰는지 남긴다 — 의향 진술이 아니라 행동으로 확인한다
    if (next.length > 0) track("concern_select", "fit");
  };

  return (
    <section className="border-t border-hairline px-4 py-4">
      <h2 className="text-[19px] font-bold leading-[1.4] text-ink">
        이 루틴이 내 피부에 맞을까요?
      </h2>
      <p className="mt-[6px] text-[16px] leading-[1.6] text-soft">
        해당하는 걸 <b className="font-bold">전부</b> 골라주세요. 고르면 위 순서가 그
        자리에서 다시 짜여요. 해당하는 게 없으면 안 고르셔도 됩니다.
      </p>

      <div className="mt-[13px] flex flex-col gap-[8px]">
        {SKIN_SIGNALS.map((s) => {
          const active = chosen.includes(s.key);
          return (
            <button
              key={s.key}
              onClick={() => toggle(s.key)}
              aria-pressed={active}
              className={`press flex min-h-[52px] items-center gap-[10px] rounded border px-[13px] py-[10px] text-left text-[17px] leading-[1.45] ${
                active
                  ? "border-ink bg-subtle font-medium text-ink"
                  : "border-line text-body"
              }`}
            >
              <span
                className={`flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-[5px] border ${
                  active ? "border-ink bg-ink text-on-ink" : "border-line-strong text-transparent"
                }`}
                aria-hidden
              >
                <Icon name="check" size={13} />
              </span>
              {s.label}
            </button>
          );
        })}
      </div>

      {on && (
        <div className="mt-[11px] rounded bg-subtle px-[11px] py-[9px]">
          <p className="text-[15px] leading-[1.6] text-body">
            고르신 걸 반영해 <b className="font-bold">제형과 자극 세기</b>를 조정했어요.
            제품을 빼지는 않고, 같은 자리에서 더 맞는 쪽을 앞에 둡니다.
          </p>
          {gentle && (
            <p className="mt-[7px] border-t border-line pt-[7px] text-[15px] leading-[1.6] text-body">
              대신 <b className="font-bold">레티놀·산처럼 근거가 두꺼운 성분이 뒤로 밀릴 수 있어요.</b>{" "}
              자극이 걱정되면 그게 맞지만, 쓰고 싶으시면 빼는 대신{" "}
              <b className="font-bold">주 1~2회부터</b> 시작하는 방법도 있어요.
            </p>
          )}
        </div>
      )}

      <p className="mt-[9px] text-[15px] leading-[1.6] text-meta">
        피부 상태를 진단하지 않아요. 고르신 관찰만 쓰고, 반응은 사람마다 달라요.
      </p>
    </section>
  );
}
