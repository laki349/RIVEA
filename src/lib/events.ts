import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { auth, db } from "./firebase";

/**
 * 최소 계측.
 *
 * 왜 필요한가 — 지금까지 우리가 가진 건 "32명이 이걸 원한다고 답했다"뿐이다.
 * "그래서 실제로 몇 명이 어디까지 갔다"가 없다. 그게 없으면 두 가지를 못 한다.
 *  ① 9/2 피칭에서 도달률을 못 보여준다 (`docs/16` C-1)
 *  ② 제조사에게 "귀사 제품으로 M명 보냈습니다"를 못 말한다. 그럼 협상 재료가 "고객 0명"뿐이다
 *
 * ⚠️ **개인정보를 한 필드도 넣지 않는다.** 익명 uid + 이벤트명 + 값 하나 + 시각까지만.
 *    leads와 달리 여기엔 연락처가 없으므로 사고의 성격이 다르지만, 넣기 시작하면 같아진다.
 *
 * ⚠️ **심은 날부터만 쌓인다.** 나중에 넣으면 그 전 트래픽은 통째로 유실이다.
 *
 * 구조는 `leads.ts`와 같다 — 서버가 없으니(정적 export) 브라우저에서 Firestore로 바로 쓴다.
 * 보호도 같은 두 겹이다: 규칙에서 create만 허용 + 익명 인증 요구.
 */

/**
 * 기록하는 이벤트. **문자열을 아무 데서나 지어내지 않는다.**
 * 여기 없는 이름을 쓰면 나중에 집계할 때 오타 하나로 통계가 갈라진다.
 *
 * 4단계 퍼널(`docs/16` C-1)이 핵심이고 나머지는 부수 지표다.
 */
export type EventName =
  // ── 4단계 퍼널
  | "concern_select" // ① 고민을 골랐다
  | "prescription_view" // ② 처방(추천 결과)에 닿았다
  | "shelf_add" // ③ 화장대에 등록했다
  | "verdict_answer" // ④ 판정 카드에 답했다
  // ── 아웃바운드 (제조사 협상 재료)
  | "outbound_click" // 공식몰로 나갔다
  // ── 진입·이탈 파악
  | "app_open" // 세션 시작
  | "product_view"; // 제품 상세를 봤다

/**
 * 이벤트에 딸리는 값 하나. 예: 고민 slug, 제품 id, 판정 답("continue"|"stop"|"unsure").
 * **자유 텍스트를 넣지 않는다.** 사용자가 입력한 문자열이 들어오면 그 순간 개인정보가 될 수 있다.
 */
export type EventValue = string | null;

/** 유입 경로. `?ref=insta` 처럼 붙여 보낸다. leads.ts와 같은 규약 */
const readRef = (): string => {
  if (typeof window === "undefined") return "direct";
  const v = new URLSearchParams(window.location.search).get("ref");
  return (v ?? "direct").slice(0, 40);
};

/**
 * 세션 구분자. 브라우저 세션 동안만 유지되는 난수다.
 * uid는 익명 인증 재발급 시 바뀔 수 있어서, 한 번의 방문을 묶으려면 이게 따로 필요하다.
 * sessionStorage라 탭을 닫으면 사라진다 — 추적 목적이 아니라 퍼널 연결용이다.
 */
const SESSION_KEY = "rivea_sid";
const readSid = (): string => {
  if (typeof window === "undefined") return "ssr";
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = Math.random().toString(36).slice(2, 12);
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
};

/**
 * 같은 이벤트가 한 세션에서 여러 번 찍히는 걸 막는다.
 * 화면 전환·리렌더로 `prescription_view`가 다섯 번 찍히면 도달률이 부풀려진다.
 * 도달률은 "몇 명이 갔나"이지 "몇 번 갔나"가 아니다.
 *
 * ⚠️ **메모리만으로는 부족하다.** 이 앱은 정적 export라 링크를 누르면 SPA 전환이 아니라
 *    진짜 페이지 로드가 일어난다. 그때 이 Set이 통째로 초기화되므로 `app_open`이
 *    페이지마다 한 번씩 찍혔다 — 실측에서 몇 초 사이에 9건이 들어왔다.
 *    그러면 **퍼널의 분모가 「사람 수」가 아니라 「페이지뷰」가 되고, 도달률이 거짓이 된다.**
 *    그래서 세션을 넘어 살아남아야 하는 것은 sessionStorage에 적는다.
 *    (탭을 닫으면 사라진다 — 추적이 아니라 한 번의 방문을 묶는 용도다. sid와 같은 수명)
 */
const seen = new Set<string>();

const SEEN_KEY = "rivea_seen";
const readSeen = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
};
const markSeen = (key: string) => {
  try {
    const list = readSeen();
    if (!list.includes(key)) sessionStorage.setItem(SEEN_KEY, JSON.stringify([...list, key]));
  } catch {
    // 사파리 프라이빗 모드 등에서 막히면 메모리 Set으로만 버틴다. 계측이 앱을 막지 않는다
  }
};

/**
 * 계측은 **절대 사용자 경험을 막지 않는다.**
 * 기록이 실패해도 화면은 그대로 돌아가야 한다. 그래서 await하지 않고 에러를 삼킨다.
 * (leads는 반대다 — 거기선 실패가 보여야 한다. 사람이 회신을 기다리니까)
 */
export function track(name: EventName, value: EventValue = null): void {
  if (typeof window === "undefined") return;

  const key = `${name}:${value ?? ""}`;
  if (seen.has(key)) return;
  // 페이지 로드를 넘어 한 번만 찍혀야 하는 것은 sessionStorage로도 막는다
  if (readSeen().includes(key)) return;
  seen.add(key);
  markSeen(key);

  void (async () => {
    try {
      if (!auth.currentUser) await signInAnonymously(auth);
      await addDoc(collection(db, "events"), {
        name,
        value: value ? value.slice(0, 60) : null,
        sid: readSid(),
        ref: readRef(),
        uid: auth.currentUser?.uid ?? null,
        createdAt: serverTimestamp(),
      });
    } catch {
      // 조용히 버린다. 계측 실패로 앱이 멈추면 계측이 손해다
    }
  })();
}

/**
 * 세션에 한 번만 찍는 게 아니라 매번 찍어야 하는 이벤트용.
 * 아웃바운드 클릭은 같은 제품을 두 번 눌렀으면 두 번이 맞다 — 협상 재료가 "클릭 수"라서.
 */
export function trackRepeat(name: EventName, value: EventValue = null): void {
  const key = `${name}:${value ?? ""}`;
  seen.delete(key);
  try {
    sessionStorage.setItem(SEEN_KEY, JSON.stringify(readSeen().filter((k) => k !== key)));
  } catch {
    // 위와 같다. 막히면 메모리 Set만으로 간다
  }
  track(name, value);
}
