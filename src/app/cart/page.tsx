"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  brandOf,
  brands,
  productOf,
  routines,
  won,
} from "@/data/catalog";
import {
  removeFromCart,
  removeMany,
  setQty,
  useCart,
  type CartItem,
} from "@/lib/cart";
import Icon from "@/components/Icon";
import AppBar from "@/components/AppBar";

type Line = {
  key: string;
  kind: CartItem["kind"];
  id: string;
  qty: number;
  name: string;
  option: string;
  price: number;
  group: string; // 배송 그룹 라벨
};

function toLine(i: CartItem): Line {
  if (i.kind === "product") {
    const p = productOf(i.id);
    return {
      key: `p-${i.id}`,
      kind: i.kind,
      id: i.id,
      qty: i.qty,
      name: p.name,
      option: p.tags[0] ?? p.volume,
      price: p.price,
      group: p.brand,
    };
  }
  const r = routines.find((x) => x.id === i.id)!;
  return {
    key: `r-${i.id}`,
    kind: i.kind,
    id: i.id,
    qty: i.qty,
    name: `[세트] ${r.title}`,
    option: `${r.badge} · ${r.label}`,
    price: r.price,
    group: "rivea-set",
  };
}

function groupLabel(group: string) {
  if (group === "rivea-set") return { name: "리베아 루틴 세트", ship: "무료배송" };
  const b = brandOf(group);
  return {
    name: b.name,
    ship: b.freeShippingOver
      ? `${won(b.freeShippingOver)}원↑ 무료배송`
      : `배송비 ${won(b.shippingFee)}원`,
  };
}

function groupShippingFee(group: string, subtotal: number) {
  if (group === "rivea-set") return 0;
  const b = brandOf(group);
  if (b.freeShippingOver && subtotal >= b.freeShippingOver) return 0;
  return b.shippingFee;
}

export default function CartPage() {
  const cart = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [unchecked, setUnchecked] = useState<Set<string>>(new Set());
  useEffect(() => setMounted(true), []);

  const lines = useMemo(() => cart.map(toLine), [cart]);
  const groups = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, Line[]>();
    for (const l of lines) {
      if (!map.has(l.group)) {
        map.set(l.group, []);
        order.push(l.group);
      }
      map.get(l.group)!.push(l);
    }
    return order.map((g) => ({ group: g, lines: map.get(g)! }));
  }, [lines]);

  const checked = (key: string) => !unchecked.has(key);
  const selectedLines = lines.filter((l) => checked(l.key));

  const itemTotal = selectedLines.reduce((s, l) => s + l.price * l.qty, 0);
  const shipTotal = groups.reduce((s, g) => {
    const sel = g.lines.filter((l) => checked(l.key));
    if (sel.length === 0) return s;
    return s + groupShippingFee(g.group, sel.reduce((x, l) => x + l.price * l.qty, 0));
  }, 0);
  const total = itemTotal + shipTotal;

  const toggle = (key: string) => {
    setUnchecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const allChecked = lines.length > 0 && lines.every((l) => checked(l.key));
  const toggleAll = () => {
    setUnchecked(allChecked ? new Set(lines.map((l) => l.key)) : new Set());
  };

  const removeSelected = () => {
    removeMany(selectedLines.map((l) => ({ kind: l.kind, id: l.id })));
  };

  if (!mounted) {
    return (
      <>
        <AppBar title="장바구니" bold search={false} />
        <main className="flex-1" />
      </>
    );
  }

  if (lines.length === 0) {
    return (
      <>
        <AppBar title="장바구니" bold search={false} />
        <main className="flex flex-1 flex-col items-center justify-center px-4 pb-24">
          <span className="text-disabled">
            <Icon name="bag" size={44} />
          </span>
          <p className="mt-4 text-[16px] font-bold text-ink">아직 담은 상품이 없어요</p>
          <p className="mt-2 text-center text-[14px] leading-[1.6] text-meta">
            고민에 맞는 루틴부터 둘러보실래요?
          </p>
          <Link
            href="/pick"
            className="mt-6 flex h-12 items-center justify-center rounded-cta bg-ink px-7 text-[15px] font-medium text-on-ink"
          >
            리베아&apos;s Pick 보러가기
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <AppBar title={`장바구니 ${lines.length}`} bold search={false} />

      {/* 전체선택 */}
      <div className="flex items-center gap-2 border-b border-hairline px-4 py-[11px]">
        <button onClick={toggleAll} className="flex items-center gap-2">
          <Check on={allChecked} />
          <span className="text-[13px] text-ink">
            전체선택 ({selectedLines.length}/{lines.length})
          </span>
        </button>
        <span className="flex-1" />
        <button onClick={removeSelected} className="py-1 text-[13px] text-meta">
          선택삭제
        </button>
      </div>

      <main className="flex-1">
        {groups.map(({ group, lines: gl }) => {
          const label = groupLabel(group);
          return (
            <section key={group} className="border-b border-hairline pb-4">
              <div className="flex items-center gap-[7px] px-4 pb-1 pt-[14px]">
                <span className="text-[14px] font-bold text-ink">{label.name}</span>
                <span className="text-[12px] text-meta">· {label.ship}</span>
              </div>
              {gl.map((l) => (
                <div key={l.key} className="flex gap-[11px] px-4 pt-3">
                  <button onClick={() => toggle(l.key)} className="mt-1 flex-shrink-0">
                    <Check on={checked(l.key)} />
                  </button>
                  <div className="h-16 w-16 flex-shrink-0 rounded bg-subtle" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] leading-[1.4] text-ink">{l.name}</p>
                      <button
                        onClick={() => removeFromCart(l.kind, l.id)}
                        aria-label="삭제"
                        className="p-1 text-disabled"
                      >
                        <Icon name="plus" size={15} className="rotate-45" />
                      </button>
                    </div>
                    <p className="mt-[2px] text-[12px] text-meta">{l.option}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded border border-line">
                        <button
                          onClick={() => setQty(l.kind, l.id, l.qty - 1)}
                          aria-label="수량 감소"
                          className="flex h-[30px] w-[30px] items-center justify-center text-body"
                        >
                          <Icon name="minus" size={15} />
                        </button>
                        <span className="flex h-[30px] w-[32px] items-center justify-center border-x border-line text-[13px] text-ink">
                          {l.qty}
                        </span>
                        <button
                          onClick={() => setQty(l.kind, l.id, l.qty + 1)}
                          aria-label="수량 증가"
                          className="flex h-[30px] w-[30px] items-center justify-center text-body"
                        >
                          <Icon name="plus" size={15} />
                        </button>
                      </div>
                      <span className="text-[15px] font-bold text-ink">
                        {won(l.price * l.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          );
        })}

        {/* 금액 요약 */}
        <section className="border-b border-hairline px-4 py-4">
          <div className="flex justify-between py-[5px] text-[13px]">
            <span className="text-meta">상품금액</span>
            <span className="text-ink">{won(itemTotal)}</span>
          </div>
          <div className="flex justify-between py-[5px] text-[13px]">
            <span className="text-meta">배송비</span>
            <span className="text-ink">{shipTotal === 0 ? "무료" : won(shipTotal)}</span>
          </div>
          <div className="mt-[6px] flex justify-between border-t border-hairline pt-[9px]">
            <span className="text-[14px] font-bold text-ink">결제예정금액</span>
            <span className="text-[18px] font-bold text-ink">{won(total)}</span>
          </div>
        </section>
      </main>

      {/* 주문 CTA */}
      <div className="sticky bottom-0 z-40 border-t border-line bg-surface px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
        <button
          onClick={() => router.push("/checkout")}
          disabled={selectedLines.length === 0}
          className="h-[52px] w-full rounded-cta bg-ink text-[16px] font-medium text-on-ink disabled:opacity-40"
        >
          {won(total)}원 주문하기
        </button>
      </div>
    </>
  );
}

function Check({ on }: { on: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 items-center justify-center rounded border ${
        on ? "border-ink bg-ink text-on-ink" : "border-line-strong bg-surface text-transparent"
      }`}
    >
      <Icon name="check" size={13} />
    </span>
  );
}
