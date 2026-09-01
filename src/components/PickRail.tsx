"use client";

import { routines } from "@/data/catalog";
import RoutineCard from "./RoutineCard";
import { sortByProfile, useProfile } from "@/lib/profile";

/**
 * 리베아's Pick — 루틴 세트 레일.
 * 프로필이 있으면 내 고민의 루틴이 앞에 온다 (순서만 바꾸고 빼지 않는다).
 *
 * ⚠️ 홈에서는 **6개까지만** 보여준다 (2026-09-01).
 *
 * 전에는 12개를 전부 밀어 넣었다. 설문 「고를 때 불편」 1위가 「이게 나한테 맞는 건지
 * 모르겠다」 50%인데(`docs/15`), 그 사람에게 첫 화면에서 12개를 옆으로 밀게 하는 건
 * 답이 아니라 문제를 한 번 더 주는 것이다. 끝까지 미는 사람도 거의 없어서, 뒤쪽 6개는
 * 사실상 아무에게도 안 보이면서 자리만 차지했다.
 *
 * 프로필이 있으면 앞 6개가 **내 고민 루틴으로 채워진다** — 자를수록 개인화가 선명해진다.
 * 전체 12개는 섹션 헤더의 「전체보기」(`/pick`)에 그대로 있다.
 */
const HOME_LIMIT = 6;

export default function PickRail() {
  const profile = useProfile();
  const ordered = sortByProfile(routines, (r) => r.concern, profile.concerns);

  return (
    <div className="rail flex gap-[11px] pb-4 pl-4 pr-4">
      {ordered.slice(0, HOME_LIMIT).map((r) => (
        <RoutineCard key={r.id} routine={r} />
      ))}
    </div>
  );
}
