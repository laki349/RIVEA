import Link from "next/link";
import { concernOf, type Product } from "@/data/catalog";
import { activeInfo, gradeLabel, pctLabel } from "@/data/actives";
import Icon from "./Icon";

/**
 * 「성분이 하는 일」 — 상품 상세에서 성분 하나하나가 어느 고민 쪽 성분인지 한 줄로 본다.
 *
 * 왜 필요한가: 지금 상세에는 `keyIngredient` 문자열 하나("나이아신아마이드 5%")만 있고,
 * 그게 뭘 하는 성분인지는 어디에도 없다. 40대+ 사용자가 성분명을 보고 판단하려면
 * 검색을 따로 해야 한다 — 그 검색을 앱 안으로 가져온다.
 *
 * ⚠️ 표현의 선은 `data/actives.ts` 주석 참고. 결과를 약속하지 않고 작용 지점만 적는다.
 * 고민 태그는 효능 주장이 아니라 **그 고민 화면으로 가는 링크**다.
 *
 * ⚠️ **디바이스에는 붙이지 않는다.** 기기에 효능을 붙이는 건 2019년 식약처
 * 시정명령(비의료용 LED 마스크 48개)의 사유 그 자체다.
 */
export default function ActiveBars({ product }: { product: Product }) {
  if (product.category === "device") return null;

  const actives = product.actives ?? [];

  // 브랜드가 성분을 공개하지 않은 제품 — 없는 걸 지어내지 않고 그렇다고 말한다.
  // 이 앱은 함량 공개를 세일즈 포인트로 쓰는 브랜드(아누아·폴라초이스)를 다루므로,
  // 공개하지 않은 쪽을 공백으로 두면 오히려 차이가 안 보인다.
  //
  // 단, **스킨케어에서만** 이 말을 한다. 클렌저·샴푸·이너뷰티는 애초에 핵심 성분
  // 함량으로 팔지 않는 제품군이라, 거기서 "공개하지 않았어요"는 없는 잘못을 지적하는 게 된다.
  if (actives.length === 0 && product.category !== "skincare") return null;

  if (actives.length === 0) {
    return (
      <section className="border-b border-hairline px-4 py-4">
        <h3 className="mb-[10px] text-[18px] font-bold text-ink">성분이 하는 일</h3>
        <p className="text-[16px] leading-[1.6] text-meta">
          이 제품은 브랜드가 주요 성분과 함량을 공개하지 않았어요.
          <br />
          공개된 제품은 이 자리에 성분별 역할이 표시돼요.
        </p>
      </section>
    );
  }

  return (
    <section className="border-b border-hairline px-4 py-4">
      <div className="mb-[10px] flex items-baseline justify-between">
        <h3 className="text-[18px] font-bold text-ink">성분이 하는 일</h3>
        <span className="text-[15px] text-meta">함량은 공개된 값만</span>
      </div>

      {actives.map((a) => {
        const info = activeInfo[a.key];
        if (!info) return null;
        const pct = pctLabel(a.pct);

        return (
          <div key={a.key} className="mb-[10px] last:mb-0">
            {/* 성분명 + 함량 + 고민 태그 한 줄 */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="flex items-center gap-[5px] text-[17px] font-bold text-ink">
                <span className="text-ink">
                  <Icon name="check" size={15} />
                </span>
                {info.name}
              </span>
              {pct && (
                <span className="rounded bg-subtle px-[7px] py-[2px] text-[15px] font-medium text-ink">
                  {pct}
                </span>
              )}
              {info.concerns.map((slug) => (
                <Link
                  key={slug}
                  href={`/concern/${slug}`}
                  className="press rounded border border-line px-[8px] py-[2px] text-[15px] text-body"
                >
                  {concernOf(slug).name}
                </Link>
              ))}
            </div>
            <p className="ml-[20px] mt-[2px] text-[16px] leading-[1.55] text-soft">{info.role}</p>

            {/*
              근거. 「효과 모르겠다」가 설문 최대 신호(72%)였고, 그 답은 더 센 카피가 아니라
              **누가 몇 명에게 확인했고 언제쯤 답이 오는가**다. 그래서 등급·출처·단서를 같이 낸다.
              단서(caveat)를 빼지 않는 게 핵심이다 — 유리한 절반만 실으면 광고가 된다.
            */}
            {info.evidence && (
              <div className="ml-[20px] mt-[6px] border-l-2 border-subtle pl-[10px]">
                <p className="mb-[3px] flex flex-wrap items-center gap-[6px]">
                  <span className="rounded bg-ink px-[6px] py-[2px] text-[14px] font-medium text-on-ink">
                    근거 {info.evidence.grade}
                  </span>
                  <span className="text-[15px] text-meta">{gradeLabel[info.evidence.grade]}</span>
                  {info.verdictWeeks && (
                    <span className="rounded border border-line px-[7px] py-[1px] text-[15px] text-body">
                      {info.verdictWeeks}주쯤 판정
                    </span>
                  )}
                </p>
                <p className="text-[16px] leading-[1.55] text-body">{info.evidence.claim}</p>
                {info.evidence.caveat && (
                  <p className="mt-[3px] text-[15px] leading-[1.55] text-meta">
                    같이 알아둘 것 — {info.evidence.caveat}
                  </p>
                )}
                <p className="mt-[3px] text-[14px] leading-[1.5] text-meta">
                  출처 · {info.evidence.source}
                </p>
              </div>
            )}
          </div>
        );
      })}

      <p className="mt-3 border-t border-subtle pt-[10px] text-[15px] leading-[1.6] text-meta">
        성분이 어디서 작용하는지만 적었어요. 효과는 사람마다 달라요.
        <br />
        근거는 브랜드 자체 시험을 빼고 동료심사 논문만 씁니다. 정리가 안 끝난 성분은 비워뒀어요.
      </p>
    </section>
  );
}
