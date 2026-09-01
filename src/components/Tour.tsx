"use client";

import { useCallback, useEffect, useState } from "react";
import { track } from "@/lib/events";

/**
 * 첫 방문 안내 — **첫 화면을 한 번에 설명한다.**
 *
 * ## 왜 만들었나
 *
 * `docs/12` §6-1이 대면 인터뷰의 **가장 아픈 지적**으로 기록한 문장이다.
 *
 * > "광고를 보고 온 상황이면 모르겠으나, **홈화면에 딱 40·50대를 위한 앱이라는 게 잘 모르겠다.**"
 *
 * ⚠️ **이건 그 지적의 답이 아니라 우회다.** 설명이 필요한 화면은 여전히 설명이 필요한
 * 화면이고, 진짜 답은 홈이 첫 화면만으로 읽히게 만드는 것이다. 이건 그때까지의 다리다.
 * 안내를 넣었다고 §6-1이 닫혔다고 적으면 안 된다.
 *
 * ## 왜 단계별로 넘기지 않는가
 *
 * 처음엔 3단계 코치마크(다음 → 다음 → 알겠어요)로 만들었다가 버렸다.
 * **단계를 넘기게 하면 화면 사이의 관계가 안 보인다.** 「고민을 고른다」와 「순서가 나온다」와
 * 「여기 남는다」는 따로 있는 사실이 아니라 **한 줄기**인데, 한 번에 하나씩 비추면
 * 그 줄기가 안 그려진다. 게다가 40대+ 대상이라 「다음」을 세 번 누르는 동안 첫 장을 잊는다.
 *
 * 그래서 **첫 화면을 그대로 어둡게 덮고, 가리킬 곳 세 군데를 동시에 뚫는다.**
 * 점선 화살표가 라벨과 대상을 잇는다. 눈이 한 번에 전체 구조를 받는다.
 *
 * ## 스크롤하지 않는다
 *
 * 세 자리를 **스크롤 없이 보이는 것 중에서만** 골랐다. 안내 중에 화면이 움직이면
 * 무엇을 가리키는지 놓친다. 그래서 대상은 고민 레일 · Pick 섹션 머리 · 하단 Pick 탭이다.
 *
 * ## 계측이 이 컴포넌트의 절반이다
 *
 * `docs/19`의 판정 기준 1번이 「친구한테 한 문장으로 설명」으로 포지셔닝 전달을 재는데,
 * **안내가 그 문장을 먼저 가르쳐버리면 측정이 무너진다.** 본 사람과 건너뛴 사람을
 * 나눠 찍어서 회수 후 응답을 그 축으로 갈라 읽는다.
 */

/** 버전을 키에 박아둔다 — 내용이 바뀌면 다시 보여줘야 한다 */
const SEEN_KEY = "rivea-tour-v2";

/** 구멍이 대상 주위에 남기는 여백(px) */
const PAD = 6;

type Spot = {
  /** 대상의 `data-tour` 값 */
  anchor: string;
  /** 대상이 세로로 길 때 위에서 이만큼만 뚫는다 (섹션 전체를 뚫으면 화면이 다 밝아진다) */
  maxH?: number;
  label: string;
  /** 라벨을 대상의 위/아래 중 어디에 둘 것인가 */
  side: "below" | "above";
  /** 라벨을 대상 왼쪽 끝에서 얼마나 들여쓸지 (0~1, 화면 폭 기준) */
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
    x: 0.08,
  },
  {
    anchor: "tab-pick",
    label: "고른 고민은\n여기 남아요",
    side: "above",
    x: 0.42,
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
type Placed = Spot & { hole: Hole; labelTop: number; labelLeft: number };

/** 라벨 한 줄 높이 · 두 줄이 기본이다 */
const LINE_H = 25;
const GAP = 34; // 대상과 라벨 사이 화살표가 지나갈 거리

export default function Tour() {
  const [open, setOpen] = useState(false);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [vw, setVw] = useState(0);

  const measure = useCallback(() => {
    const w = window.innerWidth;
    setVw(w);
    const out: Placed[] = [];
    for (const s of SPOTS) {
      const el = document.querySelector<HTMLElement>(`[data-tour="${s.anchor}"]`);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      // 화면 밖이면 가리킬 수 없다 — 조용히 건너뛴다
      if (r.bottom < 0 || r.top > window.innerHeight) continue;
      const height = Math.min(r.height, s.maxH ?? r.height);
      const hole = { top: r.top, left: r.left, width: r.width, height };
      const lines = s.label.split("\n").length;
      const labelTop =
        s.side === "below" ? hole.top + hole.height + GAP : hole.top - GAP - lines * LINE_H;
      out.push({ ...s, hole, labelTop, labelLeft: w * s.x });
    }
    setPlaced(out);
  }, []);

  // 첫 방문에만. 화면이 다 그려진 뒤에 열어야 좌표가 맞다.
  useEffect(() => {
    if (seen()) return;
    const t = window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" }); // 첫 화면을 설명하므로 맨 위에서 연다
      measure();
      setOpen(true);
      track("tutorial_start");
    }, 900);
    return () => window.clearTimeout(t);
  }, [measure]);

  // 회전·주소창 접힘으로 좌표가 밀린다
  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [open, measure]);

  const close = (how: "done" | "skip") => {
    markSeen(how);
    track(how === "done" ? "tutorial_done" : "tutorial_skip");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 animate-fade-in overscroll-contain"
      style={{ touchAction: "none" }}
      role="dialog"
      aria-modal="true"
      aria-label="리베아 첫 화면 안내"
      onClick={() => close("done")}
    >
      {/*
        딤 + 구멍들 + 점선 화살표를 SVG 한 장으로 그린다.
        구멍이 여러 개라 box-shadow 트릭(구멍 1개)을 못 쓴다 — mask로 뚫는다.
      */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <mask id="tour-holes">
            <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
            {placed.map((p) => (
              <rect
                key={p.anchor}
                x={p.hole.left - PAD}
                y={p.hole.top - PAD}
                width={p.hole.width + PAD * 2}
                height={p.hole.height + PAD * 2}
                rx="4"
                fill="#000"
              />
            ))}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(28,24,21,0.8)"
          mask="url(#tour-holes)"
        />

        {placed.map((p) => {
          // 라벨 왼쪽 위에서 출발해 대상 가장자리로 휘어 들어가는 점선
          const from = { x: p.labelLeft + 10, y: p.labelTop + (p.side === "below" ? -8 : LINE_H * p.label.split("\n").length + 8) };
          const to = {
            x: Math.min(Math.max(p.hole.left + p.hole.width * 0.3, 24), vw - 24),
            y: p.side === "below" ? p.hole.top + p.hole.height + PAD + 4 : p.hole.top - PAD - 4,
          };
          const midY = (from.y + to.y) / 2;
          const d = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
          return (
            <g key={`a-${p.anchor}`}>
              <path d={d} stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
              {/* 화살촉 — 대상 쪽을 향한다 */}
              <path
                d={
                  p.side === "below"
                    ? `M ${to.x - 5} ${to.y + 7} L ${to.x} ${to.y} L ${to.x + 5} ${to.y + 7}`
                    : `M ${to.x - 5} ${to.y - 7} L ${to.x} ${to.y} L ${to.x + 5} ${to.y - 7}`
                }
                stroke="#FFFFFF"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </svg>

      {/* 라벨 — SVG 밖에 둔다. 한글 줄바꿈·자간을 브라우저 텍스트 엔진에 맡기는 게 안전하다 */}
      {placed.map((p) => (
        <p
          key={`l-${p.anchor}`}
          className="absolute whitespace-pre-line text-[17px] font-medium leading-[25px] text-white"
          style={{
            top: p.labelTop,
            left: p.labelLeft,
            /* 구멍(밝은 대상) 위로 라벨이 걸칠 수 있다. 그림자가 없으면 흰 글씨가 사라진다 */
            textShadow: "0 1px 3px rgba(28,24,21,0.9), 0 0 12px rgba(28,24,21,0.7)",
          }}
        >
          {p.label}
        </p>
      ))}

      {/*
        닫기는 **우상단**이다. 처음엔 화면 아래 가운데에 큰 버튼으로 뒀는데,
        하단 탭을 가리키는 라벨과 자리가 겹쳐서 그 라벨이 통째로 가렸다.
        위로 올리면 세 라벨 어느 것과도 안 부딪힌다.

        아이콘 하나(✕)만 두지 않고 「닫기」를 같이 쓴다 — 40대+ 대상이고,
        `TabBar` 주석과 같은 이유다. 아이콘만으로는 무엇인지 판별이 어렵다.
      */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          close("done");
        }}
        className="press absolute right-3 top-3 flex h-11 items-center gap-[6px] rounded bg-surface px-4 text-[16px] font-medium text-ink"
      >
        닫기
        <span aria-hidden className="text-[17px] leading-none">
          ✕
        </span>
      </button>
    </div>
  );
}
