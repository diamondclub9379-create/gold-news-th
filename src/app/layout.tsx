import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Gold News TH - สรุปตลาดทอง ก่อนใคร",
    template: "%s | Gold News TH",
  },
  description:
    "สรุปตลาดทอง ก่อนใคร — ข่าวทองคำและเงินจาก Reuters, Kitco, CNBC แปลไทยอัตโนมัติ",
  keywords: [
    "ข่าวทองคำ",
    "ราคาทอง",
    "gold news",
    "silver news",
    "ข่าวเงิน",
    "ตลาดทอง",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${notoSansThai.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-gray-200 font-[family-name:var(--font-noto-thai)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
