"use client";

import { trackRepeat } from "@/lib/events";

/**
 * 「공식몰에서 보기」 — 결제를 우리가 받지 않고 브랜드·판매처로 내보낸다.
 *
 * 왜 이게 기능이 아니라 **전략**인가 (`docs/16` §7 콜드스타트 ②③⑤):
 *  ① 계약 0건에서 시작하므로 우리가 팔 수 있는 물건이 없다. 그래도 안내는 할 수 있다
 *  ② 커머스 신규 기능 요청은 「딱히 없다」가 41%였다. 결제를 붙일 이유가 약하다
 *  ③ **이 클릭이 입점 협상의 유일한 재료다.** "고객 0명입니다"를 "귀사 제품 페이지로
 *     M명 보냈습니다"로 바꾸는 숫자가 여기서 나온다
 *
 * 그래서 `track`이 아니라 `trackRepeat`을 쓴다 — 도달률은 사람 수지만
 * 아웃바운드는 **클릭 수**가 맞다. 같은 제품을 두 번 눌렀으면 두 번이다.
 *
 * ⚠️ `rel="nofollow sponsored noopener"` — 제휴 관계가 아직 없어도 상업적 링크임을
 *    검색엔진에 밝힌다. 나중에 제휴가 붙어도 표기를 바꿀 필요가 없다.
 * ⚠️ 가격을 우리 화면 값으로 약속하지 않는다. 실제 가격은 저쪽이 정한다.
 */

/**
 * UTM을 붙인다 — **우리 로그만으로는 협상이 안 되기 때문이다.**
 *
 * `outbound_click`은 우리 Firestore에만 남는다. 협상 자리에서 그건 「우리 주장」이다.
 * UTM이 붙으면 같은 방문이 **브랜드 자기 애널리틱스에 `rivea / referral`로 잡힌다.**
 * 그 순간 숫자의 출처가 우리가 아니라 저쪽이 되고, 검증하라고 말할 수 있다.
 *
 * ⚠️ **개인 식별에 쓰일 수 있는 건 한 글자도 넣지 않는다.** uid·sid는 제외한다.
 *    URL은 저쪽 서버 로그·리퍼러·주소창에 그대로 남는다. 우리 DB와 성격이 다르다.
 *    `utm_content`에 넣는 제품 id는 우리 카탈로그 식별자라 사람과 무관하다.
 *
 * ⚠️ 이미 `utm_source`가 붙어 있으면 **덮어쓰지 않는다.** 그건 저쪽이 준 링크
 *    (제휴·이벤트 트래킹)라는 뜻이고, 우리가 지우면 저쪽 정산이 깨진다.
 *
 * ⚠️ 주소가 파싱되지 않으면 원본을 그대로 쓴다. **계측 때문에 링크가 죽으면 안 된다.**
 */
export const withUtm = (href: string, productId: string): string => {
  try {
    const u = new URL(href);
    if (u.searchParams.has("utm_source")) return href;
    u.searchParams.set("utm_source", "rivea");
    u.searchParams.set("utm_medium", "referral");
    u.searchParams.set("utm_campaign", "product_detail");
    u.searchParams.set("utm_content", productId);
    return u.toString();
  } catch {
    return href;
  }
};

export default function OutboundLink({
  productId,
  href,
  brandName,
}: {
  productId: string;
  href: string;
  brandName: string;
}) {
  return (
    <a
      href={withUtm(href, productId)}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      onClick={() => trackRepeat("outbound_click", productId)}
      className="press flex h-[50px] w-full items-center justify-center rounded-cta border border-ink text-[17px] font-medium text-ink"
    >
      {brandName} 공식몰에서 보기
    </a>
  );
}
