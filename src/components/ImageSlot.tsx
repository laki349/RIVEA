// Image area with the brand's signature frame.
// - Pass `src` to show a real image (from /public).
// - Omit `src` to show the gold-hairline + "MC" monogram placeholder,
//   so empty slots still read as "Mature Care" rather than broken.
import Image from "next/image";

export default function ImageSlot({
  src,
  alt,
  label = "이미지 준비 중",
  className = "",
  ratio,
  rounded = "rounded-2xl",
  variant = "default",
  compact = false,
  tone = "light",
  sizes = "(max-width: 768px) 100vw, 600px",
  priority = false,
}: {
  src?: string;
  alt?: string;
  label?: string;
  className?: string;
  ratio?: string; // e.g. "aspect-square", "aspect-[4/3]"
  rounded?: string;
  variant?: "default" | "arch";
  compact?: boolean;
  tone?: "light" | "dark";
  sizes?: string;
  priority?: boolean;
}) {
  const shape =
    variant === "arch" ? "rounded-[999px_999px_1.25rem_1.25rem]" : rounded;
  const dark = tone === "dark";

  // ── Real image ──────────────────────────────────────────────
  if (src) {
    return (
      <div
        className={`relative overflow-hidden border ${
          dark ? "border-white/10" : "border-line"
        } ${shape} ${ratio ?? ""} ${className}`}
      >
        <Image
          src={src}
          alt={alt ?? label ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  // ── Placeholder ─────────────────────────────────────────────
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden border ${shape} ${
        dark
          ? "border-white/10 bg-gradient-to-b from-espresso to-[#231b16]"
          : "border-line bg-gradient-to-b from-cream to-champagne/60"
      } ${ratio ?? ""} ${className}`}
      role="img"
      aria-label={label || "이미지 자리"}
    >
      {/* signature gold hairline frame */}
      <div
        className={`pointer-events-none absolute inset-2.5 border ${
          dark ? "border-gold/30" : "border-gold-soft/45"
        } ${
          variant === "arch"
            ? "rounded-[999px_999px_0.75rem_0.75rem]"
            : "rounded-[calc(1rem-2px)]"
        }`}
      />
      {/* corner ticks */}
      <span
        className={`pointer-events-none absolute left-3.5 top-3.5 h-3 w-3 border-l border-t ${
          dark ? "border-gold-soft/50" : "border-gold/50"
        }`}
      />
      <span
        className={`pointer-events-none absolute bottom-3.5 right-3.5 h-3 w-3 border-b border-r ${
          dark ? "border-gold-soft/50" : "border-gold/50"
        }`}
      />

      {compact ? (
        <span className="relative font-serif text-[15px] font-bold tracking-tight text-gold/70">
          MC
        </span>
      ) : (
        <div className="relative flex flex-col items-center gap-2 text-center">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-full border font-serif text-[15px] font-bold tracking-tight ${
              dark ? "border-gold-soft/60 text-gold-soft" : "border-gold-soft/70 text-gold"
            }`}
          >
            MC
          </span>
          {label && (
            <span
              className={`text-[11px] font-medium uppercase tracking-[0.22em] ${
                dark ? "text-champagne/70" : "text-stone"
              }`}
            >
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
