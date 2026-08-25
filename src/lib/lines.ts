import {
  brandOf,
  productImage,
  productOf,
  routineImage,
  routines,
  won,
} from "@/data/catalog";
import type { CartItem } from "./cart";

/**
 * 주문 라인 계산 — 장바구니·결제·주문내역이 공유하는 단일 출처.
 *
 * 이 파일이 생긴 이유: 배송비 규칙이 화면마다 달랐다. 장바구니는 브랜드별
 * (freeShippingOver/shippingFee), 결제는 "5만원 이상 무료, 아니면 3,000원"으로
 * 계산해서 같은 장바구니의 결제예정금액과 최종 결제금액이 어긋났다.
 * 배송비는 브랜드(입점사)가 각자 정하는 값이라 중개형에서는 브랜드별 계산이 맞다.
 */

export type Line = {
  /** 목록 내 안정 키 (kind+id) */
  key: string;
  kind: CartItem["kind"];
  id: string;
  qty: number;
  name: string;
  option: string;
  /** 단가 (수량 미반영) */
  price: number;
  image?: string;
  /** 배송 그룹 = 브랜드 slug, 루틴 세트는 "rivea-set" */
  group: string;
};

export const RIVEA_SET = "rivea-set";

export function lineKey(kind: CartItem["kind"], id: string) {
  return `${kind === "product" ? "p" : "r"}-${id}`;
}

export function toLine(i: CartItem): Line {
  if (i.kind === "product") {
    const p = productOf(i.id);
    return {
      key: lineKey(i.kind, i.id),
      kind: i.kind,
      id: i.id,
      qty: i.qty,
      name: p.name,
      option: p.tags[0] ?? p.volume,
      price: p.price,
      image: productImage(i.id),
      group: p.brand,
    };
  }
  const r = routines.find((x) => x.id === i.id)!;
  return {
    key: lineKey(i.kind, i.id),
    kind: i.kind,
    id: i.id,
    qty: i.qty,
    name: `[세트] ${r.title}`,
    option: `${r.badge} · ${r.label}`,
    price: r.price,
    image: routineImage(i.id),
    group: RIVEA_SET,
  };
}

/**
 * 배송 그룹 라벨.
 *
 * ⚠️ 배송 정책 문구를 뺐다 (2026-08-25). 브랜드별 `freeShippingOver`·`shippingFee`가
 *    **우리가 지어낸 값**이었고, 실존 기업의 배송 정책을 지어내는 건 리뷰수를 지어내는
 *    것보다 성격이 나쁘다. 배송은 공식몰이 정한다.
 */
export function groupLabel(group: string) {
  if (group === RIVEA_SET) return { name: "리베아 루틴 세트", ship: "" };
  return { name: brandOf(group).name, ship: "공식몰 기준" };
}

/** 배송비는 우리가 정하지 않는다 — 결제를 받지 않으므로 계산할 것도 없다 */
export function groupShippingFee(_group: string, _subtotal: number) {
  return 0;
}

/**
 * 라인을 배송 그룹으로 묶는다. 담은 순서를 유지한다.
 * 제네릭인 이유: 호출부가 Line에 checked·amount 같은 필드를 얹어 넘긴다.
 */
export function groupLines<T extends Line>(lines: T[]) {
  const order: string[] = [];
  const map = new Map<string, T[]>();
  for (const l of lines) {
    if (!map.has(l.group)) {
      map.set(l.group, []);
      order.push(l.group);
    }
    map.get(l.group)!.push(l);
  }
  return order.map((group) => ({ group, lines: map.get(group)! }));
}

export const lineAmount = (l: Line) => l.price * l.qty;

/** 상품금액 + 그룹별 배송비 합계. 장바구니·결제가 같은 숫자를 쓰게 하는 함수 */
export function totalsOf(lines: Line[]) {
  const itemTotal = lines.reduce((s, l) => s + lineAmount(l), 0);
  const shipping = groupLines(lines).reduce(
    (s, g) => s + groupShippingFee(g.group, g.lines.reduce((x, l) => x + lineAmount(l), 0)),
    0
  );
  return { itemTotal, shipping };
}
