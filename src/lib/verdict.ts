"use client";

import { useSyncExternalStore } from "react";
import { track } from "./events";
import { currentScope, readScoped, registerScoped, writeScoped } from "./scope";
import type { ShelfEntry } from "./shelf";

/**
 * 판정 — **「효과가 있는 건지 모르겠다」에 대한 답.**
 *
 * 설문 n=32에서 쓰는 중 불편 1위가 이것이었다(23/32, 72%). 전체 최대 신호다.
 * 그리고 그 다음이 방치·폐기(18/32, 56%)다. 두 숫자는 이어져 있다 —
 * **판단할 시점을 아무도 안 알려주니까 판단을 안 하고, 그래서 서랍에 쌓인다.**
 *
 * 파는 쪽이 먼저 "아직 판단하지 마세요"와 "이제 판단하세요"를 말하는 것이
 * 이 앱이 커머스와 갈리는 지점이다. 계속 쓰라고 하지 않고 **그만 쓰라는 답을 먼저 둔다.**
 *
 * 설계 (`docs/16` C-2 부품 1~3)
 *  - 체크포인트는 저장하지 않는다. **시작일에서 파생**한다 — 저장하면 앱을 언제 켜느냐에
 *    따라 시점이 어긋나고, 화장대가 주문에서 파생되는 방식과도 어긋난다
 *  - **답만 저장한다.** 답은 사용자가 만든 유일한 정보라 파생시킬 수 없다
 *  - 신규 라우트 0개. 판정은 화장대 안에서 시작하고 끝난다
 */

/**
 * 체크포인트 두 개.
 *
 * 14일 — 세라마이드처럼 장벽 쪽은 2주면 답이 온다(`docs/17` §8: 가려움 14일차,
 *        건조 14·28일차 유의). 여기서 "안 맞는다"는 판단은 충분히 가능하다.
 * 28일 — 4주. **효과 판정이 아니라 「계속 쓸지」 판정이다.** 색소 12주·구조 12주라
 *        4주에 효과를 결론내면 멀쩡한 것도 버린다. 그래서 문구가 다르다.
 */
export const CHECKPOINTS = [14, 28] as const;
export type Checkpoint = (typeof CHECKPOINTS)[number];

export type Answer = "continue" | "stop" | "unsure";

/** 「그만」의 이유. 자유 텍스트를 받지 않는다 — 1탭으로 끝나야 답이 모인다 */
export type StopReason = "not-for-me" | "no-effect" | "forgot";

export const STOP_REASONS: { key: StopReason; label: string }[] = [
  { key: "not-for-me", label: "안 맞아서" },
  { key: "no-effect", label: "효과가 없어서" },
  { key: "forgot", label: "잊어버려서" },
];

export type VerdictRecord = {
  answer: Answer;
  reason?: StopReason;
  /** 어느 체크포인트에 답했나 */
  day: Checkpoint;
  at: number;
};

/** entryId → 체크포인트별 답 */
type Store = Record<string, Partial<Record<Checkpoint, VerdictRecord>>>;

const KEY = "rivea-verdict";
let store: Store = {};
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  store = readScoped<Store>(KEY, currentScope(), {});
}

registerScoped((uid) => {
  if (typeof window === "undefined") return;
  loaded = true;
  store = readScoped<Store>(KEY, uid, {});
  listeners.forEach((l) => l());
});

function emit() {
  writeScoped(KEY, currentScope(), store);
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  load();
  listeners.add(l);
  return () => listeners.delete(l);
}
const EMPTY: Store = {};
const getSnapshot = () => { load(); return store; };
const getServerSnapshot = () => EMPTY;

export function useVerdicts(): Store {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const DAY = 24 * 60 * 60 * 1000;

/**
 * 「언제부터 쓰셨어요?」 — 등록할 때 1탭으로 받는다.
 *
 * 화장대는 「이미 쓰고 있는 것」을 넣는 곳이다. 등록일을 시작일로 치면
 * 석 달 쓴 제품에도 2주 뒤에 「2주 됐어요」가 뜬다. 그건 그냥 틀린 화면이다.
 *
 * 날짜 입력을 받지 않는 이유: 40대+ 대상에서 날짜 피커는 그 자리에서 이탈한다
 * (`docs/15`의 입력 부담 판정과 같은 처리). 구간 세 개면 판정 시점을 정하는 데 충분하다.
 * 정확한 날짜가 필요한 계산이 아니라 **체크포인트를 지났나만 보면 되기 때문이다.**
 */
export const STARTED_OPTIONS: { key: string; label: string; daysAgo: number }[] = [
  { key: "new", label: "이번에 처음 써요", daysAgo: 0 },
  { key: "2w", label: "2주쯤 됐어요", daysAgo: 14 },
  { key: "1m", label: "한 달 넘었어요", daysAgo: 28 },
];

/** 선택한 구간을 시작 시각으로 바꾼다 */
export const startedAtFrom = (daysAgo: number, now = Date.now()) => now - daysAgo * DAY;

/** 며칠째 쓰고 있나. 시작일을 모르면 null */
export function daysUsed(entry: ShelfEntry, now = Date.now()): number | null {
  if (entry.startedAt === null) return null;
  return Math.floor((now - entry.startedAt) / DAY);
}

/**
 * 지금 물어야 할 체크포인트. 없으면 null.
 *
 * 지난 체크포인트 중 **아직 답 안 한 가장 최근 것**을 고른다.
 * 14일을 놓치고 30일에 열었으면 28일을 묻는다 — 지나간 14일을 지금 묻는 건 의미가 없다.
 *
 * ⚠️ **이미 답한 것보다 앞선 체크포인트는 다시 묻지 않는다.** 이걸 빼놨더니
 *    28일에 답한 직후 14일 카드가 떴다 — 시간을 거슬러 묻는 화면이 된다.
 *    나중 체크포인트에 답했다는 건 그 앞은 이미 지나갔다는 뜻이다.
 */
export function dueCheckpoint(
  entry: ShelfEntry,
  answers: Store,
  now = Date.now()
): Checkpoint | null {
  const d = daysUsed(entry, now);
  if (d === null) return null;
  const mine = answers[entry.id] ?? {};
  const answered = CHECKPOINTS.filter((c) => mine[c]);
  const latestAnswered = answered.length ? answered[answered.length - 1] : 0;
  const passed = CHECKPOINTS.filter((c) => d >= c && c > latestAnswered && !mine[c]);
  return passed.length ? passed[passed.length - 1] : null;
}

/** 판정 대기 목록. 홈 슬롯과 화장대가 같은 함수를 본다 */
export function pending(entries: ShelfEntry[], answers: Store, now = Date.now()) {
  return entries
    .map((e) => ({ entry: e, day: dueCheckpoint(e, answers, now) }))
    .filter((x): x is { entry: ShelfEntry; day: Checkpoint } => x.day !== null);
}

/**
 * 답을 저장한다. **계측은 답만 보낸다** — 제품 id는 자유 텍스트가 아니지만
 * 직접 입력한 제품이면 이름이 id에 섞이지 않는다는 보장이 없다(`c<타임스탬프>`라
 * 실제로는 안전하지만, 규칙을 여기서 느슨하게 두지 않는다).
 */
export function answer(entryId: string, day: Checkpoint, a: Answer, reason?: StopReason) {
  load();
  store = { ...store, [entryId]: { ...(store[entryId] ?? {}), [day]: { answer: a, reason, day, at: Date.now() } } };
  track("verdict_answer", reason ? `${a}:${reason}` : a);
  emit();
}

/** 이 체크포인트에서 뭐라고 물을 것인가 */
export function question(day: Checkpoint, name: string): { title: string; note: string } {
  return day === 14
    ? {
        title: `${name}, 2주 됐어요. 어떠세요?`,
        note: "지금은 「효과가 있나」가 아니라 「안 맞지는 않나」를 보는 시점이에요. 따갑거나 뒤집어졌으면 그만두는 게 맞아요.",
      }
    : {
        title: `${name}, 4주 됐어요. 계속 쓸까요?`,
        note: "색소나 주름은 12주쯤 가야 답이 나와요. 4주에 효과로 판단하면 멀쩡한 것도 버립니다. 지금은 계속 쓸 수 있는지만 정하세요.",
      };
}
