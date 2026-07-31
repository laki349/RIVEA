import AppBar from "@/components/AppBar";
import TabBar from "@/components/TabBar";
import CheckClient from "./CheckClient";

export default function CheckPage() {
  return (
    <>
      <AppBar title="순서 검사" bold />
      <CheckClient />
      <TabBar />
    </>
  );
}
