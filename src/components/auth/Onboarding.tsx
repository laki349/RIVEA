"use client";

import { useEffect, useState } from "react";
import { isLocalBrowse, useAuth } from "@/lib/auth";
import LoginPanel from "./LoginPanel";

/**
 * 앱 첫 진입 시퀀스 — 스플래시 → 매거진 커머스 소개 → 로그인.
 * 세 패널을 가로 트랙에 놓고 왼쪽으로 밀어 넘긴다.
 *
 * 노출 조건은 localStorage 플래그가 아니라 **인증 상태**다.
 * 게스트도 익명 uid가 발급되므로, 한 번 들어오면 다시 보이지 않는다.
 * 마이페이지에서 로그아웃하면 다시 보이는데, 그게 앱의 콜드스타트 경험으로 맞다.
 *
 * 인증 상태를 확인하는 동안(ready=false)에도 1번 패널(로고)을 띄운다 —
 * 스플래시가 원래 그 용도이므로 로딩 스피너가 따로 필요 없다.
 */
const SPLASH_MS = 1600;
const INTRO_MS = 2800;

export default function Onboarding() {
  const { user, ready } = useAuth();
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Auth 미프로비저닝 시의 로컬 둘러보기 플래그 (SSR에선 읽지 않는다)
  useEffect(() => {
    if (isLocalBrowse()) setDismissed(true);
  }, []);

  const active = !user && !dismissed; // 인증되면(게스트 포함) 오버레이 제거
  const sequenceStarted = ready && active;

  // 스플래시 → 소개 → 로그인 자동 전환. 로그인 패널에선 멈춘다.
  useEffect(() => {
    if (!sequenceStarted || step > 1) return;
    const ms = step === 0 ? SPLASH_MS : INTRO_MS;
    const t = setTimeout(() => setStep((s) => Math.min(2, s + 1)), ms);
    return () => clearTimeout(t);
  }, [sequenceStarted, step]);

  if (ready && !active) return null;

  // 탭하면 기다리지 않고 다음으로 (자동 전환이 답답한 사용자용)
  const skipAhead = () => {
    if (step < 2) setStep((s) => s + 1);
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-surface"
      role="dialog"
      aria-modal="true"
      aria-label="리베아 시작하기"
    >
      <div className="mx-auto h-full w-full max-w-app overflow-hidden">
        <div
          className="flex h-full w-[300%] transition-transform duration-[520ms] ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${(step * 100) / 3}%)` }}
        >
          {/* 1 — 스플래시: 흰 화면에 로고만 */}
          <section
            onClick={skipAhead}
            className="flex h-full w-1/3 flex-col items-center justify-center"
          >
            <p className="text-[44px] font-bold tracking-[0.06em] text-rose">RIVEA</p>
          </section>

          {/* 2 — 매거진 커머스 */}
          <section
            onClick={skipAhead}
            className="flex h-full w-1/3 flex-col justify-center px-8"
          >
            <p className="text-[13px] font-bold tracking-[0.16em] text-meta">RIVEA</p>
            <h2 className="mt-3 text-[30px] font-bold leading-[1.35] text-ink">
              <b className="font-bold">매거진 커머스</b>
              <br />
              정보와 상품을
              <br />
              한자리에
            </h2>
            <p className="mt-[18px] text-[16px] leading-[1.7] text-soft">
              성분과 나이에 맞는 관리법을 읽고,
              <br />
              그에 맞는 상품을 바로 고르세요.
            </p>
            <p className="mt-8 text-[14px] text-disabled">화면을 누르면 넘어가요</p>
          </section>

          {/* 3 — 로그인 */}
          <section className="h-full w-1/3 overflow-y-auto">
            <LoginPanel compact onAuthed={() => setDismissed(true)} />
          </section>
        </div>
      </div>

      {/* 진행 표시 — 3점 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[18px] flex justify-center gap-[6px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-[5px] rounded transition-all duration-300 ${
              i === step ? "w-[18px] bg-ink" : "w-[5px] bg-line-strong"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
