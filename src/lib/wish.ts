"use client";

import { useSyncExternalStore } from "react";
import { clearScoped, currentScope, readScoped, registerScoped, writeScoped } from "./scope";

/**
 * 찜 스토어 — localStorage 영속 + 구독. 저장은 **계정(uid)별**이다(`scope.ts`).
 * 수량 개념이 없으므로 토글만 지원한다. 최근에 찜한 것이 앞에 온다.
 */
export type WishItem = { kind: "product" | "routine"; id: string };

const KEY = "rivea-wish";
let items: WishItem[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function readFor(uid: string | null): WishItem[] {
  return readScoped<WishItem[]>(KEY, uid, []);
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

function persist() {
  writeScoped(KEY, currentScope(), items);
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): WishItem[] {
  load();
  return items;
}

const EMPTY: WishItem[] = [];
function getServerSnapshot(): WishItem[] {
  return EMPTY;
}

export function useWish(): WishItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** 특정 항목의 찜 여부. 정적 렌더 시점엔 항상 false(빈 하트)로 시작한다. */
export function useIsWished(kind: WishItem["kind"], id: string): boolean {
  const list = useWish();
  return list.some((i) => i.kind === kind && i.id === id);
}

export function toggleWish(kind: WishItem["kind"], id: string) {
  load();
  const found = items.some((i) => i.kind === kind && i.id === id);
  items = found
    ? items.filter((i) => !(i.kind === kind && i.id === id))
    : [{ kind, id }, ...items];
  emit();
}

export function removeFromWish(kind: WishItem["kind"], id: string) {
  load();
  items = items.filter((i) => !(i.kind === kind && i.id === id));
  emit();
}

/** 다른 계정으로 로그인했을 때 게스트가 찜한 것을 합친다 (합집합, 게스트 쪽이 더 최근이라 앞) */
export function mergeWishInto(fromUid: string, toUid: string) {
  const from = readFor(fromUid);
  if (from.length === 0) return;
  const to = readFor(toUid);
  const merged = [...from, ...to].filter(
    (item, i, all) => all.findIndex((x) => x.kind === item.kind && x.id === item.id) === i
  );
  writeScoped(KEY, toUid, merged);
  clearScoped(KEY, fromUid);
}
