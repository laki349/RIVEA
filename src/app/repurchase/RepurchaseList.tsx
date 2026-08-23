"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { brandOf, productImage, won } from "@/data/catalog";
import { addToCart } from "@/lib/cart";
import {
  SOON_DAYS,
  dueLabel,
  remainRatio,
  useRepurchases,
  type Repurchase,
} from "@/lib/repurchase";
import Icon from "@/components/Icon";
import { LoginSheet, useMemberGate } from "@/components/MemberGate";
import ImageSlot from "@/components/ImageSlot";
import Toast from "@/components/Toast";

/**
 * 재구매 목록 — 마이페이지에서 눌러도 아무 일이 없던 메뉴였다.
 *
 * 만들 게 있어서 만든 게 아니다. 화장품은 다 쓰는 시점이 있고 40대+가 그걸
 * 놓친다. 한 단계가 빠진 루틴은 두 달 뒤에 "효과가 없네"로 끝난다.
 * 이 화면은 **묻기만 한다** — 정기구독처럼 자동으로 사주지 않는다.
 */
export default function RepurchaseList() {
  const list = useRepurchases();
  const [mounted, setMounted] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const { guard, asking, close } = useMemberGate();
  useEffect(() => setMounted(true), []);

  if (!mounted) return <main className="flex-1" />;

  if (list.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
        <span className="text-disabled">
          <Icon name="truck" size={44} />
        </span>
        <p className="mt-4 text-[18px] font-bold text-ink">아직 볼 게 없어요</p>
        <p className="mt-2 text-[17px] leading-[1.6] text-meta">
          배송이 끝난 주문이 있으면
          <br />
          다 쓸 때쯤을 여기서 알려드려요.
        </p>
        <Link
          href="/orders"
          className="press mt-6 flex h-12 items-center justify-center rounded-cta border border-ink px-7 text-[17px] font-medium text-ink"
        >
          주문 내역 보기
        </Link>
      </main>
    );
  }

  const due = list.filter((r) => r.daysLeft <= SOON_DAYS);
  const later = list.filter((r) => r.daysLeft > SOON_DAYS);

  return (
    <main className="flex-1">
      <section className="border-b border-hairline px-4 py-4">
        <p className="text-[17px] leading-[1.6] text-body">
          받으신 날과 용량으로 <b className="font-bold text-ink">다 쓰실 때쯤</b>을 잡아
          알려드려요. 쓰시는 양에 따라 달라질 수 있어요.
        </p>
      </section>

      {due.length > 0 && (
        <section className="border-b border-hairline px-4 py-4">
          <h2 className="text-[18px] font-bold text-ink">지금 챙기실 것 {due.length}</h2>
          <div className="mt-3 space-y-[14px]">
            {due.map((r) => (
              <Row key={r.product.id} r={r} onAdd={setAdded} guard={guard} />
            ))}
          </div>
        </section>
      )}

      {later.length > 0 && (
        <section className="px-4 py-4">
          <h2 className="text-[18px] font-bold text-ink">아직 여유 있어요</h2>
          <div className="mt-3 space-y-[14px]">
            {later.map((r) => (
              <Row key={r.product.id} r={r} onAdd={setAdded} guard={guard} />
            ))}
          </div>
        </section>
      )}

      {asking && <LoginSheet onClose={close} what="다시 담아두세요" />}
      {added && <Toast message={`${added}을(를) 담았어요`} onDone={() => setAdded(null)} />}
    </main>
  );
}

function Row({
  r,
  onAdd,
  guard,
}: {
  r: Repurchase;
  onAdd: (name: string) => void;
  guard: (fn: () => void) => void;
}) {
  const p = r.product;
  const ratio = remainRatio(r);
  const out = r.daysLeft <= 0;

  return (
    <div>
      <Link href={`/product/${p.id}`} className="press-card flex gap-[11px]">
        <ImageSlot
          className="h-[56px] w-[56px] flex-shrink-0 rounded"
          src={productImage(p.id)}
          alt={p.name}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] text-meta">{brandOf(p.brand).name}</p>
          <p className="truncate text-[16px] text-ink">{p.name}</p>
          <p className="mt-[2px] text-[15px] text-meta">
            {won(p.price)}원
            {r.timesBought > 1 && ` · ${r.timesBought}번째 구매`}
          </p>
        </div>
      </Link>

      {/* 남은 양을 바로 — 숫자만 주면 "그래서 급한가"가 안 읽힌다.
          색만으로 구분하지 않는다: 다 쓴 것은 바가 비고 문장도 바뀐다 */}
      <div className="mt-[9px] h-[5px] overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full transition-transform duration-state ${
            out ? "bg-line-strong" : "bg-ink"
          }`}
          style={{ width: `${Math.max(ratio * 100, out ? 0 : 4)}%` }}
        />
      </div>
      <div className="mt-[6px] flex items-center justify-between gap-2">
        <span className={`text-[16px] ${out ? "font-medium text-ink" : "text-body"}`}>
          {dueLabel(r)}
        </span>
        <button
          onClick={() =>
            guard(() => {
              addToCart("product", p.id);
              onAdd(p.name);
            })
          }
          className="press flex h-11 items-center rounded border border-ink px-4 text-[16px] font-medium text-ink"
        >
          다시 담기
        </button>
      </div>
    </div>
  );
}
