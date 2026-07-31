"use client";

/**
 * 로드되면 떠오르는 이미지.
 *
 * 이 파일이 따로 있는 이유: `ImageSlot`은 서버 컴포넌트라 `onLoad` 같은
 * 이벤트 핸들러를 넘길 수 없다("Event handlers cannot be passed to Client
 * Component props"로 빌드가 깨진다). 핸들러를 클라이언트 경계 **안에서**
 * 정의하면 부모는 서버 컴포넌트로 남는다.
 *
 * lazy 이미지가 툭 나타나면 느린 회선에서 화면이 계속 덜컹거린다.
 * 이미 캐시된 이미지는 onLoad가 곧바로 떨어져 깜빡임 없이 보인다.
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
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
      className="h-full w-full object-cover opacity-0 transition-opacity duration-state ease-enter"
      style={{ objectPosition: position }}
    />
  );
}
