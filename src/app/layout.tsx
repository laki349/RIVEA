import type { Metadata } from "next";
import { Noto_Sans_KR, Gowun_Batang } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";

const sans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Gowun_Batang({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "리베아 Rebea — 피부 고민별 기기＋화장품 큐레이션",
  description:
    "40대 이상 여성의 피부 고민(기미·주름·탄력)을 중심으로, 홈케어 기기와 화장품을 브랜드 넘나들며 한 루틴으로 골라주는 리베아 Pick.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-dvh">
        <Header />
        <main className="pb-24 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
