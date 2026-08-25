"use client";

import { SKIN_SIGNALS, setSignals, useProfile, type SkinSignal } from "@/lib/profile";
import { weightsFrom } from "@/lib/fit";
import { track } from "@/lib/events";
import Icon from "./Icon";

/**
 * 피부 상태 — 고민과 **다른 축**을 받는 자리.
 *
 * 고민은 「뭘 해결할까」고 이건 「내 피부가 견딜 만한가」다. 기미 고민인 사람이
 * 지성일 수도 건성일 수도 있는데, 전까지 처방은 그걸 안 봤다. 설문에서 「고를 때
 * 불편」 1위가 「이게 나한테 맞는 건지 모르겠다」 16/32(50%)였고(`docs/15`),
 * 그 문장의 '맞는'이 정확히 이쪽이다.
 *
 * ## 타입을 묻지 않는 이유
 *
 * 「건성/지성/복합성」은 **안 맞는 사람을 만든다.** 40대+에 흔한 「당기면서 번들거림」이
 * 4분법 어디에도 없고, 이 프로젝트는 강제 단일선택으로 이미 데였다(설문 72%).
 * 그래서 복수 선택이고, 고른 것들이 타입 이름으로 합쳐지지 않는다 —
 * 곧장 처방 조정값이 된다(`lib/fit.ts`).
 *
 * 진단이 아니라는 점도 같은 이유다. `youIf`와 같은 원칙으로, 관찰 가능한 상황만 받고
 * 「당신은 지성입니다」로 단정하지 않는다.
 *
 * 아무것도 안 고르면 처방은 이 기능이 없을 때와 **정확히 같다.** 그게 「모르겠다」의 자리다.
 *
 * ⚠️ 자리는 **고민 바로 다음**이다(`ProfileForm`). 처방 아래에 뒀더니 설정이 두 곳으로
 *    갈라졌다 — 사용자에게는 한 번에 끝내야 할 일이다.
 */
export default function FitPanel() {
  const profile = useProfile();
  const chosen = profile.signals;
  const on = chosen.length > 0;
  // 자극을 낮추면 **근거가 두꺼운 성분이 뒤로 밀린다.** 그건 공짜가 아니라 교환이고,
  // 교환이라는 사실을 말하지 않으면 유리한 절반만 보여주는 게 된다.
  const gentle = weightsFrom(chosen).gentle > 0;

  const toggle = (key: SkinSignal) => {
    const next = chosen.includes(key) ? chosen.filter((k) => k !== key) : [...chosen, key];
    setSignals(next);
    // 몇 명이 실제로 쓰는지 남긴다 — 의향 진술이 아니라 행동으로 확인한다
    if (next.length > 0) track("concern_select", "fit");
  };

  return (
    <section className="border-b border-hairline px-4 pb-5 pt-[18px]">
      <h2 className="text-[21px] font-bold text-ink">요즘 피부는 어떠세요?</h2>
      <p className="mt-2 text-[17px] leading-[1.6] text-body">
        해당하는 걸 다 골라주세요. 고른 만큼 제형과 자극 세기를 맞춰드려요.
        <br />
        해당하는 게 없으면 넘어가셔도 됩니다.
      </p>

      <div className="mt-4 flex flex-col gap-[8px]">
        {SKIN_SIGNALS.map((s) => {
          const active = chosen.includes(s.key);
          return (
            <button
              key={s.key}
              onClick={() => toggle(s.key)}
              aria-pressed={active}
              className={`press flex min-h-[52px] items-center gap-[10px] rounded border px-[13px] py-[10px] text-left text-[17px] leading-[1.45] ${
                active ? "border-ink bg-bg-tint font-medium text-ink" : "border-line text-body"
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
        <div className="mt-[13px] rounded bg-subtle px-[12px] py-[10px]">
          <p className="text-[16px] leading-[1.6] text-ink">
            루틴에 반영했어요. 제품을 빼는 게 아니라, 같은 자리에서 더 맞는 쪽을 앞에 둡니다.
          </p>
          {gentle && (
            <p className="mt-[8px] border-t border-line pt-[8px] text-[16px] leading-[1.6] text-body">
              대신 <b className="font-bold">레티놀·산이 뒤로 밀립니다.</b> 자극이 걱정되면 그게
              맞아요. 쓰고 싶으시면 주 1~2회부터 시작하는 방법도 있습니다.
            </p>
          )}
        </div>
      )}

      <p className="mt-[10px] text-[16px] leading-[1.6] text-meta">
        진단이 아니에요. 고르신 것만 반영하고, 반응은 사람마다 다릅니다.
      </p>
    </section>
  );
}
