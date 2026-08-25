import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  brandOf,
  comparableDevices,
  concernOf,
  discountRate,
  hasRealPhoto,
  modelLabel,
  productImage,
  products,
  routines,
  won,
  buyUrlOf,
} from "@/data/catalog";
import Icon from "@/components/Icon";
import ImageSlot from "@/components/ImageSlot";
import AppBar from "@/components/AppBar";
import RoutineCard from "@/components/RoutineCard";
import BuyBar from "@/components/BuyBar";
import Track from "@/components/Track";
import TrackRecent from "@/components/TrackRecent";
import ActiveBars from "@/components/ActiveBars";
import MyReview from "@/components/MyReview";
import ShelfConflict from "@/components/ShelfConflict";
import ArticleLink from "@/components/ArticleLink";
import { articlesForProduct } from "@/data/magazine";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

/**
 * 공유용 메타데이터. 카톡·문자로 링크를 보냈을 때 뜨는 미리보기 카드가 여기서 나온다.
 * 정적 export라도 빌드 시점에 각 상품 HTML의 <head>에 그대로 구워진다.
 *
 * 가격을 설명에 넣는 건 판단이 필요했다 — 커머스 공유에서 가장 궁금한 값이라 넣되,
 * **카톡이 카드를 캐시하므로 가격을 바꾸면 옛 카드가 한동안 남는다.**
 * 실서비스에서는 가격 변경 시 캐시 갱신이 필요하다.
 */
export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const p = products.find((x) => x.id === params.id);
  if (!p) return {};
  const brand = brandOf(p.brand);
  const rate = discountRate(p);
  const concern = p.concerns[0] ? concernOf(p.concerns[0]).name : null;

  const title = `${brand.name} ${modelLabel(p)}`;
  const price = rate ? `${rate}% 할인 ${won(p.price)}원` : `${won(p.price)}원`;
  const description = concern
    ? `${concern} 고민에 ${p.keyIngredient}. ${price} · 리베아`
    : `${p.keyIngredient}. ${price} · 리베아`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/product/${p.id}`,
      images: [{ url: `/images/product/${p.image}`, alt: p.name }],
    },
  };
}

/** 고민별 대표 리뷰 (더미) */

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();

  const brand = brandOf(product.brand);
  const rate = discountRate(product);
  const mainConcern = concernOf(product.concerns[0]);
  // 성분이 겹치는 기사 우선, 없으면 고민이 겹치는 기사
  const productArticle = articlesForProduct(product)[0];
  const real = product.source;
  // 「구매」 버튼 하나의 목적지. 없으면 버튼을 그리지 않는다 (buyUrlOf 주석)
  const buyHref = buyUrlOf(product);
  /**
   * 브랜드 공식몰로 나가나, 가격비교(다나와)로 나가나.
   *
   * 공식몰 주소를 확인하지 못한 브랜드가 있고, 그건 지어내지 않고 비워뒀다.
   * 그 상태에서 「○○ 공식몰에서 진행돼요」라고 쓰면 화면이 거짓말을 한다 —
   * 실제로는 여러 판매처가 붙은 비교 페이지로 나간다. 문구를 목적지에 맞춘다.
   */
  const viaOfficial = Boolean(real?.officialUrl ?? brand.officialUrl);

  /**
   * 비교표는 디바이스에만 (docs/07 수정안 5).
   * 화장품은 저관여 소비재라 비교가 구매 판단을 돕지 않고, 디바이스는 내구재라 돕는다.
   * 축은 2개로 줄인다 (수정안 6) — 스펙을 나열하면 인지 부담만 늘어난다.
   */
  const rivals =
    real && product.category === "device"
      ? comparableDevices
          .filter((p) => p.id !== product.id)
          // 다른 브랜드를 먼저 보여준다. 같은 브랜드 라인업만 비교하면
          // 「브랜드 중립」이 화면에서 증명되지 않는다
          .sort((a, b) => Number(a.brand === product.brand) - Number(b.brand === product.brand))
          .slice(0, 2)
      : [];

  // 비교 축 2개: 작동 방식과 무게. 둘 다 측정 가능하고, 고르는 기준이 실제로 갈리는 항목
  const compareAxes = ["작동 방식", "무게"];
  const specValue = (p: typeof product, label: string) =>
    p.specs?.find((s) => s.label === label)?.value ?? "—";

  // 함께 쓰면 좋은 루틴
  const relatedRoutines = routines.filter((r) =>
    r.steps.some((s) => s.productId === product.id)
  );

  return (
    <>
      {/* 최근 본 상품으로 기록 (렌더 없음) */}
      <TrackRecent kind="product" id={product.id} />
      {/* 계측 — 4단계 퍼널 밖의 부수 지표. 어느 제품이 열리는지가 입점 협상 재료가 된다 */}
      <Track name="product_view" value={product.id} />
      <AppBar
        title={brand.name}
        share={{ title: `${brand.name} ${modelLabel(product)}`, text: `${won(product.price)}원` }}
      />

      <main className="flex-1">
        {/* 갤러리 */}
        <section className="relative border-b border-hairline">
          <ImageSlot
            className="h-[300px] w-full"
            src={productImage(product.id)}
            alt={`${brand.name} ${product.name}`}
          />
          {/*
            실사진일 때는 출처를 노출한다. 브랜드 저작물이라 협찬 오인과
            무단 사용 인상을 동시에 줄여야 한다 (ProductSource.imageUrl 주석).
            실사진이 아니면 유형 이미지이므로 그렇게 밝힌다 — 실제 제품 사진인 척하지 않는다.
          */}
          <span className="absolute bottom-[10px] right-3 rounded bg-[rgba(28,24,21,0.55)] px-[9px] py-[3px] text-[14px] text-white">
            {hasRealPhoto(product) ? "📷 브랜드·판매처 제공 이미지" : "제품 유형 이미지"}
          </span>
        </section>

        {/* 기본 정보 */}
        <section className="border-b border-hairline px-4 pb-[14px] pt-4">
          <Link href={`/brand/${brand.slug}`} className="flex items-center gap-1 text-[15px] text-meta">
            {brand.name} <Icon name="chevron-right" size={14} />
          </Link>
          <h2 className="mb-[7px] mt-[5px] text-[20px] font-bold leading-[1.4] text-ink">
            {product.name}
          </h2>
          <div className="mb-2 flex items-baseline gap-[7px]">
            {product.listPrice && (
              <span className="text-[17px] text-disabled line-through">{won(product.listPrice)}</span>
            )}
            {rate !== null && rate > 0 && <span className="text-[20px] font-bold text-rose">{rate}%</span>}
            <span className="text-[24px] font-bold text-ink">{won(product.price)}</span>
          </div>
          {/*
            ⚠️ 평점·리뷰수·조회수를 뺐다 (2026-08-25). 셋 다 **우리가 지어낸 값**이었고,
            상품 100종의 리뷰 합계가 106만 건에 평점 4.0 미만이 하나도 없었다.
            논문 PMID까지 열어 근거 등급을 매기는 앱이 화면에서 가장 크게 읽히는 숫자를
            창작하고 있으면, 근거표 전체가 같이 의심받는다.
            실제 리뷰가 쌓이기 전까지 **없는 게 정확하다.**
          */}
          <div className="mt-[11px] flex flex-wrap gap-[6px]">
            {product.tags.map((t) => (
              <span key={t} className="rounded border border-line px-[9px] py-1 text-[14px] text-body">
                # {t}
              </span>
            ))}
          </div>
        </section>

        {/*
          결제·배송 안내.

          전에는 이 자리에 「카드사 즉시할인 최대 10%」·「리베아 포인트 1% 적립 예상」과
          브랜드별 배송비가 있었다. 셋 다 우리가 지어낸 값이다. 구매 버튼이 공식몰로
          나가게 된 순간(2026-08-25) 이건 단순 데모값이 아니라 **거짓 안내**가 된다 —
          우리 화면에서 적립을 약속하고 다른 가게로 보내는 꼴이기 때문이다.

          그래서 숫자를 지우고 **어디서 무엇이 정해지는지**만 남겼다.
          가격에 확인 시점을 붙이는 건 「이 가격이 지금도 맞나」에 대한 정직한 답이다.
        */}
        <section className="border-b border-hairline px-4 py-1">
          {[
            {
              // 전에는 결제·배송이 각각 한 행이었는데, 두 행이 사실상 같은 말을 두 번 했다
              // ("공식몰에서 진행돼요" / "주문·배송 조회도 공식몰에서"). 한 행으로 합친다.
              label: "결제·배송",
              value: (
                <>
                  <b className="font-bold">
                    {viaOfficial ? `${brand.name} 공식몰` : "가격비교에 연결된 판매처"}
                  </b>
                  에서 진행돼요
                  <span className="block text-[15px] text-meta">
                    배송비·주문조회도 그쪽 기준입니다 · 리베아는 수수료를 받지 않아요
                  </span>
                </>
              ),
            },
            {
              label: "가격",
              value: (
                <>
                  {real?.priceNote ?? "판매처 표시가"}
                  <span className="block text-[15px] text-meta">
                    {real?.pricedAt ? `${real.pricedAt} 확인 · ` : ""}
                    최종 가격·재고는 {viaOfficial ? "공식몰" : "판매처"} 표시를 따릅니다
                  </span>
                </>
              ),
            },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className={`flex gap-3 py-[13px] ${i < arr.length - 1 ? "border-b border-subtle" : ""}`}
            >
              <span className="w-[56px] flex-shrink-0 text-[15px] text-meta">{row.label}</span>
              <span className="flex-1 text-[16px] leading-[1.5] text-ink">{row.value}</span>
            </div>
          ))}
        </section>

        {/* 제품 사양 — 실제 시판 제품. 공개된 물리량만 */}
        {real && product.specs && (
          <section className="border-b border-hairline px-4 py-4">
            <h3 className="mb-[9px] text-[18px] font-bold text-ink">제품 사양</h3>
            <dl className="text-[16px]">
              {product.specs.map((s, i, arr) => (
                <div
                  key={s.label}
                  className={`flex gap-3 py-[11px] ${
                    i < arr.length - 1 ? "border-b border-subtle" : ""
                  }`}
                >
                  <dt className="w-[92px] flex-shrink-0 text-meta">{s.label}</dt>
                  <dd className="flex-1 leading-[1.5] text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[15px] leading-[1.6] text-meta">
              브랜드가 공개한 사양이에요. 효능·효과에 관한 내용은 담지 않았어요.
            </p>
          </section>
        )}

        {/*
          디바이스 스펙 비교 — 중개형의 존재 이유.
          공정위 비교표시·광고 심사지침: 비교 항목·기준·시점을 명시하고
          객관적으로 확인 가능한 사항만 비교한다. 축은 2개 (docs/07 수정안 6).
          우열 판단 문구는 넣지 않는다 — 사용자가 스스로 고르게 한다.
        */}
        {rivals.length > 0 && (
          <section className="border-b border-hairline pb-4">
            <div className="px-4 pb-3 pt-4">
              <h3 className="text-[18px] font-bold text-ink">다른 기기와 나란히 보기</h3>
              <p className="mt-[3px] text-[15px] leading-[1.6] text-meta">
                작동 방식과 무게 기준 · 가격은 {real!.pricedAt} 확인
              </p>
            </div>
            <div className="px-4">
              <table className="w-full table-fixed border-collapse text-[15px]">
                <thead>
                  <tr>
                    <td className="w-[68px]" />
                    <td className="rounded-t bg-ink px-1 py-[7px] text-center font-bold leading-[1.3] text-on-ink">
                      이 기기
                    </td>
                    {rivals.map((r) => (
                      <td key={r.id} className="px-1 py-[7px] text-center leading-[1.3] text-body">
                        {brandOf(r.brand).name}
                        <br />
                        <span className="text-meta">{modelLabel(r)}</span>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareAxes.map((label) => (
                    <tr key={label} className="border-t border-hairline">
                      <td className="py-2 pr-1 align-top text-meta">{label}</td>
                      <td className="bg-bg-tint px-1 py-2 text-center font-medium leading-[1.4] text-ink">
                        {specValue(product, label)}
                      </td>
                      {rivals.map((r) => (
                        <td key={r.id} className="px-1 py-2 text-center leading-[1.4] text-body">
                          {specValue(r, label)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="border-t border-hairline">
                    <td className="py-2 pr-1 text-meta">가격</td>
                    <td className="bg-bg-tint px-1 py-2 text-center font-medium text-ink">
                      {won(product.price)}
                    </td>
                    {rivals.map((r) => (
                      <td key={r.id} className="px-1 py-2 text-center text-body">
                        {won(r.price)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <p className="mt-3 text-[15px] leading-[1.6] text-meta">
                공개된 사양과 판매가만 비교했어요. 어느 쪽이 더 낫다는 판단은 담지 않았고,
                효능·효과는 비교 대상이 아니에요.
              </p>
            </div>
          </section>
        )}

        {/* 성분이 하는 일 — 성분별 작용 지점 + 고민 태그 (디바이스는 표시하지 않음) */}
        <ActiveBars product={product} />

        {/* 성분·용법 — 접지 않고 펼침.
            실제 시판 제품의 사용법은 만들지 않는다. 기기 오사용은 안전 문제라
            브랜드 공식 안내로 넘긴다. */}
        <section className="border-b border-hairline px-4 py-4">
          <h3 className="mb-[9px] text-[18px] font-bold text-ink">성분·용법</h3>
          <p className="text-[16px] leading-[1.6] text-body">{product.usage}</p>
          <p className="mt-2 text-[15px] leading-[1.6] text-meta">
            핵심성분: {product.keyIngredient} · 용량: {product.volume}
          </p>

          {/* 매거진 — 이 성분을 왜 이 나이대에 쓰는지 */}
          {productArticle && (
            <div className="mt-4">
              <ArticleLink article={productArticle} heading="이 성분 알아보기" />
            </div>
          )}
        </section>

        {/* 내 화장대와의 조합 — 성분을 본 직후가 "같이 써도 되나"를 묻는 자리다 */}
        <ShelfConflict productId={product.id} />

        {/*
          리뷰 — **내가 쓴 것만.** 예시 리뷰(sampleReviews)와 평점·리뷰수를 전부 내렸다.
          「리뷰 0건」이 「리뷰 41,200건(창작)」보다 낫다. 그게 실제 상태이기도 하고.
        */}
        <section className="border-b border-hairline px-4 py-4">
          <h3 className="mb-[9px] text-[18px] font-bold text-ink">리뷰</h3>
          <MyReview productId={product.id} />
          <p className="text-[16px] leading-[1.6] text-meta">
            아직 리뷰를 모으지 않습니다. 준비 중인 서비스라 쌓인 후기가 없어요.
          </p>
        </section>

        {/* 함께 쓰면 좋은 루틴 */}
        {relatedRoutines.length > 0 && (
          <section className="pb-4">
            <div className="px-4 pb-3 pt-4">
              <h3 className="text-[18px] font-bold text-ink">이 상품이 담긴 루틴</h3>
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
      <BuyBar
        kind="product"
        id={product.id}
        price={product.price}
        buyHref={buyHref}
        brandName={viaOfficial ? brand.name : undefined}
      />
    </>
  );
}
