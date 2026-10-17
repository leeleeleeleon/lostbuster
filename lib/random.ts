// 시드 고정 난수 — 새로고침해도 세계수 모양이 항상 같도록
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = ReturnType<typeof mulberry32>;

export const range = (rng: Rng, min: number, max: number) => min + rng() * (max - min);

// 중심값 주변으로 몰리는 분포 (근사 정규분포)
export const gauss = (rng: Rng) => (rng() + rng() + rng() - 1.5) / 1.5;
