// Consistent stroke-based icon set (1.6px stroke, rounded).
// No emoji used anywhere in the UI — all vectors.
import type { SVGProps } from "react";
import type { IconKey } from "@/data/catalog";

type P = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const SearchIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

export const BagIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 8h12l-1 12H7L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const HeartIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 20s-7-4.6-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7-2.5C19 10.4 12 20 12 20Z" />
  </svg>
);

export const HomeIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 11 12 4l8 7" />
    <path d="M6 10v9h12v-9" />
  </svg>
);

export const GridIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  </svg>
);

export const UserIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="3.4" />
    <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
  </svg>
);

export const StarIcon = (p: P) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <path d="M12 3.5 14.6 9l6 .5-4.6 4 1.4 5.9L12 16.9 6.6 19.4 8 13.5l-4.6-4 6-.5L12 3.5Z" />
  </svg>
);

export const ChevronRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4 4 10-10" />
  </svg>
);

export const ReturnIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h11a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5H9" />
  </svg>
);

export const ChevronLeft = (p: P) => (
  <svg {...base} {...p}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);

export const TruckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 7h10v9H3z" />
    <path d="M13 10h4l3 3v3h-7" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </svg>
);

export const ShieldIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3.5 5.5 6v5.5c0 4 2.8 6.9 6.5 8.5 3.7-1.6 6.5-4.5 6.5-8.5V6L12 3.5Z" />
    <path d="m9.3 12 1.9 1.9 3.5-3.7" />
  </svg>
);

export const SlidersIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h10M18 7h2M4 12h4M12 12h8M4 17h8M16 17h4" />
    <circle cx="15" cy="7" r="1.8" />
    <circle cx="9" cy="12" r="1.8" />
    <circle cx="13" cy="17" r="1.8" />
  </svg>
);

export const SparkleIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 4c.6 3.2 1.8 4.4 5 5-3.2.6-4.4 1.8-5 5-.6-3.2-1.8-4.4-5-5 3.2-.6 4.4-1.8 5-5Z" />
    <path d="M18 14c.3 1.4.8 1.9 2.2 2.2-1.4.3-1.9.8-2.2 2.2-.3-1.4-.8-1.9-2.2-2.2 1.4-.3 1.9-.8 2.2-2.2Z" />
  </svg>
);

// ── Category icons ───────────────────────────────────────────
const CatDevice = (p: P) => (
  <svg {...base} {...p}>
    <rect x="7" y="3" width="10" height="14" rx="4" />
    <path d="M12 17v3M9 20h6" />
    <path d="M10.5 8.5 12 10l1.5-2.2" />
  </svg>
);
const CatSkincare = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 3h6v3l-1 1v2h-4V7L9 6V3Z" />
    <rect x="8" y="9" width="8" height="11" rx="3" />
    <path d="M10 13h4" />
  </svg>
);
const CatCover = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 4c4 0 6 3 6 7s-2.5 8-6 8-6-4-6-8 2-7 6-7Z" />
    <path d="M9.5 11.5c1.2 1 3.8 1 5 0" />
    <circle cx="15" cy="8.5" r="0.6" fill="currentColor" />
  </svg>
);
const CatWrinkle = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 9c3-1 5 1 8 0s5-2 8 0" />
    <path d="M4 14c3-1 5 1 8 0s5-2 8 0" />
  </svg>
);
const CatMask = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 5h12v3c0 6-3 11-6 11S6 14 6 8V5Z" />
    <path d="M9.5 10h1M13.5 10h1" />
    <path d="M10.5 14c.8.6 2.2.6 3 0" />
  </svg>
);
const CatSun = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4" />
  </svg>
);
const CatCleansing = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 10h10l-1 9H8l-1-9Z" />
    <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    <path d="M10.5 14h3" />
  </svg>
);
const CatInner = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21c4.5-2.5 7-5.8 7-9.5A3.5 3.5 0 0 0 12 8a3.5 3.5 0 0 0-7 3.5C5 15.2 7.5 18.5 12 21Z" />
    <path d="M12 8v13" />
  </svg>
);

const catMap: Record<IconKey, (p: P) => JSX.Element> = {
  device: CatDevice,
  skincare: CatSkincare,
  cover: CatCover,
  wrinkle: CatWrinkle,
  mask: CatMask,
  suncare: CatSun,
  cleansing: CatCleansing,
  inner: CatInner,
};

export function CategoryIcon({ name, ...rest }: { name: IconKey } & P) {
  const C = catMap[name];
  return <C {...rest} />;
}
