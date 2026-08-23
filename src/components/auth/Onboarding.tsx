"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isLocalBrowse, useAuth } from "@/lib/auth";
import LoginPanel from "./LoginPanel";

/**
 * 공유 링크로 들어오는 경로 — 여기서는 온보딩을 띄우지 않는다.
 *
 * 이유: 카톡으로 상품 링크를 받은 사람이 열면 **상품이 아니라 스플래시·로그인을 본다.**
 * 공유의 목적이 그 자리에서 깨지고, 정적 HTML에는 내용이 있어서
 * 크롤러는 읽는데 사람은 못 읽는 상태가 된다.
 *
 * 표준 패턴은 **콘텐츠는 공개, 커머스는 로그인**이다. 담기·결제 지점에서 인증을 요구하면
 * 되고(장바구니·결제 화면), 첫 화면부터 막을 필요가 없다.
 *
 * `/lp`는 이유가 하나 더 있다. 인스타·오프라인 카드에서 들어오는 랜딩이라
 * 스플래시가 뜨는 순간 광고비(와 도달)가 그대로 증발한다. 슬래시 없이 적은 건
 * `/lp` 자체를 매칭하기 위해서다.
 */
const OPEN_PREFIXES = ["/product/", "/routine/", "/magazine/", "/concern/", "/brand/", "/lp"];

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
  const pathname = usePathname();
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Auth 미프로비저닝 시의 로컬 둘러보기 플래그 (SSR에선 읽지 않는다)
  useEffect(() => {
    if (isLocalBrowse()) setDismissed(true);
  }, []);

  const isOpenPath = OPEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  // 인증되면(게스트 포함) 오버레이 제거. 공유로 들어온 상세 페이지는 애초에 띄우지 않는다
  const active = !user && !dismissed && !isOpenPath;
  const sequenceStarted = ready && active;

  // 스플래시 → 소개 → 로그인 자동 전환. 로그인 패널에선 멈춘다.
  useEffect(() => {
    if (!sequenceStarted || step > 1) return;
    const ms = step === 0 ? SPLASH_MS : INTRO_MS;
    const t = setTimeout(() => setStep((s) => Math.min(2, s + 1)), ms);
    return () => clearTimeout(t);
  }, [sequenceStarted, step]);

  // 공유 경로는 인증 확인이 끝나기 전에도 스플래시를 깜빡이지 않는다 — 그 한 순간이
  // 링크를 받은 사람에게는 "잘못 열렸나" 싶은 화면이 된다
  if (isOpenPath || (ready && !active)) return null;

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
            <p className="text-[15px] font-bold tracking-[0.16em] text-meta">RIVEA</p>
            <h2 className="mt-3 text-[30px] font-bold leading-[1.35] text-ink">
              <b className="font-bold">매거진 커머스</b>
              <br />
              정보와 상품을
              <br />
              한자리에
            </h2>
            <p className="mt-[18px] text-[18px] leading-[1.7] text-soft">
              성분과 나이에 맞는 관리법을 읽고,
              <br />
              그에 맞는 상품을 바로 고르세요.
            </p>
            <p className="mt-8 text-[16px] text-disabled">화면을 누르면 넘어가요</p>
          </section>

          {/* 3 — 로그인 */}
          <section className="no-scrollbar h-full w-1/3 overflow-y-auto">
            <LoginPanel compact onAuthed={() => setDismissed(true)} />
          </section>
        </div>
      </div>

      {/* 진행 표시 — 3점 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[18px] flex justify-center gap-[6px]">
        {[0, 1, 2].map((i) => (
          /**
           * 폭이 아니라 scaleX를 애니메이션한다. `transition-all`로 width를 늘이면
           * 매 프레임 레이아웃을 다시 계산해서 저사양 기기에서 끊긴다 —
           * 앱 전체에서 transform·opacity 외를 전환하던 유일한 자리였다.
           */
          <span
            key={i}
            className="flex h-[5px] w-[18px] items-center justify-center"
          >
            <span
              className={`h-[5px] w-[18px] origin-center rounded transition-transform duration-state ease-enter ${
                i === step ? "scale-x-100 bg-ink" : "scale-x-[0.28] bg-line-strong"
              }`}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
