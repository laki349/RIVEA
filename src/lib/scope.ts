"use client";

/**
 * 저장 스코프 — localStorage를 로그인 계정(uid)별로 나눈다.
 *
 * 이게 없을 때의 문제: 장바구니·찜·주문이 브라우저 단위 키 하나에 들어 있어서
 * **로그인해도 아무것도 달라지지 않았다.** 게스트와 회원이 같은 데이터를 봤고,
 * 한 폰을 모녀가 같이 쓰면 서로의 장바구니가 섞인다. 로그인의 값이 0이면 로그인 화면은 장식이다.
 *
 * 익명 인증을 켜둔 덕에 방문자는 누구나 uid를 갖는다. 그래서 스코프는 거의 항상 uid이고,
 * uid가 없는 구간(인증 확인 전·로그아웃 직후)은 예전 키를 그대로 쓴다.
 *
 * 서버가 없으니(정적 export) 격리는 어디까지나 화면상의 것이다. 같은 브라우저의
 * 다른 계정 데이터를 개발자도구로 열어보는 건 막지 못한다 — Firestore로 옮길 때
 * 보안 규칙이 그 역할을 한다.
 */

let scope: string | null = null;
const reloaders = new Set<(uid: string | null) => void>();

/** 현재 스코프(uid). null이면 인증 전 구간 */
export function currentScope(): string | null {
  return scope;
}

/**
 * 스코프가 바뀔 때 자기 데이터를 다시 읽어야 하는 스토어를 등록한다.
 * 등록 즉시 현재 스코프로 한 번 호출한다 — 늦게 로드된 모듈도 상태를 맞춘다.
 */
export function registerScoped(reload: (uid: string | null) => void) {
  reloaders.add(reload);
  reload(scope);
  return () => reloaders.delete(reload);
}

export function setScope(next: string | null) {
  if (next === scope) return;
  scope = next;
  reloaders.forEach((reload) => reload(next));
}

/**
 * 스코프는 그대로인데 저장된 내용이 밖에서 바뀐 경우 다시 읽게 한다.
 *
 * 필요한 이유: 로그인은 두 단계로 일어난다. ① Firebase가 인증 상태를 바꾸면
 * `AuthScope`가 새 uid로 스코프를 옮기고(그 계정의 빈 데이터를 읽는다),
 * ② 그 다음에 게스트 데이터가 병합된다. ②의 결과를 화면이 모르면
 * **방금 합친 장바구니가 새로고침 전까지 안 보인다.**
 */
export function refreshScoped() {
  reloaders.forEach((reload) => reload(scope));
}

function keyOf(base: string, uid: string | null) {
  return uid ? `${base}:${uid}` : base;
}

/**
 * 스코프 키에서 읽는다. 해당 uid 데이터가 아직 없고 예전 비스코프 키에 데이터가 있으면
 * **그 데이터를 이 uid의 것으로 옮긴다**(한 번만). 스코프 도입 전에 담아둔 장바구니가
 * 첫 로그인에서 사라지지 않게 하는 처리다.
 */
export function readScoped<T>(base: string, uid: string | null, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(keyOf(base, uid));
    if (raw !== null) return JSON.parse(raw) as T;
    if (uid) {
      const legacy = window.localStorage.getItem(base);
      if (legacy !== null) {
        window.localStorage.setItem(keyOf(base, uid), legacy);
        window.localStorage.removeItem(base);
        return JSON.parse(legacy) as T;
      }
    }
  } catch {
    /* 파싱 불가 → fallback */
  }
  return fallback;
}

export function writeScoped(base: string, uid: string | null, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(keyOf(base, uid), JSON.stringify(value));
  } catch {
    /* 저장 불가 환경 무시 */
  }
}

export function clearScoped(base: string, uid: string | null) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(keyOf(base, uid));
  } catch {
    /* 무시 */
  }
}
