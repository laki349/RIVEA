"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  discountRate,
  heroImages,
  products,
  routineImage,
  routineListPrice,
  routines,
  won,
} from "@/data/catalog";
import Icon from "./Icon";
import ImageSlot from "./ImageSlot";

/**
 * 히어로 배너 캐러셀.
 *
 * 고친 것 세 가지.
 *  ① 예전 히어로는 `3 / 12` 배지를 박아뒀는데 **배너는 하나였다.** 없는 걸 있다고 셌다.
 *  ② 화면에서 가장 큰 탭 타깃(280px 풀블리드)인데 **링크가 아니었다.** 눌러도 아무 일이 없었다.
 *  ③ 자동 전환이 없었다.
 *
 * 슬라이드 문구의 숫자는 전부 카탈로그에서 계산한다. "최대 30% 쿠폰" 같은
 * 지어낸 프로모션을 쓰지 않는 이유는, 이 앱의 다른 숫자(적립·절감·재고)가
 * 전부 실제 값이라서다. 한 자리에서 지어내면 나머지도 같이 의심받는다.
 *
 * 넘기는 건 CSS scroll-snap이 한다(JS 드래그 아님). 네이티브 관성 스크롤이 그대로
 * 살아 있고, 자동 전환은 그 위에 `scrollTo`를 얹은 것뿐이라 서로 싸우지 않는다.
 */

const AUTO_MS = 5000; // 40대+ 기준으로 한 장을 읽을 시간. 지그재그류는 3~4초
const RESUME_MS = 8000; // 손을 댄 뒤 다시 자동으로 돌아가기까지

type Slide = {
  image: string | undefined;
  href: string;
  title: string;
  sub: string;
  /** 인물 사진은 얼굴이 잘리지 않게 초점을 올린다 */
  position?: string;
};

function buildSlides(): Slide[] {
  const wrinkleCount = products.filter((p) => p.concerns.includes("wrinkle")).length;
  const bestSaving = routines.reduce((max, r) => {
    const rate = discountRate({ price: r.price, listPrice: routineListPrice(r) }) ?? 0;
    return Math.max(max, rate);
  }, 0);

  return [
    {
      image: heroImages[0],
      href: "/concern/wrinkle",
      title: "가을, 무너진 탄력을\n되돌리는 셀렉션",
      sub: `주름·탄력 상품 ${wrinkleCount}개`,
      position: "center 30%",
    },
    {
      image: heroImages[1],
      href: "/pick",
      title: "기기와 화장품을\n한 세트로",
      sub: `루틴 세트 ${routines.length}개 · 단품 합계보다 최대 ${bestSaving}% 절감`,
      position: "center 35%",
    },
    {
      image: routineImage("r1"),
      href: "/shelf",
      title: "쓰던 것과 겹치는지\n봐드려요",
      sub: "다른 곳에서 산 제품도 같이 검사해요",
      position: "center 50%",
    },
  ];
}

export default function HeroCarousel() {
  const slides = buildSlides();
  const railRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  /** 손으로 넘긴 직후 — 자동 전환이 사용자를 밀어내지 않도록 잠깐 쉰다 */
  const touchedUntil = useRef(0);
  /** 스크롤이 멈췄는지 판단하는 디바운스 */
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * 마지막 장 뒤에 **첫 장의 복제본**을 하나 더 둔다.
   *
   * 예전엔 3장에서 1장으로 갈 때 왼쪽으로 되감겼다 — 오른쪽으로 계속 흐르다가
   * 갑자기 왔던 길을 거슬러 가니 흐름이 끊겼다. 복제본이 있으면 3→복제본으로
   * **계속 오른쪽으로** 넘어가고, 멈춘 뒤에 소리 없이 0으로 되돌린다.
   * 복제본은 첫 장과 똑같이 생겨서 그 순간이 눈에 보이지 않는다.
   */
  const loop = [...slides, slides[0]];

  const go = useCallback((to: number, smooth = true) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollTo({
      left: rail.clientWidth * to,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  // 스크롤 위치에서 현재 장을 읽는다 (손으로 넘겨도 배지가 맞는다)
  const onScroll = () => {
    const rail = railRef.current;
    if (!rail || rail.clientWidth === 0) return;
    const raw = Math.round(rail.scrollLeft / rail.clientWidth);
    setIndex(raw % slides.length); // 복제본은 1장으로 센다

    // 복제본 위에 멈췄으면 애니메이션 없이 진짜 첫 장으로 옮긴다
    if (settle.current) clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      if (raw === slides.length) go(0, false);
    }, 140);
  };

  useEffect(() => {
    /**
     * 자동 전환을 멈춰야 하는 경우가 셋이다.
     *  - 모션 최소화 설정: 아예 돌리지 않는다
     *  - 탭이 백그라운드: 돌아왔을 때 엉뚱한 장에 가 있으면 혼란스럽다
     *  - 사용자가 방금 손을 댐: 읽는 중인 배너를 뺏지 않는다
     */
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused) return;

    const timer = setInterval(() => {
      if (document.hidden || Date.now() < touchedUntil.current) return;
      const rail = railRef.current;
      if (!rail) return;
      const current = Math.round(rail.scrollLeft / rail.clientWidth);
      // 항상 오른쪽으로. 복제본(마지막 칸)까지 간 뒤에는 onScroll이 조용히 되돌린다
      go(current >= slides.length ? 0 : current + 1);
    }, AUTO_MS);

    return () => clearInterval(timer);
  }, [go, paused, slides.length]);

  const hold = () => {
    touchedUntil.current = Date.now() + RESUME_MS;
  };

  return (
    <section className="relative border-b border-hairline" aria-label="추천 배너">
      <div
        ref={railRef}
        onScroll={onScroll}
        onPointerDown={hold}
        onTouchStart={hold}
        className="rail flex snap-x snap-mandatory"
      >
        {loop.map((s, i) => (
          <Link
            key={i}
            href={s.href}
            className="relative w-full flex-shrink-0 snap-center"
            aria-label={`${s.title.replace("\n", " ")} — ${s.sub}`}
            /* 복제본(마지막 칸)은 스크린리더·탭 이동에서 항상 제외한다 */
            aria-hidden={i !== index || i === slides.length}
            tabIndex={i === index && i !== slides.length ? undefined : -1}
          >
            <ImageSlot
              className="h-[280px] w-full"
              tone="warm"
              src={s.image}
              alt=""
              position={s.position ?? "center"}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(28,24,21,0.74)] to-transparent px-4 pb-4 pt-10">
              <p className="whitespace-pre-line text-[22px] font-bold leading-[1.3] text-white">
                {s.title}
              </p>
              <p className="mt-[6px] text-[14px] text-[#EDE7DF]">{s.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/*
        배지가 곧 일시정지 버튼이다.
        자동으로 움직이는 콘텐츠는 멈출 수단이 있어야 한다(WCAG 2.2.2).
        별도 컨트롤을 얹는 대신 이미 있던 자리를 쓰면 화면이 늘지 않는다.
        40대+ 대상에서는 "천천히 읽고 싶다"는 실제 요구이기도 하다.
      */}
      <button
        onClick={() => setPaused((v) => !v)}
        aria-label={paused ? "배너 자동 넘김 켜기" : "배너 자동 넘김 멈추기"}
        /*
          보이는 막대는 작지만 **누르는 영역은 44px**로 남긴다.
          투명한 여백이 타깃을 채우므로 위계는 낮아지고 손가락은 그대로 닿는다.
        */
        className="press absolute right-1 top-0 flex h-11 items-center px-2"
      >
        <span className="flex h-[20px] items-center gap-[3px] rounded bg-[rgba(28,24,21,0.42)] px-[6px] text-[12px] font-medium text-white/90">
          <Icon name={paused ? "play" : "pause"} size={10} />
          {index + 1} / {slides.length}
        </span>
      </button>
    </section>
  );
}
