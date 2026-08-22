"use client";

import { useSyncExternalStore } from "react";
import { concerns } from "@/data/catalog";
import { currentScope, readScoped, registerScoped, writeScoped } from "./scope";

/**
 * 내 피부 프로필 — 고민과 연령대. 계정(uid)별 저장.
 *
 * 왜 필요했나: 이 앱의 차별화 축은 concern-first IA("세럼"이 아니라 "기미·잡티"로 찾게 한다)인데,
 * 「내 피부 고민 설정하기」가 `/category`로 던지고 끝이었다. `/check`·`/gift`의 답도 버려졌다.
 * **입력을 받고 아무것도 안 하면 개인화가 아니라 설문이다.**
 *
 * 반영되는 곳은 홈 한 곳에 모았다 — 고민 레일 순서, 리베아's Pick 정렬, 연령대 인기 기본 탭.
 * 여러 화면에 흩뿌리면 사용자가 무엇 때문에 화면이 달라졌는지 알 수 없다.
 */
export type AgeKey = "40s" | "50s" | "60s";

export type Profile = {
  /** concern slug 배열. 입력 순서 = 우선순위 */
  concerns: string[];
  cohort: AgeKey | null;
};

export const EMPTY_PROFILE: Profile = { concerns: [], cohort: null };

/** 연령대 라벨 — 「또래」 같은 뭉뚱그린 표현을 쓰지 않는다 (docs/03 카피 원칙) */
export const AGE_LABELS: { key: AgeKey; label: string }[] = [
  { key: "40s", label: "40대" },
  { key: "50s", label: "50대" },
  { key: "60s", label: "60대 이상" },
];

const KEY = "rivea-profile";
let profile: Profile = EMPTY_PROFILE;
let loaded = false;
const listeners = new Set<() => void>();

function readFor(uid: string | null): Profile {
  const p = readScoped<Partial<Profile>>(KEY, uid, EMPTY_PROFILE);
  // 카탈로그에서 사라진 고민 slug는 버린다 — 없는 고민으로 정렬하면 조용히 틀린다
  const valid = (p.concerns ?? []).filter((slug) => concerns.some((c) => c.slug === slug));
  const cohort = AGE_LABELS.some((a) => a.key === p.cohort) ? (p.cohort as AgeKey) : null;
  return { concerns: valid, cohort };
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  profile = readFor(currentScope());
}

registerScoped((uid) => {
  if (typeof window === "undefined") return;
  loaded = true;
  profile = readFor(uid);
  listeners.forEach((l) => l());
});

function emit() {
  writeScoped(KEY, currentScope(), profile);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Profile {
  load();
  return profile;
}

function getServerSnapshot(): Profile {
  return EMPTY_PROFILE;
}

/** 정적 렌더 시점엔 항상 빈 프로필 — 개인화는 하이드레이션 이후에 적용된다 */
export function useProfile(): Profile {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function toggleConcern(slug: string) {
  load();
  profile = profile.concerns.includes(slug)
    ? { ...profile, concerns: profile.concerns.filter((s) => s !== slug) }
    : { ...profile, concerns: [...profile.concerns, slug] };
  emit();
}

export function setCohort(cohort: AgeKey | null) {
  load();
  profile = { ...profile, cohort };
  emit();
}

export function clearProfile() {
  load();
  profile = EMPTY_PROFILE;
  emit();
}

export const hasProfile = (p: Profile) => p.concerns.length > 0 || p.cohort !== null;

/**
 * 내 고민에 해당하는 것을 앞으로 당긴다. **순서만 바꾸고 빼지 않는다** —
 * 고른 고민 밖의 상품이 사라지면 둘러보기가 막히고, 고민이 하나뿐인 사용자에게는
 * 앱이 텅 빈 것처럼 보인다.
 */
export function sortByProfile<T>(items: T[], concernOf: (item: T) => string, picked: string[]): T[] {
  if (picked.length === 0) return items;
  const rank = (item: T) => {
    const i = picked.indexOf(concernOf(item));
    return i === -1 ? picked.length : i;
  };
  return [...items].sort((a, b) => rank(a) - rank(b));
}
