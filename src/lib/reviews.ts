"use client";

import { useSyncExternalStore } from "react";
import { currentScope, readScoped, registerScoped, writeScoped } from "./scope";
import { statusOf, type Order } from "./orders";

/**
 * 내가 쓴 리뷰 — 계정(uid)별. (cart.ts / wish.ts와 같은 패턴)
 *
 * 이게 마지막 하드코딩이었다. 상품마다 "리뷰 22,800건"이라 써 있는데 **쓸 방법이 없었고**,
 * 마이페이지 「리뷰 0」은 영원히 0이었다. 숫자만 있고 행위가 없으면 그 숫자도 의심받는다.
 *
 * ⚠️ 상품의 `reviewCount`·`rating`은 여전히 데모값이다(docs/05에 고지). 여기서 만드는 건
 * **내가 쓴 리뷰**뿐이고, 그 둘을 섞지 않는다 — 내 리뷰는 상품 상세에서 별도 블록으로 보여준다.
 * 데모 숫자에 내 리뷰를 더해 "22,801건"으로 만들면 없는 집계를 있는 척하는 게 된다.
 */
export type Review = {
  /** productId + orderNo — 같은 주문의 같은 상품엔 하나만 */
  id: string;
  productId: string;
  /** 어느 주문으로 샀는지. 구매 없이 쓴 리뷰가 아님을 남긴다 */
  orderNo: string;
  /** 1~5 */
  rating: number;
  text: string;
  at: number;
};

const KEY = "rivea-reviews";
let items: Review[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function readFor(uid: string | null): Review[] {
  return readScoped<Review[]>(KEY, uid, []);
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

function getSnapshot(): Review[] {
  load();
  return items;
}

const EMPTY: Review[] = [];
function getServerSnapshot(): Review[] {
  return EMPTY;
}

/** 최근에 쓴 것이 앞 */
export function useReviews(): Review[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const reviewId = (productId: string, orderNo: string) => `${orderNo}__${productId}`;

/** 다른 계정으로 로그인했을 때 게스트가 쓴 리뷰를 넘긴다 */
export function mergeReviewsInto(fromUid: string, toUid: string) {
  const from = readFor(fromUid);
  if (from.length === 0) return;
  const to = readFor(toUid);
  const merged = [...from, ...to]
    .filter((r, i, all) => all.findIndex((x) => x.id === r.id) === i)
    .sort((a, b) => b.at - a.at);
  writeScoped(KEY, toUid, merged);
}

export function saveReview(input: {
  productId: string;
  orderNo: string;
  rating: number;
  text: string;
}) {
  load();
  const id = reviewId(input.productId, input.orderNo);
  const next: Review = { ...input, id, at: Date.now() };
  // 이미 쓴 리뷰면 덮어쓴다(수정). 목록에서는 맨 앞으로
  items = [next, ...items.filter((r) => r.id !== id)];
  emit();
}

export function deleteReview(id: string) {
  load();
  items = items.filter((r) => r.id !== id);
  emit();
}

/**
 * 이 주문의 이 상품에 리뷰를 쓸 수 있는가.
 *
 * **배송이 끝난 주문만.** 실제 커머스가 이 규칙을 두는 이유는 받아보지 않고 쓴 리뷰가
 * 다른 사람에게 쓸모없기 때문이다. 취소한 주문도 당연히 제외한다.
 */
export function canReview(order: Order, now = Date.now()): boolean {
  return statusOf(order, now) === "delivered";
}
