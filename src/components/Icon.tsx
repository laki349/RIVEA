/**
 * 아이콘 — 단일 세트, 스트로크 1.7 고정 (이모지 금지 원칙)
 */
type IconName =
  | "search"
  | "bag"
  | "heart"
  | "heart-fill"
  | "home"
  | "grid"
  | "sparkle"
  | "user"
  | "chevron-right"
  | "chevron-left"
  | "chevron-down"
  | "star"
  | "star-fill"
  | "eye"
  | "check"
  | "bell"
  | "minus"
  | "plus"
  | "truck"
  | "message"
  | "ticket"
  | "coin"
  | "share"
  | "pause"
  | "play"
  | "info";

const paths: Record<IconName, React.ReactNode> = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.8-4.8" />
    </>
  ),
  bag: (
    <>
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.5-8.8-9C2 8 3.7 5 6.9 5c2 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.2 0 4.9 3 3.7 6-1.8 4.5-8.8 9-8.8 9Z" />
  ),
  "heart-fill": (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 20s-7-4.5-8.8-9C2 8 3.7 5 6.9 5c2 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.2 0 4.9 3 3.7 6-1.8 4.5-8.8 9-8.8 9Z"
    />
  ),
  home: (
    <>
      <path d="m4 11 8-7 8 7" />
      <path d="M6 9.5V20h12V9.5" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" />
      <rect x="13" y="4" width="7" height="7" />
      <rect x="4" y="13" width="7" height="7" />
      <rect x="13" y="13" width="7" height="7" />
    </>
  ),
  sparkle: (
    <path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3Z" />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20c1.5-3.5 4.2-5 7.5-5s6 1.5 7.5 5" />
    </>
  ),
  "chevron-right": <path d="m9 5 7 7-7 7" />,
  "chevron-left": <path d="m15 5-7 7 7 7" />,
  "chevron-down": <path d="m5 9 7 7 7-7" />,
  star: (
    <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5Z" />
  ),
  "star-fill": (
    <path
      fill="currentColor"
      stroke="none"
      d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5Z"
    />
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <path d="M12 7.6v.6" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2.5h-15L6 16Z" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v10H3V6Z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  message: (
    <path d="M4 5h16v11H9l-5 4V5Z" />
  ),
  ticket: (
    <>
      <path d="M4 7h16v3.5a1.5 1.5 0 0 0 0 3V17H4v-3.5a1.5 1.5 0 0 0 0-3V7Z" />
      <path d="M13 7v10" strokeDasharray="2 2.5" />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M9.5 10h3.7a1.7 1.7 0 0 1 0 3.4H9.5" />
    </>
  ),
  pause: (
    <>
      <path d="M9.5 5v14" />
      <path d="M14.5 5v14" />
    </>
  ),
  play: <path d="M8 5.5v13l11-6.5-11-6.5Z" />,
  share: (
    <>
      <path d="M12 4v11" />
      <path d="m8 8 4-4 4 4" />
      <path d="M6 12.5V20h12v-7.5" />
    </>
  ),
};

export default function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
