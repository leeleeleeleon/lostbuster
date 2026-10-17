import type { CSSProperties } from "react";

// 로비 지도(public/rooms/lobby.png, 596×514)에서 각 방 문과 얼굴 아이콘의 위치.
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
  // 문 옆 얼굴 아이콘 중심
  fx: number;
  fy: number;
};

const top = (x: number, fx: number) => ({ side: "top" as const, x, y: 107, w: 30, h: 30, fx, fy: 13 });
const bottom = (x: number, fx: number) => ({ side: "bottom" as const, x, y: 431, w: 30, h: 30, fx, fy: 480 });
const left = (y: number, fy: number) => ({ side: "left" as const, x: 60, y, w: 30, h: 30, fx: 38, fy });

export const DOORS: Door[] = [
  { spirit: "ire", ...top(168, 182) },
  { spirit: "jamo", ...top(240, 252) },
  { spirit: "gungun", ...top(312, 326) },
  { spirit: "oyu", ...top(384, 397) },
  { spirit: "innocent", ...left(215, 229) },
  { spirit: "iden", ...left(323, 334) },
  { spirit: "cyan", ...bottom(168, 182) },
  { spirit: "magenta", ...bottom(240, 254) },
  { spirit: "welsiet", ...bottom(312, 326) },
  { spirit: "i", ...bottom(384, 398) },
];

export const doorOf = (spiritId: string) => DOORS.find((d) => d.spirit === spiritId)!;

/** 로비 지도에서 정령의 얼굴 아이콘(약 26px)만 잘라 배경으로 쓴다. 크기는 요소가 정한다. */
export function faceStyle(spiritId: string): CSSProperties {
  const d = doorOf(spiritId);
  return {
    backgroundImage: `url(${LOBBY.src})`,
    backgroundSize: `${(LOBBY.w / 26) * 100}% auto`,
    backgroundPosition: `${((d.fx - 13) / (LOBBY.w - 26)) * 100}% ${((d.fy - 13) / (LOBBY.h - 26)) * 100}%`,
  };
}
