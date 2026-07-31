"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { markSeen } from "@/lib/recent";

/**
 * "이 상품을 봤다"고 기록만 하는 컴포넌트. 렌더하는 건 없다.
 *
 * 상품·루틴 상세는 서버 컴포넌트라 훅을 쓸 수 없어서, 기록만 하는
 * 클라이언트 리프를 하나 끼운다. (FadeImg와 같은 이유의 분리)
 *
 * ⚠️ `ready`를 기다리는 이유: 페이지가 뜬 직후 몇백 ms 동안은 Firebase가 아직
 * 로그인 상태를 알려주지 않아 저장 스코프가 비어 있다. 그때 기록하면
 * **계정 밖 키(`rivea-recent`)에 쌓이고, 계정 키에 이미 목록이 있으면 그대로 버려진다.**
 * 실제로 그렇게 만들었다가 루틴 하나가 목록에서 사라지는 걸 보고 잡았다.
 * 사용자 조작이 필요한 담기·찜과 달리, 이 기록은 진입하자마자 자동으로 일어나서
 * 그 창에 정확히 걸린다.
 */
export default function TrackRecent({
  kind,
  id,
}: {
  kind: "product" | "routine";
  id: string;
}) {
  const { ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    markSeen(kind, id);
  }, [ready, kind, id]);

  return null;
}
