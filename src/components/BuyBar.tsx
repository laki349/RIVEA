"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";
import { won } from "@/data/catalog";
import { LoginSheet, useMemberGate } from "./MemberGate";
import OutboundLink from "./OutboundLink";
import Toast from "./Toast";
import WishButton from "./WishButton";

/**
 * 하단 구매 바 — 담기 실동작 + 토스트.
 * product: 찜 + 장바구니 + **공식몰에서 구매**(외부) / routine: 찜 + 세트가 + 세트 담기
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
  likes,
  price,
  buyHref,
  brandName,
}: {
  kind: "product" | "routine";
  id: string;
  likes: number;
  price: number;
  /** 이 제품을 실제로 파는 곳 (`buyUrlOf`). 없으면 구매 버튼을 그리지 않는다 */
  buyHref?: string | null;
  brandName?: string;
}) {
  const router = useRouter();
  const [toast, setToast] = useState(false);
  // 담기·구매는 회원 전용 (MemberGate.tsx) — 게스트는 시트로 안내한다
  const { guard, asking, close } = useMemberGate();

  const add = () =>
    guard(() => {
      addToCart(kind, id);
      setToast(true);
    });


  return (
    <>
      {asking && <LoginSheet onClose={close} what="담아두세요" />}

      {toast && (
        <Toast
          message="장바구니에 담았어요"
          onDone={() => setToast(false)}
          action={{ label: "보러가기", onClick: () => router.push("/cart") }}
        />
      )}

      <div className="sticky bottom-0 z-40 flex items-center gap-3 border-t border-line bg-surface px-4 pb-[max(11px,env(safe-area-inset-bottom))] pt-[11px]">
        <WishButton kind={kind} id={id} variant="bar" baseLikes={likes} />

        {kind === "product" ? (
          <>
            <button
              onClick={add}
              className="press h-[50px] flex-1 rounded-cta border border-ink text-[17px] font-medium text-ink"
            >
              장바구니
            </button>
            {buyHref ? (
              <OutboundLink
                productId={id}
                href={buyHref}
                brandName={brandName ?? ""}
                variant="bar"
                label={brandName ? `${brandName}에서 구매` : "공식몰에서 구매"}
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
          <>
            <div className="flex-shrink-0">
              <p className="text-[14px] text-meta">세트가</p>
              <p className="text-[19px] font-bold leading-[1.1] text-ink">{won(price)}</p>
            </div>
            <button
              onClick={add}
              className="press h-[52px] flex-1 rounded-cta bg-ink text-[18px] font-medium text-on-ink"
            >
              세트 담기
            </button>
          </>
        )}
      </div>
    </>
  );
}
