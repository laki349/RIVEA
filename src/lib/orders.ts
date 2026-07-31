"use client";

import { useSyncExternalStore } from "react";
import type { Line } from "./lines";
import { clearScoped, currentScope, readScoped, registerScoped, writeScoped } from "./scope";

/**
 * 주문 스토어 — localStorage 영속 + 구독. (cart.ts / wish.ts와 같은 패턴)
 *
 * 결제 화면이 주문번호만 만들어 화면에 찍고 버리던 걸 여기로 옮겼다.
 * 주문은 "그때 그 값"이 남아야 하므로 카탈로그를 참조(id)만 하지 않고
 * 품목명·단가·이미지까지 **스냅샷으로 복사해 저장한다.**
 * 나중에 카탈로그 가격이 바뀌어도 지난 주문 금액이 흔들리지 않는다.
 *
 * 서버가 없으므로(정적 export) 이 주문은 이 브라우저에만 존재한다.
 * Firestore로 옮길 때는 이 모듈의 함수 시그니처만 유지하면 화면은 그대로 쓴다.
 */

export type OrderLine = Line & {
  /** 주문 시점 결제금액 (단가 × 수량) */
  amount: number;
};

export type Order = {
  /** 주문번호 RV20260731-142233 */
  no: string;
  /** 주문 시각 (epoch ms) */
  placedAt: number;
  lines: OrderLine[];
  itemTotal: number;
  shipping: number;
  couponCut: number;
  pointCut: number;
  total: number;
  payment: string;
  /** 이 주문으로 적립된 포인트. 취소 시 회수할 값이라 계산이 아니라 저장이다 */
  earned: number;
  receiver: { name: string; phone: string; address: string };
  /** 취소한 주문. 취소 시각(epoch ms) */
  cancelledAt?: number;
};

const KEY = "rivea-orders";
let orders: Order[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function readFor(uid: string | null): Order[] {
  return readScoped<Order[]>(KEY, uid, []);
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  orders = readFor(currentScope());
}

// 로그인·로그아웃 시 그 계정의 주문 내역으로 갈아탄다
registerScoped((uid) => {
  if (typeof window === "undefined") return;
  loaded = true;
  orders = readFor(uid);
  listeners.forEach((l) => l());
});

function persist() {
  writeScoped(KEY, currentScope(), orders);
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

function getSnapshot(): Order[] {
  load();
  return orders;
}

const EMPTY: Order[] = [];
function getServerSnapshot(): Order[] {
  return EMPTY;
}

/** 최신 주문이 앞. 정적 렌더 시점엔 빈 배열 */
export function useOrders(): Order[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useOrder(no: string | null): Order | undefined {
  const list = useOrders();
  if (!no) return undefined;
  return list.find((o) => o.no === no);
}

/** RV+날짜-시각. 같은 초에 두 번 눌려도 겹치지 않게 뒤에 순번을 붙인다 */
function nextOrderNo(at: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const base =
    `RV${at.getFullYear()}${pad(at.getMonth() + 1)}${pad(at.getDate())}` +
    `-${pad(at.getHours())}${pad(at.getMinutes())}${pad(at.getSeconds())}`;
  if (!orders.some((o) => o.no === base)) return base;
  let n = 2;
  while (orders.some((o) => o.no === `${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export type NewOrder = Omit<Order, "no" | "placedAt" | "lines"> & { lines: Line[] };

/** 주문 확정 — 저장하고 주문번호를 돌려준다 */
export function placeOrder(input: NewOrder): string {
  load();
  const at = new Date();
  const order: Order = {
    ...input,
    no: nextOrderNo(at),
    placedAt: at.getTime(),
    lines: input.lines.map((l) => ({ ...l, amount: l.price * l.qty })),
  };
  orders = [order, ...orders];
  emit();
  return order.no;
}

/** 다른 계정으로 로그인했을 때 게스트로 한 주문을 넘긴다. 주문번호로 중복 제거, 최신순 */
export function mergeOrdersInto(fromUid: string, toUid: string) {
  const from = readFor(fromUid);
  if (from.length === 0) return;
  const to = readFor(toUid);
  const merged = [...from, ...to]
    .filter((o, i, all) => all.findIndex((x) => x.no === o.no) === i)
    .sort((a, b) => b.placedAt - a.placedAt);
  writeScoped(KEY, toUid, merged);
  clearScoped(KEY, fromUid);
}

export function cancelOrder(no: string) {
  load();
  orders = orders.map((o) => (o.no === no ? { ...o, cancelledAt: Date.now() } : o));
  emit();
}

// ── 배송 상태 ──────────────────────────────────────
// 서버도 물류도 없으니 주문 시각으로부터의 경과시간으로 파생한다.
// 값을 저장해두고 안 바꾸면 며칠 전 주문이 영원히 "결제 완료"로 남아 가짜로 읽힌다.

export type OrderStatus = "paid" | "preparing" | "shipping" | "delivered" | "cancelled";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export function statusOf(o: Order, now = Date.now()): OrderStatus {
  if (o.cancelledAt) return "cancelled";
  const elapsed = now - o.placedAt;
  if (elapsed < HOUR) return "paid";
  if (elapsed < DAY) return "preparing";
  if (elapsed < 3 * DAY) return "shipping";
  return "delivered";
}

export const statusLabel: Record<OrderStatus, string> = {
  paid: "결제 완료",
  preparing: "배송 준비중",
  shipping: "배송중",
  delivered: "배송 완료",
  cancelled: "주문 취소",
};

/** 취소는 브랜드가 상품을 넘기기 전까지만 — 실제 커머스의 취소 가능 구간과 같다 */
export function isCancellable(o: Order, now = Date.now()): boolean {
  const s = statusOf(o, now);
  return s === "paid" || s === "preparing";
}

/** 도착 예정일 — 입점 브랜드 평균 2~3일 */
export function arrivalRange(o: Order): string {
  const fmt = (ms: number) => {
    const d = new Date(ms);
    return `${d.getMonth() + 1}/${d.getDate()}(${"일월화수목금토"[d.getDay()]})`;
  };
  return `${fmt(o.placedAt + 2 * DAY)}~${fmt(o.placedAt + 3 * DAY)}`;
}

export function orderDateLabel(o: Order): string {
  const d = new Date(o.placedAt);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

/** 주문 한 줄 요약 — "멜라 리페어 세럼 30ml 외 2건" */
export function orderSummary(o: Order): string {
  const first = o.lines[0]?.name ?? "";
  return o.lines.length > 1 ? `${first} 외 ${o.lines.length - 1}건` : first;
}
