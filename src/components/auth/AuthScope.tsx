"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setScope } from "@/lib/scope";

/**
 * 인증 상태를 저장 스코프에 연결한다 (`scope.ts`).
 *
 * 이 컴포넌트가 렌더하는 건 없다. 여기 없으면 로그인해도 스코프가 바뀌지 않아
 * 장바구니·찜·주문이 계정과 무관하게 한 통에 남는다 — 레이아웃에 한 번만 둔다.
 *
 * `useAuth`를 쓰지 않고 직접 구독하는 이유: 이 일은 렌더와 무관하고,
 * 리렌더 없이 최초 1회 구독으로 끝나는 편이 값싸다.
 */
export default function AuthScope() {
  useEffect(() => onAuthStateChanged(auth, (user) => setScope(user?.uid ?? null)), []);
  return null;
}
