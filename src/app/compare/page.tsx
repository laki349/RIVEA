// 임시 비교 페이지 — 폰트 페어링 + 액센트 색 방향을 한눈에.
// 결정 후 삭제 예정. (실제 적용은 tokens.ts / layout.tsx 에)
import type { CSSProperties } from "react";

type Dir = {
  key: string;
  name: string;
  note: string;
  bg: string;
  ink: string;
  sub: string;
  accent: string;
  onAccent: string;
  display: string; // font-family
  body: string; // font-family
  spec: string;
};

const dirs: Dir[] = [
  {
    key: "current",
    name: "현재 (AS-IS)",
    note: "AI 기본값 클러스터 #1",
    bg: "#FBF7F0",
    ink: "#2A211B",
    sub: "#6E5F52",
    accent: "#A8874E",
    onAccent: "#FBF7F0",
    display: "'Gowun Batang', serif",
    body: "'Noto Sans KR', sans-serif",
    spec: "Gowun Batang + Noto Sans KR · 골드 #A8874E",
  },
  {
    key: "rose",
    name: "A · 로즈 에디토리얼",
    note: "따뜻함 유지, 골드→딥로즈",
    bg: "#FBF7F0",
    ink: "#2A211B",
    sub: "#6E5F52",
    accent: "#A24E63",
    onAccent: "#FFF7F3",
    display: "'Nanum Myeongjo', serif",
    body: "'Noto Sans KR', sans-serif",
    spec: "Nanum Myeongjo + Noto Sans KR · 딥로즈 #A24E63",
  },
  {
    key: "sage",
    name: "B · 클리닉 세이지",
    note: "가장 탈-AI · 모던 더마",
    bg: "#F2F1EC",
    ink: "#24271F",
    sub: "#5B5F54",
    accent: "#5E6B54",
    onAccent: "#F5F6F1",
    display: "'IBM Plex Sans KR', sans-serif",
    body: "'IBM Plex Sans KR', sans-serif",
    spec: "IBM Plex Sans KR (산세리프 디스플레이) · 세이지 #5E6B54",
  },
  {
    key: "plum",
    name: "C · 부티크 플럼",
    note: "고대비 명조 · 잡지 부티크",
    bg: "#F7F1E6",
    ink: "#2A211B",
    sub: "#6E5F52",
    accent: "#7A3B52",
    onAccent: "#FBF3F0",
    display: "'Song Myung', serif",
    body: "'Gowun Dodum', sans-serif",
    spec: "Song Myung + Gowun Dodum · 플럼 #7A3B52",
  },
];

function Panel({ d }: { d: Dir }) {
  const card: CSSProperties = {
    background: d.bg,
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 24,
    padding: 28,
    fontFamily: d.body,
    color: d.ink,
  };
  return (
    <div style={card}>
      {/* 라벨 */}
      <div style={{ marginBottom: 18, fontFamily: d.body }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: d.ink }}>{d.name}</div>
        <div style={{ fontSize: 12, color: d.sub }}>{d.note} · {d.spec}</div>
      </div>

      {/* 마스트헤드 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: d.accent }}>
          리베아 편집
        </span>
        <span style={{ height: 1, flex: 1, background: d.accent, opacity: 0.45 }} />
        <span style={{ fontSize: 10.5, letterSpacing: "0.16em", color: d.sub }}>2026 · 여름</span>
      </div>

      {/* 헤드라인 */}
      <h2 style={{ fontFamily: d.display, fontSize: 30, lineHeight: 1.18, fontWeight: 700, letterSpacing: "-0.01em", color: d.ink, margin: 0 }}>
        나이 들수록,<br />더 정성스러운 홈케어
      </h2>

      <p style={{ marginTop: 14, fontSize: 14, lineHeight: 1.6, color: d.sub, maxWidth: 420 }}>
        기미를 자연스럽게 덮는 커버, 주름에 끼지 않는 베이스, 집에서 하는 리프팅까지.
        브랜드를 가리지 않고 고민 하나로 골라 비교합니다.
      </p>

      {/* CTA */}
      <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 20 }}>
        <span style={{ background: d.accent, color: d.onAccent, borderRadius: 999, padding: "12px 22px", fontSize: 14, fontWeight: 700 }}>
          리베아 Pick 보기
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: d.ink, borderBottom: `2px solid ${d.accent}`, paddingBottom: 2 }}>
          기미 커버 모아보기 →
        </span>
      </div>

      {/* 미니 상품 카드 2개 */}
      <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { brand: "루메아", name: "리프트 프로 EMS 마이크로커런트 디바이스", off: 30, price: "189,000원", list: "269,000원", badge: "베스트" },
          { brand: "메종로즈", name: "레티놀 0.3 리뉴얼 나이트 세럼", off: 20, price: "62,000원", list: "78,000원", badge: "" },
        ].map((p) => (
          <div key={p.name}>
            <div style={{ position: "relative", aspectRatio: "1/1", borderRadius: 16, background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.06)" }}>
              {p.badge && (
                <span style={{ position: "absolute", top: 10, left: 10, background: d.ink, color: d.bg, fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "3px 9px" }}>
                  {p.badge}
                </span>
              )}
            </div>
            <div style={{ fontSize: 11.5, color: d.sub, marginTop: 10 }}>{p.brand}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.35, color: d.ink, marginTop: 2 }}>{p.name}</div>
            <div style={{ marginTop: 6, display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: d.accent }}>{p.off}%</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: d.ink }}>{p.price}</span>
              <span style={{ fontSize: 11.5, color: d.sub, textDecoration: "line-through" }}>{p.list}</span>
            </div>
            <div style={{ fontSize: 12, color: d.sub, marginTop: 4 }}>★ 4.8 (2,412)</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <div style={{ background: "#EFEBE3", minHeight: "100vh", padding: "32px 20px" }}>
      {/* 비교용 폰트 로드 (임시) */}
      <style
        dangerouslySetInnerHTML={{
          __html:
            "@import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Gowun+Dodum&family=IBM+Plex+Sans+KR:wght@400;500;700&family=Nanum+Myeongjo:wght@400;700;800&family=Noto+Sans+KR:wght@400;500;700&family=Song+Myung&display=swap');",
        }}
      />
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 20, fontWeight: 700, color: "#2A211B", marginBottom: 4 }}>
          폰트 · 액센트 색 방향 비교
        </h1>
        <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 13, color: "#6E5F52", marginBottom: 24 }}>
          현재(좌상) 대비 A·B·C 세 방향. 헤드라인 서체와 액센트 색이 인상을 어떻게 바꾸는지 보세요.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 20 }}>
          {[dirs[2], dirs[3], dirs[0], dirs[1]].map((d) => (
            <Panel key={d.key} d={d} />
          ))}
        </div>
      </div>
    </div>
  );
}
