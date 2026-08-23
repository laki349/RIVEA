/**
 * 계측 로그를 숫자로 꺼낸다 — 4단계 퍼널 + 아웃바운드 집계
 *
 *   node docs/fetch-events.mjs            전체 기간
 *   node docs/fetch-events.mjs --days=7   최근 7일
 *   node docs/fetch-events.mjs --json     원본도 저장 (docs/events-export.json)
 *
 * ── 왜 스크립트가 필요한가 ────────────────────────────────────────────────
 * `firestore.rules`는 `events`의 **read를 아무에게도 열지 않는다.** 브라우저에서
 * 남의 행동 로그를 긁어갈 이유가 없기 때문이다(규칙 파일 주석). 그래서 집계는
 * 규칙을 우회하는 **서비스 계정**으로만 한다. 앱에는 이 경로가 없다.
 *
 * ── 준비 (한 번만) ──────────────────────────────────────────────────────
 *  1. Firebase 콘솔 → ⚙️ 프로젝트 설정 → 「서비스 계정」 탭
 *  2. 「새 비공개 키 생성」 → JSON 다운로드
 *  3. 프로젝트 루트에 `service-account.json` 으로 저장
 *     (`.gitignore`에 들어 있다. **절대 커밋하지 않는다 — 이 키는 DB 전체 권한이다**)
 *
 * ── 의존성 0 ────────────────────────────────────────────────────────────
 * firebase-admin(수십 MB)을 넣지 않는다. 서비스 계정으로 JWT를 직접 서명해
 * 액세스 토큰을 받고 Firestore REST를 부른다. node:crypto만 쓴다.
 * 이 프로젝트는 앱 의존성이 4개뿐이고, 1년에 몇 번 도는 스크립트 때문에
 * 그 목록을 늘리지 않는다.
 */
import { createSign } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// pathname을 그대로 쓰면 안 된다 — 경로에 공백이 있으면 "%20"으로 인코딩돼서 파일을 못 찾는다
const 루트 = fileURLToPath(new URL("..", import.meta.url));
const 키경로 = 루트 + "service-account.json";

const 인자 = process.argv.slice(2);
const 일수 = Number(인자.find((a) => a.startsWith("--days="))?.split("=")[1] ?? 0);
const 원본저장 = 인자.includes("--json");
/**
 * `--fixture=경로` — Firestore 대신 JSON 파일을 읽는다.
 * 키가 없는 환경에서 집계 로직을 검증하거나, 내보낸 원본으로 다시 돌려볼 때 쓴다.
 */
const 픽스처 = 인자.find((a) => a.startsWith("--fixture="))?.split("=")[1] ?? "";

if (!픽스처 && !existsSync(키경로)) {
  console.error("service-account.json 이 없습니다.");
  console.error("Firebase 콘솔 → 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성");
  console.error(`→ ${키경로} 로 저장하세요. (git에는 안 올라갑니다)`);
  process.exit(1);
}

const 키 = 픽스처 ? { project_id: "(fixture)" } : JSON.parse(readFileSync(키경로, "utf8"));

/** 서비스 계정 JWT → 액세스 토큰. scope는 Firestore 읽기에 필요한 datastore 하나만 */
async function 토큰() {
  const 지금 = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const 본문 = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: 키.client_email,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token",
    iat: 지금,
    exp: 지금 + 3600,
  })}`;
  const 서명 = createSign("RSA-SHA256").update(본문).sign(키.private_key, "base64url");

  const 응답 = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${본문}.${서명}`,
    }),
  });
  const 결과 = await 응답.json();
  if (!결과.access_token) {
    console.error("토큰 발급 실패:", 결과);
    process.exit(1);
  }
  return 결과.access_token;
}

/** Firestore REST — 페이지를 끝까지 넘긴다. 300건씩 */
async function 이벤트전부(액세스토큰) {
  const 기본 = `https://firestore.googleapis.com/v1/projects/${키.project_id}/databases/(default)/documents/events`;
  const 모음 = [];
  let 토큰커서 = "";
  do {
    const url = `${기본}?pageSize=300${토큰커서 ? `&pageToken=${토큰커서}` : ""}`;
    const r = await fetch(url, { headers: { authorization: `Bearer ${액세스토큰}` } });
    const j = await r.json();
    if (j.error) {
      console.error("Firestore 오류:", j.error.message);
      process.exit(1);
    }
    for (const d of j.documents ?? []) {
      const f = d.fields ?? {};
      모음.push({
        name: f.name?.stringValue ?? null,
        value: f.value?.stringValue ?? null,
        sid: f.sid?.stringValue ?? null,
        ref: f.ref?.stringValue ?? "direct",
        at: f.createdAt?.timestampValue ?? null,
      });
    }
    토큰커서 = j.nextPageToken ?? "";
  } while (토큰커서);
  return 모음;
}

/**
 * 제품 id → 브랜드·이름. catalog.ts를 얕게 파싱한다.
 *
 * TS를 빌드해서 import하면 스크립트 하나 때문에 빌드 단계가 생긴다.
 * 이 매핑은 표시용이라 실패해도 id는 그대로 보여주면 되므로 정규식으로 충분하다.
 */
function 카탈로그() {
  const 원문 = readFileSync(루트 + "src/data/catalog.ts", "utf8");
  const 지도 = new Map();
  for (const 블록 of 원문.split(/\n  \{/)) {
    const id = 블록.match(/^\s*id: "([^"]+)"/m)?.[1];
    const brand = 블록.match(/^\s*brand: "([^"]+)"/m)?.[1];
    const name = 블록.match(/^\s*name: "([^"]+)"/m)?.[1];
    if (id && brand) 지도.set(id, { brand, name: name ?? id });
  }
  return 지도;
}

/**
 * 한글은 터미널에서 두 칸을 먹는다. `padEnd`는 글자 수만 세서 표가 어긋난다.
 * 폭을 세어서 맞춘다 — 협상 자리에서 그대로 캡처해 쓸 표라 정렬이 깨지면 안 된다.
 */
const 폭 = (s) => [...String(s)].reduce((n, c) => n + (/[\u1100-\u115F\u2E80-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFF60\uFFE0-\uFFE6]/.test(c) ? 2 : 1), 0);
const 맞춤 = (s, n) => String(s) + " ".repeat(Math.max(0, n - 폭(s)));

// ── 실행 ──────────────────────────────────────────────────────────────────
const 전체 = 픽스처
  ? JSON.parse(readFileSync(픽스처, "utf8"))
  : await 이벤트전부(await 토큰());
const 기준 = 일수 ? Date.now() - 일수 * 86400000 : 0;
const 이벤트 = 전체.filter((e) => !기준 || (e.at && Date.parse(e.at) >= 기준));

if (!이벤트.length) {
  console.log("기록이 없습니다.");
  process.exit(0);
}

const 시각 = 이벤트.map((e) => e.at).filter(Boolean).sort();
const 날짜 = (s) => new Date(s).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" });
const 고유 = (이름) => new Set(이벤트.filter((e) => e.name === 이름).map((e) => e.sid)).size;

console.log(`\n기간   ${날짜(시각[0])} ~ ${날짜(시각.at(-1))}`);
console.log(`이벤트 ${이벤트.length}건 · 세션 ${new Set(이벤트.map((e) => e.sid)).size}개\n`);

// 4단계 퍼널 — 도달률은 「몇 번」이 아니라 「몇 세션」이다
const 분모 = 고유("app_open") || new Set(이벤트.map((e) => e.sid)).size;
console.log("4단계 퍼널 (세션 기준)");
console.log(`  ${맞춤("app_open (분모)", 22)} ${String(분모).padStart(5)}       100%`);
for (const [이름, 라벨] of [
  ["concern_select", "① 고민 선택"],
  ["prescription_view", "② 처방 도달"],
  ["shelf_add", "③ 화장대 등록"],
  ["verdict_answer", "④ 판정 응답"],
]) {
  const n = 고유(이름);
  const 율 = 분모 ? ((n / 분모) * 100).toFixed(1) : "0.0";
  console.log(`  ${맞춤(라벨, 22)} ${String(n).padStart(5)}  ${String(율).padStart(9)}%`);
}

/**
 * 세션별 경로 — **「추천을 보고 나갔나」는 여기서만 나온다.**
 *
 * 이벤트 하나만 세면 「처방 N건, 아웃바운드 M건」까지밖에 못 말한다.
 * 그건 두 숫자일 뿐 연결이 아니다. 같은 sid 안에서 **처방을 본 뒤에**
 * 아웃바운드가 찍혔는지를 봐야 「추천 → 구매 시도」가 된다.
 *
 * ⚠️ 순서를 반드시 본다. 상품을 먼저 보고 나중에 처방 화면에 들른 세션을
 *    「추천 덕분」으로 세면 우리에게 유리한 쪽으로 거짓말이 된다.
 */
const 세션들 = new Map();
for (const e of [...이벤트].sort((a, z) => String(a.at).localeCompare(String(z.at)))) {
  if (!세션들.has(e.sid)) 세션들.set(e.sid, []);
  세션들.get(e.sid).push(e);
}

/** 세션 안에서 `앞` 이벤트가 먼저 있고 그 뒤에 `뒤` 이벤트가 있는가 */
const 순서있음 = (목록, 앞, 뒤) => {
  const i = 목록.findIndex((e) => e.name === 앞);
  return i >= 0 && 목록.slice(i + 1).some((e) => e.name === 뒤);
};

const 처방본세션 = [...세션들.values()].filter((v) => v.some((e) => e.name === "prescription_view"));
const 처방후나감 = 처방본세션.filter((v) => 순서있음(v, "prescription_view", "outbound_click"));
const 아웃있는세션 = [...세션들.values()].filter((v) => v.some((e) => e.name === "outbound_click"));
const 처방없이나감 = 아웃있는세션.filter((v) => !순서있음(v, "prescription_view", "outbound_click"));
const 화장대후나감 = [...세션들.values()].filter((v) => 순서있음(v, "shelf_add", "outbound_click"));

const 율 = (a, b) => (b ? ((a / b) * 100).toFixed(1) : "0.0");

console.log("\n루틴 추천 → 공식몰 (세션 기준, 순서 고려)");
console.log(`  ${맞춤("처방 화면을 본 세션", 30)}${String(처방본세션.length).padStart(5)}`);
console.log(`  ${맞춤("└ 그 뒤에 공식몰로 나감", 30)}${String(처방후나감.length).padStart(5)}  ${율(처방후나감.length, 처방본세션.length).padStart(6)}%  ← 추천 도달률`);
console.log(`  ${맞춤("화장대 등록 뒤에 나감", 30)}${String(화장대후나감.length).padStart(5)}`);
console.log(`  ${맞춤("추천 없이 나감 (둘러보다 클릭)", 30)}${String(처방없이나감.length).padStart(5)}`);
console.log("  ⚠️ 실제 결제 여부는 알 수 없다 — 결제를 우리가 받지 않는다. 여기까지가 우리 데이터의 끝이다.");

// 아웃바운드 — 여기는 세션이 아니라 클릭 수다 (OutboundLink 주석)
const 지도 = 카탈로그();
const 클릭 = 이벤트.filter((e) => e.name === "outbound_click");
const 제품별 = new Map();
const 브랜드별 = new Map();
for (const c of 클릭) {
  제품별.set(c.value, (제품별.get(c.value) ?? 0) + 1);
  const b = 지도.get(c.value)?.brand ?? "(미상)";
  브랜드별.set(b, (브랜드별.get(b) ?? 0) + 1);
}

console.log(`\n아웃바운드 — 공식몰로 내보낸 클릭 ${클릭.length}건`);
if (!클릭.length) {
  console.log("  아직 없습니다.");
} else {
  console.log("\n  브랜드별 (입점 협상에 그대로 쓰는 숫자)");
  for (const [b, n] of [...브랜드별].sort((a, z) => z[1] - a[1])) {
    console.log(`    ${맞춤(b, 24)} ${String(n).padStart(4)}회`);
  }
  console.log("\n  제품별");
  for (const [id, n] of [...제품별].sort((a, z) => z[1] - a[1])) {
    console.log(`    ${맞춤((지도.get(id)?.name ?? id).slice(0, 26), 40)} ${String(n).padStart(4)}회`);
  }
}

/**
 * 제품별 전환 — 「이 제품 상세를 본 사람 중 몇 %가 공식몰로 갔나」.
 * 클릭 수만 보면 조회가 많은 제품이 무조건 이긴다. 협상에서 쓸 말은
 * 「이 제품은 보면 나가는 비율이 높다」 쪽이다.
 */
const 본세션 = new Map();
const 나간세션 = new Map();
for (const [sid, 목록] of 세션들) {
  for (const e of 목록) {
    if (e.name === "product_view" && e.value) {
      if (!본세션.has(e.value)) 본세션.set(e.value, new Set());
      본세션.get(e.value).add(sid);
    }
    if (e.name === "outbound_click" && e.value) {
      if (!나간세션.has(e.value)) 나간세션.set(e.value, new Set());
      나간세션.get(e.value).add(sid);
    }
  }
}
const 전환 = [...본세션]
  .map(([id, s]) => ({ id, 본: s.size, 나간: 나간세션.get(id)?.size ?? 0 }))
  .filter((x) => x.본 > 0)
  .sort((a, z) => z.나간 / z.본 - a.나간 / a.본 || z.본 - a.본);

if (전환.length) {
  console.log("\n제품별 전환 (상세를 본 세션 → 공식몰로 나간 세션)");
  for (const x of 전환.slice(0, 15)) {
    const 이름 = 맞춤((지도.get(x.id)?.name ?? x.id).slice(0, 26), 40);
    console.log(`  ${이름} ${String(x.본).padStart(4)}봄 → ${String(x.나간).padStart(4)}나감  ${율(x.나간, x.본).padStart(6)}%`);
  }
}

// 유입 경로 — ?ref=insta 처럼 붙여 보낸 것
const ref별 = new Map();
for (const s of new Set(이벤트.map((e) => e.sid))) {
  const r = 이벤트.find((e) => e.sid === s)?.ref ?? "direct";
  ref별.set(r, (ref별.get(r) ?? 0) + 1);
}
console.log("\n유입 경로 (세션)");
for (const [r, n] of [...ref별].sort((a, z) => z[1] - a[1])) {
  console.log(`  ${맞춤(r, 24)} ${String(n).padStart(4)}`);
}

if (원본저장) {
  const 경로 = 루트 + "docs/events-export.json";
  writeFileSync(경로, JSON.stringify(이벤트, null, 2));
  console.log(`\n원본 → docs/events-export.json (${이벤트.length}건)`);
}
console.log();
