"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ContactType,
  isValidEmail,
  isValidPhone,
  MAX_PRODUCT_LEN,
  submitLead,
} from "@/lib/leads";

/**
 * 진단 신청 폼.
 *
 * 순서가 설계의 핵심이다: **제품을 먼저 적게 하고 연락처를 마지막에 묻는다.**
 * 연락처부터 물으면 거기서 절반이 나간다. 화장대를 뒤져 제품명을 적는 건
 * 이메일 남기는 것보다 훨씬 큰 노력이라, 그걸 이미 한 사람은 연락처를 준다.
 *
 * 그리고 적어준 제품명 자체가 이 폼의 두 번째 산출물이다 —
 * `src/lib/rules.ts` 판정에 그대로 넣으면 "N명 중 M명이 겹치게 쓰고 있었다"가 계산된다.
 */

const CHECK_ID = "lp-agree";

function Check({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={`mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
        on ? "border-ink bg-ink" : "border-line-strong bg-surface"
      }`}
    >
      {on && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6.2L4.8 8.5L9.5 3.8"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="square"
          />
        </svg>
      )}
    </span>
  );
}

export default function LeadForm() {
  const [products, setProducts] = useState(["", "", ""]);
  const [contactType, setContactType] = useState<ContactType>("phone");
  const [contact, setContact] = useState("");
  const [agreed, setAgreed] = useState(false); // 기본 해제 (다크패턴 금지)
  const [touchedContact, setTouchedContact] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [ref, setRef] = useState("direct");
  const firstProductRef = useRef<HTMLInputElement>(null);

  /**
   * 유입 경로. `useSearchParams`는 정적 export에서 Suspense 경계를 요구해서
   * 랜딩 첫 화면을 한 번 비우게 만든다. 여기선 그냥 주소창을 읽는다.
   */
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("ref");
    if (r) setRef(r.slice(0, 40));
  }, []);

  const filled = products.map((p) => p.trim()).filter(Boolean);
  const contactOk =
    contactType === "email" ? isValidEmail(contact) : isValidPhone(contact);
  const contactError = touchedContact && contact.length > 0 && !contactOk;
  const canSubmit = filled.length >= 1 && contactOk && agreed && state !== "sending";

  const setProduct = (i: number, v: string) =>
    setProducts((prev) => prev.map((p, idx) => (idx === i ? v : p)));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setState("sending");
    try {
      await submitLead({ products: filled, contact, contactType, agreed: true, ref });
      setState("done");
    } catch {
      setState("error");
    }
  };

  /* ── 완료 ─────────────────────────────────────── */
  if (state === "done") {
    return (
      <section className="px-5 pb-12 pt-4" aria-live="polite">
        <p className="text-[13px] font-medium tracking-[0.08em] text-meta">접수되었습니다</p>
        <h2 className="mt-3 text-[24px] font-bold leading-[1.35] text-ink">
          진단서를 {contactType === "email" ? "메일로" : "문자로"} 보내드릴게요
        </h2>
        <p className="mt-3 text-[16px] leading-[1.65] text-body">
          적어주신 {filled.length}개를 하나씩 보고, 겹치는 것과 채우면 좋은 것,
          그리고 아침·저녁 순서를 정리해서 보내드립니다. <b className="font-medium text-ink">2~3일 걸립니다.</b>
        </p>
        <p className="mt-6 text-[15px] leading-[1.6] text-meta">
          답이 늦으면 잊은 게 아니라 하나씩 보고 있는 중입니다.
        </p>
        <Link
          href="/"
          className="press mt-8 flex h-[52px] w-full items-center justify-center rounded-cta border border-line-strong text-[16px] font-medium text-ink"
        >
          리베아 둘러보기
        </Link>
      </section>
    );
  }

  /* ── 폼 ───────────────────────────────────────── */
  return (
    <form onSubmit={onSubmit} className="px-5 pb-10">
      {/* 1단계 — 제품.
          히어로 바로 아래에 붙는다. 제목을 또 쓰면 같은 말이 두 번이라
          첫 화면에서 입력칸이 밀려난다. 단계 표시와 안내 한 줄만 남긴다. */}
      <p className="text-[13px] font-medium tracking-[0.08em] text-meta">1 / 2</p>
      <p className="mt-2 text-[16px] leading-[1.6] text-body">
        브랜드와 제품명을 아는 만큼만요. <b className="font-medium text-ink">하나만 적으셔도 됩니다.</b>
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {products.map((p, i) => (
          <div key={i}>
            <label
              htmlFor={`lp-product-${i}`}
              className="mb-1.5 block text-[13px] font-medium text-body"
            >
              제품 {i + 1}
              {i === 0 && <span className="ml-1 text-rose">*</span>}
            </label>
            <input
              id={`lp-product-${i}`}
              ref={i === 0 ? firstProductRef : undefined}
              value={p}
              onChange={(e) => setProduct(i, e.target.value)}
              maxLength={MAX_PRODUCT_LEN}
              enterKeyHint={i === 2 ? "done" : "next"}
              autoComplete="off"
              placeholder={
                ["예) 아누아 나이아신아마이드 세럼", "예) 토리든 다이브인", "예) 레티놀 크림"][i]
              }
              className="h-[52px] w-full rounded border border-line bg-surface px-4 text-[16px] text-ink placeholder:text-disabled focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/15"
            />
          </div>
        ))}
      </div>

      <p className="mt-3 text-[14px] leading-[1.6] text-meta">
        기기(LED 마스크·갈바닉 등)를 쓰신다면 그것도 같이 적어주세요. 순서가 달라집니다.
      </p>

      {/* 2단계 — 연락처. 노력을 이미 들인 뒤에 묻는다 */}
      <div className="mt-10 border-t border-hairline pt-8">
        <p className="text-[13px] font-medium tracking-[0.08em] text-meta">2 / 2</p>
        <h2 className="mt-2 text-[22px] font-bold leading-[1.4] text-ink">
          결과를 어디로 보내드릴까요
        </h2>

        <div
          role="radiogroup"
          aria-label="회신 방법"
          className="mt-4 flex gap-2"
        >
          {(
            [
              ["phone", "문자"],
              ["email", "이메일"],
            ] as const
          ).map(([type, label]) => (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={contactType === type}
              onClick={() => {
                setContactType(type);
                setTouchedContact(false);
              }}
              className={`press h-11 flex-1 rounded border text-[15px] font-medium ${
                contactType === type
                  ? "border-ink bg-ink text-on-ink"
                  : "border-line text-body"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label
            htmlFor="lp-contact"
            className="mb-1.5 block text-[13px] font-medium text-body"
          >
            {contactType === "email" ? "이메일 주소" : "휴대폰 번호"}
            <span className="ml-1 text-rose">*</span>
          </label>
          <input
            id="lp-contact"
            type={contactType === "email" ? "email" : "tel"}
            inputMode={contactType === "email" ? "email" : "numeric"}
            autoComplete={contactType === "email" ? "email" : "tel"}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            onBlur={() => setTouchedContact(true)}
            aria-invalid={contactError || undefined}
            aria-describedby={contactError ? "lp-contact-err" : undefined}
            placeholder={contactType === "email" ? "name@example.com" : "010-0000-0000"}
            className={`h-[52px] w-full rounded border bg-surface px-4 text-[16px] text-ink placeholder:text-disabled focus:outline-none focus:ring-2 focus:ring-ink/15 ${
              contactError ? "border-rose" : "border-line focus:border-ink"
            }`}
          />
          {contactError && (
            <p id="lp-contact-err" role="alert" className="mt-2 text-[14px] text-rose">
              {contactType === "email"
                ? "메일 주소를 다시 확인해 주세요."
                : "휴대폰 번호 10~11자리를 입력해 주세요."}
            </p>
          )}
        </div>
      </div>

      {/* 개인정보 — 기본 해제 */}
      <div className="mt-8 border-t border-hairline pt-6">
        <button
          type="button"
          id={CHECK_ID}
          role="checkbox"
          aria-checked={agreed}
          onClick={() => setAgreed((v) => !v)}
          /* py-[11px]: 40대+ 대상이라 터치타깃 44px는 타협 불가 (docs/03) */
          className="flex w-full items-start gap-3 py-[11px] text-left"
        >
          <Check on={agreed} />
          <span className="text-[14px] leading-[1.6] text-body">
            개인정보 수집·이용에 동의합니다.
          </span>
        </button>
        <p className="mt-2 pl-8 text-[13px] leading-[1.7] text-meta">
          수집 항목: 사용 중인 제품명, {contactType === "email" ? "이메일 주소" : "휴대폰 번호"}
          <br />
          이용 목적: 진단 결과 회신
          <br />
          보유 기간: 회신 완료 후 6개월, 이후 파기
          <br />
          동의를 거부하실 수 있으며, 이 경우 결과를 보내드릴 수 없습니다.
        </p>
      </div>

      {state === "error" && (
        <p role="alert" className="mt-6 text-[15px] leading-[1.6] text-rose">
          전송에 실패했어요. 잠시 뒤 다시 눌러주시겠어요? 계속 안 되면 인스타그램 DM으로 보내주셔도 됩니다.
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="press mt-8 h-[52px] w-full rounded-cta bg-ink text-[16px] font-medium text-on-ink disabled:opacity-40"
      >
        {state === "sending" ? "보내는 중…" : "진단서 받기"}
      </button>

      <p className="mt-3 text-center text-[14px] leading-[1.6] text-meta">
        무료입니다. 아무것도 판매하지 않습니다.
        <br />
        받기까지 2~3일 걸립니다.
      </p>
    </form>
  );
}
