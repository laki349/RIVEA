/**
 * RIVEA 인터뷰 기록지 v2 — 진행자용 docx 생성기
 *
 *   node docs/build-interview-docx-v2.js ["출력경로.docx"]
 *
 * 내용 원본: docs/09-interview-script.md (v2)
 * v1 생성기(build-interview-docx.js)와 별개 파일이다. v1은 그대로 둔다.
 *
 * 구성 — 4장
 *   1장 A세트 기록지   8부 인쇄 (한 사람당 한 부)
 *   2장 B세트 기록지   3~4부
 *   3장 관찰 기록지    2~3부
 *   4장 진행 안내      1부 (진행자만 본다)
 */

const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  LevelFormat, PageBreak,
} = require("docx");
const fs = require("fs");

const FONT = "Malgun Gothic";

// A4 (twip) — 좌우 여백 1080
const PAGE = { w: 11906, h: 16838, m: 1080 };
const PAGE_W = PAGE.w - PAGE.m * 2;   // 9746

// 비율로 열 너비를 잡는다 (합이 1이면 본문 폭에 꽉 찬다)
const cols = (...ratios) => {
  const raw = ratios.map((r) => Math.round(PAGE_W * r));
  raw[raw.length - 1] += PAGE_W - raw.reduce((a, b) => a + b, 0);
  return raw;
};

const INK = "1F2933";
const MUTED = "6B7280";
const RED = "A03030";

const t = (text, opts = {}) => new TextRun({ text, font: FONT, ...opts });

// ── 문단 요소 ────────────────────────────────────────
const SectionBar = (num, title, mins, fill = INK) =>
  new Paragraph({
    spacing: { before: 240, after: 90 },
    shading: { type: ShadingType.CLEAR, fill, color: "auto" },
    keepNext: true,
    children: [
      t(`  ${num}. ${title}`, { bold: true, size: 23, color: "FFFFFF" }),
      t(`      ${mins}`, { size: 18, color: "C9D1D9" }),
    ],
  });

const Q = (text) =>
  new Paragraph({
    spacing: { before: 120, after: 45 },
    keepNext: true,
    children: [t("▸  ", { bold: true, size: 21 }), t(text, { bold: true, size: 21 })],
  });

const Sub = (text) =>
  new Paragraph({
    spacing: { before: 18, after: 18 },
    indent: { left: 320 },
    children: [t("– " + text, { size: 19, color: "444444" })],
  });

const Note = (text) =>
  new Paragraph({
    spacing: { before: 45, after: 45 },
    indent: { left: 320 },
    children: [t("※ " + text, { size: 18, italics: true, color: RED })],
  });

const Field = (text) =>
  new Paragraph({
    spacing: { before: 60, after: 60 },
    indent: { left: 320 },
    children: [t(text, { size: 19 })],
  });

const Say = (text) =>
  new Paragraph({
    spacing: { before: 80, after: 100 },
    indent: { left: 200, right: 200 },
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: "B8BEC6", space: 8 } },
    children: [t("“" + text + "”", { size: 20, italics: true })],
  });

const WriteLines = (n = 2, label) => {
  const out = [];
  if (label) out.push(new Paragraph({
    spacing: { before: 70, after: 25 }, indent: { left: 320 }, keepNext: true,
    children: [t(label, { size: 17, color: "777777" })],
  }));
  for (let i = 0; i < n; i++) out.push(new Paragraph({
    spacing: { before: 0, after: 150 }, indent: { left: 320 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB", space: 4 } },
    children: [t("", { size: 20 })],
  }));
  return out;
};

const callout = (text, fill = "FFF4E5", border = "E0A030") =>
  new Paragraph({
    spacing: { before: 100, after: 120 },
    shading: { type: ShadingType.CLEAR, fill, color: "auto" },
    border: {
      top: { style: BorderStyle.SINGLE, size: 4, color: border, space: 6 },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: border, space: 6 },
      left: { style: BorderStyle.SINGLE, size: 18, color: border, space: 6 },
      right: { style: BorderStyle.SINGLE, size: 4, color: border, space: 6 },
    },
    children: [t("  " + text + "  ", { size: 20 })],
  });

const H = (text) => new Paragraph({
  spacing: { before: 260, after: 90 },
  keepNext: true,
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: INK, space: 4 } },
  children: [t(text, { bold: true, size: 24 })],
});

const bullets = (arr, size = 19) => arr.map((s) => new Paragraph({
  numbering: { reference: "dots", level: 0 }, spacing: { after: 50 }, children: [t(s, { size })],
}));

const Title = (main, sub) => [
  new Paragraph({ spacing: { after: 25 }, children: [t(main, { bold: true, size: 31 })] }),
  new Paragraph({
    spacing: { after: 140 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: INK, space: 5 } },
    children: [t(sub, { size: 19, color: "555555" })],
  }),
];

// ── 표 ───────────────────────────────────────────────
/** text에 배열을 주면 줄마다 문단이 된다 (Word에서 \n은 줄바꿈이 안 된다) */
const cell = (text, { bold, w, fill, size, align, color } = {}) =>
  new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: fill ? { type: ShadingType.CLEAR, fill, color: "auto" } : undefined,
    margins: { top: 70, bottom: 70, left: 110, right: 110 },
    children: (Array.isArray(text) ? text : [text]).map((line) => new Paragraph({
      alignment: align, spacing: { after: 0 },
      children: [t(line, { bold, size: size ?? 18, color })],
    })),
  });

const table = (widths, rows) =>
  new Table({ columnWidths: widths, width: { size: PAGE_W, type: WidthType.DXA }, rows });

/** 라벨 + 기입칸 세로 표 */
const formTable = (rows, ratio = 0.26) => {
  const w = cols(ratio, 1 - ratio);
  return table(w, rows.map(([label, hint]) => new TableRow({
    children: [
      cell(label, { bold: true, w: w[0], fill: "F0F1F3", size: 18 }),
      cell(hint || "", { w: w[1], size: 18, color: hint ? "9AA0A6" : undefined }),
    ],
  })));
};

const headerTable = () => {
  const w = cols(0.11, 0.20, 0.10, 0.24, 0.10, 0.25);
  return table(w, [new TableRow({
    children: [
      cell("참가자", { bold: true, w: w[0], fill: "F0F1F3" }), cell("", { w: w[1] }),
      cell("연세", { bold: true, w: w[2], fill: "FFF4E5" }),
      cell("☐40초 ☐40후 ☐50초 ☐50후 ☐60+", { w: w[3], size: 17 }),
      cell("방식", { bold: true, w: w[4], fill: "F0F1F3" }),
      cell("☐ 대면  ☐ 전화", { w: w[5], size: 17 }),
    ],
  })]);
};

/** 화장대 — 사진을 못 받을 때만 손으로 */
const shelfTable = () => {
  const w = cols(0.12, 0.46, 0.42);
  const rows = [new TableRow({
    tableHeader: true,
    children: [cell("", { w: w[0], fill: "E8EAED" }),
               cell("브랜드 + 제품명", { bold: true, w: w[1], fill: "E8EAED" }),
               cell("메모", { bold: true, w: w[2], fill: "E8EAED" })],
  })];
  for (const [label, n] of [["아침", 3], ["저녁", 3], ["주1~2회", 1]]) {
    for (let i = 0; i < n; i++) rows.push(new TableRow({
      children: [cell(i === 0 ? label : "", { bold: i === 0, w: w[0], fill: i === 0 ? "F5F6F7" : undefined }),
                 cell("", { w: w[1] }), cell("", { w: w[2] })],
    }));
  }
  return table(w, rows);
};

/** 검색 기록 — 화면에 뜬 그대로 */
const searchTable = () => {
  const w = cols(0.08, 0.62, 0.30);
  const rows = [new TableRow({
    tableHeader: true,
    children: [cell("#", { bold: true, w: w[0], fill: "E8F0FF", align: AlignmentType.CENTER }),
               cell("검색어 — 화면에 뜬 글자 그대로 (띄어쓰기·오타 포함)", { bold: true, w: w[1], fill: "E8F0FF" }),
               cell("어디에 / 뭘 봤나", { bold: true, w: w[2], fill: "E8F0FF" })],
  })];
  for (let i = 1; i <= 6; i++) rows.push(new TableRow({
    children: [cell(String(i), { w: w[0], fill: "FAFBFC", align: AlignmentType.CENTER }),
               cell("", { w: w[1] }), cell("", { w: w[2] })],
  }));
  return table(w, rows);
};

/** 기기 — v2의 핵심 신설 */
const deviceTable = () => formTable([
  ["뭐예요? 브랜드", "메디큐브 / 프라엘 / LED마스크 / 갈바닉 / 고주파 / 기타 — 원문 그대로"],
  ["얼마 주고?", "실제 지불 금액. 「기억 안 남」도 적는다"],
  ["누가 샀나", "☐ 본인   ☐ 딸·자녀   ☐ 배우자   ☐ 선물받음(누구)"],
  ["어떻게 알고?", "홈쇼핑 / 유튜브 / 딸 / 매장 / 광고 / 친구"],
  ["언제 샀나", ""],
  ["지금도 쓰나", "☐ 매일   ☐ 가끔   ☐ 안 쓴다"],
  ["★ 안 쓰면, 왜", "이 칸이 이 문항의 핵심이다. 원문으로"],
  ["바르기 전/후", "☐ 바르기 전   ☐ 바른 다음   ☐ 그때그때   ☐ 생각해본 적 없다"],
  ["(없는 경우) 사려다 만 적", "뭐가 걸렸나"],
]);

/** 피부과 */
const clinicTable = () => formTable([
  ["가본 적", "☐ 있다   ☐ 없다"],
  ["뭘 받았나", "레이저토닝 / 피코 / 리쥬란 / 스킨부스터 / 리프팅 / 기타"],
  ["몇 번 / 총 얼마", ""],
  ["또 갈 건가", "☐ 또 간다   ☐ 모르겠다   ☐ 안 간다  → 왜?"],
  ["★ 시술 후 뭘 바르랬나", "「아무도 안 알려줬다」 / 「거기서 파는 걸 샀다」 — 어느 쪽인지가 전부 다르다"],
  ["그건 어디서 샀나", "병원 / 인터넷 / 매장"],
  ["(안 간 경우) 왜", "생각은 해봤나"],
]);

const queenitTable = () => {
  const w = cols(0.22, 0.33, 0.45);
  return table(w, [
    new TableRow({
      tableHeader: true,
      children: [cell("", { bold: true, w: w[0], fill: "E8EAED" }),
                 cell("인지", { bold: true, w: w[1], fill: "E8EAED" }),
                 cell("어떻게 아셨어요? (경로 원문)", { bold: true, w: w[2], fill: "E8EAED" })],
    }),
    new TableRow({ children: [cell("퀸잇", { bold: true, w: w[0], fill: "FFF4E5" }),
                              cell("☐ 모름 ☐ 들어봄 ☐ 깔아서 씀", { w: w[1] }), cell("", { w: w[2] })] }),
    new TableRow({ children: [cell("설치는 누가", { bold: true, w: w[0], fill: "F5F6F7" }),
                              cell("☐ 본인 ☐ 딸·자녀 ☐ 기타", { w: w[1] }), cell("", { w: w[2] })] }),
    new TableRow({ children: [cell("사봤나", { bold: true, w: w[0], fill: "F5F6F7" }),
                              cell("☐ 없음 ☐ 1~2번 ☐ 여러 번", { w: w[1] }), cell("", { w: w[2] })] }),
  ]);
};

/** 딸이 사준 것 — 가정법이 아니라 실제 사례 */
const daughterTable = () => {
  const w = cols(0.26, 0.14, 0.14, 0.16, 0.30);
  const head = ["뭘 사줬나 (품목)", "얼마", "언제", "지금도 쓰나", "어떻게 골랐대요"];
  const rows = [new TableRow({
    tableHeader: true,
    children: head.map((h, i) => cell(h, { bold: true, w: w[i], fill: "E8EAED", size: 17 })),
  })];
  for (let i = 0; i < 3; i++) rows.push(new TableRow({
    children: w.map((ww) => cell("", { w: ww })),
  }));
  return table(w, rows);
};

/** 지불의사 */
const priceTable = () => formTable([
  ["화장품 한 병 보통", "원  ← 열린 질문으로 먼저 받는다"],
  ["제일 비싸게 산 것", "원 (뭐였나)"],
  ["기기는 얼마까지", "원까지 산다 /       원 넘으면 안 산다"],
  ["★ 피부과 15만 vs 기기 30만", "☐ 피부과   ☐ 기기   ☐ 둘 다 안 함   → 왜?"],
], 0.30);

/** 성분어 인지 — 데이터랩 대체 */
const ingredientTable = () => {
  const w = cols(0.30, 0.46, 0.24);
  const items = ["레티놀", "히알루론산", "나이아신아마이드", "리포좀 비타민C", "(화해 앱)"];
  const rows = [new TableRow({
    tableHeader: true,
    children: [cell("성분·앱", { bold: true, w: w[0], fill: "E8EAED" }),
               cell("인지 수준", { bold: true, w: w[1], fill: "E8EAED" }),
               cell("어디서 아셨나", { bold: true, w: w[2], fill: "E8EAED" })],
  })];
  for (const it of items) rows.push(new TableRow({
    children: [cell(it, { bold: true, w: w[0], fill: "F9FAFB" }),
               cell("☐ 모름   ☐ 들어봄   ☐ 뭔지 안다   ☐ 쓰고 있다", { w: w[1], size: 17 }),
               cell("", { w: w[2] })],
  }));
  return table(w, rows);
};

/** 관찰 — 과업 기반 */
const taskTable = () => {
  const w = cols(0.05, 0.37, 0.19, 0.19, 0.20);
  const tasks = [
    ["1", "“기미가 고민이라고 치고, 뭘 사면 될지 한번 찾아봐 주세요”", "제품 상세까지 도달"],
    ["2", "“지금 쓰시는 거 두 개만 등록해 보세요”", "화장대에 2개 등록"],
    ["3", "“그 둘이 같이 써도 되는지 확인해 보세요”", "판정 결과 확인"],
  ];
  const rows = [new TableRow({
    tableHeader: true,
    children: [cell("#", { bold: true, w: w[0], fill: "E8EAED", align: AlignmentType.CENTER }),
               cell("과업 — 이 문장 그대로 읽는다", { bold: true, w: w[1], fill: "E8EAED", size: 17 }),
               cell("성공 기준", { bold: true, w: w[2], fill: "E8EAED", size: 17 }),
               cell("결과", { bold: true, w: w[3], fill: "E8EAED", size: 17 }),
               cell("걸린 시간 / 포기 화면", { bold: true, w: w[4], fill: "E8EAED", size: 17 })],
  })];
  for (const [n, task, ok] of tasks) rows.push(new TableRow({
    children: [cell(n, { bold: true, w: w[0], fill: "F9FAFB", align: AlignmentType.CENTER }),
               cell(task, { w: w[1], size: 17 }),
               cell(ok, { w: w[2], size: 17 }),
               cell(["☐ 성공", "☐ 실패", "☐ 포기"], { w: w[3], size: 17 }),
               cell("", { w: w[4] })],
  }));
  return table(w, rows);
};

const obsTable = () => {
  const w = cols(0.34, 0.66);
  const items = [
    "처음 누른 곳",
    "멈춘 지점 (3초 이상 정지) — 어느 화면",
    "뒤로가기 횟수",
    "도움을 요청하기까지 (초)",
    "소리 내어 말한 것 (원문, 요약 금지)",
    "끝까지 못 한 것 + 그 이유",
  ];
  return table(w, [
    new TableRow({ tableHeader: true,
      children: [cell("항목", { bold: true, w: w[0], fill: "E8EAED" }),
                 cell("기록", { bold: true, w: w[1], fill: "E8EAED" })] }),
    ...items.map((it) => new TableRow({
      children: [cell(it, { w: w[0], fill: "F9FAFB", size: 17 }), cell("", { w: w[1] })] })),
  ]);
};

const checklist = (items) => {
  const w = cols(0.06, 0.94);
  return table(w, items.map(([star, it]) => new TableRow({
    children: [cell("☐", { bold: true, w: w[0], size: 21, align: AlignmentType.CENTER }),
               cell(it, { w: w[1], size: 19, bold: star })],
  })));
};

// ── 문서 ─────────────────────────────────────────────
const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 20 }, paragraph: { spacing: { line: 262 } } } } },
  numbering: {
    config: [{
      reference: "dots",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 380, hanging: 200 } }, run: { font: FONT, size: 19 } },
      }],
    }],
  },
  sections: [{
    properties: {
      page: { size: { width: PAGE.w, height: PAGE.h },
              margin: { top: 900, right: PAGE.m, bottom: 850, left: PAGE.m } },
    },
    children: [

      // ══════════ 1장 · A세트 ══════════
      ...Title("RIVEA 인터뷰 v2 — A세트 (전원 8명)",
               "2026-08-17 (월) · 인당 10분 · 8부 인쇄 — 한 사람당 한 부"),
      headerTable(),
      callout("앱 얘기는 관찰 파트 전까지 절대 꺼내지 않는다. 시간이 모자라면 B세트를 버리고 이 장을 끝까지 한다.", "FFE8E8", "C05050"),

      Say("제가 뭘 팔러 온 게 아니고요, 화장품이랑 피부 관리 어떻게 하시는지 여쭤보려고요. 10분이면 돼요. 정답 없는 질문이라 편하게 말씀해 주시면 돼요."),

      // --- 0 연세 ---
      SectionBar("0", "연세", "10초"),
      Q("연세가 어떻게 되세요?"),
      Note("맨 위 표에 먼저 적는다. 나머지 답 전부의 해석이 여기에 달렸다. 40대가 3명 미만이면 이 인터뷰는 「40대 검증」이 아니다 (4장 §표본 경고)."),

      // --- 1 화장대 ---
      SectionBar("1", "지금 뭘 쓰고 계세요", "1분"),
      Q("혹시 화장대 한 장만 찍어서 보여주실 수 있으세요?"),
      Note("사진이 받아적는 것보다 빠르고 정확하다. 말로 받지 말고 사진으로 받는다."),
      Sub("(대면·지금 없으면) “이따 집에서 한 장만 카톡으로 주실 수 있으세요?” → 약속만 받고 넘어간다"),
      Sub("(전화) “지금 화장대 앞이세요? 하나씩 읽어주실 수 있으세요?”"),
      Field("사진   ☐ 지금 받음   ☐ 카톡 약속   ☐ 못 받음          제품 총 개수: ______ 개"),
      Note("사진을 못 받는 경우에만 아래 표를 손으로 채운다."),
      shelfTable(),

      new Paragraph({ children: [new PageBreak()] }),

      // --- 2 검색 기록 ---
      SectionBar("2", "최근에 산 것 + 검색 기록", "2분 30초"),
      Q("제일 최근에 새로 사신 게 뭐예요? 그건 어떻게 알게 되셨어요?"),
      ...WriteLines(1),
      Q("어디서 사셨어요?"),
      Field("☐ 쿠팡  ☐ 네이버  ☐ 올리브영  ☐ 백화점  ☐ 홈쇼핑  ☐ 매장  ☐ 기타 ____________"),

      callout("여기가 이 인터뷰에서 제일 중요한 30초다. 기억으로 묻지 말고 폰 화면을 본다.", "E8F0FF", "3060B0"),

      Say("혹시 폰에서 네이버 검색창 한 번만 열어봐 주실 수 있으세요? 최근에 뭐 치셨는지 그것만 보려고요. 다른 건 안 봅니다. 불편하시면 안 하셔도 괜찮아요."),

      Sub("네이버 앱 → 검색창 탭 → 최근 검색어 목록"),
      Note("폰을 건네받지 않는다. 본인이 들고 읽어주시게 한다. 사생활이다."),
      Note("거부하면 바로 물러선다. 기억으로 물어보는 걸로 대체하고, 아래 표에 「기억」이라고 표시한다."),
      Note("화장품과 무관한 검색어도 그대로 적는다. 이 층이 뭘 검색하는지 자체가 데이터다."),
      Field("출처:  ☐ 폰 화면 그대로   ☐ 기억으로 회상   ☐ 확보 실패"),
      searchTable(),
      callout("정리하지 말 것. 「기미없애는방법」(월 190) vs 「기미없애는법」(월 13,250) — 한 글자에 70배다. 띄어쓰기·오타·조사까지 화면 그대로.", "E8F0FF", "3060B0"),

      new Paragraph({ children: [new PageBreak()] }),

      // --- 3 기기 ---
      SectionBar("3", "집에서 쓰는 기기", "2분", "8A5A00"),
      callout("★ 신설 — 여기가 v2에서 제일 중요해진 문항이다. 「디바이스 중심」으로 피봇했는데 우리한테 1차 데이터가 0건이다.", "FFF4E5", "E0A030"),
      Q("LED 마스크나 갈바닉, 고주파 같은 기기 써보신 적 있으세요?"),
      Field("☐ 지금도 쓴다      ☐ 샀는데 안 쓴다      ☐ 없다      ☐ 사려다 말았다"),
      deviceTable(),
      Note("「안 쓰게 된 이유」가 이 문항의 핵심이다. 기기 시장의 진짜 문제는 구매가 아니라 이탈이다."),
      Note("브랜드명을 반드시 원문으로. 「메디큐브디바이스」가 월 2만 검색인데 우리한테 근거가 없다."),

      // --- 4 피부과 ---
      SectionBar("4", "피부과", "1분 30초", "8A5A00"),
      callout("★ 신설 — 시술어 월 31만 회(전체의 17.6%). 리쥬란 하나가 뷰티디바이스 전체의 3배. IR덱 09 경쟁표에 피부과 행이 없다.", "FFF4E5", "E0A030"),
      Q("기미나 주름 때문에 피부과 가보신 적 있으세요?"),
      clinicTable(),
      Note("「시술받고 나서 뭘 바르라고 하던가요」가 이 문항의 목적지다. 「아무도 안 알려줬다」면 그 자리가 비어 있고, 「거기서 파는 걸 샀다」면 병원이 이미 먹었다."),

      new Paragraph({ children: [new PageBreak()] }),

      // --- 5 퀸잇 ---
      SectionBar("5", "퀸잇", "1분"),
      Note("40대+ 여성 도달에 성공한 유일한 확인 사례 (월 16.7만 · 경쟁 「낮음」). 어떻게 알았는지가 우리가 따라갈 경로다."),
      Q("40대 이상 옷 파는 「퀸잇」이라는 앱 아세요?"),
      queenitTable(),
      Sub("모르신다면 → “폰에 깔린 앱 중에 쇼핑하는 거 뭐 있으세요?” (홈 화면을 같이 본다)"),
      ...WriteLines(1, "홈 화면에 있던 쇼핑 앱"),

      // --- 6 딸 ---
      SectionBar("6", "따님이 뭘 사줬나", "1분 30초", "8A5A00"),
      callout("★ 가정법 → 실제 사례. 「엄마생신선물」(월 1,830)이 「50대화장품」(월 280)의 6.5배다. 획득 경로인데 v1은 “골라주는 게 나을까요?”라고 물었다.", "FFF4E5", "E0A030"),
      Q("따님(또는 자녀) 계세요? 몇 살이에요?"),
      Field("☐ 딸 ______세      ☐ 아들 ______세      ☐ 없다"),
      Q("따님이 뭐 사드린 적 있으세요? 뭐였어요?"),
      daughterTable(),
      Sub("따님한테 뭐 사달라고 말씀하신 적 있으세요? 뭘요?"),
      ...WriteLines(1),
      callout("여기서 따님 연락처를 받는다. 획득이 딸이면 딸이 더 급한 표본이다.", "E8F5E9", "4A8B5A"),
      Field("따님 인터뷰 요청   ☐ 승낙 (연락처: ________________________)   ☐ 거절   ☐ 안 물어봄"),

      // --- 7 조합 ---
      SectionBar("7", "같이 쓰면 안 되는 거", "30초"),
      Note("병용 검색량 0으로 이미 확정된 사안이다. 짧게 치고 넘어간다. 진짜 증거는 1번 화장대 사진이 준다 — 말이 아니라 실물이 겹침을 증명한다."),
      Q("화장품 두 개를 같이 쓰면 안 되는 경우가 있다는 얘기, 들어보신 적 있으세요?"),
      Field("판정:   ☐ 전혀 모름    ☐ 들어는 봤는데 뭔지는 모름    ☐ 구체적으로 안다 (예시를 말함)"),
      ...WriteLines(1, "「안다」면 뭐라고 했는지 (원문)"),
      Note("예시를 절대 먼저 말하지 않는다. 5초 기다리고 넘어간다."),

      // --- 체크 ---
      H("A세트 끝내기 전에 확인"),
      checklist([
        [true,  "연세 — 맨 위 표에 적었나"],
        [false, "화장대 사진 (또는 카톡 약속)"],
        [true,  "검색 기록 원문 — 화면 그대로 옮겼나, 정리하지 않았나"],
        [true,  "기기 — 브랜드 · 가격 · 지금 쓰는지 · 안 쓰면 왜"],
        [true,  "피부과 — 시술 후 뭘 바르라 했는지"],
        [true,  "딸이 사준 것 — 품목 · 가격 · 지금도 쓰는지"],
        [false, "퀸잇 인지 경로"],
        [true,  "딸 연락처 (인터뷰 요청)"],
      ]),

      // ══════════ 2장 · B세트 ══════════
      new Paragraph({ children: [new PageBreak()] }),
      ...Title("RIVEA 인터뷰 v2 — B세트 (여유 있는 3~4명)",
               "A세트가 끝난 사람에게만 · +5분 · 3~4부 인쇄"),
      headerTable(),
      callout("시간이 없으면 통째로 버린다. 단 10번(성분어)은 2명이라도 확보한다 — 데이터랩을 대신하는 유일한 문항이다.", "FFF4E5", "E0A030"),

      // --- 8 가격 ---
      SectionBar("8", "얼마까지 쓰시나", "2분", "8A5A00"),
      callout("★ 신설 — 「적정가 인식 6~10만원 vs 실구매 20~100만원」 괴리. 중개형인데 v1에는 가격 질문이 한 개도 없었다.", "FFF4E5", "E0A030"),
      Q("화장품 한 병에 보통 얼마쯤 쓰세요? 제일 비싸게 주고 사신 건 얼마였어요?"),
      Q("기기는요? 얼마까지면 사시겠어요? 얼마 넘어가면 안 사시겠어요?"),
      Q("피부과 한 번에 15만원, 기기 한 대에 30만원이면 어느 쪽에 쓰시겠어요? 왜요?"),
      priceTable(),
      Note("금액을 먼저 제시하지 않는다. 앞 두 질문은 반드시 열린 질문으로 받고, 선택지는 마지막 질문에서만."),
      ...WriteLines(2, "“왜요?” 답변 원문"),

      // --- 9 정보원 ---
      SectionBar("9", "누구한테 물어보시나", "1분 30초"),
      Note("40·50대 정보원 상위 3개 중 2개가 오프라인(매장판매원, 가족)이라는 문헌이 있다. 「온라인 앱이 끼어들 자리가 아니다」— 이게 사실인지 확인한다."),
      Q("화장품 사실 때 누구한테 물어보세요?"),
      Field("☐ 아무한테도 안 물어본다   ☐ 친구   ☐ 딸·자녀   ☐ 매장 직원   ☐ 인터넷   ☐ 기타"),
      Note("「아무도 안 물어본다」가 나오면 그것도 데이터다 — 위임 수요가 없다는 뜻이니까."),
      Q("매장 직원 말 듣고 사신 적 있으세요? 그때 뭐라고 하던가요?"),
      ...WriteLines(2),
      Q("네이버 카페나 밴드 하시는 거 있으세요? 어떤 데요?"),
      ...WriteLines(2, "카페·밴드 이름 — 그대로 적는다 (공개 순위가 없다. 8명이 실제로 들어가는 곳이 우리가 들어갈 곳이다)"),
      Sub("거기서 화장품 얘기도 나와요? 뭐 사실 때 거기서 물어보신 적 있으세요?"),
      Field("☐ 물어본 적 있다   ☐ 얘기는 나오는데 안 물어봄   ☐ 화장품 얘기 안 나옴   ☐ 하는 데 없음"),

      // --- 10 성분어 ---
      SectionBar("10", "성분 이름을 아시나", "1분 30초", "8A5A00"),
      callout("★ 신설 — 성분어가 월 33.3만 회로 전체의 19%인데 연령 미확인이다. 8명에게 직접 물으면 데이터랩보다 거친 대신 훨씬 빠른 답이 나온다.", "FFF4E5", "E0A030"),
      Q("이런 말 들어보셨어요? 하나씩 여쭐게요."),
      ingredientTable(),
      Note("「쓰고 있다」가 8명 중 0명이면 33만 회는 우리 층이 아니다. 그럼 성분 축은 접는다."),
      Note("이름을 읽어줄 때 설명을 붙이지 않는다. 「레티놀 아세요?」까지만."),

      H("B세트 끝내기 전에 확인"),
      checklist([
        [true,  "기기 30만 vs 피부과 15만 — 어느 쪽을 골랐고, 「왜요?」 답이 원문으로 적혔나"],
        [false, "화장품 한 병 / 기기 상한 금액 — 숫자로 적혔나"],
        [true,  "성분 4개 인지 수준 — 「쓰고 있다」가 몇 명인가"],
        [false, "카페·밴드 이름 — 원문 그대로"],
        [false, "매장 직원이 뭐라고 했는지 (원문)"],
      ]),

      // ══════════ 3장 · 관찰 ══════════
      new Paragraph({ children: [new PageBreak()] }),
      ...Title("RIVEA 인터뷰 v2 — 관찰 기록지 (2~3명)",
               "A·B세트가 다 끝난 뒤에만 · +15분 · 대면 전용 · 2~3부 인쇄"),
      headerTable(),
      callout("지금 우리한테 아예 없는 유일한 데이터다. 한 명이라도 확보한다.", "E8F5E9", "4A8B5A"),

      Field("rivea-app.web.app  ·  반드시 시크릿 모드로 열어 온보딩이 처음부터 뜨게 한다"),
      Say("제가 만들고 있는 게 있는데 한번 써보시겠어요? 설명은 안 드릴 거고요, 뭘 하시든 다 괜찮아요. 생각나시는 게 있으면 소리 내서 말씀해 주시면 좋고요."),

      H("과업 — 성공과 실패를 가른다"),
      Note("v1에는 기록 항목만 있고 무엇이 성공인지가 없었다. 과업을 주고 완료 여부를 적는다."),
      taskTable(),

      H("과업마다 기록"),
      obsTable(),

      callout("폰을 건네고 입을 닫는다. “어떻게 해요?” → “편하신 대로 해보세요”만 반복. 3분이 지나면 딱 한 번만 “지금 뭐 하시려던 거예요?”", "FFE8E8", "C05050"),
      Note("과업 3은 병용 판정이다. 여기서 「이런 게 있는지 몰랐다」가 나오면 그게 유지 가치의 증거다."),

      H("가장 값진 비교"),
      ...WriteLines(2, "이 사람이 A세트에서 말한 것과, 여기서 실제로 한 행동이 어떻게 달랐나"),

      // ══════════ 4장 · 진행 안내 ══════════
      new Paragraph({ children: [new PageBreak()] }),
      ...Title("진행 안내 — 진행자만 본다",
               "1부만 인쇄 · 참가자에게 보여주지 않는다"),

      H("표본 경고 — 시작 전에 반드시 읽는다"),
      callout("어머니 모임 8명은 십중팔구 50대다. 그런데 우리 전제는 「40대 중심」으로 좁혀져 있고, 비교탐색이 유의한 것도 40대뿐이다(50대에서는 사라진다).", "FFE8E8", "C05050"),
      ...bullets([
        "연세를 맨 먼저 묻고 기록한다. 나머지 답 전부의 해석이 여기에 달렸다.",
        "40대가 3명 미만이면 IR에 「40대 대상 인터뷰 8건」이라고 쓰면 안 된다. 「타깃 인접층 관찰」로 이름을 바꿔서 인용한다.",
        "40대를 못 채우면 딸(30~40대) 쪽에서 따로 확보한다. 획득이 딸이면 딸이 더 급한 표본이다.",
      ]),

      H("v1에서 무엇을 왜 바꿨나"),
      ...bullets([
        "기기 · 피부과를 B세트 → A세트로 올렸다. 「디바이스 중심」으로 피봇해 놓고 A세트 7문항이 전부 화장품 얘기였다.",
        "조합 문항을 1분 30초 → 30초로 줄였다. 병용 검색량 0으로 이미 확정된 사안이라, 「모른다」가 나와도 전략이 안 바뀐다.",
        "「이런 데 있으면 쓰시겠어요」를 삭제했다. 「‘좋다’는 말을 수요로 적지 말 것」이라 써놓고 그걸 묻고 있었다.",
        "검색어를 기억 회상 → 폰 화면 확인으로 바꿨다. 한 글자에 70배가 갈리는데 기억으로 복원하면 그 한 글자가 틀린다.",
        "딸 질문을 가정법 → 실제로 사준 것(품목·가격·시기·지금도 쓰는지)으로 바꿨다.",
        "지불의사 문항을 신설했다. 중개형인데 가격 질문이 한 개도 없었다.",
        "성분어 인지 문항을 신설했다. 월 33만 회의 연령을 8명에게 직접 확인한다.",
        "관찰에 과업과 성공 기준을 넣었다.",
      ]),

      H("시간이 모자랄 때 무엇을 버리나"),
      ...bullets([
        "A세트(10분)는 8명 전원. 이건 안 버린다.",
        "A세트 안에서도 못 버리는 것: 0(연세) · 2(검색 기록) · 3(기기) · 4(피부과)",
        "B세트(5분)는 3~4명. 시간 없으면 버린다. 단 10번(성분어)은 2명이라도 확보.",
        "관찰(15분)은 2~3명. 한 명이라도 확보한다.",
        "8명을 20분씩 얕게 보는 것보다, 5명을 A+B+관찰로 제대로 보는 게 낫다.",
      ]),

      H("모임에서 어떻게 도나"),
      ...bullets([
        "전체 3분 인사 → 한 분씩 조용한 자리로. A세트만 8명이면 90분.",
        "여러 명이 같이 있는 자리에서는 묻지 않는다 — 옆 사람 답을 듣고 따라간다.",
        "화장대 사진·검색 기록을 그 자리에서 못 받으면 카톡 약속을 받고 넘어간다.",
      ]),

      H("전화로 할 때"),
      ...bullets([
        "더 나은 것: 제품명·기기 브랜드. “지금 화장대 앞이세요?”가 기억보다 정확하다.",
        "못 하는 것: 관찰, 검색 기록 화면 확인. 둘 다 대면으로 따로 확보한다.",
        "1:1이라 7번(조합) 답의 신뢰도는 전화가 더 높다.",
      ]),

      H("하지 말 것"),
      ...bullets([
        "관찰 전에 앱을 보여주기",
        "7번에서 예시 먼저 말하기",
        "검색어를 정리해서 적기 — 화면 그대로. 70배 차이가 난다",
        "폰을 건네받아 직접 뒤지기 — 본인이 들고 읽어주시게 한다",
        "8번에서 금액을 먼저 제시하기 — 열린 질문 먼저, 선택지는 마지막에만",
        "관찰 중 도와주기",
        "“좋다”는 말을 수요로 적기",
        "8명 답을 평균 내기 — 개별 사례로 인용한다",
        "40대가 3명 미만인데 「40대 인터뷰」라고 쓰기",
      ]),

      H("끝나고 할 일 (화요일)"),
      ...bullets([
        "기기 보유·가격·이탈 사유를 표로 만든다 → “N명 중 M명이 기기를 샀고, 그중 K명이 지금은 안 쓴다. 이유는 ○○.” ← 「디바이스 중심」 피봇을 떠받치는 유일한 1차 데이터가 된다",
        "피부과 이용 + 「시술 후 뭘 바르라 했나」를 모은다 → IR덱 09 경쟁표에 「피부과 시술」 행을 추가한다",
        "검색 기록 원문을 전부 모아 키워드 도구에 넣는다. 지금 우리 키워드는 전부 추측이다",
        "딸이 사준 것 목록 + 딸 연락처. 딸 인터뷰를 다음 주에 잡는다",
        "화장대 사진 속 제품을 rules.ts 판정에 넣는다 → “N명 중 M명이 지금 겹치는 조합을 쓰고 있었다. 스스로 알던 사람은 K명.”",
        "성분어 4개 인지도를 정리한다 (데이터랩 대체)",
      ]),
      new Paragraph({
        spacing: { before: 140 },
        children: [t("이 여섯이 IR덱 03 · 05 · 06 · 08 · 09를 채운다.", { bold: true, size: 20 })],
      }),
    ],
  }],
});

const OUT = process.argv[2] || "docs/RIVEA_인터뷰_기록지_v2_20260817.docx";
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log(`${OUT}  (${(buf.length / 1024).toFixed(0)} KB)`);
});
