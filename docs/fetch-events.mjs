/**
 * 계측 로그를 숫자로 꺼낸다 — 4단계 퍼널 + 아웃바운드 집계
 *
 *   node docs/fetch-events.mjs            전체 기간
 *   node docs/fetch-events.mjs --days=7   최근 7일
 *   node docs/fetch-events.mjs --json     원본도 저장 (docs/events-export.json)
 *   node docs/fetch-events.mjs --html     **사람별 이동 경로 대시보드** (docs/events-dashboard.html)
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
 * `--html` — 사람별 이동 경로가 보이는 대시보드를 파일로 뽑는다.
 *
 * 왜 필요한가: 터미널 출력은 **집계**다. "몇 명이 어디까지 갔나"는 답하지만
 * **"이 사람이 어떻게 움직였나"**는 답하지 못한다. 관찰 3명을 하고 나서
 * "그 사람이 앱에서 뭘 눌렀는지"를 보려면 사람 단위 타임라인이 있어야 한다.
 *
 * GA4를 붙이는 대신 이걸 만든 이유: 우리 `events`에는 **uid·시각·이벤트·값이 전부 있다.**
 * 데이터가 부족한 게 아니라 보여주는 방법이 없었을 뿐이다. GA4의 사용자 탐색기는
 * 되긴 하지만 샘플링·보존기간(기본 2개월) 제한이 있고, 개인정보 수집 성격이 달라진다.
 */
const HTML저장 = 인자.includes("--html");
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
        uid: f.uid?.stringValue ?? null,
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
/**
 * 세션과 사람은 다른 숫자다.
 *
 * `sid`는 sessionStorage라 **탭을 닫으면 사라진다** — 같은 사람이 아침·저녁에 한 번씩
 * 열면 2세션이다. `uid`는 익명 인증이 브라우저에 붙여주는 값이라 그 사람을 가로지른다.
 * 지금까지 이 스크립트는 uid를 아예 읽지 않아서 **「몇 명이 왔나」를 답할 수 없었다.**
 * 퍼널 도달률은 세션 기준이 맞지만(한 번의 방문 안에서 어디까지 갔나),
 * 「고유 사용자」를 말하려면 uid가 필요하다.
 *
 * ⚠️ uid도 사람과 1:1은 아니다. 브라우저를 바꾸거나 저장소를 비우면 새로 발급된다.
 *    **실제 사람 수의 상한**으로 읽는다.
 */
const 고유uid = new Set(이벤트.map((e) => e.uid).filter(Boolean)).size;
console.log(
  `이벤트 ${이벤트.length}건 · 세션 ${new Set(이벤트.map((e) => e.sid)).size}개 · 고유 사용자(uid) ${고유uid}명\n`
);

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

/**
 * 유입 경로 — `?ref=salon` 처럼 붙여 보낸 것.
 *
 * ⚠️ **한 세션의 이벤트가 전부 같은 ref를 갖지 않는다.** `readRef()`는 이벤트를 찍는
 *    순간의 주소창을 읽는데, 이 앱은 정적 export라 링크를 누르면 진짜 페이지 로드가
 *    일어나고 `?ref=`가 주소에서 사라진다. 그래서 첫 화면 이벤트만 ref를 갖고
 *    그 뒤로는 전부 "direct"가 된다.
 *
 * ⚠️ 그러므로 「그 세션의 첫 이벤트」를 봐야 하는데, **Firestore가 돌려주는 순서는
 *    문서 id 순이지 시간 순이 아니다.** 정렬 안 하고 find로 집으면 뒤쪽 "direct"를
 *    집어서 미용실에서 온 방문이 direct로 둔갑한다. 관찰 나가서 링크를 갈라 뿌리는
 *    운영에서 이건 조용히 틀리는 종류의 오류다.
 *
 * 세션 안에서 **시간 순으로 처음 나오는 direct 아닌 값**을 그 세션의 유입으로 본다.
 */
const ref별 = new Map();
for (const 목록 of 세션들.values()) {
  const r = 목록.find((e) => e.ref && e.ref !== "direct")?.ref ?? "direct";
  ref별.set(r, (ref별.get(r) ?? 0) + 1);
}
console.log("\n유입 경로 (세션)");
for (const [r, n] of [...ref별].sort((a, z) => z[1] - a[1])) {
  console.log(`  ${맞춤(r, 24)} ${String(n).padStart(4)}`);
}

/* ── 사람별 이동 경로 대시보드 ─────────────────────────────────── */
if (HTML저장) {
  const 지도2 = 카탈로그();
  const 제품명 = (e) => {
    if (!e.value) return "";
    return 지도2.get(e.value)?.name ?? e.value;
  };
  const 라벨 = {
    app_open: "앱 열기",
    concern_select: "고민 선택",
    prescription_view: "처방 봄",
    shelf_add: "화장대 등록",
    verdict_answer: "판정 응답",
    outbound_click: "공식몰로 나감",
    product_view: "제품 봄",
  };
  const 색 = {
    outbound_click: "#8a3324",
    prescription_view: "#2c5c3f",
    verdict_answer: "#2c5c3f",
    shelf_add: "#2c5c3f",
  };

  // uid별로 묶고, 마지막 활동이 최근인 사람부터
  const 사람별 = new Map();
  for (const e of 이벤트) {
    const u = e.uid ?? "(uid 없음)";
    if (!사람별.has(u)) 사람별.set(u, []);
    사람별.get(u).push(e);
  }
  const 사람들 = [...사람별.entries()]
    .map(([uid, evs]) => {
      evs.sort((a, z) => String(a.at).localeCompare(String(z.at)));
      const refs = [...new Set(evs.map((e) => e.ref).filter((r) => r && r !== "direct"))];
      return {
        uid,
        evs,
        ref: refs[0] ?? "direct",
        sessions: new Set(evs.map((e) => e.sid)).size,
        out: evs.filter((e) => e.name === "outbound_click").length,
        last: evs[evs.length - 1]?.at ?? "",
      };
    })
    .sort((a, z) => String(z.last).localeCompare(String(a.last)));

  const esc = (t) =>
    String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const 짧은시각 = (t) => (t ? new Date(t).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "");

  const 사람HTML = 사람들
    .map((p, i) => {
      const 줄 = p.evs
        .map((e) => {
          const c = 색[e.name] ?? "#6b6259";
          const v = 제품명(e);
          return `<li><span class="t">${esc(짧은시각(e.at))}</span><b style="color:${c}">${esc(라벨[e.name] ?? e.name)}</b>${v ? `<span class="v">${esc(v)}</span>` : ""}</li>`;
        })
        .join("");
      return `<details ${i < 3 ? "open" : ""}>
  <summary><b>#${i + 1}</b> <code>${esc(p.uid).slice(0, 10)}…</code>
    <span class="chip">유입 ${esc(p.ref)}</span>
    <span class="chip">방문 ${p.sessions}회</span>
    <span class="chip">이벤트 ${p.evs.length}</span>
    ${p.out > 0 ? `<span class="chip out">공식몰 ${p.out}</span>` : ""}
  </summary>
  <ol class="tl">${줄}</ol>
</details>`;
    })
    .join("\n");

  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>RIVEA 사용자 이동 경로</title><style>
*{box-sizing:border-box}body{margin:0;padding:24px;background:#faf8f5;color:#1c1815;
font:15px/1.6 -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",sans-serif;max-width:900px;margin-inline:auto}
h1{font-size:22px;margin:0 0 4px}.sub{color:#6b6259;font-size:14px;margin-bottom:20px}
.cards{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px}
.card{flex:1;min-width:120px;background:#fff;border:1px solid #e8e2d9;border-radius:8px;padding:14px}
.card .n{font-size:26px;font-weight:700}.card .l{font-size:13px;color:#6b6259;margin-top:2px}
details{background:#fff;border:1px solid #e8e2d9;border-radius:8px;margin-bottom:8px}
summary{cursor:pointer;padding:12px 14px;list-style:none;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
summary::-webkit-details-marker{display:none}
code{background:#f2eee7;padding:2px 6px;border-radius:4px;font-size:13px}
.chip{font-size:12px;color:#6b6259;background:#f2eee7;padding:2px 8px;border-radius:99px}
.chip.out{background:#8a3324;color:#fff}
.tl{margin:0;padding:0 14px 14px 34px}
.tl li{margin:3px 0;font-size:14px}
.tl .t{color:#a09589;font-size:12px;margin-right:8px;font-variant-numeric:tabular-nums}
.tl .v{color:#6b6259;margin-left:6px}
</style></head><body>
<h1>RIVEA 사용자 이동 경로</h1>
<p class="sub">${esc(날짜(시각[0]))} ~ ${esc(날짜(시각.at(-1)))} · 사람 단위 타임라인 (uid는 브라우저마다 발급되는 익명 식별자라 실제 사람 수의 상한이다)</p>
<div class="cards">
  <div class="card"><div class="n">${사람들.length}</div><div class="l">고유 사용자</div></div>
  <div class="card"><div class="n">${세션들.size}</div><div class="l">방문(세션)</div></div>
  <div class="card"><div class="n">${이벤트.length}</div><div class="l">이벤트</div></div>
  <div class="card"><div class="n">${이벤트.filter((e) => e.name === "outbound_click").length}</div><div class="l">공식몰 이동</div></div>
</div>
${사람HTML || "<p>아직 데이터가 없습니다.</p>"}
</body></html>`;

  const 경로H = 루트 + "docs/events-dashboard.html";
  writeFileSync(경로H, html);
  console.log(`\n대시보드 → docs/events-dashboard.html (${사람들.length}명)`);
  console.log(`   열기: open docs/events-dashboard.html`);
}

if (원본저장) {
  const 경로 = 루트 + "docs/events-export.json";
  writeFileSync(경로, JSON.stringify(이벤트, null, 2));
  console.log(`\n원본 → docs/events-export.json (${이벤트.length}건)`);
}
console.log();
