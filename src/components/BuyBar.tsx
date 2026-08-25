"use client";

import { won } from "@/data/catalog";
import OutboundLink from "./OutboundLink";
import WishButton from "./WishButton";

/**
 * 하단 구매 바 — 찜 + **공식몰에서 구매**(외부).
 *
 * ## 2026-08-25 — 장바구니를 뺐다
 *
 * 우리는 결제를 받지 않는다. 장바구니는 `/checkout`으로 이어지고 거기엔
 * 「N원 결제하기」 버튼이 있었다 — **결제하는 척하는 화면**이다. 실사용자를 인스타로
 * 받기 시작하면 그건 데모가 아니라 거짓 약속이 된다.
 *
 * 담아두는 기능 자체는 **찜**이 이미 한다. 장바구니는 「결제 직전 단계」라는 뜻인데
 * 그 다음 단계가 없으므로 자리가 없다.
 *
 * ## 「구매」는 왜 로그인을 묻지 않나 (2026-08-25, 운영자 결정)
 *
 * 전에는 「바로구매」가 장바구니에 담고 `/checkout`으로 갔다. 회원 전용이었다.
 * 그런데 **우리는 결제를 받지 않는다** — 그 체크아웃은 결제하는 척하는 화면이고,
 * 진짜 구매는 브랜드 공식몰에서 일어난다.
 *
 * 그러면 로그인을 받을 근거가 없다. 로그인의 값은 주문내역·배송조회·재구매인데
 * 아웃바운드 구매는 **그 셋 중 무엇도 우리에게 남기지 않는다.** 저쪽에서 산 걸
 * 우리가 조회해줄 방법이 없다. 없는 값을 근거로 문턱을 세우는 셈이다.
 *
 * 게다가 나가는 클릭은 **입점 협상에 들고 갈 유일한 숫자**다(`OutboundLink` 주석).
 * 로그인 시트를 한 장 끼우면 40대+ 상당수가 거기서 멈추고, 우리는 그 숫자를 잃는다.
 * 문턱을 세워 얻는 것이 0이고 잃는 것이 지표라면 세우지 않는다.
 *
 * 장바구니는 그대로 회원 전용이다 — 그건 **다음에 다시 꺼내 보는 것**이라
 * 계정에 매여야 말이 된다. 로그인의 대가는 저장하는 지점에서만 받는다.
 */
export default function BuyBar({
  kind,
  id,
  price,
  buyHref,
  brandName,
}: {
  kind: "product" | "routine";
  id: string;
  price: number;
  /** 이 제품을 실제로 파는 곳 (`buyUrlOf`). 없으면 구매 버튼을 그리지 않는다 */
  buyHref?: string | null;
  /** 브랜드 공식몰로 나갈 때만 준다. 비어 있으면 「판매처에서 구매」로 쓴다 */
  brandName?: string;
}) {


  return (
    <>


      <div className="sticky bottom-0 z-40 flex items-center gap-3 border-t border-line bg-surface px-4 pb-[max(11px,env(safe-area-inset-bottom))] pt-[11px]">
        <WishButton kind={kind} id={id} variant="bar" />

        {kind === "product" ? (
          <>
            {buyHref ? (
              <OutboundLink
                productId={id}
                href={buyHref}
                brandName={brandName ?? ""}
                variant="bar"
                label={brandName ? `${brandName}에서 구매` : "판매처에서 구매"}
              />
            ) : (
              // 파는 곳 주소가 없으면 버튼을 비활성으로 남긴다 — 눌러도 갈 데가 없는
              // 버튼을 그리는 것보다, 왜 못 사는지 보이는 쪽이 낫다.
              <span className="flex h-[50px] flex-1 items-center justify-center rounded-cta border border-line text-[17px] text-disabled">
                판매처 확인 중
              </span>
            )}
          </>
        ) : (
          /*
            루틴은 여러 브랜드가 섞여 있어 한 곳으로 내보낼 수 없다. 그래서 담기 대신
            **합계만 보여주고 구성품에서 각자 나가게** 한다 (구성품 목록이 상세에 있다).
          */
          <div className="flex flex-1 items-center justify-between">
            <div>
              <p className="text-[14px] text-meta">단품 합계</p>
              <p className="text-[19px] font-bold leading-[1.1] text-ink">{won(price)}</p>
            </div>
            <p className="text-[15px] leading-[1.5] text-meta">
              구성품에서 각각
              <br />
              공식몰로 가요
            </p>
          </div>
        )}
      </div>
    </>
  );
}
