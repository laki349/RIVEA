"use client";

import { routines } from "@/data/catalog";
import RoutineCard from "./RoutineCard";
import { sortByProfile, useProfile } from "@/lib/profile";

/**
 * 리베아's Pick — 루틴 세트 레일.
 * 프로필이 있으면 내 고민의 루틴이 앞에 온다 (순서만 바꾸고 빼지 않는다).
 */
export default function PickRail() {
  const profile = useProfile();
  const ordered = sortByProfile(routines, (r) => r.concern, profile.concerns);

  return (
    <div className="rail flex gap-[11px] pb-4 pl-4 pr-4">
      {ordered.map((r) => (
        <RoutineCard key={r.id} routine={r} />
      ))}
    </div>
  );
}
