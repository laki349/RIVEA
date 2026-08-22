"use client";

import { useEffect } from "react";
import { track, type EventName, type EventValue } from "@/lib/events";

/**
 * 화면 도달을 기록하는 조각.
 *
 * 왜 컴포넌트로 만드나 — 제품 상세·레이아웃 같은 **서버 컴포넌트에서는 훅을 못 쓴다**
 * (정적 export라 대부분이 서버 컴포넌트다). 이 조각 하나를 끼워 넣으면 그 자리에서 기록된다.
 *
 * 아무것도 그리지 않는다. 레이아웃에 영향을 주면 계측이 화면을 바꾸는 셈이 된다.
 */
export default function Track({ name, value = null }: { name: EventName; value?: EventValue }) {
  useEffect(() => {
    track(name, value);
  }, [name, value]);
  return null;
}
