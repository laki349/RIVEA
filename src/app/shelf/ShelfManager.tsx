"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { brandOf, productImage, products, type ActiveKey } from "@/data/catalog";
import { activeInfo } from "@/data/actives";
import { STEP_LABEL, STEP_ORDER, regimenOf, type Step } from "@/data/regimen";
import {
  addCustom,
  removeFromShelf,
  toggleShelfProduct,
  useShelf,
  useShelfEntries,
} from "@/lib/shelf";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import InteractionNotes from "@/components/InteractionNotes";

/**
 * 내 화장대 — 이미 쓰고 있는 것을 등록한다.
 *
 * 등록의 대가를 먼저 보여줘야 사람이 등록한다. 그래서 목록 아래에 병용 안내를
 * 바로 붙인다 — 하나만 넣어도 "그래서 뭐가 달라지나"가 그 자리에서 보인다.
 */
export default function ShelfManager() {
  const items = useShelf();
  const entries = useShelfEntries();
  const [mounted, setMounted] = useState(false);
  const [adding, setAdding] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <main className="flex-1" />;

  return (
    <main className="flex-1">
      <section className="border-b border-hairline px-4 py-4">
        <p className="text-[15px] leading-[1.6] text-body">
          쓰고 계신 걸 알면 <b className="font-bold text-ink">새로 담는 것과 같이 써도 되는지</b>{" "}
          알려드려요. <b className="font-bold text-ink">배송이 끝난 주문은 자동으로 들어오고</b>,
          다 쓰실 때쯤이 지나면 스스로 빠져요.
        </p>
      </section>

      {entries.length > 0 && (
        <section className="border-b border-hairline px-4 py-4">
          <h2 className="text-[16px] font-bold text-ink">쓰고 있는 것 {entries.length}</h2>
          <div className="mt-3 space-y-3">
            {entries.map((e) => (
              <div key={e.id} className="flex items-start gap-[11px]">
                {e.product ? (
                  <ImageSlot
                    className="h-[48px] w-[48px] flex-shrink-0 rounded"
                    src={productImage(e.product.id)}
                    alt={e.name}
                  />
                ) : (
                  <span className="flex h-[48px] w-[48px] flex-shrink-0 items-center justify-center rounded bg-wash text-disabled">
                    <Icon name="sparkle" size={18} />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-meta">
                    {e.product ? brandOf(e.product.brand).name : "직접 입력"} ·{" "}
                    {STEP_LABEL[e.step]}
                  </p>
                  {e.product ? (
                    <Link href={`/product/${e.product.id}`} className="press block">
                      <span className="text-[14px] text-ink">{e.name}</span>
                    </Link>
                  ) : (
                    <p className="text-[14px] text-ink">{e.name}</p>
                  )}
                  <p className="mt-[2px] text-[13px] leading-[1.5] text-meta">
                    {e.actives.length > 0
                      ? e.actives.map((k) => activeInfo[k]?.name ?? k).join(" · ")
                      : "성분을 몰라 병용 판정에는 넣지 못해요"}
                  </p>
                </div>
                {e.source === "manual" ? (
                  <button
                    onClick={() => removeFromShelf(e.id)}
                    className="press flex h-11 items-center pl-3 text-[14px] text-meta"
                  >
                    빼기
                  </button>
                ) : (
                  // 주문에서 온 것은 손으로 못 뺀다 — 다 쓸 때쯤이 지나면 스스로 빠진다.
                  // 뺄 수 없다는 걸 말해주지 않으면 "빼기가 안 먹는다"로 읽힌다.
                  <span className="flex h-11 flex-shrink-0 items-center pl-3 text-[13px] text-meta">
                    주문에서
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/*
        등록의 대가를 바로 보여준다. ids를 비워 넘기는 이유: InteractionNotes가
        화장대를 스스로 읽고, 그 목록에 주문 파생분까지 이미 들어 있다.
        여기서 수동 등록분을 또 넘기면 같은 걸 두 번 세게 된다.
      */}
      <InteractionNotes ids={[]} />

      {adding ? (
        <AddPanel onClose={() => setAdding(false)} />
      ) : (
        <div className="px-4 py-4">
          <button
            onClick={() => setAdding(true)}
            className="press h-[52px] w-full rounded-cta bg-ink text-[16px] font-medium text-on-ink"
          >
            쓰고 있는 것 추가
          </button>
          {entries.length === 0 && (
            <p className="mt-2 text-center text-[13px] leading-[1.5] text-meta">
              여기서 산 것은 배송이 끝나면 자동으로 들어와요.
              <br />
              다른 곳에서 산 것만 넣어주시면 돼요.
            </p>
          )}
        </div>
      )}
    </main>
  );
}

/** 추가 — 카탈로그에서 고르거나, 없으면 성분만 고른다 */
function AddPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"catalog" | "custom">("catalog");

  return (
    <section className="animate-rise border-t border-line px-4 py-4">
      <div className="flex gap-2">
        <TabButton on={tab === "catalog"} onClick={() => setTab("catalog")}>
          목록에서 찾기
        </TabButton>
        <TabButton on={tab === "custom"} onClick={() => setTab("custom")}>
          목록에 없어요
        </TabButton>
      </div>

      {tab === "catalog" ? <CatalogPicker /> : <CustomForm onDone={onClose} />}

      <button
        onClick={onClose}
        className="press mt-3 h-12 w-full rounded-cta border border-line text-[15px] font-medium text-body"
      >
        닫기
      </button>
    </section>
  );
}

function TabButton({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`press h-11 flex-1 rounded border text-[14px] font-medium ${
        on ? "border-ink bg-ink text-on-ink" : "border-line text-body"
      }`}
    >
      {children}
    </button>
  );
}

function CatalogPicker() {
  const [q, setQ] = useState("");
  const shelf = useShelf();

  const hits = useMemo(() => {
    const term = q.trim();
    // 검색어가 없으면 아무것도 보여주지 않는다 — 29개를 통째로 펼치면 고르기 더 어렵다
    if (term.length === 0) return [];
    return products
      .filter(
        (p) => p.name.includes(term) || brandOf(p.brand).name.includes(term)
      )
      .slice(0, 8);
  }, [q]);

  return (
    <div className="mt-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="브랜드나 제품 이름"
        aria-label="제품 검색"
        className="h-12 w-full rounded border border-line px-3 text-[15px] text-ink placeholder:text-meta"
      />
      <div className="mt-2">
        {q.trim().length > 0 && hits.length === 0 && (
          <p className="py-3 text-[14px] leading-[1.6] text-meta">
            찾는 게 없으면 「목록에 없어요」로 성분만 골라주세요.
          </p>
        )}
        {hits.map((p) => {
          const on = shelf.some((i) => i.kind === "product" && i.id === p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggleShelfProduct(p.id)}
              className="press flex w-full items-center gap-[11px] border-b border-hairline py-[10px] text-left"
            >
              <ImageSlot
                className="h-[44px] w-[44px] flex-shrink-0 rounded"
                src={productImage(p.id)}
                alt={p.name}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] text-meta">
                  {brandOf(p.brand).name} · {STEP_LABEL[regimenOf(p).step]}
                </span>
                <span className="block truncate text-[14px] text-ink">{p.name}</span>
              </span>
              <span className={on ? "text-ink" : "text-disabled"}>
                <Icon name={on ? "check" : "plus"} size={18} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 직접 입력 — 이름과 **성분**을 받는다.
 *
 * 이름만 받으면 목록에는 남지만 판정에는 못 쓴다. 성분만 알면 규칙은 그대로 도니,
 * 여기서 받아야 하는 건 브랜드명이 아니라 성분이다.
 */
const PICKABLE: ActiveKey[] = [
  "retinol",
  "aha-bha",
  "vitaminC",
  "niacinamide",
  "tranexamic",
  "arbutin",
  "peptide",
  "ceramide",
  "panthenol",
  "sunscreen",
];

function CustomForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [step, setStep] = useState<Step>("serum");
  const [picked, setPicked] = useState<ActiveKey[]>([]);

  const toggle = (k: ActiveKey) =>
    setPicked((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  return (
    <div className="mt-3">
      <label className="block text-[14px] font-medium text-ink" htmlFor="shelf-name">
        제품 이름
      </label>
      <input
        id="shelf-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="예) 집에 있는 레티놀 크림"
        className="mt-[6px] h-12 w-full rounded border border-line px-3 text-[15px] text-ink placeholder:text-meta"
      />

      <p className="mt-4 text-[14px] font-medium text-ink">어느 단계에 쓰세요?</p>
      <div className="mt-[6px] flex flex-wrap gap-2">
        {STEP_ORDER.map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            aria-pressed={step === s}
            className={`press h-11 rounded border px-3 text-[14px] ${
              step === s ? "border-ink bg-ink text-on-ink" : "border-line text-body"
            }`}
          >
            {STEP_LABEL[s]}
          </button>
        ))}
      </div>

      <p className="mt-4 text-[14px] font-medium text-ink">아는 성분이 있으면 골라주세요</p>
      <p className="mt-[3px] text-[13px] leading-[1.5] text-meta">
        용기 뒤나 상세 페이지에 적혀 있어요. 없으면 비워두셔도 됩니다.
      </p>
      <div className="mt-[8px] flex flex-wrap gap-2">
        {PICKABLE.map((k) => {
          const on = picked.includes(k);
          return (
            <button
              key={k}
              onClick={() => toggle(k)}
              aria-pressed={on}
              className={`press h-11 rounded border px-3 text-[14px] ${
                on ? "border-ink bg-ink text-on-ink" : "border-line text-body"
              }`}
            >
              {activeInfo[k].name}
            </button>
          );
        })}
      </div>

      <button
        disabled={name.trim().length === 0}
        onClick={() => {
          addCustom(name, picked, step);
          setName("");
          setPicked([]);
          onDone();
        }}
        className="press mt-4 h-12 w-full rounded-cta bg-ink text-[15px] font-medium text-on-ink disabled:opacity-40"
      >
        화장대에 넣기
      </button>
    </div>
  );
}
