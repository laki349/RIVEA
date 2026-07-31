"use client";

import { useSyncExternalStore } from "react";
import { products, routines } from "@/data/catalog";
import { currentScope, readScoped, registerScoped, writeScoped } from "./scope";

/**
 * 최근 본 상품 — 계정(uid)별. (cart.ts / wish.ts와 같은 패턴)
 *
 * 커머스에서 재방문의 기본 동선이다. 사람은 한 번에 안 사고 며칠 걸쳐 재본다.
 * 마이페이지에 메뉴만 있고 눌러도 아무 일이 없던 자리를 실제로 채운다.
 *
 * 20개에서 자른다. 그보다 길면 "최근"이 아니고, 찾는 데 스크롤이 더 든다.
 */
export type RecentItem = {
  kind: "product" | "routine";
  id: string;
  /** 마지막으로 본 시각 (epoch ms) */
  at: number;
};

const KEY = "rivea-recent";
const LIMIT = 20;

let items: RecentItem[] = [];
let loaded = false;
const listeners = new Set<() => void>();

/** 카탈로그에서 사라진 id는 버린다 — 없는 상품을 목록에 두면 빈 카드가 남는다 */
function clean(list: RecentItem[]): RecentItem[] {
  return list.filter((i) =>
    i.kind === "product"
      ? products.some((p) => p.id === i.id)
      : routines.some((r) => r.id === i.id)
  );
}

function readFor(uid: string | null): RecentItem[] {
  return clean(readScoped<RecentItem[]>(KEY, uid, []));
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  items = readFor(currentScope());
}

registerScoped((uid) => {
  if (typeof window === "undefined") return;
  loaded = true;
  items = readFor(uid);
  listeners.forEach((l) => l());
});

function emit() {
  writeScoped(KEY, currentScope(), items);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): RecentItem[] {
  load();
  return items;
}

const EMPTY: RecentItem[] = [];
function getServerSnapshot(): RecentItem[] {
  return EMPTY;
}

/** 최근 본 것이 앞. 정적 렌더 시점엔 빈 배열 */
export function useRecent(): RecentItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * 본 것으로 기록한다. 이미 있으면 **맨 앞으로 올리고 시각만 갱신** —
 * 같은 상품을 세 번 봤다고 목록에 세 번 나오면 안 된다.
 */
export function markSeen(kind: RecentItem["kind"], id: string) {
  load();
  const rest = items.filter((i) => !(i.kind === kind && i.id === id));
  items = [{ kind, id, at: Date.now() }, ...rest].slice(0, LIMIT);
  emit();
}

export function clearRecent() {
  load();
  items = [];
  emit();
}
