import { gauss, mulberry32, range, type Rng } from "@/lib/random";

// 세계수: 은행나무 노거수처럼 낮은 곳에서 굵은 가지가 옆으로 크게 벌어지고
// 반구형 수관을 이루는 나무. 시드 고정이라 항상 같은 모양으로 자란다.

type Pt = { x: number; y: number };

export type Branch = {
  x0: number; y0: number;
  cx: number; cy: number;
  x1: number; y1: number;
  w0: number; w1: number;
  depth: number;
};

export type TreeLayout = {
  unit: number; // 수관 폭 — 모든 크기의 기준
  baseX: number;
  baseY: number;
  crown: { cx: number; cy: number; rx: number; ry: number };
  branches: Branch[];
  anchors: Pt[]; // 오색천을 매다는 자리 (왼쪽 → 오른쪽)
  shape: (x: number, y: number) => number; // 수관 안쪽이면 1 이하
};

type Clump = { x: number; y: number; r: number; tint: number; light: number };

const MAX_DEPTH = 4;

const qPoint = (b: Branch, t: number): Pt => {
  const u = 1 - t;
  return {
    x: u * u * b.x0 + 2 * u * t * b.cx + t * t * b.x1,
    y: u * u * b.y0 + 2 * u * t * b.cy + t * t * b.y1,
  };
};

export function layoutTree(w: number, h: number, seed = 20261017): TreeLayout {
  const rng = mulberry32(seed);
  const unit = Math.min(w * 0.94, h * 0.86);
  const baseX = w / 2;
  const baseY = Math.min(h * 0.8, h / 2 + unit * 0.4);
  const trunkH = unit * 0.19;
  const rx = unit * 0.5;
  const ry = unit * 0.36;
  const crown = { cx: baseX, cy: baseY - trunkH - ry * 0.3, rx, ry };

  const branches: Branch[] = [];
  const shape = crownShape(crown, rng);

  const grow = (x: number, y: number, ang: number, len: number, w0: number, depth: number) => {
    let x1 = x + Math.cos(ang) * len;
    let y1 = y + Math.sin(ang) * len;
    // 수관 밖으로 뻗지 않도록 길이를 줄인다
    let guard = 0;
    while (shape(x1, y1) > 0.97 && guard++ < 30) {
      len *= 0.92;
      x1 = x + Math.cos(ang) * len;
      y1 = y + Math.sin(ang) * len;
    }
    const mx = (x + x1) / 2;
    const my = (y + y1) / 2;
    const nx = -Math.sin(ang);
    const ny = Math.cos(ang);
    const bend = len * gauss(rng) * 0.16;
    // 옆으로 뻗은 굵은 가지는 아래로 처졌다가 끝이 들린다
    const sag = len * 0.14 * Math.abs(Math.cos(ang)) * (depth <= 1 ? 1 : 0.5);
    const w1 = w0 * range(rng, 0.62, 0.72);
    const b: Branch = { x0: x, y0: y, cx: mx + nx * bend, cy: my + ny * bend + sag, x1, y1, w0, w1, depth };
    branches.push(b);
    if (depth >= MAX_DEPTH) return;

    const n = depth === 0 ? 3 : 2 + (rng() < 0.45 ? 1 : 0);
    const spread = depth === 0 ? 0.62 : 0.5;
    for (let j = 0; j < n; j++) {
      let ca = ang + spread * (j - (n - 1) / 2) + gauss(rng) * 0.28;
      ca = ca * 0.86 + (-Math.PI / 2) * 0.14; // 빛을 향해 조금씩 위로
      const t = j === 0 && n > 2 ? range(rng, 0.55, 0.75) : range(rng, 0.88, 1);
      const p = qPoint(b, t);
      grow(p.x, p.y, ca, len * range(rng, 0.6, 0.76), w1 * range(rng, 0.62, 0.8), depth + 1);
    }
  };

  // 줄기 끝에서 굵은 주가지 6개가 부채꼴로 벌어진다
  const trunkTopY = baseY - trunkH;
  const limbs = 6;
  for (let i = 0; i < limbs; i++) {
    const f = i / (limbs - 1);
    const ang = -Math.PI * (0.93 - 0.86 * f) + gauss(rng) * 0.08;
    const lateral = Math.abs(Math.cos(ang));
    const sx = baseX + (f - 0.5) * unit * 0.07;
    const sy = trunkTopY + range(rng, 0, trunkH * 0.25) + lateral * trunkH * 0.15;
    grow(sx, sy, ang, unit * (0.2 + 0.12 * lateral), unit * (0.05 - 0.012 * lateral), 0);
  }

  // 오색천 앵커: 수관 아래쪽 굵은 가지 위의 점들 중 x 구간마다 가장 낮은 곳
  const candidates: Pt[] = [];
  for (const b of branches) {
    if (b.depth < 0 || b.depth > 2) continue;
    for (let t = 0.3; t <= 0.95; t += 0.08) {
      const p = qPoint(b, t);
      if (p.y > crown.cy + crown.ry * 0.05) candidates.push(p);
    }
  }
  const anchors: Pt[] = [];
  const span = crown.rx * 1.5;
  for (let i = 0; i < 10; i++) {
    const tx = baseX - span / 2 + (span * (i + 0.5)) / 10;
    const bin = candidates.filter((p) => Math.abs(p.x - tx) < span / 20);
    const pool = bin.length ? bin : candidates;
    let best = pool[0];
    for (const p of pool) {
      if (bin.length ? p.y > best.y : Math.abs(p.x - tx) < Math.abs(best.x - tx)) best = p;
    }
    anchors.push({ x: best.x, y: best.y });
  }

  return { unit, baseX, baseY, crown, branches, anchors, shape };
}

/**
 * 수관 실루엣: 둥근 돔 위에 몇 개의 혹(lobe)이 솟고,
 * 아랫선은 가운데가 들리고 양 끝이 땅 쪽으로 처진다. 1보다 크면 바깥.
 */
function crownShape(crown: TreeLayout["crown"], rng: Rng) {
  const lobes = Array.from({ length: 4 }, (_, i) => ({
    f: 2.5 + i * 2.1 + rng() * 1.5,
    p: rng() * Math.PI * 2,
    a: 0.09 / (1 + i * 0.6),
  }));
  return (x: number, y: number) => {
    const nx = (x - crown.cx) / crown.rx;
    const ax = Math.abs(nx);
    if (ax >= 1) return ax + 1;
    const dy = y - crown.cy;
    if (dy < 0) {
      let top = Math.pow(1 - nx * nx, 0.5);
      for (const l of lobes) top += l.a * Math.sin(nx * l.f + l.p) * (1 - ax * 0.5);
      return Math.max(ax, -dy / (crown.ry * Math.max(0.05, top)));
    }
    const bottom = crown.ry * (0.28 + 0.62 * Math.pow(ax, 2.2)) * (ax > 0.85 ? (1 - ax) / 0.15 : 1);
    return Math.max(ax, dy / Math.max(1, bottom));
  };
}

// ───────────────────────── 그리기 ─────────────────────────

const LEAF_STOPS: [number, number, number][] = [
  [4, 12, 9],
  [8, 28, 19],
  [14, 50, 31],
  [24, 78, 46],
  [38, 108, 60],
  [66, 145, 78],
  [118, 190, 104],
  [188, 236, 160],
];
const TEAL: [number, number, number] = [26, 104, 92];
const LUM_STEPS = 22;
const TINT_STEPS = 3;

function leafColor(lum: number, tint: number, alpha: number) {
  const f = Math.max(0, Math.min(0.999, lum)) * (LEAF_STOPS.length - 1);
  const i = Math.floor(f);
  const k = f - i;
  const a = LEAF_STOPS[i];
  const b = LEAF_STOPS[i + 1];
  const mix = tint * 0.35 * (1 - lum * 0.6);
  const c = [0, 1, 2].map((j) => {
    const v = a[j] + (b[j] - a[j]) * k;
    return Math.round(v + (TEAL[j] * (0.4 + lum) - v) * mix);
  });
  return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
}

function makeClumps(layout: TreeLayout, rng: Rng): Clump[] {
  const { crown, unit, branches, shape } = layout;
  const clumps: Clump[] = [];
  for (const b of branches) {
    if (b.depth < 2 || shape(b.x1, b.y1) > 1.05) continue;
    const r = unit * (b.depth === MAX_DEPTH ? range(rng, 0.045, 0.072) : range(rng, 0.055, 0.08));
    clumps.push({ x: b.x1, y: b.y1, r, tint: rng(), light: gauss(rng) * 0.07 });
    if (b.depth >= 3) {
      const p = qPoint(b, range(rng, 0.35, 0.65));
      clumps.push({ x: p.x, y: p.y, r: r * 0.8, tint: rng(), light: gauss(rng) * 0.07 });
    }
  }
  // 빈틈 메우기 — 아랫부분은 성기게 남겨 가지가 비치도록
  let tries = 0;
  while (tries++ < 1400) {
    const x = crown.cx + (rng() * 2 - 1) * crown.rx;
    const y = crown.cy + (rng() * 2 - 1) * crown.ry;
    const s = shape(x, y);
    if (s > 0.9) continue;
    // 안쪽 아랫부분은 성기게 남겨 가지와 줄기가 비치도록
    const below = (y - crown.cy) / crown.ry;
    if (below > 0.05 && Math.abs(x - crown.cx) < crown.rx * 0.45 && rng() < 0.8) continue;
    clumps.push({ x, y, r: unit * range(rng, 0.04, 0.07), tint: rng(), light: gauss(rng) * 0.07 });
  }
  return clumps;
}

type Bucket = Map<string, number[]>;

function stampClumps(
  clumps: Clump[],
  layout: TreeLayout,
  rng: Rng,
  opts: { density: number; lumScale: number; lumBias: number; alpha: number; offY: number; grow: number; topOnly?: boolean },
): Bucket {
  const { crown, unit } = layout;
  const buckets: Bucket = new Map();
  const top = crown.cy - crown.ry;
  const leaf = unit * 0.0065;
  for (const c of clumps) {
    const r = c.r * opts.grow;
    const cy = c.y + opts.offY * unit;
    const count = Math.round(((r * r) / (leaf * leaf)) * opts.density);
    for (let i = 0; i < count; i++) {
      const a = rng() * Math.PI * 2;
      const d = Math.pow(rng(), 0.6);
      const x = c.x + Math.cos(a) * d * r;
      const y = cy + Math.sin(a) * d * r * 0.86;
      const local = (y - cy) / r; // -1(위) ~ 1(아래)
      if (opts.topOnly && local > -0.15 + rng() * 0.3) continue;
      const side = (c.x - x) / r; // 왼쪽 위에서 달빛
      const gy = Math.max(0, Math.min(1, (y - top) / (crown.ry * 2)));
      // 큰 스케일 명암 — 빛 받는 혹과 그늘진 골이 생기도록
      const fx = (x - crown.cx) / unit, fy = (y - crown.cy) / unit;
      const field = 0.16 * Math.sin(fx * 9.1 + 1.3) * Math.sin(fy * 11.7 + 0.4) + 0.08 * Math.sin(fx * 23 + fy * 17);
      let lum = (0.5 - local * 0.42 + side * 0.12) * 0.55 + (1 - gy) * 0.45 + field + c.light;
      lum = lum * opts.lumScale + opts.lumBias + gauss(rng) * 0.06;
      const li = Math.max(0, Math.min(LUM_STEPS - 1, Math.round(lum * (LUM_STEPS - 1))));
      const ti = Math.min(TINT_STEPS - 1, Math.floor(c.tint * TINT_STEPS));
      const key = `${li}|${ti}`;
      let arr = buckets.get(key);
      if (!arr) buckets.set(key, (arr = []));
      const s = leaf * range(rng, 0.7, 1.5);
      arr.push(x, y, s, s * range(rng, 0.45, 0.75), rng() * Math.PI);
    }
  }
  // 알파는 키에 같이 담아 둔다
  const out: Bucket = new Map();
  for (const [k, v] of buckets) out.set(`${k}|${opts.alpha}`, v);
  return out;
}

function fillBuckets(ctx: CanvasRenderingContext2D, buckets: Bucket) {
  for (const [key, arr] of buckets) {
    const [li, ti, alpha] = key.split("|").map(Number);
    ctx.fillStyle = leafColor(li / (LUM_STEPS - 1), ti / (TINT_STEPS - 1), alpha);
    ctx.beginPath();
    for (let i = 0; i < arr.length; i += 5) {
      const x = arr[i], y = arr[i + 1];
      ctx.moveTo(x + arr[i + 2], y);
      ctx.ellipse(x, y, arr[i + 2], arr[i + 3], arr[i + 4], 0, Math.PI * 2);
    }
    ctx.fill();
  }
}

function branchOutline(b: Branch, steps = 14) {
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = qPoint(b, t);
    const q = qPoint(b, Math.min(1, t + 0.01));
    const r = qPoint(b, Math.max(0, t - 0.01));
    const dx = q.x - r.x, dy = q.y - r.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const w = (b.w0 + (b.w1 - b.w0) * t) / 2;
    left.push({ x: p.x + nx * w, y: p.y + ny * w });
    right.push({ x: p.x - nx * w, y: p.y - ny * w });
  }
  return { left, right };
}

function drawBranches(ctx: CanvasRenderingContext2D, layout: TreeLayout, rng: Rng) {
  const sorted = [...layout.branches].sort((a, b) => b.depth - a.depth);
  for (const b of sorted) {
    const { left, right } = branchOutline(b);
    ctx.beginPath();
    ctx.moveTo(left[0].x, left[0].y);
    for (const p of left) ctx.lineTo(p.x, p.y);
    for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
    ctx.closePath();
    ctx.fillStyle = b.depth <= 1 ? "#1c1813" : "#16130f";
    ctx.fill();
    // 위쪽 가장자리에 스치는 달빛
    const upper = left[0].y < right[0].y ? left : right;
    ctx.beginPath();
    upper.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.strokeStyle = `rgba(150,175,150,${b.depth <= 1 ? 0.22 : 0.12})`;
    ctx.lineWidth = Math.max(0.6, b.w0 * 0.12);
    ctx.stroke();
    // 굵은 가지 위 이끼
    if (b.depth <= 1) {
      for (let i = 0; i < 40; i++) {
        const t = rng();
        const p = qPoint(b, t);
        const w = (b.w0 + (b.w1 - b.w0) * t) / 2;
        ctx.fillStyle = `rgba(${40 + rng() * 30},${70 + rng() * 40},${40 + rng() * 20},${0.25 + rng() * 0.3})`;
        ctx.beginPath();
        ctx.ellipse(p.x + gauss(rng) * w * 0.3, p.y - w * range(rng, 0.3, 0.8), w * range(rng, 0.15, 0.4), w * range(rng, 0.08, 0.2), rng(), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function drawTrunk(ctx: CanvasRenderingContext2D, layout: TreeLayout, rng: Rng) {
  const { baseX: bx, baseY: by, unit } = layout;
  const top = by - unit * 0.19;
  const wb = unit * 0.13;
  const wt = unit * 0.085;

  // 뿌리
  for (let i = 0; i < 9; i++) {
    const side = i % 2 ? 1 : -1;
    const sx = bx + side * wb * range(rng, 0.15, 0.45);
    const ex = bx + side * unit * range(rng, 0.1, 0.3);
    const ey = by + unit * range(rng, -0.004, 0.03);
    const w = unit * range(rng, 0.018, 0.034);
    const root: Branch = {
      x0: sx, y0: by - unit * 0.035,
      cx: (sx + ex) / 2 + side * unit * 0.02, cy: by - unit * 0.01,
      x1: ex, y1: ey, w0: w, w1: 1, depth: 9,
    };
    const { left, right } = branchOutline(root);
    ctx.beginPath();
    left.forEach((p, k) => (k ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    for (let k = right.length - 1; k >= 0; k--) ctx.lineTo(right[k].x, right[k].y);
    ctx.closePath();
    ctx.fillStyle = "#1a1612";
    ctx.fill();
    ctx.strokeStyle = "rgba(140,160,130,0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    left.forEach((p, k) => (k ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.stroke();
  }

  // 줄기 외곽 — 밑동이 넓게 퍼진다
  const path = new Path2D();
  path.moveTo(bx - wb * 0.9, by + unit * 0.005);
  path.bezierCurveTo(bx - wb * 0.5, by - unit * 0.02, bx - wt * 0.5, by - unit * 0.08, bx - wt * 0.55, top);
  path.lineTo(bx + wt * 0.55, top);
  path.bezierCurveTo(bx + wt * 0.5, by - unit * 0.08, bx + wb * 0.5, by - unit * 0.02, bx + wb * 0.9, by + unit * 0.005);
  path.closePath();

  const g = ctx.createLinearGradient(bx - wb, 0, bx + wb, 0);
  g.addColorStop(0, "#0f0d0b");
  g.addColorStop(0.3, "#2a241d");
  g.addColorStop(0.55, "#211c17");
  g.addColorStop(1, "#0b0a08");
  ctx.fillStyle = g;
  ctx.fill(path);

  ctx.save();
  ctx.clip(path);
  // 세로로 갈라진 수피
  for (let i = 0; i < 170; i++) {
    let x = bx + gauss(rng) * wb * 0.7;
    let y = by + unit * 0.01;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const len = unit * range(rng, 0.05, 0.22);
    const steps = 8;
    for (let s = 0; s < steps; s++) {
      y -= len / steps;
      x += (bx - x) * 0.04 + gauss(rng) * unit * 0.0025;
      ctx.lineTo(x, y);
    }
    const light = rng() < 0.35;
    ctx.strokeStyle = light ? `rgba(120,115,95,${range(rng, 0.08, 0.2)})` : `rgba(0,0,0,${range(rng, 0.25, 0.55)})`;
    ctx.lineWidth = range(rng, 0.6, 2.2);
    ctx.stroke();
  }
  // 오래된 나무의 옹이와 구멍
  const knots: [number, number, number][] = [
    [-0.18, 0.09, 0.012],
    [0.22, 0.14, 0.008],
    [0.05, 0.05, 0.016],
  ];
  for (const [kx, ky, kr] of knots) {
    const x = bx + kx * wb * 2;
    const y = by - unit * ky;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.beginPath();
    ctx.ellipse(x, y, unit * kr * 0.7, unit * kr * 1.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(120,110,90,0.18)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  // 왼쪽 위 달빛, 오른쪽 그늘
  const shade = ctx.createLinearGradient(bx - wb, top, bx + wb, by);
  shade.addColorStop(0, "rgba(150,180,150,0.10)");
  shade.addColorStop(0.5, "rgba(0,0,0,0)");
  shade.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = shade;
  ctx.fillRect(bx - wb, top, wb * 2, by - top + 10);
  // 밑동의 이끼
  for (let i = 0; i < 260; i++) {
    const x = bx + gauss(rng) * wb * 0.8;
    const y = by - Math.abs(gauss(rng)) * unit * 0.07;
    ctx.fillStyle = `rgba(${30 + rng() * 40},${60 + rng() * 60},${30 + rng() * 25},${range(rng, 0.15, 0.45)})`;
    ctx.beginPath();
    ctx.ellipse(x, y, unit * range(rng, 0.002, 0.006), unit * range(rng, 0.001, 0.003), rng() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawGround(ctx: CanvasRenderingContext2D, layout: TreeLayout, rng: Rng) {
  const { baseX: bx, baseY: by, unit } = layout;
  ctx.save();
  ctx.translate(bx, by + unit * 0.02);
  ctx.scale(1, 0.16);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, unit * 0.75);
  g.addColorStop(0, "rgba(22,44,28,0.9)");
  g.addColorStop(0.5, "rgba(12,26,17,0.55)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, unit * 0.75, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 풀
  for (let i = 0; i < 700; i++) {
    const x = bx + gauss(rng) * unit * 0.42;
    const d = Math.abs(x - bx) / (unit * 0.6);
    const y = by + unit * 0.02 + gauss(rng) * unit * 0.025 * (1 - d * 0.5);
    const hgt = unit * range(rng, 0.006, 0.02) * (1 - d * 0.6);
    const lean = gauss(rng) * hgt * 0.6;
    ctx.strokeStyle = `rgba(${20 + rng() * 30},${45 + rng() * 55},${25 + rng() * 25},${range(rng, 0.25, 0.7) * (1 - d * 0.7)})`;
    ctx.lineWidth = range(rng, 0.6, 1.3);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + lean * 0.3, y - hgt * 0.6, x + lean, y - hgt);
    ctx.stroke();
  }
}

function addGrain(ctx: CanvasRenderingContext2D, w: number, h: number, rng: Rng) {
  const size = 160;
  const noise = document.createElement("canvas");
  noise.width = noise.height = size;
  const nctx = noise.getContext("2d")!;
  const img = nctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + gauss(rng) * 90;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  nctx.putImageData(img, 0, 0);
  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  ctx.globalAlpha = 0.09;
  ctx.fillStyle = ctx.createPattern(noise, "repeat")!;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/** 세계수를 오프스크린 캔버스에 한 번 그려 돌려준다. (CSS 픽셀 좌표, dpr 배율) */
export function renderTree(layout: TreeLayout, w: number, h: number, dpr: number, seed = 777): HTMLCanvasElement {
  const rng = mulberry32(seed);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  const { crown, unit } = layout;

  // 수관 뒤의 희미한 빛 — 어둠 속 실루엣이 살아나도록
  const glow = ctx.createRadialGradient(crown.cx, crown.cy, 0, crown.cx, crown.cy, unit * 0.78);
  glow.addColorStop(0, "rgba(46,120,78,0.20)");
  glow.addColorStop(0.5, "rgba(22,70,45,0.09)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  drawGround(ctx, layout, rng);

  const clumps = makeClumps(layout, rng);
  const back = stampClumps(clumps, layout, rng, { density: 0.32, lumScale: 0.42, lumBias: 0.02, alpha: 0.9, offY: -0.012, grow: 1.12 });
  const mid = stampClumps(clumps, layout, rng, { density: 0.3, lumScale: 0.78, lumBias: 0.02, alpha: 0.82, offY: 0, grow: 0.96 });
  const high = stampClumps(clumps, layout, rng, { density: 0.12, lumScale: 0.95, lumBias: 0.1, alpha: 0.75, offY: -0.004, grow: 0.85, topOnly: true });

  fillBuckets(ctx, back);
  drawBranches(ctx, layout, rng);
  drawTrunk(ctx, layout, rng);
  fillBuckets(ctx, mid);
  fillBuckets(ctx, high);

  addGrain(ctx, w, h, rng);
  return canvas;
}
