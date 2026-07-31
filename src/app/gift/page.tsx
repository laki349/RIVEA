import AppBar from "@/components/AppBar";
import TabBar from "@/components/TabBar";
import GiftClient from "./GiftClient";

export default function GiftPage() {
  return (
    <>
      <AppBar title="어머니 선물" bold />
      <GiftClient />
      <TabBar />
    </>
  );
}
