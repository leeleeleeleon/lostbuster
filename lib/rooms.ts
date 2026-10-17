import type { CSSProperties } from "react";

// 로비 지도(public/rooms/lobby.png, 596×514)에서 각 방 문의 위치.
// 좌표는 원본 이미지 픽셀 기준. spirit 은 lib/spirits.ts 의 id.
export const LOBBY = { src: "/rooms/lobby.png", w: 596, h: 514 };

export type Door = {
  spirit: string;
  side: "top" | "left" | "bottom";
  // 문 사각형
  x: number;
  y: number;
  w: number;
  h: number;
};

const top = (x: number) => ({ side: "top" as const, x, y: 107, w: 30, h: 30 });
const bottom = (x: number) => ({ side: "bottom" as const, x, y: 431, w: 30, h: 30 });
const left = (y: number) => ({ side: "left" as const, x: 60, y, w: 30, h: 30 });

export const DOORS: Door[] = [
  { spirit: "ire", ...top(168) },
  { spirit: "jamo", ...top(240) },
  { spirit: "gungun", ...top(312) },
  { spirit: "oyu", ...top(384) },
  { spirit: "innocent", ...left(215) },
  { spirit: "iden", ...left(323) },
  { spirit: "cyan", ...bottom(168) },
  { spirit: "magenta", ...bottom(240) },
  { spirit: "welsiet", ...bottom(312) },
  { spirit: "i", ...bottom(384) },
];

/** 오너가 그린 얼굴 칩(public/faces/<id>.png, 144px)을 배경으로 쓴다. 크기는 요소가 정한다. */
export function faceStyle(spiritId: string): CSSProperties {
  return {
    backgroundImage: `url(/faces/${spiritId}.png)`,
    backgroundSize: "cover",
    backgroundPosition: "center top",
  };
}
