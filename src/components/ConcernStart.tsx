"use client";

import { useRouter } from "next/navigation";
import { toggleConcern, useProfile } from "@/lib/profile";
import Icon from "./Icon";

/**
 * 「이 고민으로 내 루틴 짜기」 — 퍼널 ①→② 를 잇는 자리.
 *
 * ## 무엇이 끊겨 있었나 (2026-08-26)
 *
 * 홈에서 고민 아이콘을 누르면 `/concern/[slug]`로 오는데, 그 선택이 **아무 데도
 * 남지 않았다.** 프로필에 저장되지 않으니 `/my-routine`에 가면 「고민을 먼저
 * 골라주세요」가 뜬다 — 방금 골랐는데. 그리고 여기서 처방으로 가는 길 자체가 없었다.
 *
 * 결과적으로 이 화면은 **그냥 상품 목록**이었다. 다른 커머스와 구분되지 않는 자리고,
 * 계측에서도 `concern_select`가 찍히지 않아 4단계 퍼널의 ①이 비어 있었다.
 * (실측에서 「고민 선택」이 25%로 유독 낮았던 게 이것 때문이다.)
 *
 * ## 왜 「이런 경우예요」 다음인가
 *
 * 설문 「고를 때 불편」 1위가 「이게 나한테 맞는 건지 모르겠다」 50%다(`docs/15`).
 * `youIf`가 그 50%에 답하는 자리이고, 읽고 나서 **「내 얘기다」가 성립한 직후**가
 * 행동을 물을 타이밍이다. 페이지 맨 위에서 물으면 아직 답할 이유가 없다.
 *
 * ⚠️ 이미 고른 고민이면 버튼이 **「내 루틴 보기」로 바뀐다.** 같은 걸 또 고르게 하면
 *    프로필에서 토글로 빠져버린다 — 누른 사람이 잃는 쪽으로 동작하면 안 된다.
 */
/**
 * 「~으로 / ~로」 — 받침에 따라 갈린다.
 * 고민 이름이 데이터에서 오므로 문장에 박아둘 수 없다.
 * 받침이 없거나 ㄹ이면 「로」, 그 외에는 「으로」.
 * (기미·잡티 → 로 / 주름·탄력 → 으로 / 모공 → 으로 / 두피·헤어 → 로)
 */
function 로조사(word: string): string {
  const last = word.charCodeAt(word.length - 1) - 0xac00;
  if (last < 0 || last > 11171) return "로"; // 한글이 아니면 기본형
  const 받침 = last % 28;
  return 받침 === 0 || 받침 === 8 ? "로" : "으로";
}

export default function ConcernStart({ slug, name }: { slug: string; name: string }) {
  const router = useRouter();
  const profile = useProfile();
  const already = profile.concerns.includes(slug);

  const go = () => {
    // `toggleConcern`이 `concern_select`를 켤 때만 남긴다 (profile.ts)
    if (!already) toggleConcern(slug);
    router.push("/my-routine");
  };

  return (
    <section className="border-b border-hairline px-4 py-4">
      <button
        onClick={go}
        className="press flex h-[54px] w-full items-center justify-center gap-[7px] rounded-cta bg-ink text-[18px] font-medium text-on-ink"
      >
        {already ? "내 루틴 보기" : `${name}${로조사(name)} 내 루틴 짜기`}
        <Icon name="chevron-right" size={17} />
      </button>
      <p className="mt-[9px] text-[16px] leading-[1.6] text-meta">
        {already
          ? "이미 고르신 고민이에요. 아침·저녁 순서가 짜여 있습니다."
          : "아침·저녁에 무엇을 어떤 순서로 쓰면 되는지 짜드려요. 고민은 나중에 더 고르거나 뺄 수 있습니다."}
      </p>
    </section>
  );
}
