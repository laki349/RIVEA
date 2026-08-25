import Link from "next/link";
import { brandOf, discountRate, modelLabel, productImage, won, type Product } from "@/data/catalog";
import ImageSlot from "./ImageSlot";
import Icon from "./Icon";
import WishButton from "./WishButton";

/**
 * 상품 카드 — 직사각 그리드용 (각진 이미지, 뱃지·하트 오버레이)
 */
export default function ProductCard({
  product,
  rank,
  imageClassName = "h-[168px]",
  showRating = true,
}: {
  product: Product;
  rank?: number;
  imageClassName?: string;
  showRating?: boolean;
}) {
  const rate = discountRate(product);
  const badge = product.badges.find((b) => b === "빠른배송" || b === "단독");

  return (
    <Link href={`/product/${product.id}`} className="press-card block">
      <div className="relative">
        <ImageSlot
          className={`w-full ${imageClassName}`}
          src={productImage(product.id)}
          alt={`${brandOf(product.brand).name} ${product.name}`}
        />
        {rank !== undefined && (
          <span className="absolute left-0 top-0 flex h-[22px] min-w-[22px] items-center justify-center bg-ink px-[6px] text-[14px] font-medium text-on-ink">
            {rank}
          </span>
        )}
        {badge && (
          <span className="absolute bottom-2 left-2 rounded-badge bg-ink px-[6px] py-[3px] text-[14px] font-medium text-on-ink">
            {badge}
          </span>
        )}
        <WishButton kind="product" id={product.id} variant="overlay" />
      </div>
      <div className="px-1 pb-[14px] pt-2">
        <p className="text-[15px] font-bold text-ink">{brandOf(product.brand).name}</p>
        <p className="mb-[5px] mt-[2px] truncate text-[15px] leading-[1.35] text-soft">
          {modelLabel(product)}
        </p>
        <div className="mb-[6px] flex items-baseline gap-[5px]">
          {rate !== null && rate > 0 && (
            <span className="text-[17px] font-bold text-rose">{rate}%</span>
          )}
          <span className="text-[17px] font-bold text-ink">{won(product.price)}</span>
        </div>
        {showRating && (
          <p className="flex items-center gap-1 text-[14px] text-meta">
            <span className="text-ink">
              <Icon name="star" size={12} />
            </span>
            {product.rating} ({won(product.reviewCount)})
          </p>
        )}
      </div>
    </Link>
  );
}
