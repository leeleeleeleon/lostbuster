import type { Metadata, Viewport } from "next";
import { Cinzel, Gowun_Batang, Jua, Noto_Sans_KR } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const serif = Gowun_Batang({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-serif", display: "swap" });
const sans = Noto_Sans_KR({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-sans", display: "swap" });
const cinzel = Cinzel({ weight: ["400", "600"], subsets: ["latin"], variable: "--font-cinzel", display: "swap" });
const cute = Jua({ weight: "400", subsets: ["latin"], variable: "--font-cute", display: "swap" });
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
    <html lang="ko" className={`${serif.variable} ${sans.variable} ${cinzel.variable} ${pixel.variable} ${cute.variable}`}>
      <body>{children}</body>
    </html>
  );
}
