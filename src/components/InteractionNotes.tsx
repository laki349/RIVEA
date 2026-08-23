"use client";

import { useState } from "react";
import { productOf, routines, type ActiveKey } from "@/data/catalog";
import {
  findDeviceCautions,
  findInteractions,
  type InteractionKind,
} from "@/data/interactions";
import { activeInfo } from "@/data/actives";
import { useShelfEntries, type ShelfEntry } from "@/lib/shelf";
import Icon from "./Icon";

/**
 * 담아둔 것 + **이미 쓰고 있는 것**을 같이 쓸 때 알아둘 점.
 *
 * 이 카드가 이 앱에만 있을 수 있는 이유: 중개형이라 장바구니 안에 여러 브랜드가
 * 섞인다. 브랜드몰은 자기 제품 하나만 설명하고, 종합몰은 조합을 볼 이유가 없다.
 * **여러 브랜드를 한 바구니에 담는 구조가 조합을 볼 자격을 준다.**
 *
 * 처음엔 담은 것끼리만 봤는데 그건 반쪽이었다 — 실제 충돌은 새로 산 것과 원래
 * 쓰던 것 사이에서 생긴다. 그래서 「내 화장대」(lib/shelf.ts)를 함께 읽는다.
 *
 * 톤은 경고가 아니라 안내다. 겁을 주면 사용자는 결제를 멈추는 게 아니라 앱을 닫는다.
 * 그래서 "괜찮은 조합"(fine)도 같이 보여준다 — 괜히 걱정하던 걸 풀어주는 것도 정보다.
 */
export default function InteractionNotes({
  ids,
  className = "",
  /** 화장대를 함께 볼지. 화장대 화면 자신은 이미 목록을 보여주므로 끌 수 있다 */
  includeShelf = true,
}: {
  /** 화면에 담긴 것들. 상품 id와 루틴 id가 섞여 들어와도 된다 */
  ids: { kind: "product" | "routine"; id: string }[];
  className?: string;
  includeShelf?: boolean;
}) {
  const shelf = useShelfEntries();
  const [openFine, setOpenFine] = useState(false);

  // 어느 성분이 어디서 왔는지 기억한다 — "레티놀과 산은 나눠서"만 말하면
  // 사용자가 자기 물건 중 뭐가 그 둘인지 찾아야 한다
  const sources = new Map<ActiveKey, { name: string; owned: boolean }[]>();
  const note = (key: ActiveKey, name: string, owned: boolean) => {
    const list = sources.get(key) ?? [];
    if (!list.some((x) => x.name === name)) list.push({ name, owned });
    sources.set(key, list);
  };

  const picked = expand(ids);
  picked.forEach((p) => p.actives?.forEach((a) => note(a.key, p.name, false)));
  const shelfUsed = includeShelf ? shelf : [];
  shelfUsed.forEach((e) => e.actives.forEach((k) => note(k, e.name, true)));

  const keys = Array.from(sources.keys());
  const hasDevice =
    picked.some((p) => p.category === "device") ||
    shelfUsed.some((e) => e.product?.category === "device");

  const all = findInteractions(keys);
  const deviceNotes = findDeviceCautions(keys, hasDevice);
  // 행동이 필요한 것만 펼친다. 성분을 많이 담으면 규칙이 7개까지 걸리는데,
  // 카드 7장은 읽히지 않는다 — 안 읽히는 안내는 없는 안내다.
  const acting = all.filter((n) => n.kind !== "fine");
  const fine = all.filter((n) => n.kind === "fine");

  if (all.length === 0 && deviceNotes.length === 0) return null;

  const usesShelf = shelfUsed.length > 0;

  return (
    <section className={`border-b border-hairline px-4 py-4 ${className}`}>
      <h2 className="text-[17px] font-bold text-ink">함께 쓸 때 알아두세요</h2>
      <p className="mt-[3px] text-[15px] leading-[1.5] text-meta">
        {usesShelf
          ? "담아두신 것과 화장대에 있는 것을 함께 봤어요. 피부 반응은 사람마다 달라요."
          : "담아두신 제품의 성분을 보고 알려드려요. 피부 반응은 사람마다 달라요."}
      </p>

      <div className="mt-3 space-y-2">
        {acting.map((n) => (
          <Note key={n.title} {...n} sources={sources} />
        ))}
        {deviceNotes.map((n) => (
          <Note
            key={n.title}
            kind="caution"
            title={n.title}
            why={n.why}
            how={n.how}
            pair={[n.active, n.active]}
            sources={sources}
          />
        ))}

        {fine.length > 0 &&
          (openFine ? (
            fine.map((n) => <Note key={n.title} {...n} sources={sources} />)
          ) : (
            <button
              onClick={() => setOpenFine(true)}
              className="press flex h-11 w-full items-center justify-center gap-[6px] rounded border border-hairline text-[16px] text-body"
            >
              <span className="text-ink">
                <Icon name="check" size={14} />
              </span>
              같이 써도 괜찮은 조합 {fine.length}개 보기
            </button>
          ))}
      </div>
    </section>
  );
}

const TONE: Record<InteractionKind, { icon: "info" | "check"; label: string; cls: string }> = {
  // 색으로만 구분하지 않는다 — 아이콘과 말머리를 함께 둔다 (docs/03 접근성)
  caution: { icon: "info", label: "나눠 쓰기", cls: "border-line-strong" },
  pair: { icon: "info", label: "같이 챙기기", cls: "border-line-strong" },
  fine: { icon: "check", label: "괜찮아요", cls: "border-hairline" },
};

function Note({
  kind,
  title,
  why,
  how,
  pair,
  sources,
}: {
  kind: InteractionKind;
  title: string;
  why: string;
  how: string;
  pair: [ActiveKey, ActiveKey];
  sources: Map<ActiveKey, { name: string; owned: boolean }[]>;
}) {
  const tone = TONE[kind];
  // 규칙에 걸린 성분이 실제로 어느 물건에 들어 있는지
  const lines = Array.from(new Set(pair)).map((key) => ({
    key,
    label: activeInfo[key]?.name ?? key,
    from: sources.get(key) ?? [],
  }));

  return (
    <div className={`rounded border px-3 py-[11px] ${tone.cls}`}>
      <div className="flex items-center gap-[6px]">
        <span className="text-ink">
          <Icon name={tone.icon} size={14} />
        </span>
        <span className="text-[15px] font-medium text-meta">{tone.label}</span>
      </div>
      <p className="mt-[5px] text-[17px] font-medium leading-[1.45] text-ink">{title}</p>
      <p className="mt-[4px] text-[16px] leading-[1.6] text-body">{why}</p>
      <p className="mt-[6px] text-[16px] leading-[1.6] text-ink">{how}</p>

      {/* 근거 — 어느 물건 때문인지. 이게 없으면 사용자가 자기 물건을 뒤져야 한다 */}
      {lines.some((l) => l.from.length > 0) && (
        <ul className="mt-[9px] border-t border-hairline pt-[8px]">
          {lines.map((l) => (
            <li key={l.key} className="text-[15px] leading-[1.6] text-meta">
              <b className="font-medium text-body">{l.label}</b>{" "}
              {l.from.map((f, i) => (
                <span key={f.name}>
                  {i > 0 && ", "}
                  {f.name}
                  {f.owned && " (쓰고 계신 것)"}
                </span>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** 루틴 세트는 구성품으로 펼친다 — 세트 안에서도 조합은 생긴다 */
function expand(ids: { kind: "product" | "routine"; id: string }[]) {
  const out = [];
  for (const it of ids) {
    if (it.kind === "product") {
      const p = productOf(it.id);
      if (p) out.push(p);
      continue;
    }
    const r = routines.find((x) => x.id === it.id);
    if (!r) continue;
    for (const s of r.steps) {
      const p = productOf(s.productId);
      if (p) out.push(p);
    }
  }
  return out;
}

export type { ShelfEntry };
