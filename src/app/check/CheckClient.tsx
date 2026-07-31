"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { brandOf, categories, products, won } from "@/data/catalog";
import { check, externalItems, type Note } from "@/lib/rules";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import { productImage } from "@/data/catalog";

const noteStyle: Record<Note["level"], { label: string; className: string }> = {
  caution: { label: "주의", className: "text-rose" },
  order: { label: "순서", className: "text-ink" },
  synergy: { label: "궁합", className: "text-ink" },
};

export default function CheckClient() {
  const [picked, setPicked] = useState<string[]>([]);
  const [tab, setTab] = useState<"device" | "skincare" | "external">("device");

  const toggle = (id: string) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const result = useMemo(() => (picked.length > 0 ? check(picked) : null), [picked]);

  const deviceList = products.filter((p) => p.deviceKinds);
  const careList = products.filter((p) => p.actives && !p.deviceKinds);

  const slots = ["아침", "저녁", "주 1~2회"] as const;

  return (
    <>
      <main className="flex-1">
        <section className="border-b border-hairline px-4 pb-4 pt-4">
          <h2 className="text-[18px] font-bold leading-[1.4] text-ink">
            지금 쓰는 걸 골라주세요
          </h2>
          <p className="mt-[6px] text-[14px] leading-[1.6] text-soft">
            기기와 화장품의 순서, 겹치면 안 되는 성분을 정리해 드려요. 다른 브랜드에서 쓰고 계신
            것도 함께 골라주세요.
          </p>
        </section>

        {/* 탭 */}
        <nav className="flex gap-[18px] border-b border-hairline px-4">
          {(
            [
              { key: "device", label: "디바이스" },
              { key: "skincare", label: "화장품" },
              { key: "external", label: "다른 브랜드" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`min-h-[44px] text-[14px] ${
                tab === t.key ? "border-b-2 border-ink font-bold text-ink" : "text-meta"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* 선택 목록 */}
        <section className="border-b border-hairline">
          {tab === "external"
            ? externalItems.map((x) => {
                const on = picked.includes(x.id);
                return (
                  <button
                    key={x.id}
                    onClick={() => toggle(x.id)}
                    className="flex w-full items-center gap-3 border-b border-subtle px-4 py-[14px] text-left"
                  >
                    <span
                      className={`flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded border ${
                        on ? "border-ink bg-ink text-on-ink" : "border-line"
                      }`}
                    >
                      {on && <Icon name="check" size={14} />}
                    </span>
                    <span className="flex-1">
                      <span className="block text-[14px] font-medium text-ink">{x.label}</span>
                      <span className="block text-[13px] text-meta">{x.hint}</span>
                    </span>
                  </button>
                );
              })
            : (tab === "device" ? deviceList : careList).map((p) => {
                const on = picked.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggle(p.id)}
                    className="flex w-full items-center gap-3 border-b border-subtle px-4 py-[11px] text-left"
                  >
                    <span
                      className={`flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded border ${
                        on ? "border-ink bg-ink text-on-ink" : "border-line"
                      }`}
                    >
                      {on && <Icon name="check" size={14} />}
                    </span>
                    <ImageSlot
                      className="h-[44px] w-[44px] flex-shrink-0 rounded"
                      src={productImage(p.id)}
                      alt={p.name}
                    />
                    <span className="flex-1">
                      <span className="block text-[13px] text-meta">{brandOf(p.brand).name}</span>
                      <span className="block text-[14px] text-ink">{p.name}</span>
                    </span>
                    <span className="text-[13px] text-meta">{won(p.price)}</span>
                  </button>
                );
              })}
        </section>

        {/* 결과 */}
        {result === null ? (
          <section className="px-4 py-12 text-center">
            <p className="text-[15px] font-bold text-ink">두 개 이상 고르면 순서가 나와요</p>
            <p className="mt-2 text-[14px] leading-[1.6] text-meta">
              기기 하나와 화장품 하나만 골라도 순서를 알려드려요.
            </p>
          </section>
        ) : (
          <>
            {/* 순서표 */}
            <section className="border-b border-hairline px-4 py-4">
              <h3 className="mb-[11px] text-[16px] font-bold text-ink">이 순서로 쓰세요</h3>
              {slots.map((slot) => {
                const inSlot = result.steps.filter((s) => s.slot === slot);
                if (inSlot.length === 0) return null;
                return (
                  <div key={slot} className="mb-4 last:mb-0">
                    <p className="mb-2 text-[13px] font-bold text-rose">{slot}</p>
                    {inSlot.map((s, i) => (
                      <div key={`${s.name}-${i}`} className="mb-[10px] flex gap-3 last:mb-0">
                        <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded bg-ink text-[13px] font-bold text-on-ink">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-[14px] font-medium leading-[1.4] text-ink">{s.name}</p>
                          <p className="mt-[2px] text-[13px] leading-[1.55] text-soft">{s.how}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </section>

            {/* 판정 */}
            {result.notes.length > 0 && (
              <section className="border-b border-hairline px-4 py-4">
                <h3 className="mb-[11px] text-[16px] font-bold text-ink">
                  확인할 점 {result.notes.length}
                </h3>
                {result.notes.map((n, i) => (
                  <div
                    key={i}
                    className={`border border-hairline px-3 py-[13px] ${
                      i < result.notes.length - 1 ? "mb-[10px]" : ""
                    } ${n.level === "caution" ? "border-l-2 border-l-rose" : ""}`}
                  >
                    <p className="flex items-center gap-[6px]">
                      <span className={`text-[12px] font-bold ${noteStyle[n.level].className}`}>
                        {noteStyle[n.level].label}
                      </span>
                      <span className="text-[14px] font-bold leading-[1.4] text-ink">
                        {n.title}
                      </span>
                    </p>
                    <p className="mt-[6px] text-[14px] leading-[1.6] text-body">{n.detail}</p>
                    {/* 근거를 접지 않고 그대로 보여준다 — 근거 없는 지시는 안 지켜진다 */}
                    <p className="mt-[8px] border-t border-subtle pt-[8px] text-[13px] leading-[1.6] text-meta">
                      왜 그런가요 — {n.basis}
                    </p>
                  </div>
                ))}
              </section>
            )}

            <section className="px-4 py-4">
              <p className="text-[13px] leading-[1.6] text-meta">
                일반적인 관리 순서를 정리한 안내예요. 피부 상태에 따라 다를 수 있고, 자극이 계속되면
                사용을 멈추고 전문가와 상의하세요.
              </p>
              <Link
                href="/pick"
                className="mt-3 flex h-12 items-center justify-center rounded-cta border border-ink text-[15px] font-medium text-ink"
              >
                순서까지 맞춰진 루틴 보기
              </Link>
            </section>
          </>
        )}
      </main>
    </>
  );
}
