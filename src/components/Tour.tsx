"use client";

import { useCallback, useEffect, useState } from "react";
import { track } from "@/lib/events";

/**
 * 첫 방문 안내 — 홈의 세 자리를 **하나씩** 비추고 무엇을 하는 앱인지 말한다.
 *
 * ## 왜 만들었나
 *
 * `docs/12` §6-1이 대면에서 **가장 아픈 지적**으로 기록한 문장이다.
 *
 * > "광고를 보고 온 상황이면 모르겠으나, **홈화면에 딱 40·50대를 위한 앱이라는 게 잘 모르겠다.**"
 *
 * ⚠️ **이건 그 지적의 답이 아니라 우회다.** 설명이 필요한 화면은 여전히 설명이 필요한
 * 화면이고, 진짜 답은 홈이 첫 화면만으로 읽히게 만드는 것이다. 이건 그때까지의 다리다.
 *
 * ## 모양에 대한 결정 세 가지
 *
 * ① **하나씩 넘긴다.** 세 곳을 한 번에 펼쳐도 봤는데, 40대+ 대상에 화살표 셋과 문장 셋이
 *    동시에 뜨면 어디부터 읽을지가 안 정해진다. 한 번에 하나만 밝히면 시선이 갈 곳이 하나다.
 *
 * ② **화살표는 실선이고, 곡선이 아니라 한 번 꺾이는 직선이다.** 점선·곡선은 손으로 그린
 *    메모처럼 보인다. 이 앱의 디자인은 각진 기조(`docs/03`)라 곡선이 혼자 튄다.
 *    가로로 간 다음 세로로 꺾어 대상에 꽂는다 — 꺾임은 **한 번뿐**이다.
 *
 * ③ **색을 쓰지 않는다.** 흰 선과 흰 글자만. 유채색은 rose 하나라는 규칙(`docs/03`)을
 *    안내가 깨면 안 된다.
 *
 * ## 스크롤하지 않는다
 *
 * 세 자리를 **스크롤 없이 보이는 것 중에서만** 골랐다. 안내 중에 화면이 움직이면
 * 무엇을 가리키는지 놓친다.
 *
 * ## 계측이 이 컴포넌트의 절반이다
 *
 * `docs/19`의 판정 기준 1번이 「친구한테 한 문장으로 설명」으로 포지셔닝 전달을 재는데,
 * **안내가 그 문장을 먼저 가르쳐버리면 측정이 무너진다.** 본 사람과 건너뛴 사람을
 * 나눠 찍어서 회수 후 응답을 그 축으로 갈라 읽는다.
 */

/** 버전을 키에 박아둔다 — 내용이 바뀌면 다시 보여줘야 한다 */
const SEEN_KEY = "rivea-tour-v3";

/** 구멍이 대상 주위에 남기는 여백(px) */
const PAD = 6;
/** 대상과 라벨 사이. 꺾인 화살표가 이 사이를 지난다 */
const GAP = 48;
/** 라벨 한 줄 높이 */
const LINE_H = 25;
/** 「다음」 버튼 높이 + 위 여백 */
const BTN_BLOCK = 52;

type Spot = {
  /** 대상의 `data-tour` 값 */
  anchor: string;
  /** 대상이 세로로 길 때 위에서 이만큼만 뚫는다 (섹션 전체를 뚫으면 화면이 다 밝아진다) */
  maxH?: number;
  label: string;
  /** 라벨을 대상의 위/아래 중 어디에 둘 것인가 */
  side: "below" | "above";
  /** 라벨 왼쪽 위치 (0~1, 화면 폭 기준) */
  x: number;
};

const SPOTS: Spot[] = [
  {
    anchor: "concern",
    label: "제품 이름 말고\n고민으로 찾습니다",
    side: "below",
    x: 0.06,
  },
  {
    anchor: "pick",
    maxH: 44,
    label: "고민에 맞는 순서까지\n짜여 있어요",
    side: "below",
    x: 0.07,
  },
  {
    anchor: "tab-pick",
    label: "고른 고민은\n여기 남아요",
    side: "above",
    x: 0.3,
  },
];

/** 저장소 접근은 던질 수 있다 (사파리 프라이빗·인앱 브라우저) — 막히면 조용히 넘어간다 */
function seen(): boolean {
  try {
    return !!window.localStorage.getItem(SEEN_KEY);
  } catch {
    return true; // 못 읽으면 안 띄운다. 매번 뜨는 것보다 안 뜨는 게 낫다
  }
}
function markSeen(how: "done" | "skip") {
  try {
    window.localStorage.setItem(SEEN_KEY, how);
  } catch {
    /* 저장 못 해도 이번 세션은 끝난 상태로 둔다 */
  }
}

type Hole = { top: number; left: number; width: number; height: number };

export default function Tour() {
  const [i, setI] = useState<number | null>(null);
  const [hole, setHole] = useState<Hole | null>(null);
  const [vw, setVw] = useState(0);
  const [vh, setVh] = useState(0);

  const measure = useCallback((step: number) => {
    setVw(window.innerWidth);
    setVh(window.innerHeight);
    const s = SPOTS[step];
    const el = document.querySelector<HTMLElement>(`[data-tour="${s.anchor}"]`);
    if (!el) return setHole(null);
    const r = el.getBoundingClientRect();
    setHole({
      top: r.top,
      left: r.left,
      width: r.width,
      height: Math.min(r.height, s.maxH ?? r.height),
    });
  }, []);

  // 첫 방문에만. 화면이 다 그려진 뒤에 열어야 좌표가 맞다.
  useEffect(() => {
    if (seen()) return;
    const t = window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" }); // 첫 화면을 설명하므로 맨 위에서 연다
      measure(0);
      setI(0);
      track("tutorial_start");
    }, 900);
    return () => window.clearTimeout(t);
  }, [measure]);

  useEffect(() => {
    if (i === null) return;
    measure(i);
  }, [i, measure]);

  // 회전·주소창 접힘으로 좌표가 밀린다
  useEffect(() => {
    if (i === null) return;
    const on = () => measure(i);
    window.addEventListener("resize", on);
    window.addEventListener("orientationchange", on);
    return () => {
      window.removeEventListener("resize", on);
      window.removeEventListener("orientationchange", on);
    };
  }, [i, measure]);

  const close = (how: "done" | "skip") => {
    markSeen(how);
    track(how === "done" ? "tutorial_done" : "tutorial_skip");
    setI(null);
  };

  if (i === null) return null;

  const spot = SPOTS[i];
  const last = i === SPOTS.length - 1;
  const lines = spot.label.split("\n").length;
  const labelH = lines * LINE_H + BTN_BLOCK;
  const labelLeft = vw * spot.x;
  const labelTop = hole
    ? spot.side === "below"
      ? hole.top + hole.height + GAP
      : hole.top - GAP - labelH
    : Math.max(24, vh / 2 - labelH / 2);

  /**
   * 꺾인 실선 화살표 — 라벨에서 가로로 갔다가 세로로 꺾어 대상에 꽂는다.
   * 꺾임은 한 번뿐이다.
   */
  let arrow: { path: string; head: string } | null = null;
  if (hole) {
    // 좁은 대상(탭 하나)은 한가운데를, 넓은 섹션은 왼쪽 1/4 지점을 가리킨다
    const tx =
      hole.width < 200 ? hole.left + hole.width / 2 : hole.left + hole.width * 0.25;
    const startX = labelLeft + 10;
    if (spot.side === "below") {
      const y = labelTop - 12; // 라벨 바로 위에서 가로로 달린다
      const endY = hole.top + hole.height + PAD + 3;
      arrow = {
        path: `M ${startX} ${y} L ${tx} ${y} L ${tx} ${endY}`,
        head: `M ${tx - 6} ${endY + 9} L ${tx} ${endY} L ${tx + 6} ${endY + 9}`,
      };
    } else {
      // 라벨 묶음(글자 + 버튼) **아래**에서 출발한다.
      // 글자와 버튼 사이에서 출발시켰더니 가로 선이 버튼을 관통했다.
      const y = labelTop + labelH + 8;
      const endY = hole.top - PAD - 3;
      arrow = {
        path: `M ${startX} ${y} L ${tx} ${y} L ${tx} ${endY}`,
        head: `M ${tx - 6} ${endY - 9} L ${tx} ${endY} L ${tx + 6} ${endY - 9}`,
      };
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 animate-fade-in overscroll-contain"
      style={{ touchAction: "none" }}
      role="dialog"
      aria-modal="true"
      aria-label="리베아 첫 화면 안내"
    >
      {/* 딤 + 구멍 + 화살표를 SVG 한 장으로. mask로 뚫는다 */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <mask id="tour-hole">
            <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
            {hole && (
              <rect
                x={hole.left - PAD}
                y={hole.top - PAD}
                width={hole.width + PAD * 2}
                height={hole.height + PAD * 2}
                rx="4"
                fill="#000"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(28,24,21,0.82)"
          mask="url(#tour-hole)"
        />
        {arrow && (
          <g>
            <path d={arrow.path} stroke="#FFFFFF" strokeWidth="2" fill="none" />
            <path
              d={arrow.head}
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>

      {/* 라벨 — SVG 밖에 둔다. 한글 줄바꿈·자간은 브라우저 텍스트 엔진에 맡기는 게 안전하다 */}
      <div className="absolute" style={{ top: labelTop, left: labelLeft }}>
        <p
          className="whitespace-pre-line text-[17px] font-medium leading-[25px] text-white"
          style={{
            /* 라벨이 밝은 구멍 위로 걸칠 수 있다. 그림자가 없으면 흰 글씨가 사라진다 */
            textShadow: "0 1px 3px rgba(28,24,21,0.9), 0 0 12px rgba(28,24,21,0.7)",
          }}
        >
          {spot.label}
        </p>
        <button
          onClick={() => (last ? close("done") : setI(i + 1))}
          className="press mt-[10px] flex h-[42px] items-center rounded bg-surface px-5 text-[16px] font-medium text-ink"
        >
          {last ? "알겠어요" : `다음 (${i + 1}/${SPOTS.length})`}
        </button>
      </div>

      {/*
        닫기는 우상단이다. 처음엔 화면 아래 가운데 큰 버튼으로 뒀는데,
        하단 탭을 가리키는 라벨과 자리가 겹쳐 그 라벨이 통째로 가렸다.
        아이콘 하나(✕)만 두지 않고 「건너뛰기」를 쓴다 — `TabBar` 주석과 같은 이유로
        40대+ 대상에 아이콘 단독은 판별이 어렵다.
      */}
      <button
        onClick={() => close("skip")}
        className="press absolute right-3 top-3 flex h-11 items-center gap-[6px] rounded bg-surface px-4 text-[16px] font-medium text-ink"
      >
        건너뛰기
        <span aria-hidden className="text-[17px] leading-none">
          ✕
        </span>
      </button>
    </div>
  );
}
