"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 로드되면 떠오르는 이미지.
 *
 * 이 파일이 따로 있는 이유: `ImageSlot`은 서버 컴포넌트라 `onLoad` 같은
 * 이벤트 핸들러를 넘길 수 없다("Event handlers cannot be passed to Client
 * Component props"로 빌드가 깨진다). 핸들러를 클라이언트 경계 **안에서**
 * 정의하면 부모는 서버 컴포넌트로 남는다.
 *
 * ⚠️ `onLoad`만 믿으면 안 된다. 캐시된 이미지나 SSR HTML에 이미 있던 이미지는
 * **React가 핸들러를 붙이기 전에 로드가 끝나** onLoad가 영영 오지 않는다.
 * 그러면 이미지가 투명한 채로 남아 화면에서 사라진다(실제로 그렇게 만들었다가 잡았다).
 * 마운트 시 `complete`를 직접 확인하는 줄이 그래서 있다.
 *
 * 로드에 실패하면 투명한 채로 둔다 — 뒤의 웜 그레이 플레이스홀더가 그대로 보이고,
 * 이미지가 없는 슬롯과 같은 모습이 된다. 깨진 이미지 아이콘보다 낫다.
 */
export default function FadeImg({
  src,
  alt,
  position,
}: {
  src: string;
  alt: string;
  position: string;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 핸들러가 붙기 전에 이미 끝난 로드를 잡는다 (캐시·뒤로가기·SSR)
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      className={`h-full w-full object-cover transition-opacity duration-state ease-enter ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
      style={{ objectPosition: position }}
    />
  );
}
