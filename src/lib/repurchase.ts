"use client";

import { productOf, type Product } from "@/data/catalog";
import { regimenOf } from "@/data/regimen";
import { statusOf, useOrders, type Order } from "./orders";

/**
 * 다 쓸 때쯤 — 지난 주문에서 재구매 시점을 계산한다.
 *
 * 화장품은 다 쓰는 시점이 있고, **40대+가 그걸 놓친다.** 세럼이 바닥나면 그
 * 단계를 건너뛰고, 한 단계가 빠진 루틴은 두 달 뒤에 "효과가 없네"로 끝난다.
 * 정기구독은 이 문제의 답이 아니다 — 쓰는 속도가 사람마다 다르고, 40대+는
 * 자동결제를 특히 꺼린다. 필요한 건 **묻는 것**이지 자동으로 사주는 게 아니다.
 *
 * 계산은 배송 완료 시점 + 예상 사용 기간(regimen.lifespanDays)이다. 예상이라
 * 화면에서도 단정하지 않는다("쯤", "약"). 여러 번 산 제품은 **가장 최근 주문**을
 * 기준으로 본다 — 이전 통은 이미 다 썼을 테니까.
 */
export type Repurchase = {
  product: Product;
  /** 마지막으로 받은 날 (epoch ms) */
  receivedAt: number;
  /** 다 쓸 것으로 보는 날 (epoch ms) */
  dueAt: number;
  /** 남은 일수. 음수면 이미 지났다 */
  daysLeft: number;
  /** 예상 사용 기간 */
  lifespanDays: number;
  /** 지금까지 몇 번 샀는지 — 재구매는 신뢰의 신호라 보여줄 값이다 */
  timesBought: number;
};

const DAY = 24 * 60 * 60 * 1000;

/** 이 앞으로 남았으면 "아직 여유" — 목록에서 아래로 내린다 */
export const SOON_DAYS = 14;

/**
 * 배송 완료된 주문에서만 센다.
 *
 * 받지도 않은 걸 "다 쓸 때쯤"의 기준으로 삼을 수는 없다. 배송 상태는
 * 시간 파생이라(orders.ts) 데모에서도 30분 뒤면 완료로 넘어간다.
 */
export function repurchasesFrom(orders: Order[], now = Date.now()): Repurchase[] {
  const last = new Map<string, { at: number; count: number }>();

  for (const o of orders) {
    if (statusOf(o, now) !== "delivered") continue;
    for (const l of o.lines) {
      // 루틴 세트는 구성품 단위로 사용 기간이 달라서 여기서 다루지 않는다.
      // 세트를 통째로 "다 쓸 때쯤"이라고 말하면 어느 통이 비었는지 알 수 없다.
      if (l.kind !== "product") continue;
      const prev = last.get(l.id);
      last.set(l.id, {
        at: Math.max(prev?.at ?? 0, o.placedAt),
        count: (prev?.count ?? 0) + l.qty,
      });
    }
  }

  const out: Repurchase[] = [];
  last.forEach(({ at, count }, id) => {
    const p = productOf(id) as Product | undefined;
    if (!p) return; // 카탈로그에서 내려간 상품
    const { lifespanDays } = regimenOf(p);
    if (lifespanDays === null) return; // 기기 — 재구매 개념이 없다
    const dueAt = at + lifespanDays * DAY;
    out.push({
      product: p,
      receivedAt: at,
      dueAt,
      daysLeft: Math.round((dueAt - now) / DAY),
      lifespanDays,
      timesBought: count,
    });
  });

  // 급한 것부터 — 이미 지난 것이 맨 위
  return out.sort((a, b) => a.daysLeft - b.daysLeft);
}

export function useRepurchases(): Repurchase[] {
  const orders = useOrders();
  return repurchasesFrom(orders);
}

/** 지금 챙길 것 — 다 썼거나 2주 안에 다 쓸 것들 */
export function dueNow(list: Repurchase[]): Repurchase[] {
  return list.filter((r) => r.daysLeft <= SOON_DAYS);
}

/** 남은 기간을 사람 말로. 단정하지 않는다 — 예상이다 */
export function dueLabel(r: Repurchase): string {
  if (r.daysLeft < -7) return `${Math.abs(r.daysLeft)}일 전에 다 쓰셨을 거예요`;
  if (r.daysLeft < 0) return "다 쓰셨을 때쯤이에요";
  if (r.daysLeft === 0) return "오늘쯤 다 쓰실 거예요";
  if (r.daysLeft <= SOON_DAYS) return `${r.daysLeft}일쯤 뒤에 다 쓰실 거예요`;
  return `${r.daysLeft}일쯤 남았어요`;
}

/** 진행 바에 쓸 남은 비율 (0~1) */
export function remainRatio(r: Repurchase): number {
  const used = (r.lifespanDays * DAY - (r.dueAt - Date.now())) / (r.lifespanDays * DAY);
  return Math.min(1, Math.max(0, 1 - used));
}
