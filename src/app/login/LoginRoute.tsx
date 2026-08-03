"use client";

import { useRouter, useSearchParams } from "next/navigation";
import LoginPanel from "@/components/auth/LoginPanel";

/**
 * 로그인 라우트의 본체.
 *
 * `?next=`를 받는 이유: 장바구니·결제가 회원 전용이 되면서 **하던 일 도중에**
 * 로그인 화면으로 오게 됐다. 끝나고 마이페이지로 보내면 담으려던 상품 화면을
 * 다시 찾아 들어가야 한다 — 그건 로그인의 대가를 사용자가 치르는 것이다.
 *
 * 정적 export라 useSearchParams가 Suspense를 요구해서 파일을 나눴다.
 */
export default function LoginRoute() {
  const router = useRouter();
  const params = useSearchParams();

  // 외부 주소로 튕기지 않게 앱 내부 경로만 받는다
  const raw = params.get("next") ?? "";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/mypage";

  return <LoginPanel compact onAuthed={() => router.replace(next)} />;
}
