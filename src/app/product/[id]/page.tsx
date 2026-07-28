import Link from "next/link";
import { notFound } from "next/navigation";
import {
  brandOf,
  concernOf,
  discountRate,
  productImage,
  products,
  routines,
  won,
} from "@/data/catalog";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import AppBar from "@/components/AppBar";
import RoutineCard from "@/components/RoutineCard";
import BuyBar from "@/components/BuyBar";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

/** 고민별 대표 리뷰 (더미) */
const sampleReviews: Record<string, { meta: string; text: string }> = {
  pigment: {
    meta: "5.0 · 52세 · 건성",
    text: "두 달 쓰니 눈가 잡티가 확실히 옅어졌어요. 자극 없이 순해서 계속 쓸 것 같아요.",
  },
  wrinkle: {
    meta: "5.0 · 48세 · 복합성",
    text: "아침에 쓰고 나가면 화장이 잘 먹어요. 턱선이 좀 정리된 느낌이라 꾸준히 쓰는 중입니다.",
  },
  dry: {
    meta: "4.5 · 55세 · 건성",
    text: "저녁에 바르고 자면 아침까지 안 당겨요. 향도 은은해서 부담 없습니다.",
  },
  sun: {
    meta: "5.0 · 51세 · 민감성",
    text: "백탁 없이 발리고 눈 시림이 없어요. 덧발라도 밀리지 않아 매일 씁니다.",
  },
  pore: {
    meta: "4.5 · 47세 · 지성",
    text: "볼 모공이 확 줄진 않아도 피부결이 매끈해졌어요. 순해서 매일 쓰기 좋아요.",
  },
  "scalp-hair": {
    meta: "5.0 · 58세 · 두피 예민",
    text: "정수리 볼륨이 조금씩 사는 게 보여요. 두피가 시원하고 가렵지 않아 좋습니다.",
  },
  inner: {
    meta: "4.5 · 50세",
    text: "8주째 먹는 중인데 피부가 덜 푸석해요. 젤리 타입이라 챙겨 먹기 편합니다.",
  },
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();

  const brand = brandOf(product.brand);
  const rate = discountRate(product);
  const mainConcern = concernOf(product.concerns[0]);
  const review = sampleReviews[mainConcern.slug];

  // 같은 고민 대안 (비교표)
  const rivals = products
    .filter((p) => p.id !== product.id && p.concerns.includes(mainConcern.slug))
    .slice(0, 2);

  // 함께 쓰면 좋은 루틴
  const relatedRoutines = routines.filter((r) =>
    r.steps.some((s) => s.productId === product.id)
  );

  return (
    <>
      <AppBar title={brand.name} />

      <main className="flex-1">
        {/* 갤러리 */}
        <section className="relative border-b border-hairline">
          <ImageSlot
            className="h-[300px] w-full"
            src={productImage(product.id)}
            alt={`${brand.name} ${product.name}`}
          />
          <span className="absolute bottom-[10px] right-3 rounded bg-[rgba(28,24,21,0.55)] px-[9px] py-[3px] text-[12px] text-white">
            1 / 5
          </span>
        </section>

        {/* 기본 정보 */}
        <section className="border-b border-hairline px-4 pb-[14px] pt-4">
          <Link href={`/brand/${brand.slug}`} className="flex items-center gap-1 text-[13px] text-meta">
            {brand.name} <Icon name="chevron-right" size={14} />
          </Link>
          <h2 className="mb-[7px] mt-[5px] text-[18px] font-bold leading-[1.4] text-ink">
            {product.name}
          </h2>
          <div className="mb-2 flex items-baseline gap-[7px]">
            {product.listPrice && (
              <span className="text-[15px] text-disabled line-through">{won(product.listPrice)}</span>
            )}
            {rate !== null && <span className="text-[18px] font-bold text-rose">{rate}%</span>}
            <span className="text-[22px] font-bold text-ink">{won(product.price)}</span>
          </div>
          <p className="mb-[5px] flex items-center gap-1 text-[13px] text-meta">
            <span className="text-ink">
              <Icon name="star" size={13} />
            </span>
            {product.rating} · 리뷰 {won(product.reviewCount)}건
          </p>
          <p className="text-[13px] text-meta">{won(Math.round(product.likes / 22))}명이 보고 있어요</p>
          <div className="mt-[11px] flex flex-wrap gap-[6px]">
            {product.tags.map((t) => (
              <span key={t} className="rounded border border-line px-[9px] py-1 text-[12px] text-body">
                # {t}
              </span>
            ))}
          </div>
        </section>

        {/* 혜택·배송 정보 행 */}
        <section className="border-b border-hairline px-4 py-1">
          {[
            {
              label: "결제혜택",
              value: (
                <>
                  카드사 즉시할인 <b className="font-bold">최대 10%</b>
                </>
              ),
            },
            {
              label: "적립",
              value: (
                <>
                  리베아 포인트 <b className="font-bold">1%</b> 적립 예상
                </>
              ),
            },
            {
              label: "배송",
              value: (
                <>
                  {won(brand.shippingFee)}원
                  {brand.freeShippingOver && (
                    <>
                      {" "}
                      · <b className="font-bold">{won(brand.freeShippingOver)}원 이상 무료</b>
                    </>
                  )}
                  <span className="block text-[13px] text-meta">평균 2~3일 이내 도착</span>
                </>
              ),
            },
            ...(product.badges.includes("빠른배송")
              ? [
                  {
                    label: "빠른배송",
                    value: (
                      <>
                        <b className="font-bold">지금 주문 시 내일 도착</b> 가능
                      </>
                    ),
                  },
                ]
              : []),
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className={`flex gap-3 py-[13px] ${i < arr.length - 1 ? "border-b border-subtle" : ""}`}
            >
              <span className="w-[56px] flex-shrink-0 text-[13px] text-meta">{row.label}</span>
              <span className="flex-1 text-[14px] leading-[1.5] text-ink">{row.value}</span>
              <span className="text-disabled">
                <Icon name="chevron-right" size={17} />
              </span>
            </div>
          ))}
        </section>

        {/* 브랜드 비교표 — 중개형의 핵심 */}
        {rivals.length > 0 && (
          <section className="border-b border-hairline pb-4">
            <div className="px-4 pb-3 pt-4">
              <h3 className="text-[16px] font-bold text-ink">같은 고민, 브랜드 비교</h3>
              <p className="mt-[3px] text-[12px] text-meta">
                {mainConcern.name} 제품 {rivals.length + 1}종을 나란히
              </p>
            </div>
            <div className="px-4">
              <table className="w-full table-fixed border-collapse text-[12px]">
                <thead>
                  <tr>
                    <td className="w-[60px]" />
                    <td className="rounded-t bg-ink px-1 py-[7px] text-center font-bold text-on-ink">
                      {brand.name}
                      <br />
                      (이 상품)
                    </td>
                    {rivals.map((r) => (
                      <td key={r.id} className="px-1 py-[7px] text-center text-body">
                        {brandOf(r.brand).name}
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ["가격", (p: typeof product) => won(p.price)],
                      ["핵심성분", (p: typeof product) => p.keyIngredient],
                      ["용량", (p: typeof product) => p.volume],
                      ["평점", (p: typeof product) => String(p.rating)],
                    ] as const
                  ).map(([label, get]) => (
                    <tr key={label} className="border-t border-hairline">
                      <td className="py-2 pr-1 text-meta">{label}</td>
                      <td className="bg-bg-tint px-1 py-2 text-center font-medium text-ink">
                        {get(product)}
                      </td>
                      {rivals.map((r) => (
                        <td key={r.id} className="px-1 py-2 text-center text-body">
                          {get(r)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 성분·용법 — 접지 않고 펼침 */}
        <section className="border-b border-hairline px-4 py-4">
          <h3 className="mb-[9px] text-[16px] font-bold text-ink">성분·용법</h3>
          <p className="text-[14px] leading-[1.6] text-body">{product.usage}</p>
          <p className="mt-2 text-[13px] leading-[1.6] text-meta">
            핵심성분: {product.keyIngredient} · 용량: {product.volume}
          </p>
        </section>

        {/* 리뷰 */}
        <section className="border-b border-hairline px-4 py-4">
          <div className="mb-[11px] flex items-baseline justify-between">
            <h3 className="text-[16px] font-bold text-ink">리뷰 {won(product.reviewCount)}</h3>
            <span className="text-[13px] text-meta">전체보기</span>
          </div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[26px] font-bold text-ink">{product.rating}</span>
            <span className="flex text-ink">
              {[...Array(5)].map((_, i) => (
                <Icon key={i} name="star" size={14} />
              ))}
            </span>
          </div>
          <div className="rounded border border-hairline px-3 py-[11px]">
            <p className="flex items-center gap-1 text-[13px] text-ink">
              <Icon name="star" size={12} /> {review.meta}
            </p>
            <p className="mt-[5px] text-[13px] leading-[1.6] text-body">{review.text}</p>
          </div>
        </section>

        {/* 함께 쓰면 좋은 루틴 */}
        {relatedRoutines.length > 0 && (
          <section className="pb-4">
            <div className="px-4 pb-3 pt-4">
              <h3 className="text-[16px] font-bold text-ink">이 상품이 담긴 루틴</h3>
            </div>
            <div className="rail flex gap-[11px] pl-4 pr-4">
              {relatedRoutines.map((r) => (
                <RoutineCard key={r.id} routine={r} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 하단 구매 바 — 담기 실동작 */}
      <BuyBar kind="product" id={product.id} likes={product.likes} price={product.price} />
    </>
  );
}
