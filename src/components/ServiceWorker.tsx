"use client";

import { useEffect } from "react";

/**
 * 서비스워커 등록 — 렌더하는 건 없다.
 *
 * 개발 중에는 등록하지 않는다. dev 서버에서 서비스워커가 화면을 캐시하면
 * 코드를 고쳐도 옛 화면이 뜨고, 원인을 찾는 데 한참 걸린다.
 * (오늘 HMR 하이드레이션 문제로 한 번 헤맸던 것과 같은 종류의 함정이다.)
 */
export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    // 첫 화면 렌더와 경쟁하지 않도록 로드가 끝난 뒤 등록한다
    const register = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
