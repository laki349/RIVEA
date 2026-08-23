"use client";

import { won } from "@/data/catalog";
import Icon from "@/components/Icon";
import { useWallet } from "@/lib/wallet";

/**
 * 퀵액션의 쿠폰·포인트 칸 — 실제 잔액을 보여준다 (`wallet.ts`).
 * 결제에서 차감되는데 여기 숫자가 그대로면 그 자리에서 가짜가 드러난다.
 *
 * 아직 쿠폰함·포인트 내역 화면이 없어서 링크는 걸지 않았다.
 * 숫자만 맞게 보여주는 편이, 눌러도 아무 일 없는 링크보다 낫다.
 */
export default function WalletQuickActions() {
  const wallet = useWallet();

  return (
    <>
      <div className="relative flex-1 py-[15px] text-center">
        <span className="text-ink">
          <Icon name="ticket" size={20} className="mx-auto" />
        </span>
        {wallet.coupons > 0 && (
          <span className="absolute left-[calc(50%+10px)] top-3 h-[5px] w-[5px] rounded-full bg-rose" />
        )}
        <p className="mt-[5px] text-[14px] text-body">쿠폰 {wallet.coupons}</p>
      </div>
      <div className="flex-1 py-[15px] text-center">
        <span className="text-ink">
          <Icon name="coin" size={20} className="mx-auto" />
        </span>
        <p className="mt-[5px] text-[14px] text-body">{won(wallet.points)}P</p>
      </div>
    </>
  );
}
