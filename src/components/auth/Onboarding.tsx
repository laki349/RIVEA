"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isLocalBrowse, signInAsGuest, useAuth } from "@/lib/auth";

/**
 * 공유 링크로 들어오는 경로 — 여기서는 온보딩을 띄우지 않는다.
 *
 * 이유: 카톡으로 상품 링크를 받은 사람이 열면 **상품이 아니라 스플래시를 본다.**
 * 공유의 목적이 그 자리에서 깨지고, 정적 HTML에는 내용이 있어서
 * 크롤러는 읽는데 사람은 못 읽는 상태가 된다.
 *
 * `/lp`는 이유가 하나 더 있다. 인스타·오프라인 카드에서 들어오는 랜딩이라
 * 스플래시가 뜨는 순간 광고비(와 도달)가 그대로 증발한다. 슬래시 없이 적은 건
 * `/lp` 자체를 매칭하기 위해서다.
 *
 * **2026-08-25 — 「내 루틴」과 「화장대」를 여기 넣었다.** 이 둘이 빠져 있어서
 * 처방을 보러 온 사람이 스플래시와 로그인 패널을 먼저 만났다. 이 앱이 파는 게
 * 정확히 그 두 화면인데 그 앞에 문을 세우고 있었다.
 */
const OPEN_PREFIXES = [
  "/product/",
  "/routine/",
  "/magazine/",
  "/concern/",
  "/brand/",
  "/lp",
  "/my-routine",
  "/shelf",
];

/**
 * 앱 첫 진입 시퀀스 — 스플래시 → 매거진 커머스 소개 → **그대로 앱으로.**
 *
 * ## 2026-08-25 — 로그인 패널을 시퀀스에서 뺐다 (운영자 결정)
 *
 * 전에는 세 번째 패널이 로그인이었다. 인스타 링크로 들어온 사람이 보는 순서가
 * **스플래시 4.4초 → 로그인 화면**이었다는 뜻이다. 「게스트로 둘러보기」 버튼이
 * 있긴 했지만, 그건 탈출구지 입구가 아니다.
 *
 * 로그인을 입구에서 받지 않는 이유 셋:
 *  ① **증명이 안 된다.** 익명 uid가 이미 고유 사용자를 센다. 피칭에서 강한 숫자는
 *     가입자 수가 아니라 퍼널이다 — "몇 명이 처방까지 갔고 몇 명이 공식몰로 나갔나".
 *     콜드 트래픽의 가입 수는 작을 수밖에 없고, 그건 보여주기 더 나쁜 숫자다.
 *  ② **설문이 반대를 말한다.** 「고를 때 불편」 1위가 "이게 나한테 맞는 건지 모르겠다"
 *     50%(`docs/15`)인데, 그 답 앞에 로그인 벽을 세우는 셈이다.
 *  ③ **잃은 걸 셀 수 없다.** 벽에서 나간 사람은 `app_open`조차 남기지 않는다.
 *
 * 로그인이 값을 하는 자리는 따로 있다 — **14·28일 판정**이다. 그건 사람이 돌아와야
 * 성립하는데 localStorage는 브라우저마다 따로고 인앱 브라우저에서 잘 날아간다.
 * 그래서 권유는 **화장대에 무언가 등록한 뒤**로 옮겼다 (`/shelf`의 게스트 안내).
 *
 * 유입 링크(`?ref=`)는 스플래시도 건너뛴다. 목적이 분명한 방문이라 브랜드 소개가
 * 그 사이에 낄 이유가 없다.
 */
const SPLASH_MS = 1400;
const INTRO_MS = 2400;

export default function Onboarding() {
  const { user, ready } = useAuth();
  const pathname = usePathname();
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Auth 미프로비저닝 시의 로컬 둘러보기 플래그 (SSR에선 읽지 않는다)
  useEffect(() => {
    if (isLocalBrowse()) setDismissed(true);
  }, []);

  // `?ref=`가 붙은 방문은 목적이 분명하다. 브랜드 소개를 끼우지 않는다
  const [fromLink, setFromLink] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("ref")) {
      setFromLink(true);
    }
  }, []);

  const isOpenPath = OPEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  // 인증되면(게스트 포함) 오버레이 제거. 공유로 들어온 상세 페이지는 애초에 띄우지 않는다
  const active = !user && !dismissed && !isOpenPath && !fromLink;
  const sequenceStarted = ready && active;

  /**
   * 스플래시 → 소개 → **앱**. 마지막에 게스트로 들여보내고 오버레이를 걷는다.
   * 예전엔 여기서 로그인 패널에 멈춰 섰다 — 그게 문이었다.
   */
  useEffect(() => {
    if (!sequenceStarted) return;
    if (step > 1) {
      void signInAsGuest().finally(() => setDismissed(true));
      return;
    }
    const ms = step === 0 ? SPLASH_MS : INTRO_MS;
    const t = setTimeout(() => setStep((s) => s + 1), ms);
    return () => clearTimeout(t);
  }, [sequenceStarted, step]);

  // 공유 경로는 인증 확인이 끝나기 전에도 스플래시를 깜빡이지 않는다 — 그 한 순간이
  // 링크를 받은 사람에게는 "잘못 열렸나" 싶은 화면이 된다
  if (isOpenPath || (ready && !active)) return null;

  // 탭하면 기다리지 않고 다음으로 (자동 전환이 답답한 사용자용)
  const skipAhead = () => setStep((s) => s + 1);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-surface"
      role="dialog"
      aria-modal="true"
      aria-label="리베아 시작하기"
    >
      <div className="mx-auto h-full w-full max-w-app overflow-hidden">
        <div
          className="flex h-full w-[200%] transition-transform duration-[520ms] ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${(step * 100) / 2}%)` }}
        >
          {/* 1 — 스플래시: 흰 화면에 로고만 */}
          <section
            onClick={skipAhead}
            className="flex h-full w-1/2 flex-col items-center justify-center"
          >
            <p className="text-[44px] font-bold tracking-[0.06em] text-rose">RIVEA</p>
          </section>

          {/* 2 — 매거진 커머스 */}
          <section
            onClick={skipAhead}
            className="flex h-full w-1/2 flex-col justify-center px-8"
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
            <p className="mt-8 text-[16px] text-disabled">화면을 누르면 바로 시작해요</p>
          </section>

        </div>
      </div>

      {/* 진행 표시 — 3점 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[18px] flex justify-center gap-[6px]">
        {[0, 1].map((i) => (
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
