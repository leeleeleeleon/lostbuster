import type { Metadata, Viewport } from "next";
import { Gaegu, Silkscreen } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// 한글은 픽셀체 갈무리, 영문 라벨은 Silkscreen
const en = Silkscreen({ weight: "400", subsets: ["latin"], variable: "--font-en", display: "swap" });
const hand = Gaegu({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-hand", display: "swap" });
const pixel = localFont({
  src: [
    { path: "./fonts/Galmuri11.woff2", weight: "400" },
    { path: "./fonts/Galmuri11-Bold.woff2", weight: "700" },
  ],
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "로스트버스터 LOSTBUSTER",
  description: "숲의 세계수를 지키는 열 정령의 이야기, RPG 로스트버스터 공식 홈페이지",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${en.variable} ${pixel.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
