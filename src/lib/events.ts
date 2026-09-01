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
  | "product_view" // 제품 상세를 봤다
  /**
   * ── 첫 방문 튜토리얼 (components/Tour.tsx)
   *
   * 이 셋은 기능 계측이 아니라 **설문을 읽기 위한 축**이다.
   * `docs/19` 판정 기준 1번이 「친구한테 한 문장으로 설명」으로 포지셔닝 전달을 재는데,
   * 튜토리얼을 본 사람은 그 문장을 배운 뒤에 답한다. 갈라서 읽지 않으면 그 숫자가 거짓이 된다.
   */
  | "tutorial_start" // 튜토리얼이 떴다
  | "tutorial_done" // 끝까지 봤다
  | "tutorial_skip"; // 건너뛰었다

/**
 * 이벤트에 딸리는 값 하나. 예: 고민 slug, 제품 id, 판정 답("continue"|"stop"|"unsure").
 * **자유 텍스트를 넣지 않는다.** 사용자가 입력한 문자열이 들어오면 그 순간 개인정보가 될 수 있다.
 */
export type EventValue = string | null;

/**
 * sessionStorage 안전 래퍼.
 *
 * 저장소 접근은 **예외를 던질 수 있다** — 사파리 프라이빗 모드, 쿠키 차단, 일부
 * 인앱 브라우저(인스타·카카오)에서 실제로 던진다. 계측 코드가 그 예외에 걸려
 * 죽으면 계측만 죽는 게 아니라 **그 사실조차 아무도 모른다.**
 * 그래서 읽기·쓰기를 전부 여기로 통과시키고, 막히면 메모리로 버틴다.
 */
const memo = new Map<string, string>();
const safeSession = {
  get(key: string): string | null {
    try {
      return sessionStorage.getItem(key) ?? memo.get(key) ?? null;
    } catch {
      return memo.get(key) ?? null;
    }
  },
  set(key: string, value: string): void {
    memo.set(key, value);
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // 메모리에는 이미 담았다. 페이지를 넘기면 사라지지만 없는 것보단 낫다
    }
  },
};

/**
 * 유입 경로. `?ref=insta` 처럼 붙여 보낸다. leads.ts와 같은 규약.
 *
 * ⚠️ **첫 화면에서 세션에 붙잡아둔다.** 정적 export라 링크를 누르면 진짜 페이지 로드가
 *    일어나고 `?ref=`가 주소에서 사라진다. 그래서 예전엔 첫 이벤트만 ref를 갖고
 *    나머지는 전부 "direct"였고, 집계 쪽(`docs/fetch-events.mjs`)이 세션 안에서
 *    direct 아닌 첫 값을 찾아 메우고 있었다.
 *
 *    그 보정은 **첫 이벤트가 실제로 저장됐을 때만** 동작한다. 인증이 늦어 `app_open`이
 *    유실되면 그 세션의 유입은 통째로 direct가 된다 — 인스타로 뿌린 링크의 성과가
 *    조용히 0이 되는 경로다. 그래서 저장 성공 여부와 무관하게 **읽는 순간 세션에 적어둔다.**
 */
const REF_KEY = "rivea_ref";
let refMemo: string | null = null;

const readRef = (): string => {
  if (typeof window === "undefined") return "direct";
  if (refMemo) return refMemo;

  const fromUrl = new URLSearchParams(window.location.search).get("ref");
  const stored = safeSession.get(REF_KEY);
  // 주소에 있으면 그게 우선이다(같은 세션에서 다른 경로로 다시 들어온 경우)
  const ref = (fromUrl ?? stored ?? "direct").slice(0, 40);

  refMemo = ref;
  if (ref !== "direct") safeSession.set(REF_KEY, ref);
  return ref;
};

/**
 * 세션 구분자. 브라우저 세션 동안만 유지되는 난수다.
 * uid는 익명 인증 재발급 시 바뀔 수 있어서, 한 번의 방문을 묶으려면 이게 따로 필요하다.
 * sessionStorage라 탭을 닫으면 사라진다 — 추적 목적이 아니라 퍼널 연결용이다.
 */
const SESSION_KEY = "rivea_sid";
let sidMemo: string | null = null;

const readSid = (): string => {
  if (typeof window === "undefined") return "ssr";
  if (sidMemo) return sidMemo;

  // ⚠️ 예전엔 sessionStorage를 직접 불렀다. **이게 던지면 이벤트가 통째로 유실된다** —
  //    readSid()는 아래 async try 안에서 호출되므로 예외가 조용히 삼켜지고, 결과적으로
  //    저장소가 막힌 브라우저(사파리 프라이빗, 일부 인앱 브라우저)에서는 계측이 0이 된다.
  //    화면은 멀쩡하고 숫자만 없는, 알아채기 가장 어려운 종류의 실패다.
  //    저장소가 막혀도 메모리 sid로 그 페이지 안의 이벤트는 묶인다.
  let sid = safeSession.get(SESSION_KEY);
  if (!sid) {
    sid = Math.random().toString(36).slice(2, 12);
    safeSession.set(SESSION_KEY, sid);
  }
  sidMemo = sid;
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
    return JSON.parse(safeSession.get(SEEN_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
};
const markSeen = (key: string) => {
  const list = readSeen();
  if (!list.includes(key)) safeSession.set(SEEN_KEY, JSON.stringify([...list, key]));
};

/**
 * 계측은 **절대 사용자 경험을 막지 않는다.**
 * 기록이 실패해도 화면은 그대로 돌아가야 한다. 그래서 await하지 않고 에러를 삼킨다.
 * (leads는 반대다 — 거기선 실패가 보여야 한다. 사람이 회신을 기다리니까)
 */
/**
 * 익명 인증을 **한 번만** 시도한다.
 *
 * 예전엔 이벤트마다 `if (!auth.currentUser) await signInAnonymously(auth)`를 돌렸다.
 * 첫 화면에서 이벤트 여러 개가 동시에 뜨면 로그인 요청이 그만큼 병렬로 나가고,
 * 실패하는 환경에서는 그 실패가 이벤트 수만큼 반복된다.
 * 진행 중인 약속을 하나 붙들어 공유한다.
 */
let authOnce: Promise<unknown> | null = null;
const ensureAuth = (): Promise<unknown> => {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);
  if (!authOnce) {
    authOnce = signInAnonymously(auth).catch((e) => {
      // 다음 이벤트에서 다시 시도할 수 있게 풀어준다 (일시적 네트워크 실패 대비)
      authOnce = null;
      throw e;
    });
  }
  return authOnce;
};

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
      await ensureAuth();
      await addDoc(collection(db, "events"), {
        name,
        value: value ? value.slice(0, 60) : null,
        sid: readSid(),
        ref: readRef(),
        uid: auth.currentUser?.uid ?? null,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      // 화면은 멈추지 않는다. 다만 **완전히 조용하지는 않게** 한다 —
      // 인스타로 링크를 뿌려놓고 일주일 뒤에 "데이터가 하나도 없네"를 발견하는 게
      // 이 앱에서 가장 비싼 실패다. 개발자도구를 열면 바로 보이게 표시만 남긴다.
      if (typeof console !== "undefined") {
        console.warn("[rivea:track] 계측 저장 실패", name, e);
      }
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
  safeSession.set(SEEN_KEY, JSON.stringify(readSeen().filter((k) => k !== key)));
  track(name, value);
}
