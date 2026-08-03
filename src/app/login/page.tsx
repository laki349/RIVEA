"use client";

import { Suspense } from "react";
import AppBar from "@/components/AppBar";
import LoginRoute from "./LoginRoute";

/**
 * 로그인 라우트 — 게스트가 마이페이지에서 다시 로그인할 때, 그리고
 * 장바구니·결제(회원 전용)에서 막혔을 때 들어온다.
 * 온보딩 3번째 패널과 같은 LoginPanel을 쓴다.
 */
export default function LoginPage() {
  return (
    <>
      <AppBar title="로그인" search={false} />
      <main className="flex-1">
        <Suspense fallback={null}>
          <LoginRoute />
        </Suspense>
      </main>
    </>
  );
}
