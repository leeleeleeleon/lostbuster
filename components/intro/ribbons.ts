import type { Spirit } from "@/lib/spirits";

// 세계수 가지에 묶인 오색천 10개. 마디를 스프링으로 이은 verlet 체인이
// 바람을 받아 나부낀다.

type Node = { x: number; y: number; px: number; py: number };

type Ribbon = {
  nodes: Node[];
  seg: number;
  width: number;
  color: [number, number, number];
  glow: string;
  dark: boolean;
  phase: number;
};

const NODES = 11;
// 흰 천 두 개(3, 6번)는 길이를 다르게 해 서로 구분되도록
const LENGTHS = [1, 0.86, 1.08, 0.9, 1, 1.04, 1.28, 0.94, 1.12, 0.88];

const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export type Ribbons = ReturnType<typeof createRibbons>;

export function createRibbons(anchors: { x: number; y: number }[], unit: number, spirits: Spirit[]) {
  const ribbons: Ribbon[] = anchors.map((a, i) => {
    const seg = unit * 0.0165 * LENGTHS[i];
    const nodes: Node[] = [];
    for (let k = 0; k < NODES; k++) nodes.push({ x: a.x, y: a.y + k * seg, px: a.x, py: a.y + k * seg });
    const s = spirits[i];
    return {
      nodes,
      seg,
      width: unit * 0.024,
      color: hexToRgb(s.color),
      glow: s.glow,
      dark: s.id === "geuneul",
      phase: i * 1.37,
    };
  });

  const gravity = unit * 1.5;
  const step = 1 / 60;
  let acc = 0;

  function update(dt: number, t: number, anchorAt: (i: number) => { x: number; y: number }, calm = false) {
    acc = Math.min(acc + dt, step * 4);
    while (acc >= step) {
      acc -= step;
      ribbons.forEach((r, i) => {
        const a = anchorAt(i);
        const gust = 0.5 + 0.5 * Math.sin(t * 0.37) * Math.sin(t * 0.23 + 1.3);
        const wind = calm ? 0.05 : (0.12 + 0.16 * Math.sin(t * 0.6 + r.phase) + 0.22 * gust) * gravity;
        r.nodes.forEach((n, k) => {
          if (k === 0) {
            n.x = n.px = a.x;
            n.y = n.py = a.y;
            return;
          }
          const f = k / (NODES - 1);
          const flutter = calm ? 0 : (Math.sin(t * 3.1 + r.phase - k * 0.9) + 0.5 * Math.sin(t * 5.3 + r.phase * 2 - k * 1.4)) * gravity * 0.32 * f;
          const vx = (n.x - n.px) * 0.975;
          const vy = (n.y - n.py) * 0.975;
          n.px = n.x;
          n.py = n.y;
          n.x += vx + (wind * (0.4 + f) + flutter) * step * step;
          n.y += vy + (gravity - flutter * 0.4) * step * step;
        });
        for (let it = 0; it < 6; it++) {
          for (let k = 1; k < NODES; k++) {
            const p = r.nodes[k - 1];
            const q = r.nodes[k];
            const dx = q.x - p.x, dy = q.y - p.y;
            const d = Math.hypot(dx, dy) || 0.0001;
            const diff = (d - r.seg) / d;
            if (k === 1) {
              q.x -= dx * diff;
              q.y -= dy * diff;
            } else {
              p.x += dx * diff * 0.5;
              p.y += dy * diff * 0.5;
              q.x -= dx * diff * 0.5;
              q.y -= dy * diff * 0.5;
            }
          }
          r.nodes[0].x = a.x;
          r.nodes[0].y = a.y;
        }
      });
    }
  }

  /** 박동 때 천이 바깥쪽으로 튕겨 나가도록 */
  function impulse(cx: number, cy: number, strength: number) {
    for (const r of ribbons) {
      r.nodes.forEach((n, k) => {
        const dx = n.x - cx, dy = n.y - cy;
        const d = Math.hypot(dx, dy) || 1;
        const s = strength * (k / NODES);
        n.px -= (dx / d) * s;
        n.py -= (dy / d) * s - s * 0.3;
      });
    }
  }

  function draw(ctx: CanvasRenderingContext2D, t: number) {
    for (const r of ribbons) {
      const n = r.nodes;
      const L: { x: number; y: number }[] = [];
      const R: { x: number; y: number }[] = [];
      const shades: number[] = [];
      for (let k = 0; k < NODES; k++) {
        const a = n[Math.max(0, k - 1)];
        const b = n[Math.min(NODES - 1, k + 1)];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        const nx = -dy / d, ny = dx / d;
        const twist = Math.cos(t * 0.9 + r.phase + k * 0.38);
        const w = (r.width * (0.85 + 0.25 * Math.sin((k / NODES) * Math.PI)) * (0.4 + 0.6 * Math.abs(twist))) / 2;
        L.push({ x: n[k].x + nx * w, y: n[k].y + ny * w });
        R.push({ x: n[k].x - nx * w, y: n[k].y - ny * w });
        shades.push(twist);
      }

      // 은은한 자체발광
      ctx.save();
      ctx.shadowColor = r.glow;
      ctx.shadowBlur = r.width * (r.dark ? 1.2 : 1.6);
      ctx.globalAlpha = r.dark ? 0.55 : 0.5;
      ctx.beginPath();
      ctx.moveTo(L[0].x, L[0].y);
      for (const p of L) ctx.lineTo(p.x, p.y);
      for (let k = R.length - 1; k >= 0; k--) ctx.lineTo(R[k].x, R[k].y);
      ctx.closePath();
      ctx.fillStyle = `rgb(${r.color.join(",")})`;
      ctx.fill();
      ctx.restore();

      // 꼬임에 따라 면마다 다른 명암
      for (let k = 0; k < NODES - 1; k++) {
        const s = (shades[k] + shades[k + 1]) / 2;
        const [cr, cg, cb] = r.color;
        let rr: number, gg: number, bb: number;
        if (r.dark) {
          const sheen = 18 + 38 * Math.max(0, s);
          rr = cr + sheen; gg = cg + sheen; bb = cb + sheen * 1.15;
        } else {
          const k2 = s >= 0 ? 0.92 + 0.08 * s : 0.62 + 0.3 * (1 + s);
          rr = cr * k2; gg = cg * k2; bb = cb * k2;
        }
        ctx.fillStyle = `rgba(${rr | 0},${gg | 0},${bb | 0},0.94)`;
        ctx.beginPath();
        ctx.moveTo(L[k].x, L[k].y);
        ctx.lineTo(L[k + 1].x, L[k + 1].y);
        ctx.lineTo(R[k + 1].x, R[k + 1].y);
        ctx.lineTo(R[k].x, R[k].y);
        ctx.closePath();
        ctx.fill();
      }
      if (r.dark) {
        // 검은 천의 가장자리 광택
        ctx.strokeStyle = "rgba(190,205,225,0.28)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        L.forEach((p, k) => (k ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        ctx.stroke();
      }

      // 끝의 해진 올
      const last = n[NODES - 1];
      const prev = n[NODES - 2];
      const dx = last.x - prev.x, dy = last.y - prev.y;
      ctx.strokeStyle = `rgba(${r.color.map((c) => (r.dark ? c + 40 : c)).join(",")},0.7)`;
      ctx.lineWidth = 0.7;
      for (let f = 0; f < 5; f++) {
        const off = (f - 2) / 2;
        const sx = last.x + (L[NODES - 1].x - last.x) * off;
        const sy = last.y + (L[NODES - 1].y - last.y) * off;
        const sway = Math.sin(t * 2.6 + f + r.phase) * r.width * 0.25;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(sx + dx * 0.35 + sway, sy + dy * 0.35, sx + dx * (0.45 + f * 0.05) + sway * 1.6, sy + dy * (0.5 + (f % 2) * 0.12));
        ctx.stroke();
      }

      // 가지에 감긴 매듭
      const a = n[0];
      // 가지를 한 바퀴 감아 묶은 자리: 천보다 조금 넓고 어두운 띠 + 짧은 꼬리
      const knot = `rgb(${r.color.map((c) => (r.dark ? c + 22 : c * 0.72) | 0).join(",")})`;
      ctx.fillStyle = knot;
      ctx.beginPath();
      ctx.ellipse(a.x, a.y, r.width * 0.62, r.width * 0.26, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = knot;
      ctx.lineWidth = r.width * 0.28;
      ctx.lineCap = "round";
      const tail = Math.sin(t * 2.2 + r.phase) * r.width * 0.3;
      ctx.beginPath();
      ctx.moveTo(a.x + r.width * 0.3, a.y);
      ctx.quadraticCurveTo(a.x + r.width * 0.9, a.y + r.width * 0.4, a.x + r.width * 0.8 + tail, a.y + r.width * 1.3);
      ctx.stroke();
      ctx.lineCap = "butt";
    }
  }

  return { update, draw, impulse };
}
