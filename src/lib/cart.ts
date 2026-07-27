"use client";

import { useSyncExternalStore } from "react";

/**
 * 장바구니 스토어 — localStorage 영속 + 구독.
 * 상품은 단품으로, 루틴은 "세트 한 줄"(세트가 유지)로 담는다.
 */
export type CartItem = { kind: "product" | "routine"; id: string; qty: number };

const KEY = "rivea-cart";
let items: CartItem[] = [];
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

function getSnapshot(): CartItem[] {
  load();
  return items;
}

const EMPTY: CartItem[] = [];
function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function addToCart(kind: CartItem["kind"], id: string, qty = 1) {
  load();
  const found = items.find((i) => i.kind === kind && i.id === id);
  items = found
    ? items.map((i) => (i === found ? { ...i, qty: i.qty + qty } : i))
    : [...items, { kind, id, qty }];
  emit();
}

export function setQty(kind: CartItem["kind"], id: string, qty: number) {
  load();
  items = items.map((i) =>
    i.kind === kind && i.id === id ? { ...i, qty: Math.max(1, qty) } : i
  );
  emit();
}

export function removeFromCart(kind: CartItem["kind"], id: string) {
  load();
  items = items.filter((i) => !(i.kind === kind && i.id === id));
  emit();
}

export function removeMany(keys: { kind: CartItem["kind"]; id: string }[]) {
  load();
  items = items.filter((i) => !keys.some((k) => k.kind === i.kind && k.id === i.id));
  emit();
}

export function clearCart() {
  load();
  items = [];
  emit();
}
