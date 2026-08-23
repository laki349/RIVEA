"use client";

import { useSyncExternalStore } from "react";
import { productOf, routines, type ActiveKey, type Product } from "@/data/catalog";
import { regimenOf, type Step } from "@/data/regimen";
import { statusOf, useOrders, type Order } from "./orders";
import { clearScoped, currentScope, readScoped, registerScoped, writeScoped } from "./scope";
import { track } from "./events";

/**
 * 내 화장대 — **이미 쓰고 있는 것.**
 *
 * 왜 필요했나: 성분 병용 안내가 반쪽이었다. 장바구니에 담은 것끼리만 봤는데,
 * 실제 충돌은 **새로 산 것과 원래 쓰던 것 사이에서** 생긴다. 레티놀을 새로 샀는데
 * 화장대에 각질 토너가 이미 있는 상황 — 앱이 그걸 모르면 규칙이 있어도 못 잡는다.
 *
 * 부수 효과가 더 크다. 등록된 것이 「내 루틴」의 그 자리를 채우면 **살 것이 줄어든다.**
 * 파는 앱이 하지 않는 일이라, 여기서 신뢰가 붙는다.
 *
 * 직접 입력을 둔 이유: 그녀가 쓰던 건 대부분 이 카탈로그에 없다. 이름만 받으면
 * 목록에는 남지만 판정에는 못 쓴다 — 그래서 **성분을 직접 고르게** 한다.
 * 성분만 알면 규칙은 그대로 돈다.
 */
export type ShelfItem =
  | { kind: "product"; id: string; addedAt?: number }
  | { kind: "custom"; id: string; name: string; actives: ActiveKey[]; step: Step; addedAt?: number };

const KEY = "rivea-shelf";
let items: ShelfItem[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function readFor(uid: string | null): ShelfItem[] {
  const raw = readScoped<ShelfItem[]>(KEY, uid, []);
  // 카탈로그에서 내려간 상품은 버린다 — 없는 상품으로 판정하면 조용히 틀린다
  return raw.filter((i) => i.kind === "custom" || Boolean(productOf(i.id)));
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

function getSnapshot(): ShelfItem[] {
  load();
  return items;
}

const EMPTY: ShelfItem[] = [];
function getServerSnapshot(): ShelfItem[] {
  return EMPTY;
}

export function useShelf(): ShelfItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useOnShelf(productId: string): boolean {
  return useShelf().some((i) => i.kind === "product" && i.id === productId);
}

/**
 * `startedAt`은 **등록 시각이 아니라 쓰기 시작한 시각**이다 (addCustom 주석과 같은 이유).
 * 목록에서 고르는 경로에도 이 값을 받아야 한다 — 여기만 빼놓으면 카탈로그 제품은
 * 전부 오늘 시작한 것이 되고, 판정이 2주 뒤에야 뜬다.
 */
export function toggleShelfProduct(productId: string, startedAt = Date.now()) {
  // 뺄 때가 아니라 **넣을 때만** 센다
  load();
  const found = items.some((i) => i.kind === "product" && i.id === productId);
  items = found
    ? items.filter((i) => !(i.kind === "product" && i.id === productId))
    : [{ kind: "product", id: productId, addedAt: startedAt }, ...items];
  if (!found) track("shelf_add", productId);
  emit();
}

/**
 * 직접 입력. id는 저장 시점에 만든다 — 같은 이름을 두 번 넣어도 각자 지울 수 있게.
 *
 * `startedAt`은 **등록 시각이 아니라 쓰기 시작한 시각**이다. 화장대는 정의상
 * 「이미 쓰고 있는 것」을 넣는 곳이라, 등록일을 시작일로 치면 석 달 쓴 제품에도
 * 「2주 됐어요」가 뜬다. 판정 시점이 통째로 틀어진다.
 */
export function addCustom(name: string, actives: ActiveKey[], step: Step, startedAt = Date.now()) {
  load();
  const id = `c${Date.now().toString(36)}`;
  items = [{ kind: "custom", id, name: name.trim(), actives, step, addedAt: startedAt }, ...items];
  // 직접 입력한 제품명은 자유 텍스트다 — **값으로 보내지 않는다.** 개인정보가 섞일 수 있다
  track("shelf_add", "custom");
  emit();
}

export function removeFromShelf(id: string) {
  load();
  items = items.filter((i) => i.id !== id);
  emit();
}

/** 화면·판정에 공통으로 쓰는 평평한 형태 */
export type ShelfEntry = {
  id: string;
  name: string;
  /** 카탈로그 제품이면 있다 */
  product: Product | null;
  actives: ActiveKey[];
  step: Step;
  /**
   * 어디서 왔나. `order`는 주문에서 자동으로 들어온 것이라 손으로 뺄 수 없다
   * (다 쓸 때쯤이 지나면 스스로 빠진다).
   */
  source: "manual" | "order";
  /**
   * 언제부터 쓰기 시작했나 (판정 시점 계산의 분모).
   * 주문에서 온 것은 주문 시각, 손으로 넣은 것은 넣은 시각.
   * **`addedAt`이 없던 시절에 저장된 항목은 null이다** — 그런 항목엔 판정을 걸지 않는다.
   * 모르는 시작일을 오늘로 치면 「28일 됐어요」가 거짓말이 된다.
   */
  startedAt: number | null;
};

function entryOfProduct(p: Product, source: ShelfEntry["source"], startedAt: number | null): ShelfEntry {
  return {
    id: p.id,
    name: p.name,
    product: p,
    actives: (p.actives ?? []).map((a) => a.key),
    step: regimenOf(p).step,
    source,
    startedAt,
  };
}

export function entriesOf(list: ShelfItem[]): ShelfEntry[] {
  return list.map((i) => {
    if (i.kind === "custom") {
      return {
        id: i.id, name: i.name, product: null,
        actives: i.actives, step: i.step, source: "manual" as const,
        startedAt: i.addedAt ?? null,
      };
    }
    const p = productOf(i.id) as Product | undefined;
    if (!p) {
      return {
        id: i.id, name: i.id, product: null,
        actives: [], step: "serum" as Step, source: "manual" as const,
        startedAt: i.addedAt ?? null,
      };
    }
    return entryOfProduct(p, "manual", i.addedAt ?? null);
  });
}

const DAY = 24 * 60 * 60 * 1000;

/**
 * 배송이 끝난 주문에서 **지금 쓰고 있을 것**을 뽑는다.
 *
 * 화장대가 값이 없던 이유가 여기 있었다. 등록이 순수한 수동 노동이라
 * "등록할 이유는 등록해봐야 안다"는 순환에 걸렸고, 아무도 채우지 않았다.
 * 그런데 **배송이 끝난 상품은 정의상 지금 쓰고 있는 것**이고 앱이 이미 알고 있다.
 *
 * 저장하지 않고 주문에서 파생시킨다. 저장 방식이면 "언제 쓰나"(앱을 켜야 함)가
 * 애매하고, 다 쓴 뒤에도 남아 판정을 틀리게 만든다. 파생이면 다 쓸 때쯤이
 * 지나는 순간 **스스로 빠진다** — 배송 상태·등급과 같은 처리다.
 *
 * 루틴 세트는 구성품으로 펼친다. 세트로 샀어도 실제로 쓰는 건 그 안의 제품들이고,
 * 성분 판정은 제품 단위로 돌기 때문이다.
 */
export function fromOrders(orders: Order[], now = Date.now()): ShelfEntry[] {
  const ids = new Map<string, number>(); // productId → 마지막으로 받은 시각

  for (const o of orders) {
    if (statusOf(o, now) !== "delivered") continue;
    for (const l of o.lines) {
      const targets =
        l.kind === "product"
          ? [l.id]
          : (routines.find((r) => r.id === l.id)?.steps ?? []).map((s) => s.productId);
      for (const id of targets) {
        ids.set(id, Math.max(ids.get(id) ?? 0, o.placedAt));
      }
    }
  }

  const out: ShelfEntry[] = [];
  ids.forEach((at, id) => {
    const p = productOf(id) as Product | undefined;
    if (!p) return;
    const { lifespanDays } = regimenOf(p);
    // 기기는 다 쓰는 개념이 없으니 계속 화장대에 남는다
    if (lifespanDays !== null && now > at + lifespanDays * DAY) return;
    out.push(entryOfProduct(p, "order", at));
  });
  return out;
}

/**
 * 화장대 = 손으로 넣은 것 + 주문에서 자동으로 들어온 것.
 * 같은 상품이 양쪽에 있으면 손으로 넣은 쪽을 남긴다 (사용자가 명시한 것이 우선).
 */
export function useShelfEntries(): ShelfEntry[] {
  const manual = entriesOf(useShelf());
  const auto = fromOrders(useOrders());
  const seen = new Set(manual.map((e) => e.id));
  return [...manual, ...auto.filter((e) => !seen.has(e.id))];
}

/** 다른 계정으로 로그인했을 때 게스트가 등록한 것을 합친다 (id 기준 합집합) */
export function mergeShelfInto(fromUid: string, toUid: string) {
  const from = readFor(fromUid);
  if (from.length === 0) return;
  const to = readFor(toUid);
  const merged = [...from, ...to].filter(
    (item, i, all) => all.findIndex((x) => x.id === item.id) === i
  );
  writeScoped(KEY, toUid, merged);
  clearScoped(KEY, fromUid);
}
