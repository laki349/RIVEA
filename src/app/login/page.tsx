"use client";

import { useRouter } from "next/navigation";
import AppBar from "@/components/AppBar";
import LoginPanel from "@/components/auth/LoginPanel";

/**
 * 로그인 라우트 — 게스트가 마이페이지에서 다시 로그인할 때 들어온다.
 * 온보딩 3번째 패널과 같은 LoginPanel을 쓴다.
 */
export default function LoginPage() {
  const router = useRouter();

  return (
    <>
      <AppBar title="로그인" search={false} />
      <main className="flex-1">
        <LoginPanel compact onAuthed={() => router.replace("/mypage")} />
      </main>
    </>
  );
}
