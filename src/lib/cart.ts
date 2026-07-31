"use client";

import { useSyncExternalStore } from "react";
import { clearScoped, currentScope, readScoped, registerScoped, writeScoped } from "./scope";

/**
 * 장바구니 스토어 — localStorage 영속 + 구독. 저장은 **계정(uid)별**이다(`scope.ts`).
 * 상품은 단품으로, 루틴은 "세트 한 줄"(세트가 유지)로 담는다.
 *
 * 선택(checked)이 여기 있는 이유: 예전엔 장바구니 화면의 로컬 state였고
 * 결제 화면은 장바구니 전체를 읽었다 — 선택 해제한 상품까지 결제되는 결함.
 * 스토어에 두면 결제·주문이 같은 선택을 보고, 새로고침해도 유지된다.
 */
export type CartItem = {
  kind: "product" | "routine";
  id: string;
  qty: number;
  /** 주문 대상 선택 여부. 예전 저장분에는 없어서 load()에서 true로 채운다 */
  checked: boolean;
};

const KEY = "rivea-cart";
let items: CartItem[] = [];
let loaded = false;
const listeners = new Set<() => void>();

/** checked 도입 전 저장분도 읽히게 — 기본은 전체 선택 */
function normalize(raw: Partial<CartItem>[]): CartItem[] {
  return raw
    .filter((i): i is CartItem => Boolean(i?.kind && i?.id))
    .map((i) => ({ ...i, qty: i.qty ?? 1, checked: i.checked ?? true }));
}

function readFor(uid: string | null): CartItem[] {
  return normalize(readScoped<Partial<CartItem>[]>(KEY, uid, []));
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  items = readFor(currentScope());
}

// 로그인·로그아웃으로 스코프가 바뀌면 그 계정의 장바구니로 갈아탄다
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
  // 이미 있던 줄에 더 담으면 선택 상태를 되살린다 — 방금 담은 걸 결제에서 빼면 안 된다
  items = found
    ? items.map((i) => (i === found ? { ...i, qty: i.qty + qty, checked: true } : i))
    : [...items, { kind, id, qty, checked: true }];
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

export function toggleChecked(kind: CartItem["kind"], id: string) {
  load();
  items = items.map((i) =>
    i.kind === kind && i.id === id ? { ...i, checked: !i.checked } : i
  );
  emit();
}

export function setAllChecked(checked: boolean) {
  load();
  items = items.map((i) => ({ ...i, checked }));
  emit();
}

/** 결제 대상 — 선택된 줄만 */
export function checkedItems(): CartItem[] {
  load();
  return items.filter((i) => i.checked);
}

export function clearCart() {
  load();
  items = [];
  emit();
}

/**
 * 게스트(from)가 이미 있는 계정(to)으로 로그인했을 때 장바구니를 합친다.
 * uid가 유지되는 승계(link)에서는 필요 없고, **다른 계정으로 로그인한 경우**에만 쓴다.
 * 수량은 큰 쪽을 남긴다 — 합산하면 양쪽에 2개씩 있던 게 4개가 돼 사용자가 의도한 적 없는 수량이 된다.
 */
export function mergeCartInto(fromUid: string, toUid: string) {
  const from = readFor(fromUid);
  if (from.length === 0) return;
  const merged = readFor(toUid);
  for (const f of from) {
    const found = merged.find((m) => m.kind === f.kind && m.id === f.id);
    if (found) {
      found.qty = Math.max(found.qty, f.qty);
      found.checked = found.checked || f.checked;
    } else {
      merged.push(f);
    }
  }
  writeScoped(KEY, toUid, merged);
  clearScoped(KEY, fromUid);
}
