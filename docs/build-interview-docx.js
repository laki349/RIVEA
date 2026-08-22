const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  LevelFormat, PageBreak,
} = require("docx");
const fs = require("fs");

const FONT = "Malgun Gothic";
const PAGE_W = 12240 - 1080 * 2;

const t = (text, opts = {}) => new TextRun({ text, font: FONT, ...opts });

const SectionBar = (num, title, mins, fill = "1F2933") =>
  new Paragraph({
    spacing: { before: 230, after: 90 },
    shading: { type: ShadingType.CLEAR, fill, color: "auto" },
    children: [
      t(`  ${num}. ${title}`, { bold: true, size: 23, color: "FFFFFF" }),
      t(`      ${mins}`, { size: 18, color: "C9D1D9" }),
    ],
  });

const Q = (text) =>
  new Paragraph({
    spacing: { before: 110, after: 45 },
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
    children: [t("※ " + text, { size: 18, italics: true, color: "A03030" })],
  });

const Field = (text) =>
  new Paragraph({
    spacing: { before: 55, after: 55 },
    indent: { left: 320 },
    children: [t(text, { size: 19 })],
  });

const WriteLines = (n = 2, label) => {
  const out = [];
  if (label) out.push(new Paragraph({
    spacing: { before: 70, after: 25 }, indent: { left: 320 },
    children: [t(label, { size: 17, color: "777777" })],
  }));
  for (let i = 0; i < n; i++) out.push(new Paragraph({
    spacing: { before: 0, after: 135 }, indent: { left: 320 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB", space: 4 } },
    children: [t("", { size: 20 })],
  }));
  return out;
};

const cell = (text, { bold, w, fill, size, align } = {}) =>
  new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: fill ? { type: ShadingType.CLEAR, fill, color: "auto" } : undefined,
    margins: { top: 65, bottom: 65, left: 100, right: 100 },
    children: [new Paragraph({ alignment: align, spacing: { after: 0 }, children: [t(text, { bold, size: size ?? 18 })] })],
  });

const table = (widths, rows) =>
  new Table({ columnWidths: widths, width: { size: PAGE_W, type: WidthType.DXA }, rows });

// 화장대 기록 — 사진 우선, 못 받으면 손으로
const shelfTable = () => {
  const w = [1150, 4400, 4570];
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

// 퀸잇 — 이 층 도달에 성공한 유일한 확인 사례
const queenitTable = () => {
  const w = [2100, 3200, 4820];
  return table(w, [
    new TableRow({
      tableHeader: true,
      children: [cell("", { bold: true, w: w[0], fill: "E8EAED" }),
                 cell("인지", { bold: true, w: w[1], fill: "E8EAED" }),
                 cell("어떻게 아셨어요? (경로 원문)", { bold: true, w: w[2], fill: "E8EAED" })],
    }),
    new TableRow({ children: [cell("퀸잇", { bold: true, w: w[0], fill: "FFF4E5" }),
                              cell("☐ 모름 ☐ 들어봄 ☐ 써봄", { w: w[1] }), cell("", { w: w[2] })] }),
    new TableRow({ children: [cell("설치는 누가?", { bold: true, w: w[0], fill: "F5F6F7" }),
                              cell("☐ 본인 ☐ 딸·자녀 ☐ 친구 ☐ 기타", { w: w[1] }), cell("", { w: w[2] })] }),
  ]);
};

const obsTable = () => {
  const w = [3400, 5720];
  const items = ["첫 탭까지 걸린 시간 (초)", "처음 누른 곳", "멈춘 지점 (3초 이상 정지)",
                 "뒤로가기 횟수", "도움을 요청하기까지 (초)", "소리 내어 말한 것 (원문)", "끝까지 못 한 것"];
  return table(w, [
    new TableRow({ tableHeader: true,
      children: [cell("항목", { bold: true, w: w[0], fill: "E8EAED" }), cell("기록", { bold: true, w: w[1], fill: "E8EAED" })] }),
    ...items.map((it) => new TableRow({ children: [cell(it, { w: w[0], fill: "F9FAFB" }), cell("", { w: w[1] })] })),
  ]);
};

const headerTable = () => {
  const w = [1100, 2200, 900, 1400, 1000, 2520];
  return table(w, [new TableRow({
    children: [cell("참가자", { bold: true, w: w[0], fill: "F0F1F3" }), cell("", { w: w[1] }),
               cell("연령대", { bold: true, w: w[2], fill: "F0F1F3" }), cell("", { w: w[3] }),
               cell("방식", { bold: true, w: w[4], fill: "F0F1F3" }),
               cell("☐ 대면  ☐ 전화     B세트 ☐ 함", { w: w[5] })],
  })]);
};

const mustHaveTable = () => {
  const w = [640, 8480];
  const items = [
    "화장대 사진 (또는 제품명 목록) — 없으면 화요일 판정을 못 돌린다",
    "「같이 쓰면 안 되는 조합」 답변 원문",
    "「뭐라고 검색하셨어요」 검색어 원문 — 우리 키워드 전략의 유일한 실측 소스",
    "「퀸잇 어떻게 아셨어요」 경로 — 이 층 도달에 성공한 유일한 확인 사례",
  ];
  return table(w, items.map((it) => new TableRow({
    children: [cell("☐", { bold: true, w: w[0], size: 21, align: AlignmentType.CENTER }), cell(it, { w: w[1], size: 19 })],
  })));
};

const callout = (text, fill = "FFF4E5", border = "E0A030") =>
  new Paragraph({
    spacing: { before: 90, after: 110 },
    shading: { type: ShadingType.CLEAR, fill, color: "auto" },
    border: {
      top: { style: BorderStyle.SINGLE, size: 4, color: border, space: 5 },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: border, space: 5 },
      left: { style: BorderStyle.SINGLE, size: 16, color: border, space: 5 },
      right: { style: BorderStyle.SINGLE, size: 4, color: border, space: 5 },
    },
    children: [t("  " + text + "  ", { size: 20 })],
  });

const H = (text) => new Paragraph({
  spacing: { before: 250, after: 90 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: "1F2933", space: 4 } },
  children: [t(text, { bold: true, size: 24 })],
});

const bullets = (arr, size = 19) => arr.map((s) => new Paragraph({
  numbering: { reference: "dots", level: 0 }, spacing: { after: 45 }, children: [t(s, { size })],
}));

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 20 }, paragraph: { spacing: { line: 262 } } } } },
  numbering: {
    config: [{
      reference: "dots",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
                 style: { paragraph: { indent: { left: 380, hanging: 200 } }, run: { font: FONT, size: 19 } } }],
    }],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 850, right: 1080, bottom: 850, left: 1080 } } },
    children: [
      // ================= A세트 =================
      new Paragraph({ spacing: { after: 25 }, children: [t("RIVEA 인터뷰 — A세트 (전원 8명)", { bold: true, size: 31 })] }),
      new Paragraph({
        spacing: { after: 130 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: "1F2933", space: 5 } },
        children: [t("2026-08-17 (월) · 인당 10분 · 대면 또는 전화 · 이 장은 8명 전원에게", { size: 19, color: "555555" })],
      }),
      headerTable(),
      callout("앱 얘기는 6번 전까지 꺼내지 않는다. 시간이 모자라면 B세트를 버리고 이 장을 끝까지 한다."),

      new Paragraph({
        spacing: { before: 50, after: 90 }, indent: { left: 160 },
        children: [t("“제가 뭘 팔러 온 게 아니고요, 화장품 고르실 때 뭐가 불편하신지 여쭤보려고요. 10분이면 돼요. 정답 없는 질문이라 편하게 말씀해 주시면 돼요.”", { size: 20, italics: true })],
      }),

      // --- 1 ---
      SectionBar("1", "지금 뭘 쓰고 계세요", "1분 30초"),
      Q("혹시 화장대 한 장만 찍어서 보여주실 수 있으세요?"),
      Note("사진이 손으로 받아적는 것보다 빠르고 정확하다. 이게 이 인터뷰에서 제일 값진 산출물이다."),
      Sub("(대면) 지금 안 계시면 → “이따 집에서 한 장만 카톡으로 주실 수 있으세요?”"),
      Sub("(전화) “지금 화장대 앞이세요? 하나씩 읽어주실 수 있으세요?”"),
      Field("사진 받음  ☐ 지금  ☐ 나중에 카톡 약속  ☐ 못 받음        총 개수: ______ 개"),
      Note("사진을 못 받는 경우에만 아래 표를 손으로 채운다."),
      shelfTable(),

      // --- 2 ---
      SectionBar("2", "그건 어떻게 알고 사셨어요", "2분 30초"),
      Q("제일 최근에 새로 사신 게 뭐예요? 그건 어떻게 알게 되셨어요?"),
      Sub("웹 검색 / 지인·가족 / 매장 판매원 / TV·홈쇼핑 / 유튜브 / 인스타 / 그 외"),
      Q("어디서 사셨어요?  (쿠팡 · 네이버 · 올리브영 · 백화점 · 홈쇼핑 · 브랜드몰)"),
      Q("사기 전에 인터넷에 뭐 쳐보셨어요? 뭐라고 치셨어요?"),
      callout("검색어를 들리는 대로 그대로 적는다. 정리하지 말 것. 이게 우리 키워드 전략의 유일한 실측 소스다.", "E8F0FF", "3060B0"),
      ...WriteLines(2, "검색어 원문"),
      Sub("네이버에 치셨어요, 유튜브에 치셨어요?"),
      Sub("쳐서 나온 것 중에 뭘 보셨어요?  (블로그 / 카페 / 쇼핑 / 지식iN / 유튜브)"),
      Field("검색 안 한다고 하시면 → “한 번도 안 쳐보셨어요?”  ☐ 아예 안 함  ☐ 가끔  ☐ 자주"),

      new Paragraph({ children: [new PageBreak()] }),

      // --- 3 ---
      SectionBar("3", "고르실 때 불편한 거 있으세요", "2분"),
      Q("화장품 고르실 때 불편하거나 답답했던 적 있으세요?"),
      Note("보기를 먼저 읽어주지 않는다. 5초는 기다린다. 스스로 말한 것이 진짜 불편이다."),
      Q("(안 나오면) 이런 것 중에 있으세요?"),
      Sub("성분을 봐도 무슨 뜻인지 모르겠다   /   광고인지 진짜 후기인지 못 믿겠다"),
      Sub("종류가 너무 많다   /   나한테 맞는 건지 모르겠다   /   효과가 있는 건지 모르겠다"),
      Note("보기를 읽었으면 반드시 → “그중에 제일 큰 게 뭐예요? 그때 어떻게 하셨어요?”"),
      Q("돈이 아깝다고 느끼신 제품 있으세요? 어떤 거요?"),
      ...WriteLines(2),

      // --- 4 ---
      SectionBar("4", "같이 쓰면 안 되는 거, 아세요", "1분 30초"),
      callout("여기가 목적지다. 예시를 절대 먼저 말하지 않는다. 침묵이 길어도 기다린다.", "FFE8E8", "C05050"),
      Q("화장품 두 개를 같이 쓰면 안 되는 경우가 있다는 얘기, 들어보신 적 있으세요?"),
      Sub("(안다) 어떤 거요? 어디서 들으셨어요?"),
      Sub("(모른다) 그럼 지금 쓰시는 것들끼리 겹치는지는 확인 안 해보셨겠네요?"),
      Field("판정:   ☐ 전혀 모름    ☐ 들어는 봤는데 뭔지는 모름    ☐ 구체적으로 안다 (예시를 말함)"),
      ...WriteLines(2, "답변 원문 (요약하지 말고 말한 대로)"),

      // --- 5 ---
      SectionBar("5", "퀸잇 아세요", "1분 30초"),
      callout("퀸잇은 40대+ 여성 도달에 성공한 유일한 확인 사례다(월 검색 16.7만, 이 층 지수는 「기미」의 28배). 어떻게 알게 됐는지가 우리가 따라갈 수 있는 유일한 경로다.", "E8F0FF", "3060B0"),
      Q("40대 이상 옷 파는 「퀸잇」이라는 앱 아세요?"),
      Sub("어떻게 알게 되셨어요?  (TV광고 / 딸·자녀 / 친구 / 유튜브 / 인스타 / 카톡 / 그냥 떴다)"),
      Sub("설치는 직접 하셨어요, 누가 해드렸어요?"),
      Sub("거기서 사보셨어요? 몇 번쯤이요?"),
      queenitTable(),
      Field("모르신다고 하면 → “폰에 깔린 앱 중에 쇼핑하는 거 뭐 있으세요?”  답: ________________"),

      // --- 6 ---
      SectionBar("6", "이런 데가 있으면 쓰시겠어요", "1분"),
      Q("피부 고민을 말하면 맞는 제품을 골라주고, 성분까지 봐서 뭘 쓰면 되는지 쉽게 알려주는 데가 있으면 한번 써보실 것 같으세요?"),
      Field("☐ 쓸 것 같다      ☐ 잘 모르겠다      ☐ 안 쓸 것 같다"),
      callout("여기서 대부분 “네”가 나온다. 아래 두 개를 붙여야 데이터가 된다."),
      Q("지금은 그런 걸 누가 대신 해주세요? 없으면 어떻게 하세요?"),
      Q("나오면 알려드릴까요? 연락처 남겨 주시겠어요?"),
      Field("연락처 받음  ☐ 예  ☐ 아니오        거절 이유: ______________________________"),

      // --- 7 ---
      SectionBar("7", "따님", "30초"),
      Q("혹시 따님 계세요?  이런 걸 선물 받으신다면 따님이 골라주는 게 나을까요, 직접 고르시는 게 나을까요?"),
      Sub("따님이 뭐 사드린 적 있으세요? 뭐요?"),
      ...WriteLines(1),

      H("A세트 끝내기 전에 확인"),
      mustHaveTable(),

      new Paragraph({ children: [new PageBreak()] }),

      // ================= B세트 =================
      new Paragraph({ spacing: { after: 25 }, children: [t("B세트 — 여유 있는 3~4명에게만", { bold: true, size: 31 })] }),
      new Paragraph({
        spacing: { after: 130 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: "1F2933", space: 5 } },
        children: [t("A세트가 다 끝난 뒤 · +5분 · 8명 전원은 무리라도 3명은 확보한다", { size: 19, color: "555555" })],
      }),
      headerTable(),

      SectionBar("8", "피부과 가보신 적 있으세요", "2분", "6B3A3A"),
      callout("40~59세 여성 검색 지수에서 「리쥬란」이 「기미」의 7배다. 이 층의 진짜 경쟁자는 다른 화장품이 아니라 피부과일 수 있는데, IR덱 09번 경쟁표에 피부과가 없다.", "FFE8E8", "C05050"),
      Q("기미나 주름 때문에 피부과 가보신 적 있으세요?"),
      Sub("(있다) 뭐 받으셨어요?  (레이저토닝 / 피코 / 리쥬란 / 스킨부스터 / 리프팅 / 기타)"),
      Sub("(있다) 얼마나 드셨어요? 몇 번 받으셨어요? 또 가실 거예요?"),
      Sub("(있다) 시술받고 나서 뭘 바르라고 하던가요? 그건 어디서 사셨어요?"),
      Sub("(없다) 왜 안 가셨어요? 생각은 해보셨어요?"),
      Note("“시술 후에 뭘 바르라 하던가요”가 핵심이다. 아무도 안 알려준다는 답이 나오면 그게 우리 자리다."),
      ...WriteLines(3),

      SectionBar("9", "홈케어 기기", "1분 30초", "6B3A3A"),
      Q("LED 마스크나 마사지 기기 같은 거 써보신 적 있으세요?"),
      Sub("(있다) 어떻게 쓰세요? 바르기 전에 쓰세요, 바른 다음에 쓰세요?"),
      Sub("(있다) 지금도 쓰세요? 안 쓰신다면 왜 그만두셨어요?"),
      Sub("(없다) 왜 안 사셨어요? 뭐가 걸리셨어요?"),
      Note("“바르기 전 / 후”는 rules.ts의 기기 규칙을 직격한다. 답이 갈리면 그 자체가 데이터다."),
      ...WriteLines(2),

      SectionBar("10", "화해 · 카페 · 밴드", "1분 30초", "6B3A3A"),
      Q("화장품 성분 알려주는 「화해」라는 앱은 아세요?"),
      Field("☐ 모름   ☐ 들어봄   ☐ 써봄      어떻게 아셨어요: ______________________"),
      Q("네이버 카페나 밴드 하시는 거 있으세요? 어떤 데요?"),
      Sub("거기서 화장품 얘기도 나와요? 뭐 사실 때 거기서 물어보신 적 있으세요?"),
      Note("카페·밴드 이름을 그대로 적는다. 8명이 실제로 들어가는 곳이 우리가 들어갈 곳이다."),
      Field("카페 / 밴드: __________________________________________________"),

      new Paragraph({ children: [new PageBreak()] }),

      // ================= 관찰 =================
      new Paragraph({ spacing: { after: 25 }, children: [t("관찰 기록지 — 2~3명에게만", { bold: true, size: 30 })] }),
      new Paragraph({
        spacing: { after: 140 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: "1F2933", space: 5 } },
        children: [t("A·B세트가 다 끝난 뒤에만 · 15분 · 대면 전용 (전화로는 불가)", { size: 19, color: "555555" })],
      }),
      headerTable(),
      callout("이 프로젝트에서 아직 한 번도 없었던 데이터다. 8명 전원은 무리라도 2~3명은 반드시 확보한다."),
      new Paragraph({
        spacing: { before: 90, after: 90 }, indent: { left: 160 },
        children: [t("“제가 만들고 있는 게 있는데 한번 써보시겠어요? 설명은 안 드릴 거고요, 뭘 하시든 다 괜찮아요. 생각나시는 게 있으면 소리 내서 말씀해 주시면 좋고요.”", { size: 20, italics: true })],
      }),
      Field("rivea-app.web.app  ·  시크릿 모드로 열어 온보딩이 처음부터 뜨게 한다"),
      Note("폰을 건네고 입을 닫는다. “어떻게 해요?”라고 물으면 “편하신 대로 해보세요”만 반복한다."),
      Note("도와주는 순간 측정값이 사라진다. 3분이 지나면 딱 한 번만: “지금 뭐 하시려던 거예요?”"),
      new Paragraph({ spacing: { before: 140, after: 70 }, children: [t("기록", { bold: true, size: 20, color: "555555" })] }),
      obsTable(),
      new Paragraph({
        spacing: { before: 180, after: 90 }, indent: { left: 160 },
        children: [t("6번에서 “쓸 것 같다”고 답한 사람이 여기서 실제로 목적을 달성했는가? ", { size: 20, bold: true }),
                   t("말과 행동의 차이가 이 인터뷰에서 가장 값진 데이터다.", { size: 20 })],
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ================= 진행 안내 =================
      new Paragraph({ spacing: { after: 25 }, children: [t("진행 안내", { bold: true, size: 30 })] }),
      new Paragraph({
        spacing: { after: 170 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: "1F2933", space: 5 } },
        children: [t("시간 배분 · 모임 운영 · 전화 · 하지 말 것 · 끝나고 할 일", { size: 19, color: "555555" })],
      }),

      H("시간이 모자랄 때 무엇을 버리나"),
      ...bullets([
        "A세트(10분)는 8명 전원. 이건 안 버린다",
        "B세트(5분)는 3~4명이면 충분하다. 시간이 없으면 버린다",
        "관찰(15분)은 2~3명. 한 명이라도 확보한다 — 지금 없는 유일한 데이터다",
        "8명을 20분씩 얕게 보는 것보다, 5명을 A+B+관찰로 제대로 보는 게 낫다",
      ]),

      H("모임에서 어떻게 도나"),
      ...bullets([
        "전체에게 3분 인사 → 한 분씩 조용한 자리로. A세트만 8명이면 90분",
        "여러 명이 같이 있는 자리에서는 묻지 않는다 — 옆 사람 답을 듣고 따라간다",
        "화장대 사진을 그 자리에서 못 받으면 카톡 약속을 받고 넘어간다",
        "B세트와 관찰은 마지막에 남으시는 분들께",
      ]),

      H("전화로 할 때"),
      ...bullets([
        "전화가 더 나은 것 — 제품명. “지금 화장대 앞이세요?” 기억보다 정확하다",
        "전화로 못 하는 것 — 관찰. 그래서 관찰은 반드시 대면으로 따로 확보한다",
        "1:1이라 옆 사람 영향이 없다. 4번(조합) 답의 신뢰도는 전화가 더 높다",
        "카톡으로 약속을 먼저 잡는다. 40·50대 앱 사용 1위가 카카오톡이다",
        "침묵을 견딘다. 전화에서는 3초가 30초처럼 느껴지지만 그대로 기다린다",
      ]),

      H("하지 말 것"),
      ...bullets([
        "관찰 전에 앱을 보여주기 — 앞의 답이 전부 오염된다",
        "4번에서 예시 먼저 말하기 (“레티놀이랑 산 같은 거요”) — 이 인터뷰가 통째로 무의미해진다",
        "2번 검색어를 정리해서 적기 — 들린 그대로 적는다. “기미없애는방법”과 “기미없애는법”은 검색량이 70배 차이 난다",
        "관찰 중 도와주기 — 도와주는 순간 측정값이 사라진다",
        "“좋다”는 말을 수요로 적기 — 지인이라 좋다고 한다. 행동만 적는다",
        "8명 답을 평균 내기 — n=8은 통계가 아니다. 개별 사례로 인용한다",
      ]),

      H("끝나고 할 일 (화요일)"),
      new Paragraph({ spacing: { after: 50 }, children: [t("① 화장대 사진 속 제품을 rules.ts 판정에 넣어 이 문장을 만든다:", { size: 19 })] }),
      new Paragraph({
        spacing: { before: 50, after: 90 },
        shading: { type: ShadingType.CLEAR, fill: "F0F1F3", color: "auto" },
        children: [t("  “인터뷰한 N명 중 M명이 지금 겹치는 조합을 쓰고 있었다. 그중 스스로 알고 있던 사람은 K명이었다.”  ", { size: 20, bold: true })],
      }),
      new Paragraph({ spacing: { after: 50 }, children: [t("② 2번에서 받은 검색어 원문을 전부 모아 키워드 도구에 넣는다. 지금 우리가 찍은 키워드는 전부 추측이다.", { size: 19 })] }),
      new Paragraph({ spacing: { after: 50 }, children: [t("③ 5번 「퀸잇 어떻게 아셨어요」 답을 모은다. 경로가 겹치면 그게 우리 채널이다.", { size: 19 })] }),
      new Paragraph({ children: [t("이 셋이 IR덱 04·08·09번을 채운다.", { size: 19, bold: true })] }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2], buf);
  console.log("written:", process.argv[2]);
});
