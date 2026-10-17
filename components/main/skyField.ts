import { mulberry32 } from "@/lib/random";

// 첫 화면 배경: 192×108 캔버스에 그린 뒤 CSS로 늘려서 픽셀을 크게 보이게 한다.
export const SKY_W = 192;
export const SKY_H = 108;
const GROUND = 70;

const BANDS = ["#3a8fe0", "#4a9ff0", "#5fb0f5", "#7ec3f7", "#a2d6fa", "#c6e8fc"];
const SUN = [[2, 0, 4], [1, 1, 6], [0, 2, 8], [0, 3, 8], [0, 4, 8], [0, 5, 8], [1, 6, 6], [2, 7, 4]];
// [x, y, 크기]. 크기가 클수록 가까워서 빨리 흐른다
const CLOUDS = [[10, 10, 1], [70, 6, 1.4], [130, 16, 1], [175, 8, 0.8]];

type Opt = { cat?: boolean; snow?: boolean };

/** 산, 세계수, 땅처럼 움직이지 않는 층을 한 번만 그린다 */
function drawBase(): HTMLCanvasElement {
  const base = document.createElement("canvas");
  base.width = SKY_W;
  base.height = SKY_H;
  const g = base.getContext("2d")!;
  const B = (x: number, y: number, w: number, h: number, c: string) => {
    g.fillStyle = c;
    g.fillRect(x | 0, y | 0, w, h);
  };
  const rng = mulberry32(7);

  // 오른쪽 면은 한 톤 어둡게
  const mountain = (cx: number, peak: number, half: number, c: string, dark: string, opt: Opt = {}) => {
    for (let x = cx - half; x <= cx + half; x++) {
      let top = peak + (Math.abs(x - cx) * (GROUND - peak)) / half;
      // 냥산: 고양이 귀처럼 봉우리 두 개
      if (opt.cat) {
        const ear = Math.min(Math.abs(x - (cx - half * 0.45)), Math.abs(x - (cx + half * 0.45)));
        top = Math.max(top, peak + ear * 1.6);
      }
      top = Math.round(top / 2) * 2;
      B(x, top, 1, GROUND + 2 - top, x > cx ? dark : c);
      if (opt.snow && top < peak + 6) B(x, top, 1, 3, "#ffffff");
    }
  };
  mountain(28, 40, 34, "#a493c9", "#8a79b2", { cat: true }); // 냥산
  mountain(158, 34, 36, "#7aa6d6", "#5f8cbf", { snow: true }); // 갈치산
  mountain(60, 46, 30, "#e98a8a", "#d06f72"); // 자몽산
  mountain(132, 44, 30, "#e0a040", "#c4832c"); // 너겟산

  // 체크무늬 잔디와 가운데 흙길
  for (let y = GROUND; y < SKY_H; y += 4)
    for (let x = 0; x < SKY_W; x += 4) B(x, y, 4, 4, ((x + y) / 4) % 2 ? "#5cb85c" : "#52a852");
  for (let y = GROUND; y < SKY_H; y++) {
    const w = 8 + (y - GROUND) * 1.2;
    B(96 - w / 2, y, w, 1, y % 4 < 2 ? "#d8b26a" : "#cca45c");
  }
  B(0, GROUND, SKY_W, 1, "#3f8f3f");

  // 세계수
  B(92, 46, 8, 26, "#7a4b2a");
  B(97, 46, 3, 26, "#5e3820");
  B(86, 68, 20, 3, "#7a4b2a");
  const leaves = [[96, 34, 20], [82, 40, 12], [110, 40, 12], [96, 24, 13], [86, 30, 10], [106, 30, 10]];
  for (const [bx, by, r] of leaves)
    for (let y = -r; y <= r; y++)
      for (let x = -r; x <= r; x++) {
        if (x * x + y * y > r * r) continue;
        const n = rng();
        B(bx + x, by + y, 1, 1, y > r * 0.35 ? "#2f7a36" : n < 0.12 ? "#7fd17a" : n < 0.5 ? "#4fa84a" : "#3f9440");
      }
  return base;
}

/** 캔버스에 하늘을 그리고 구름을 흘려보낸다. 정리 함수를 돌려준다 */
export function startSky(canvas: HTMLCanvasElement): () => void {
  const g = canvas.getContext("2d")!;
  const R = (x: number, y: number, w: number, h: number, c: string) => {
    g.fillStyle = c;
    g.fillRect(x | 0, y | 0, w, h);
  };
  const base = drawBase();
  const cloud = (x: number, y: number, s: number) => {
    x = (((x % (SKY_W + 40)) + SKY_W + 40) % (SKY_W + 40)) - 30;
    for (const [a, b, w, h] of [[4, 0, 10, 3], [0, 3, 22, 4], [2, 7, 18, 2]]) R(x + a * s, y + b * s, w * s, h * s, "#ffffff");
    R(x + 2 * s, y + 8 * s, 18 * s, s, "#cfe6f7");
  };

  let t = 0;
  const draw = () => {
    BANDS.forEach((c, i) => R(0, i * 12, SKY_W, 12, c));
    R(0, 72, SKY_W, SKY_H, BANDS[BANDS.length - 1]);
    for (const [x, y, w] of SUN) R(166 + x, 6 + y, w, 1, "#ffe98a");
    for (const [x, y, s] of CLOUDS) cloud(x + t * s * 0.5, y, s);
    g.drawImage(base, 0, 0);
  };

  draw();
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const id = setInterval(() => {
    t++;
    draw();
  }, 140);
  return () => clearInterval(id);
}
