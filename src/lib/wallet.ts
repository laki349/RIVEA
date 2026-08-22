"use client";

import { useSyncExternalStore } from "react";
import { currentScope, readScoped, registerScoped, writeScoped } from "./scope";
import { statusOf, type Order } from "./orders";

/**
 * 포인트·쿠폰 잔액 — 계정(uid)별. (cart.ts와 같은 패턴)
 *
 * 왜 필요했나: 결제 화면은 "보유 3,200P"와 "쿠폰 2장"을 **하드코딩**으로 띄우고
 * 금액에서 실제로 차감했다. 그런데 마이페이지 잔액은 영원히 그대로여서,
 * 포인트를 쓰고 나서 봐도 3,200P가 남아 있었다. 숫자가 서로 안 맞는 순간
 * 화면 전체가 시늉으로 읽힌다.
 *
 * 실제 커머스의 적립은 "구매확정 후"지만, 여기서는 **주문 즉시 적립**으로 단순화했다.
 * 취소하면 쓴 포인트·쿠폰을 되돌리고 적립분을 회수한다.
 */
export type Wallet = {
  points: number;
  /** 신규가입 쿠폰 보유 장수 (10,000원권) */
  coupons: number;
};

/** 첫 진입 지급분 — 신규가입 혜택 */
export const INITIAL_WALLET: Wallet = { points: 3200, coupons: 2 };

export const COUPON_AMOUNT = 10000;

const KEY = "rivea-wallet";
let wallet: Wallet = INITIAL_WALLET;
let loaded = false;
const listeners = new Set<() => void>();

function readFor(uid: string | null): Wallet {
  const w = readScoped<Partial<Wallet>>(KEY, uid, INITIAL_WALLET);
  return {
    points: Math.max(0, w.points ?? INITIAL_WALLET.points),
    coupons: Math.max(0, w.coupons ?? INITIAL_WALLET.coupons),
  };
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  wallet = readFor(currentScope());
}

registerScoped((uid) => {
  if (typeof window === "undefined") return;
  loaded = true;
  wallet = readFor(uid);
  listeners.forEach((l) => l());
});

function emit() {
  writeScoped(KEY, currentScope(), wallet);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Wallet {
  load();
  return wallet;
}

function getServerSnapshot(): Wallet {
  return INITIAL_WALLET;
}

export function useWallet(): Wallet {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** 결제 화면에서 잔액을 읽을 때 — 훅을 쓸 수 없는 곳용 */
export function walletNow(): Wallet {
  load();
  return wallet;
}

/** 적립률 — 등급 혜택. 결제금액 기준 */
export function earnRate(grade: Grade): number {
  return grade === "GOLD" ? 0.015 : 0.01;
}

/**
 * 주문 확정 시 지갑 반영: 쓴 만큼 빼고, 결제금액의 적립률만큼 더한다.
 * 반환값은 적립된 포인트 — 주문 완료 화면에서 보여줄 수 있다.
 */
export function applyOrder(input: {
  pointCut: number;
  couponCut: number;
  total: number;
  grade: Grade;
}): number {
  load();
  const earned = Math.floor(input.total * earnRate(input.grade));
  wallet = {
    points: Math.max(0, wallet.points - input.pointCut + earned),
    coupons: Math.max(0, wallet.coupons - (input.couponCut > 0 ? 1 : 0)),
  };
  emit();
  return earned;
}

/**
 * 주문 취소 시 되돌리기 — 쓴 것은 환원, 적립분은 회수.
 * 적립액을 다시 계산하지 않고 **주문에 저장된 값**(`Order.earned`)을 쓴다.
 * 그 사이 등급이 올라갔으면 계산값이 커져서 취소가 이득이 되는 구멍이 생긴다.
 */
export function revertOrder(input: { pointCut: number; couponCut: number; earned: number }) {
  load();
  wallet = {
    points: Math.max(0, wallet.points + input.pointCut - input.earned),
    coupons: wallet.coupons + (input.couponCut > 0 ? 1 : 0),
  };
  emit();
}

// ── 등급 ───────────────────────────────────────────
// 누적 구매액에서 파생한다. 저장하지 않는 이유는 orders.ts의 배송 상태와 같다 —
// 주문이 늘었는데 등급이 그대로면 그 자리에서 가짜가 드러난다.

export type Grade = "SILVER" | "GOLD";

export const GOLD_THRESHOLD = 100000;

/** 취소분은 제외한 누적 구매액 */
export function spentTotal(orders: Order[]): number {
  return orders
    .filter((o) => statusOf(o) !== "cancelled")
    .reduce((s, o) => s + o.total, 0);
}

export function gradeOf(orders: Order[]): Grade {
  return spentTotal(orders) >= GOLD_THRESHOLD ? "GOLD" : "SILVER";
}

/** GOLD까지 남은 금액. 이미 GOLD면 0 */
export function toNextGrade(orders: Order[]): number {
  return Math.max(0, GOLD_THRESHOLD - spentTotal(orders));
}
