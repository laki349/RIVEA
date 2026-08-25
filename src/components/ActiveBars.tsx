import { type Product } from "@/data/catalog";
import { activeInfo, gradeLabel, pctLabel } from "@/data/actives";

/**
 * 「성분이 하는 일」 — 상품 상세에서 성분 하나하나가 어느 고민 쪽 성분인지 한 줄로 본다.
 *
 * 왜 필요한가: 지금 상세에는 `keyIngredient` 문자열 하나("나이아신아마이드 5%")만 있고,
 * 그게 뭘 하는 성분인지는 어디에도 없다. 40대+ 사용자가 성분명을 보고 판단하려면
 * 검색을 따로 해야 한다 — 그 검색을 앱 안으로 가져온다.
 *
 * ⚠️ 표현의 선은 `data/actives.ts` 주석 참고. 결과를 약속하지 않고 작용 지점만 적는다.
 *
 * ⚠️ **디바이스에는 붙이지 않는다.** 기기에 효능을 붙이는 건 2019년 식약처
 * 시정명령(비의료용 LED 마스크 48개)의 사유 그 자체다.
 *
 * ## 2026-08-25 — 근거를 지우지 않고 접었다
 *
 * 실제로 써보니 이 섹션 하나가 상세 페이지 2,906px 중 **942px(32%)**를 먹고 있었다.
 * 성분 하나당 등급·주장·단서·출처가 전부 같은 무게로 펼쳐져 있었고, 성분이 셋이면
 * 그게 세 번 반복된다. 읽을 게 많은 게 아니라 **어디부터 읽을지가 없는** 상태였다.
 *
 * 그렇다고 근거를 빼면 이 앱이 하는 일이 없어진다 — 「효과 모르겠다」 72%(`docs/15`)에
 * 답하는 게 정확히 이 자리다. 그래서 **지우지 않고 접는다.**
 *
 *  - 펼쳐둔 것: 성분명 · 함량 · 역할 한 줄 · 근거 등급 배지 → **훑어서 비교되는 층**
 *  - 접은 것: 주장 · 단서 · 출처 → 한 번 눌러 여는 층
 *
 * `<details>`를 쓴다. JS 없이 동작하므로 정적 export와 맞고, 키보드·스크린리더가
 * 기본으로 지원한다. 40대+ 대상이라 `<summary>`는 44px 터치 타깃을 확보한다.
 *
 * **고민 태그(기미·잡티 등)는 뺐다.** 성분마다 붙어서 같은 태그가 세 번 반복됐는데,
 * 페이지 위쪽 해시태그 줄에 이미 있다. 같은 정보를 두 번 그리는 게 번잡함의 절반이었다.
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
        <h3 className="mb-[6px] text-[18px] font-bold text-ink">성분이 하는 일</h3>
        <p className="text-[16px] leading-[1.6] text-meta">
          브랜드가 주요 성분과 함량을 공개하지 않았어요.
        </p>
      </section>
    );
  }

  const rows = actives.map((a) => ({ a, info: activeInfo[a.key] })).filter((x) => x.info);

  return (
    <section className="border-b border-hairline px-4 py-4">
      <div className="mb-[10px] flex items-baseline justify-between">
        <h3 className="text-[18px] font-bold text-ink">성분이 하는 일</h3>
        <span className="text-[15px] text-meta">함량은 공개된 값만</span>
      </div>

      <ul className="flex flex-col">
        {rows.map(({ a, info }, i) => {
          const pct = pctLabel(a.pct);
          const ev = info.evidence;

          return (
            <li
              key={a.key}
              className={i < rows.length - 1 ? "border-b border-subtle pb-3" : ""}
              style={i > 0 ? { paddingTop: 12 } : undefined}
            >
              {/* ── 훑는 층: 이름 · 함량 · 등급 ── */}
              <div className="flex flex-wrap items-center gap-x-[7px] gap-y-1">
                <span className="text-[17px] font-bold text-ink">{info.name}</span>
                {pct && (
                  <span className="rounded bg-subtle px-[7px] py-[2px] text-[15px] font-medium text-ink">
                    {pct}
                  </span>
                )}
                {ev && (
                  <span className="rounded bg-ink px-[6px] py-[2px] text-[14px] font-medium text-on-ink">
                    근거 {ev.grade}
                  </span>
                )}
              </div>
              <p className="mt-[3px] text-[16px] leading-[1.55] text-soft">{info.role}</p>

              {/*
                여는 층. 단서(caveat)를 접는 것과 빼는 것은 다르다 —
                유리한 절반만 싣는 게 광고이고, 여기서는 두 절반이 같은 자리에 함께 열린다.
              */}
              {ev && (
                <details className="group mt-[6px]">
                  <summary className="press flex h-11 cursor-pointer list-none items-center gap-[6px] text-[16px] text-body [&::-webkit-details-marker]:hidden">
                    <span className="text-[15px] text-meta">{gradeLabel[ev.grade]}</span>
                    {info.verdictWeeks && (
                      <span className="rounded border border-line px-[7px] py-[1px] text-[15px] text-body">
                        {info.verdictWeeks}주쯤 판정
                      </span>
                    )}
                    <span className="ml-auto text-[15px] text-meta">
                      <span className="group-open:hidden">근거 보기 ›</span>
                      <span className="hidden group-open:inline">접기</span>
                    </span>
                  </summary>

                  <div className="border-l-2 border-subtle pl-[10px]">
                    <p className="text-[16px] leading-[1.55] text-body">{ev.claim}</p>
                    {ev.caveat && (
                      <p className="mt-[5px] text-[15px] leading-[1.55] text-meta">
                        같이 알아둘 것 — {ev.caveat}
                      </p>
                    )}
                    <p className="mt-[5px] break-words text-[14px] leading-[1.5] text-meta">
                      출처 · {ev.source}
                    </p>
                  </div>
                </details>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-3 border-t border-subtle pt-[10px] text-[15px] leading-[1.6] text-meta">
        작용 지점만 적었어요. 효과는 사람마다 다르고, 근거는 동료심사 논문만 씁니다.
      </p>
    </section>
  );
}
