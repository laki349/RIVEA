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
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      onClick={() => trackRepeat("outbound_click", productId)}
      className="press flex h-[50px] w-full items-center justify-center rounded-cta border border-ink text-[15px] font-medium text-ink"
    >
      {brandName} 공식몰에서 보기
    </a>
  );
}
