import type { Metadata } from "next";
import Link from "next/link";
import ComboCounter from "./ComboCounter";
import LeadForm from "./LeadForm";

/**
 * `/lp` — 인스타그램·오프라인 카드에서 들어오는 랜딩.
 *
 * 앱 홈(`/`)으로 바로 보내면 안 된다. 첫 진입에 온보딩(스플래시→로그인)이 뜨고,
 * 하단에 "발표용 데모이고 실제 판매는 이뤄지지 않아요" 고지가 있다.
 * 그래서 도달이 전부 증발하고 **누가 왔었는지도 남지 않는다.**
 *
 * 카피 구조는 M–R–C다 (cardnews/카피공식.md):
 *   Myth    겹쳐 바르면 더 좋은 거 아니에요?
 *   Reality 겹치면 자극이 커지는 조합이 있고, 함량은 합산된다
 *   Action  쓰시는 것 3개를 적어주세요
 *
 * ⚠️ 화장품법 13조·별표5-2. "기미가 없어집니다" 같은 효능·효과 표현을 쓰지 않는다.
 *    성분은 **"무엇에 좋다"가 아니라 "어디서 작용한다 / 겹칠 수 있다"**로만 적는다.
 *    문장은 전부 `src/lib/rules.ts`의 규칙에서 가져온다. 새로 지어내지 않는다.
 */

export const metadata: Metadata = {
  title: "쓰시는 것 적어주시면 진단서를 보내드립니다",
  description:
    "지금 쓰고 계신 화장품만 적어주세요. 겹치는 것과 채우면 좋은 것, 아침·저녁 순서를 진단서로 보내드립니다. 무료. 리베아.",
  openGraph: {
    title: "쓰시는 것 적어주시면 진단서를 보내드립니다 · 리베아",
    description:
      "레티놀과 각질 제품은 같은 날 저녁에 겹치면 자극이 커집니다. 쓰시는 것만 알려주세요.",
  },
};

/** rules.ts에서 그대로 가져온 판정 근거. 표시용으로 문장만 다듬었다 */
const RULES = [
  {
    tag: "겹침",
    head: "레티놀과 각질 제품은 같은 날 저녁을 피합니다",
    body: "레티놀과 AHA·BHA를 같은 날 저녁에 함께 쓰면 자극이 커집니다. 하루씩 번갈아 두는 편이 낫습니다.",
  },
  {
    tag: "함량",
    head: "나이아신아마이드는 제품 두 개에 있으면 합산됩니다",
    body: "세럼과 크림에 함께 들어 있는 경우가 많습니다. 각각은 적정 함량이어도 같이 쓰면 합쳐집니다.",
  },
  {
    tag: "순서",
    head: "LED는 바르기 전, 갈바닉은 바른 후입니다",
    body: "빛은 통과해야 하고, 미세전류는 밀어 넣을 성분이 있어야 합니다. 두 기기의 자리가 정반대인데 어느 설명서에도 나란히 적혀 있지 않습니다.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-dvh bg-page pb-16">
      {/* 상단 바 — 풀블리드, 아래 1px로만 구분 */}
      <header className="flex h-14 items-center justify-between border-b border-line pl-5 pr-5">
        {/* -ml-2 px-2: 시각적 위치는 그대로 두고 탭 영역만 44px로 넓힌다 */}
        <Link
          href="/"
          className="press -ml-2 flex h-11 items-center px-2 text-[21px] font-bold tracking-[-0.02em] text-rose"
        >
          RIVEA
        </Link>
        <span className="text-[15px] text-meta">40대 이후의 홈케어</span>
      </header>

      {/* 히어로는 짧게. 인스타 카드뉴스가 이미 설명(M-R-C)을 했으므로 랜딩이 또 설명하면
          중복 마찰이다. 여기 역할은 설득이 아니라 **전환**이다.
          제안 한 줄 + 받는 것 한 줄 + 조건 한 줄이면 폼이 첫 화면 안에 들어온다. */}
      <section className="px-5 pb-7 pt-9">
        <h1 className="text-[28px] font-bold leading-[1.34] tracking-[-0.02em] text-ink">
          쓰시는 것만 적어주시면
          <br />
          진단서를 보내드립니다
        </h1>
        <p className="mt-4 text-[19px] leading-[1.7] text-body">
          겹치는 것 · 채우면 좋은 것 · 아침저녁 순서를 정리해서 보내드려요.
        </p>
        <p className="mt-3 text-[17px] leading-[1.6] text-meta">
          무료입니다 · 받기까지 2~3일 걸립니다
        </p>
      </section>

      {/* 폼이 곧 첫 화면. 스크롤 없이 입력이 시작된다 */}
      <LeadForm />

      {/* ── 아래는 망설이는 사람만 읽는 근거 ────────────────────────── */}

      {/* 왜 이걸 적어야 하는지. 첫 항목만 크게 세워 위계를 준다 */}
      <section className="border-t border-line px-5 pb-2 pt-9">
        <p className="text-[15px] font-medium tracking-[0.08em] text-meta">
          이런 것들을 봅니다
        </p>
        <ul className="mt-5">
          {RULES.map((r, i) => (
            <li key={r.tag} className="border-b border-hairline py-6 first:pt-0 last:border-b-0">
              <p className="text-[14px] font-medium tracking-[0.08em] text-meta">{r.tag}</p>
              <h3
                className={`mt-2 font-bold text-ink ${
                  i === 0
                    ? "text-[23px] leading-[1.4] tracking-[-0.01em]"
                    : "text-[20px] leading-[1.45]"
                }`}
              >
                {r.head}
              </h3>
              <p className="mt-2 text-[18px] leading-[1.7] text-body">{r.body}</p>
            </li>
          ))}
        </ul>
        <p className="pb-1 pt-6 text-[18px] leading-[1.7] text-meta">
          이런 규칙이 <b className="font-medium text-body">13가지</b> 있습니다. 제품이 늘수록
          겹칠 자리도 늘어납니다.
        </p>
      </section>

      {/* 조합 수 — 여기서는 훅이 아니라 "왜 혼자 확인하기 어려운가"의 근거로 쓴다 */}
      <ComboCounter />

      {/* 진단서에 정확히 뭐가 들어가는지. ②「채우면 좋은 것」이 있어야
          진단으로 끝나지 않고 커머스의 입구가 된다 */}
      <section className="border-b border-line bg-bg-tint px-5 py-9">
        <h2 className="text-[22px] font-bold leading-[1.4] tracking-[-0.01em] text-ink">
          진단서에 들어가는 것
        </h2>
        <ol className="mt-5 flex flex-col gap-5">
          {[
            ["01", "지금 쓰시는 것", "성분이 겹치는 곳, 같이 쓰면 자극이 커지는 조합"],
            ["02", "채우면 좋은 것", "고민에 비해 지금 비어 있는 자리 (예: 아침 자외선 차단)"],
            ["03", "아침·저녁 순서", "무엇을 언제 쓰는지, 기기가 있다면 어디에 들어가는지"],
          ].map(([n, k, v]) => (
            <li key={n} className="flex gap-4">
              <span className="w-[22px] shrink-0 pt-[3px] text-[15px] font-bold tabular-nums text-meta">
                {n}
              </span>
              <div>
                <p className="text-[18px] font-bold leading-[1.5] text-ink">{k}</p>
                <p className="mt-1 text-[18px] leading-[1.65] text-body">{v}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-7 border-t border-line pt-5 text-[17px] leading-[1.7] text-meta">
          리베아는 여러 브랜드를 함께 다룹니다. 특정 브랜드를 밀 이유가 없어서
          <b className="font-medium text-body"> &ldquo;그건 빼셔도 됩니다&rdquo;</b>라고 말할 수 있습니다.
        </p>
      </section>

      <footer className="border-t border-line px-5 pt-8 text-[15px] leading-[1.8] text-meta">
        <p>
          개인차가 있으며, 제품의 효능·효과를 보증하지 않습니다. 피부 이상이 있으시면
          전문의와 상담하세요.
        </p>
        <p className="mt-1 flex items-center">
          <Link
            href="/"
            className="press -ml-2 flex h-11 items-center px-2 underline underline-offset-2"
          >
            리베아 둘러보기
          </Link>
          {/* 구분자는 장식이다. line-strong은 흰 배경에서 1.66:1이라 AA에 걸리고,
              스크린리더가 "가운뎃점"을 읽는 것도 의미가 없다 */}
          <span aria-hidden className="px-1 text-meta">
            ·
          </span>
          준비 중인 서비스입니다
        </p>
      </footer>
    </main>
  );
}
