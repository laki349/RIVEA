import Link from "next/link";
import {
  type Product,
  brandById,
  discountRate,
  formatKRW,
} from "@/data/catalog";
import ImageSlot from "./ImageSlot";
import StarRating from "./StarRating";
import { HeartIcon } from "./Icons";

const badgeStyle: Record<NonNullable<Product["badge"]>, string> = {
  베스트: "bg-cocoa text-ivory",
  신상: "bg-gold text-white",
  단독: "bg-rose text-white",
  앵콜: "bg-white text-cocoa border border-line-strong",
};

export default function ProductCard({ product }: { product: Product }) {
  const brand = brandById(product.brandId);
  const off = discountRate(product);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block rounded-2xl transition"
    >
      <div className="relative">
        <ImageSlot
          src={product.image}
          alt={product.name}
          ratio="aspect-square"
          label="상품 이미지"
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 270px"
          className="transition duration-300 group-hover:border-gold-soft group-hover:shadow-card"
        />
        {product.badge && (
          <span
            className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeStyle[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
        <span className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-taupe opacity-0 shadow-soft backdrop-blur transition group-hover:opacity-100">
          <HeartIcon className="h-4 w-4" />
        </span>
      </div>

      <div className="px-0.5 pt-3">
        <p className="text-[12px] font-medium text-stone">{brand?.name}</p>
        <h3 className="mt-1 line-clamp-2 text-[14px] font-medium leading-snug text-cocoa transition group-hover:text-espresso">
          {product.name}
        </h3>

        {/* 가격 한 줄로: 할인율 · 판매가 · (원가) — 스캔이 쉽게 */}
        <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          {off > 0 && (
            <span className="text-[15px] font-bold text-rose">{off}%</span>
          )}
          <span className="text-[17px] font-bold text-espresso tabular-nums">
            {formatKRW(product.price)}
          </span>
          {off > 0 && (
            <span className="text-[12px] text-stone line-through tabular-nums">
              {formatKRW(product.listPrice)}
            </span>
          )}
        </div>

        <div className="mt-1.5">
          <StarRating value={product.rating} count={product.reviewCount} />
        </div>
      </div>
    </Link>
  );
}
