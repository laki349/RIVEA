"use client";

import { useSyncExternalStore } from "react";

/**
 * 찜 스토어 — localStorage 영속 + 구독. (cart.ts와 같은 패턴)
 * 수량 개념이 없으므로 토글만 지원한다. 최근에 찜한 것이 앞에 온다.
 */
export type WishItem = { kind: "product" | "routine"; id: string };

const KEY = "rivea-wish";
let items: WishItem[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) items = JSON.parse(raw);
  } catch {
    items = [];
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* 저장 불가 환경 무시 */
  }
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
