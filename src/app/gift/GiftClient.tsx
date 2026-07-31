"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  concernOf,
  concerns,
  productOf,
  routineListPrice,
  routines,
  routineImage,
  won,
} from "@/data/catalog";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";

/**
 * 연령대별 고민 순위 — 엠브레인 트렌드모니터 「2022 피부 관리 및 홈뷰티 관련 인식 조사」
 * (전국 만 19~59세 여성 1,000명, 2022.4.27~29). docs/07 §2.
 *
 * 이 화면의 존재 이유가 여기 있다. 딸은 엄마 피부 고민을 모른다.
 * 그때 "모르겠어요"를 막다른 길로 두지 않고 **실제 조사 수치로 대신 답한다.**
 * 창작한 숫자가 아니라 출처가 있는 수치라서 화면에 출처를 같이 띄운다.
 */
type AgeBand = "40s" | "50s";

/**
 * 연령별 수치가 실제로 있는 항목만 쓴다. docs/07 §2가 연령대로 쪼개 주는 건
 * 「피부 잡티」와 「탄력 저하」 두 개뿐이고, 모공 60.5%는 전 연령 합계 수치라
 * 연령별 차트에 섞으면 오독을 만든다 — 그래서 넣지 않았다.
 * 배열은 반드시 pct 내림차순 = "가장 많이 답한" 순서와 일치해야 한다.
 */
const cohortTop: Record<AgeBand, { concern: string; pct: number; label: string }[]> = {
  "40s": [
    { concern: "pigment", pct: 77.2, label: "피부 잡티" },
    { concern: "wrinkle", pct: 65.4, label: "탄력 저하" },
  ],
  "50s": [
    { concern: "pigment", pct: 76.6, label: "피부 잡티" },
    { concern: "wrinkle", pct: 70.9, label: "탄력 저하" },
  ],
};

/** 수치만 보면 두 연령 모두 잡티가 1위다. 연령을 가르는 건 "어디서 정점인가"쪽 */
const cohortInsight: Record<AgeBand, string> = {
  "40s": "잡티 불만은 40대에서 가장 높게 나타나요 (전 연령 중 최고).",
  "50s": "탄력 저하는 50대에서 가장 높게 나타나요 (40대 65.4% → 50대 70.9%).",
};

const ageLabel: Record<AgeBand, string> = { "40s": "40대", "50s": "50대 이상" };

const budgets = [
  { key: "under10", label: "10만원 안쪽", max: 100000 },
  { key: "under20", label: "20만원 안쪽", max: 200000 },
  { key: "any", label: "좋은 걸로", max: Infinity },
] as const;

export default function GiftClient() {
  const [age, setAge] = useState<AgeBand | null>(null);
  const [knows, setKnows] = useState<boolean | null>(null);
  const [concern, setConcern] = useState<string | null>(null);
  const [budget, setBudget] = useState<(typeof budgets)[number]["key"] | null>(null);

  const suggested = age ? cohortTop[age] : [];
  const effectiveConcern = concern;

  const picks = useMemo(() => {
    if (!effectiveConcern || !budget) return [];
    const max = budgets.find((b) => b.key === budget)!.max;
    return routines
      .filter((r) => r.concern === effectiveConcern && r.price <= max)
      .sort((a, b) => b.price - a.price)
      .slice(0, 2);
  }, [effectiveConcern, budget]);

  const reset = () => {
    setAge(null);
    setKnows(null);
    setConcern(null);
    setBudget(null);
  };

  const done = effectiveConcern !== null && budget !== null;

  return (
    <main className="flex-1">
      <section className="border-b border-hairline px-4 pb-4 pt-4">
        <h2 className="text-[18px] font-bold leading-[1.4] text-ink">
          어머니께 드릴 홈케어, 대신 골라드려요
        </h2>
        <p className="mt-[6px] text-[14px] leading-[1.6] text-soft">
          고민을 모르셔도 괜찮아요. 연령대 조사 데이터로 시작해서, 순서까지 맞춰진 세트로
          정리해 드립니다.
        </p>
      </section>

      {/* 1. 연령대 */}
      <section className="border-b border-hairline px-4 py-4">
        <p className="mb-[10px] text-[15px] font-bold text-ink">
          <span className="text-rose">1</span> 어머니 연령대가 어떻게 되세요?
        </p>
        <div className="flex gap-[7px]">
          {(["40s", "50s"] as AgeBand[]).map((a) => (
            <button
              key={a}
              onClick={() => {
                setAge(a);
                setKnows(null);
                setConcern(null);
              }}
              className={`min-h-[48px] flex-1 rounded px-4 text-[15px] ${
                age === a
                  ? "bg-ink font-medium text-on-ink"
                  : "border border-line bg-surface text-body"
              }`}
            >
              {ageLabel[a]}
            </button>
          ))}
        </div>
      </section>

      {/* 2. 고민을 아는지 */}
      {age && (
        <section className="border-b border-hairline px-4 py-4">
          <p className="mb-[10px] text-[15px] font-bold text-ink">
            <span className="text-rose">2</span> 어머니 피부 고민을 아시나요?
          </p>
          <div className="flex gap-[7px]">
            <button
              onClick={() => setKnows(true)}
              className={`min-h-[48px] flex-1 rounded px-4 text-[15px] ${
                knows === true
                  ? "bg-ink font-medium text-on-ink"
                  : "border border-line bg-surface text-body"
              }`}
            >
              알아요
            </button>
            <button
              onClick={() => {
                setKnows(false);
                // 조사에서 1위인 고민으로 시작하되, 아래에서 바꿀 수 있게 둔다
                setConcern(age ? cohortTop[age][0].concern : null);
              }}
              className={`min-h-[48px] flex-1 rounded px-4 text-[15px] ${
                knows === false
                  ? "bg-ink font-medium text-on-ink"
                  : "border border-line bg-surface text-body"
              }`}
            >
              잘 몰라요
            </button>
          </div>

          {knows === true && (
            <div className="mt-3 flex flex-wrap gap-2">
              {concerns.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setConcern(c.slug)}
                  className={`min-h-[44px] rounded border px-[14px] text-[14px] ${
                    concern === c.slug ? "border-ink bg-ink text-on-ink" : "border-line text-body"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {/* 모를 때 — 막다른 길 대신 조사 데이터로 답한다 */}
          {knows === false && (
            <div className="mt-3 border border-hairline px-3 py-[13px]">
              <p className="text-[14px] font-bold leading-[1.45] text-ink">
                {ageLabel[age]} 여성이 가장 많이 답한 고민이에요
              </p>
              <p className="mt-[3px] text-[13px] leading-[1.6] text-meta">
                눌러서 기준을 바꿀 수 있어요
              </p>
              <div className="mt-[10px]">
                {suggested.map((s) => {
                  const on = concern === s.concern;
                  return (
                    <button
                      key={s.concern}
                      onClick={() => setConcern(s.concern)}
                      className="flex w-full items-center gap-3 border-b border-subtle py-[11px] text-left last:border-0"
                    >
                      <span
                        className={`w-[74px] flex-shrink-0 text-[14px] ${
                          on ? "font-bold text-ink" : "text-body"
                        }`}
                      >
                        {s.label}
                      </span>
                      <span className="h-[6px] flex-1 bg-subtle">
                        <span
                          className={`block h-full ${on ? "bg-rose" : "bg-ink"}`}
                          style={{ width: `${s.pct}%` }}
                          aria-hidden
                        />
                      </span>
                      <span
                        className={`w-[46px] flex-shrink-0 text-right text-[14px] font-bold ${
                          on ? "text-rose" : "text-ink"
                        }`}
                      >
                        {s.pct}%
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-[10px] text-[13px] leading-[1.6] text-body">
                {cohortInsight[age]}
              </p>
              <p className="mt-2 text-[13px] leading-[1.6] text-meta">
                엠브레인 트렌드모니터 「2022 피부 관리 및 홈뷰티 관련 인식 조사」 · 전국 만 19~59세
                여성 1,000명 · 2022.4
              </p>
            </div>
          )}
        </section>
      )}

      {/* 3. 예산 */}
      {effectiveConcern && (
        <section className="border-b border-hairline px-4 py-4">
          <p className="mb-[10px] text-[15px] font-bold text-ink">
            <span className="text-rose">3</span> 예산은 어느 정도 생각하세요?
          </p>
          <div className="flex gap-[7px]">
            {budgets.map((b) => (
              <button
                key={b.key}
                onClick={() => setBudget(b.key)}
                className={`min-h-[48px] flex-1 rounded px-2 text-[14px] ${
                  budget === b.key
                    ? "bg-ink font-medium text-on-ink"
                    : "border border-line bg-surface text-body"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 결과 */}
      {done && (
        <section className="px-4 py-4">
          <h3 className="mb-1 text-[16px] font-bold text-ink">
            {ageLabel[age!]} · {concernOf(effectiveConcern).name}
          </h3>
          <p className="mb-3 text-[13px] leading-[1.6] text-meta">
            {knows === false
              ? "연령대 조사에서 가장 많이 나온 고민을 기준으로 골랐어요."
              : "고르신 고민에 맞춰 순서까지 맞춰진 세트예요."}
          </p>

          {picks.length === 0 ? (
            <div className="border border-hairline px-3 py-[18px] text-center">
              <p className="text-[14px] font-bold text-ink">이 예산에 맞는 세트가 아직 없어요</p>
              <p className="mt-[6px] text-[13px] leading-[1.6] text-meta">
                예산을 한 단계 올리시면 이 고민에 맞는 세트를 보여드릴 수 있어요.
              </p>
            </div>
          ) : (
            picks.map((r) => {
              const listPrice = routineListPrice(r);
              return (
                <Link
                  key={r.id}
                  href={`/routine/${r.id}`}
                  className="mb-3 block border border-hairline last:mb-0"
                >
                  <ImageSlot
                    className="h-[150px] w-full"
                    tone="warm"
                    src={routineImage(r.id)}
                    alt={r.title}
                  />
                  <div className="px-3 py-[13px]">
                    <p className="text-[12px] font-bold text-rose">{r.label}</p>
                    <p className="mt-[3px] text-[15px] font-bold leading-[1.4] text-ink">
                      {r.title}
                    </p>
                    <p className="mt-[5px] text-[13px] leading-[1.55] text-soft">{r.description}</p>
                    <div className="mt-[9px] flex items-baseline gap-2">
                      <span className="text-[14px] text-disabled line-through">
                        {won(listPrice)}
                      </span>
                      <span className="text-[18px] font-bold text-ink">{won(r.price)}</span>
                    </div>
                    <p className="mt-[7px] text-[13px] text-meta">
                      {r.steps.map((s) => productOf(s.productId).volume).join(" · ")}
                    </p>
                    <span className="mt-[9px] flex items-center gap-1 text-[14px] font-medium text-ink">
                      순서와 이유 보기 <Icon name="chevron-right" size={15} />
                    </span>
                  </div>
                </Link>
              );
            })
          )}

          {/* 선물이라는 맥락에서 실제로 걸리는 것들 */}
          <div className="mt-4 border border-hairline px-3 py-[13px]">
            <p className="text-[14px] font-bold text-ink">선물로 보낼 때</p>
            <ul className="mt-[8px] text-[13px] leading-[1.7] text-body">
              <li>· 세트에는 사용 순서 안내가 함께 들어가요</li>
              <li>· 받는 분이 직접 교환·환불할 수 있어요</li>
              <li>· 기기는 무게를 확인하세요 — 무거우면 안 쓰게 됩니다</li>
            </ul>
          </div>

          <button
            onClick={reset}
            className="mt-4 flex h-12 w-full items-center justify-center rounded-cta border border-ink text-[15px] font-medium text-ink"
          >
            다시 고르기
          </button>
        </section>
      )}
    </main>
  );
}
