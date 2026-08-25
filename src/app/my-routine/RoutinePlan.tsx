"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { brandOf, concernOf, productImage, productOf, won, type Product } from "@/data/catalog";
import { pmNoteFor, prescribe, type Slotted } from "@/lib/prescribe";
import { useProfile } from "@/lib/profile";
import { track } from "@/lib/events";
import { useShelfEntries } from "@/lib/shelf";
import { regimenOf } from "@/data/regimen";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import InteractionNotes from "@/components/InteractionNotes";

/**
 * 내 루틴 — 고민에서 만든 아침·저녁 순서.
 *
 * 이 화면이 이 앱의 답이다. 지금까지 고민 프로필이 하던 일은 홈 정렬을 바꾸는
 * 것뿐이었고, 정렬은 "무엇을 살까"만 돕는다. **막히는 지점은 순서다.**
 *
 * 화면 규칙 둘:
 * ① 빈 자리를 숨기지 않는다. 채울 게 없으면 없다고 말하는 게 아무거나 끼워 넣는
 *    것보다 정확하고, 사용자가 "여긴 내가 쓰던 걸 쓰면 되네"를 알 수 있다.
 * ② 주 2~3회는 매일 루틴과 섞지 않는다. 섞으면 매일 써야 하는 줄 안다.
 */
export default function RoutinePlan() {
  const profile = useProfile();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const shelf = useShelfEntries();
  const plan = useMemo(
    () => prescribe(profile.concerns, shelf, profile.signals),
    [profile.concerns, shelf, profile.signals]
  );

  // 처방 도달 — 고민이 있어야 처방이 나온다. 빈 화면은 도달로 세지 않는다
  useEffect(() => {
    if (profile.concerns.length > 0) track("prescription_view", profile.concerns[0]);
  }, [profile.concerns]);

  if (!mounted) return <main className="flex-1" />;

  if (profile.concerns.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
        <span className="text-disabled">
          <Icon name="sparkle" size={44} />
        </span>
        <p className="mt-4 text-[18px] font-bold text-ink">고민을 먼저 골라주세요</p>
        <p className="mt-2 text-[17px] leading-[1.6] text-meta">
          고민을 고르면 아침·저녁에
          <br />
          무엇을 어떤 순서로 쓰면 되는지 짜드려요.
        </p>
        <Link
          href="/profile"
          className="press mt-6 flex h-12 items-center justify-center rounded-cta bg-ink px-7 text-[17px] font-medium text-on-ink"
        >
          내 피부 고민 고르기
        </Link>
      </main>
    );
  }

  const names = profile.concerns.map((s) => concernOf(s)?.name).filter(Boolean);
  const buyable = plan.productIds;

  return (
    <main className="flex-1">
      {/* 무엇으로 짠 루틴인지 — 개인화는 근거를 보여줘야 개인화가 된다 */}
      <section className="border-b border-hairline px-4 py-4">
        <p className="text-[15px] text-meta">고른 고민으로 짰어요</p>
        <h2 className="mt-[3px] text-[21px] font-bold leading-[1.35] text-ink">
          {names.join(" · ")} 루틴
        </h2>
        <Link href="/profile" className="press mt-2 inline-flex items-center text-[16px] text-body">
          고민 바꾸기
          <Icon name="chevron-right" size={14} />
        </Link>
      </section>

      <Day title="아침" note="바르는 순서예요" steps={plan.am} />
      <Day title="저녁" note={pmNoteFor(profile.concerns)} steps={plan.pm} />

      {/*
        얼굴 밖에서 매일 쓰는 것 — 두피·이너뷰티. 아침·저녁 사다리에 끼우지 않는다.
        바르는 순서와 무관하고, 순서 안에 넣으면 「3번 다음에 4번」이 성립하지 않는다.
      */}
      {plan.extra.length > 0 && (
        <section className="border-b border-hairline px-4 py-4">
          <h3 className="text-[18px] font-bold text-ink">매일, 순서와 상관없이</h3>
          <p className="mt-[3px] text-[15px] leading-[1.5] text-meta">
            얼굴에 바르는 순서와 따로 가는 자리예요.
          </p>
          <div className="mt-3 space-y-3">
            {plan.extra.map((w) => (
              <div key={w.product.id}>
                <ProductRow id={w.product.id} />
                <p className="mt-[5px] text-[16px] leading-[1.55] text-body">{w.when}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {plan.weekly.length > 0 && (
        <section className="border-b border-hairline px-4 py-4">
          <h3 className="text-[18px] font-bold text-ink">주 2~3회</h3>
          <p className="mt-[3px] text-[15px] leading-[1.5] text-meta">
            매일 하지 않아도 돼요. 위 순서에 끼워 넣는 날만 쓰세요.
          </p>
          <div className="mt-3 space-y-3">
            {plan.weekly.map((w) => (
              <div key={w.product.id}>
                <ProductRow id={w.product.id} />
                <p className="mt-[5px] text-[16px] leading-[1.55] text-body">{w.when}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 이 조합에서 생기는 주의 — 장바구니와 같은 규칙, 같은 카드 */}
      <InteractionNotes
        ids={[...buyable, ...plan.weeklyIds].map((id) => ({ kind: "product" as const, id }))}
      />

      {/*
        「전부 담기」를 뺐다 (2026-08-25). 담으면 `/checkout`으로 이어지는데 우리는
        결제를 받지 않는다. 루틴은 여러 브랜드가 섞여 있어 한 번에 내보낼 수도 없다.
        각 제품 상세에서 그 브랜드 공식몰로 나가는 게 실제로 가능한 동선이다.
      */}
      <div className="px-4 py-4">
        <Link
          href="/shelf"
          className="press flex h-[52px] w-full items-center justify-center rounded-cta bg-ink text-[18px] font-medium text-on-ink"
        >
          쓰고 있는 것 등록하고 판정받기
        </Link>
        <Link
          href="/shelf"
          className="press mt-2 flex h-11 items-center justify-center text-[16px] text-body"
        >
          14·28일 뒤에 효과를 같이 봐드려요
          <Icon name="chevron-right" size={15} />
        </Link>
      </div>


    </main>
  );
}

function Day({ title, note, steps }: { title: string; note: string; steps: Slotted[] }) {
  const empty = steps.filter((s) => !s.product && !s.owned).length;

  return (
    <section className="border-b border-hairline px-4 py-4">
      <h3 className="text-[18px] font-bold text-ink">{title}</h3>
      <p className="mt-[3px] text-[15px] leading-[1.5] text-meta">{note}</p>

      <ol className="mt-3">
        {steps.map((s, i) => (
          <li key={s.step} className={i < steps.length - 1 ? "pb-[14px]" : ""}>
            <div className="flex items-center gap-2">
              {/* 번호는 순서 그 자체라 자리가 비어도 매긴다 */}
              <span className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-ink text-[15px] font-bold text-on-ink">
                {i + 1}
              </span>
              <span className="text-[17px] font-medium text-ink">{s.label}</span>
              {s.reason && (
                <span className="text-[15px] text-meta">
                  · {concernOf(s.reason)?.name}
                </span>
              )}
            </div>

            <div className="mt-2 pl-[30px]">
              {s.owned ? (
                // 갖고 계신 것 — 살 것에서 빠졌다는 걸 이 자리에서 말해준다
                <div className="rounded border border-hairline px-3 py-[9px]">
                  <p className="flex items-center gap-[5px] text-[15px] text-meta">
                    <Icon name="check" size={13} />
                    갖고 계신 것
                  </p>
                  <p className="mt-[3px] text-[16px] text-ink">{s.owned.name}</p>
                </div>
              ) : s.product ? (
                <ProductRow id={s.product.id} />
              ) : (
                // 같은 문장을 자리마다 반복하지 않는다. 두피 고민에서 다섯 번 나오니
                // 화면이 「없다」는 말로 도배됐다. 이유는 아래 한 줄로 한 번만 말한다.
                <p className="text-[16px] leading-[1.55] text-meta">쓰시던 것</p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {empty > 0 && (
        <p className="mt-[10px] border-t border-subtle pt-[10px] text-[15px] leading-[1.6] text-meta">
          {empty}자리는 쓰시던 걸 그대로 쓰세요. 이 고민에 맞는 상품을 아직 못 갖춘
          자리라, 아무거나 끼워 넣지 않았어요.
        </p>
      )}
    </section>
  );
}

function ProductRow({ id }: { id: string }) {
  // productOf의 타입은 non-null이지만 못 찾으면 undefined다 — 방어한다
  const p = productOf(id) as Product | undefined;
  if (!p) return null;
  const r = regimenOf(p);

  return (
    <Link href={`/product/${p.id}`} className="press-card flex gap-[11px]">
      <ImageSlot
        className="h-[52px] w-[52px] flex-shrink-0 rounded"
        src={productImage(p.id)}
        alt={p.name}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[15px] text-meta">{brandOf(p.brand).name}</p>
        <p className="truncate text-[16px] text-ink">{p.name}</p>
        <p className="mt-[2px] text-[15px] text-meta">
          {won(p.price)}원
          {r.lifespanDays !== null && ` · 약 ${r.lifespanDays}일분`}
        </p>
      </div>
    </Link>
  );
}
