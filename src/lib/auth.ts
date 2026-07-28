"use client";

import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * 인증 상태 + 동작.
 *
 * 게스트는 Firebase 익명 인증(signInAnonymously)을 쓴다. 로컬 플래그가 아니라
 * 실제 uid가 발급되므로, 나중에 주문·찜을 서버로 옮길 때 게스트 데이터를
 * 정식 계정으로 승격(linkWithCredential)할 수 있다.
 */

export type AuthState = {
  user: User | null;
  /** 최초 상태 확인이 끝났는지 — 끝나기 전엔 로그인 UI를 깜빡이지 않는다 */
  ready: boolean;
  /** 익명(게스트) 로그인 상태 */
  isGuest: boolean;
  /** 이메일 또는 소셜로 로그인한 정식 계정 */
  isMember: boolean;
};

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
    return unsub;
  }, []);

  const isGuest = Boolean(user?.isAnonymous);
  return { user, ready, isGuest, isMember: Boolean(user) && !isGuest };
}

/** 마이페이지 등에 보여줄 이름 — 없으면 이메일 아이디, 그것도 없으면 게스트 */
export function displayNameOf(user: User | null): string {
  if (!user) return "게스트";
  if (user.isAnonymous) return "게스트";
  if (user.displayName) return user.displayName;
  return user.email?.split("@")[0] ?? "회원";
}

/** 이메일 일부를 가려서 보여준다 (seo****@gmail.com) */
export function maskEmail(email: string | null | undefined): string {
  if (!email) return "";
  const [id, domain] = email.split("@");
  if (!domain) return email;
  const head = id.slice(0, 3);
  return `${head}${"*".repeat(Math.max(1, id.length - 3))}@${domain}`;
}

export async function signUpWithEmail(email: string, password: string, name?: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name) await updateProfile(cred.user, { displayName: name });
  return cred.user;
}

export async function signInWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  return cred.user;
}

/**
 * 로컬 둘러보기 — Firebase Auth가 아직 준비되지 않았을 때의 폴백.
 *
 * 콘솔에서 Authentication을 켜지 않으면 익명 로그인이 CONFIGURATION_NOT_FOUND로 실패한다.
 * 그때 온보딩이 앱 전체를 막아버리면 안 되므로, 로컬 플래그로 통과시킨다.
 * 장바구니·찜이 이미 localStorage 기반이라 이 모드에서도 전 여정이 동작한다.
 */
const LOCAL_BROWSE_KEY = "rivea-local-browse";

export function isLocalBrowse(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(LOCAL_BROWSE_KEY) === "1";
  } catch {
    return false;
  }
}

function setLocalBrowse() {
  try {
    window.localStorage.setItem(LOCAL_BROWSE_KEY, "1");
  } catch {
    /* 저장 불가 환경 무시 */
  }
}

/** Auth가 켜져 있으면 익명 uid 발급, 아니면 로컬 둘러보기로 폴백한다. */
export async function signInAsGuest() {
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (e) {
    const code = (e as { code?: string })?.code ?? "";
    const notProvisioned =
      code === "auth/configuration-not-found" ||
      code === "auth/admin-restricted-operation" ||
      code === "auth/operation-not-allowed";
    if (!notProvisioned) throw e;
    // 개발자용 신호 — 사용자에게는 정상 진입으로 보인다.
    console.warn(
      "[RIVEA] 익명 로그인 불가(" + code + ") → 로컬 둘러보기로 진입. " +
        "Firebase 콘솔 > Authentication 에서 익명 로그인을 켜면 실제 uid가 발급됩니다."
    );
    setLocalBrowse();
    return null;
  }
}

export async function signOut() {
  await fbSignOut(auth);
}

/**
 * Firebase 인증 에러코드를 한국어로. 40대+ 대상이라 원인 + 다음 행동을 같이 준다.
 * (ui-ux-pro-max `error-clarity`: 원인과 해결 경로를 함께)
 */
export function authErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-email":
      return "이메일 형식이 올바르지 않아요. 다시 확인해 주세요.";
    case "auth/missing-password":
      return "비밀번호를 입력해 주세요.";
    case "auth/weak-password":
      return "비밀번호는 6자 이상으로 정해 주세요.";
    case "auth/email-already-in-use":
      return "이미 가입된 이메일이에요. 로그인으로 진행해 주세요.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "이메일 또는 비밀번호가 맞지 않아요.";
    case "auth/too-many-requests":
      return "시도가 많았어요. 잠시 후 다시 시도해 주세요.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "구글 로그인 창이 닫혔어요. 다시 시도해 주세요.";
    case "auth/popup-blocked":
      return "브라우저가 팝업을 막았어요. 팝업을 허용하거나 이메일로 로그인해 주세요.";
    case "auth/network-request-failed":
      return "네트워크 연결을 확인해 주세요.";
    case "auth/operation-not-allowed":
    case "auth/admin-restricted-operation":
      return "이 로그인 방식이 아직 켜져 있지 않아요. 다른 방식으로 시도해 주세요.";
    case "auth/configuration-not-found":
      // Firebase 콘솔에서 Authentication을 켜지 않은 상태. 사용자에게 내부 사정을 말하지 않는다.
      return "지금 로그인 준비가 되지 않았어요. 게스트로 둘러보실 수 있어요.";
    default:
      return "로그인에 실패했어요. 잠시 후 다시 시도해 주세요.";
  }
}
