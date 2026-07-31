import type { Metadata } from "next";
import AppBar from "@/components/AppBar";
import ProfileForm from "./ProfileForm";

export const metadata: Metadata = {
  title: "내 피부 고민 설정",
};

/** 내 피부 프로필 — 저장은 localStorage라 ProfileForm(클라이언트)이 담당 */
export default function ProfilePage() {
  return (
    <>
      <AppBar title="내 피부 고민" bold search={false} />
      <ProfileForm />
    </>
  );
}
