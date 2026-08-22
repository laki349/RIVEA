"use client";

import Icon from "./Icon";

/**
 * 별점 — 읽기 전용과 입력 겸용.
 *
 * 입력일 때 별 하나가 44px 타깃이다. 40대+ 대상에서 작은 별을 정확히 누르는 건
 * 실패하기 쉬운 동작이고, 실패하면 의도한 것보다 낮은 점수가 남는다.
 */
export default function StarRating({
  value,
  onChange,
  size = 20,
}: {
  value: number;
  /** 있으면 입력 모드 */
  onChange?: (v: number) => void;
  size?: number;
}) {
  const stars = [1, 2, 3, 4, 5];

  if (!onChange) {
    return (
      <span className="flex items-center gap-[2px] text-ink" aria-label={`별점 ${value}점`}>
        {stars.map((s) => (
          <Icon key={s} name={s <= value ? "star-fill" : "star"} size={size} />
        ))}
      </span>
    );
  }

  return (
    <span className="flex items-center" role="radiogroup" aria-label="별점">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={s === value}
          aria-label={`${s}점`}
          onClick={() => onChange(s)}
          className="press flex h-11 w-11 items-center justify-center text-ink"
        >
          <Icon name={s <= value ? "star-fill" : "star"} size={size + 6} />
        </button>
      ))}
    </span>
  );
}
