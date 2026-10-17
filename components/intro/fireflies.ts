// 세계수 주위를 떠도는 반딧불이 같은 빛들

type Fly = {
  x: number; y: number;
  vx: number; vy: number;
  phase: number;
  blink: number; // 깜빡임 속도
  speed: number;
  size: number;
  steady: boolean; // 깜빡이지 않고 은은히 떠 있는 빛
  warm: boolean;
};

export type Region = { cx: number; cy: number; rx: number; ry: number };

function sprite(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,240,1)");
  grd.addColorStop(0.12, inner);
  grd.addColorStop(0.4, outer);
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return c;
}

export type Fireflies = ReturnType<typeof createFireflies>;

export function createFireflies(w: number, h: number, count: number, region: Region | null) {
  const warm = sprite("rgba(236,255,150,0.9)", "rgba(190,230,80,0.18)");
  const cool = sprite("rgba(170,255,190,0.9)", "rgba(80,210,140,0.16)");

  const spawn = (): Fly => {
    let x: number, y: number;
    if (region && Math.random() < 0.8) {
      const a = Math.random() * Math.PI * 2;
      const d = Math.sqrt(Math.random()) * 1.25;
      x = region.cx + Math.cos(a) * region.rx * d;
      y = region.cy + Math.sin(a) * region.ry * d * 1.3;
    } else {
      x = Math.random() * w;
      y = Math.random() * h;
    }
    return {
      x, y, vx: 0, vy: 0,
      phase: Math.random() * Math.PI * 2,
      blink: 0.6 + Math.random() * 1.4,
      speed: 8 + Math.random() * 16,
      size: 0.6 + Math.random() * 0.9,
      steady: Math.random() < 0.3,
      warm: Math.random() < 0.6,
    };
  };

  const flies: Fly[] = Array.from({ length: count }, spawn);
  const pointer = { x: -9999, y: -9999 };

  function update(dt: number, t: number) {
    for (const f of flies) {
      // 느리게 흐르는 방향장
      const ang =
        Math.sin(f.x * 0.0031 + t * 0.21 + f.phase) * Math.PI +
        Math.cos(f.y * 0.0043 - t * 0.17) * Math.PI;
      const tx = Math.cos(ang) * f.speed;
      const ty = Math.sin(ang) * f.speed - 3; // 아주 조금씩 떠오른다
      f.vx += (tx - f.vx) * Math.min(1, dt * 0.9);
      f.vy += (ty - f.vy) * Math.min(1, dt * 0.9);

      if (region) {
        const ex = (f.x - region.cx) / (region.rx * 1.35);
        const ey = (f.y - region.cy) / (region.ry * 1.8);
        const e = ex * ex + ey * ey;
        if (e > 1) {
          f.vx -= ex * (e - 1) * 30 * dt;
          f.vy -= ey * (e - 1) * 30 * dt;
        }
      }

      const dx = f.x - pointer.x, dy = f.y - pointer.y;
      const d = Math.hypot(dx, dy);
      if (d < 110 && d > 0.1) {
        const k = (1 - d / 110) * 260 * dt;
        f.vx += (dx / d) * k;
        f.vy += (dy / d) * k;
      }

      f.x += f.vx * dt;
      f.y += f.vy * dt;
      if (f.x < -40) f.x = w + 30;
      if (f.x > w + 40) f.x = -30;
      if (f.y < -40) f.y = h + 30;
      if (f.y > h + 40) f.y = -30;
    }
  }

  function draw(ctx: CanvasRenderingContext2D, t: number, intensity = 1) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const f of flies) {
      const s = Math.sin(t * f.blink + f.phase);
      const b = f.steady ? 0.45 + 0.2 * s : 0.08 + 0.92 * Math.pow(Math.max(0, s), 4);
      if (b < 0.03) continue;
      const r = f.size * (7 + 15 * b);
      ctx.globalAlpha = Math.min(1, b * intensity);
      ctx.drawImage(f.warm ? warm : cool, f.x - r, f.y - r, r * 2, r * 2);
    }
    ctx.restore();
  }

  /** 중심에서 바깥으로 흩어지게 */
  function burst(cx: number, cy: number, power: number) {
    for (const f of flies) {
      const dx = f.x - cx, dy = f.y - cy;
      const d = Math.hypot(dx, dy) || 1;
      const k = power * (0.6 + Math.random() * 0.8);
      f.vx += (dx / d) * k;
      f.vy += (dy / d) * k;
    }
  }

  function setPointer(x: number, y: number) {
    pointer.x = x;
    pointer.y = y;
  }

  return { update, draw, burst, setPointer };
}
