"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import {
  authErrorMessage,
  signInAsGuest,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "@/lib/auth";

/**
 * 로그인 · 회원가입 패널. 온보딩 3번째 화면과 /login 라우트가 공유한다.
 *
 * 중년 가독성 규칙: 라벨은 placeholder가 아니라 눈에 보이게, 입력 높이 52px,
 * 본문 16px(iOS 자동 확대 방지 겸), 에러는 해당 필드 아래에 원인 + 다음 행동으로.
 */
type Mode = "signin" | "signup";

export default function LoginPanel({
  onAuthed,
  compact = false,
}: {
  /** 인증 성공 시 (게스트 포함) */
  onAuthed?: () => void;
  /** 온보딩 안에서 쓸 때 상단 여백을 줄인다 */
  compact?: boolean;
}) {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<null | "email" | "google" | "guest">(null);

  const run = async (kind: "email" | "google" | "guest", fn: () => Promise<unknown>) => {
    setError("");
    setBusy(kind);
    try {
      await fn();
      onAuthed?.();
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run("email", () =>
      mode === "signin"
        ? signInWithEmail(email, password)
        : signUpWithEmail(email, password, name.trim() || undefined)
    );
  };

  const disabled = busy !== null;

  return (
    <div className={`flex flex-col px-6 ${compact ? "pt-8" : "pt-12"} pb-8`}>
      <p className="text-[26px] font-bold tracking-[0.05em] text-rose">RIVEA</p>
      <h1 className="mt-4 text-[24px] font-bold leading-[1.35] text-ink">
        {mode === "signin" ? "다시 오셨네요" : "리베아 시작하기"}
      </h1>
      <p className="mt-[7px] text-[17px] leading-[1.6] text-soft">
        {mode === "signin"
          ? "주문내역과 찜한 상품을 이어서 볼 수 있어요."
          : "이메일만 있으면 바로 시작할 수 있어요."}
      </p>

      {/* 로그인 / 회원가입 전환 */}
      <div className="mt-6 flex gap-[18px] border-b border-hairline">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError("");
            }}
            aria-selected={mode === m}
            className={`min-h-[44px] pb-[9px] text-[17px] ${
              mode === m ? "border-b-2 border-ink font-bold text-ink" : "text-meta"
            }`}
          >
            {m === "signin" ? "로그인" : "회원가입"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5">
        {mode === "signup" && (
          <div className="mb-4">
            <label htmlFor="auth-name" className="block text-[16px] font-medium text-ink">
              이름 <span className="font-normal text-meta">(선택)</span>
            </label>
            <input
              id="auth-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="김서연"
              className="mt-[7px] h-[52px] w-full rounded border border-line px-[13px] text-[18px] text-ink placeholder:text-disabled focus:border-ink focus:outline-none"
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="auth-email" className="block text-[16px] font-medium text-ink">
            이메일
          </label>
          <input
            id="auth-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="rivea@example.com"
            className="mt-[7px] h-[52px] w-full rounded border border-line px-[13px] text-[18px] text-ink placeholder:text-disabled focus:border-ink focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="auth-pw" className="block text-[16px] font-medium text-ink">
            비밀번호
          </label>
          <div className="relative mt-[7px]">
            <input
              id="auth-pw"
              type={showPw ? "text" : "password"}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "6자 이상" : ""}
              className="h-[52px] w-full rounded border border-line pl-[13px] pr-[52px] text-[18px] text-ink placeholder:text-disabled focus:border-ink focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 표시"}
              className="absolute right-0 top-0 flex h-[52px] w-[48px] items-center justify-center text-meta"
            >
              <Icon name="eye" size={19} />
            </button>
          </div>
          {mode === "signup" && (
            <p className="mt-[6px] text-[15px] text-meta">6자 이상으로 정해 주세요.</p>
          )}
        </div>

        {/* 에러 — 필드 아래, 스크린리더에 알림 */}
        {error && (
          <p
            role="alert"
            aria-live="polite"
            className="mt-4 flex items-start gap-[7px] rounded bg-subtle px-[12px] py-[10px] text-[16px] leading-[1.55] text-ink"
          >
            <span className="mt-[2px] flex-shrink-0 text-rose">
              <Icon name="bell" size={15} />
            </span>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={disabled}
          className="mt-6 h-[52px] w-full rounded-cta bg-ink text-[18px] font-medium text-on-ink disabled:opacity-50"
        >
          {busy === "email" ? "확인 중…" : mode === "signin" ? "로그인" : "가입하고 시작하기"}
        </button>
      </form>

      {/* 구분 */}
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[15px] text-meta">또는</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <button
        type="button"
        onClick={() => run("google", signInWithGoogle)}
        disabled={disabled}
        className="flex h-[52px] w-full items-center justify-center gap-[9px] rounded-cta border border-line-strong text-[17px] font-medium text-ink disabled:opacity-50"
      >
        <GoogleMark />
        {busy === "google" ? "확인 중…" : "구글로 계속하기"}
      </button>

      <button
        type="button"
        onClick={() => run("guest", signInAsGuest)}
        disabled={disabled}
        className="mt-3 min-h-[48px] w-full text-[17px] text-soft underline underline-offset-[3px] disabled:opacity-50"
      >
        {busy === "guest" ? "들어가는 중…" : "게스트로 둘러보기"}
      </button>
      <p className="mt-[7px] text-center text-[15px] leading-[1.55] text-meta">
        게스트로 둘러본 뒤 마이페이지에서 로그인할 수 있어요.
      </p>
    </div>
  );
}

/** 구글 공식 브랜드 마크 (색상 규정 준수 — 임의 변색 금지) */
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.41 5.41 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.01-2.34Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}
