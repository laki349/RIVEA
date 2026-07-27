import Link from "next/link";
import ImageSlot from "./ImageSlot";
import { ChevronRight } from "./Icons";
import { media } from "@/data/media";

export default function PromoBanner({
  eyebrow,
  title,
  desc,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-cocoa text-ivory">
      <div className="grid items-center md:grid-cols-2">
        <div className="p-7 sm:p-10">
          <h2 className="font-serif text-2xl font-semibold leading-snug text-ivory sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-champagne">
            {desc}
          </p>
          <Link
            href={href}
            className="mt-6 inline-flex items-center gap-1 rounded-xl bg-ivory px-5 py-2.5 text-[14px] font-semibold text-cocoa transition hover:bg-cream"
          >
            {cta}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="p-4 sm:p-6">
          <ImageSlot
            src={media.promo || undefined}
            alt={title}
            ratio="aspect-[16/10]"
            label="기획전 이미지 자리"
            tone="dark"
            sizes="(max-width: 768px) 100vw, 560px"
          />
        </div>
      </div>
    </section>
  );
}
