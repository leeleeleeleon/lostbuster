import { SPIRITS } from "@/lib/spirits";
import { createFireflies, type Fireflies } from "./fireflies";
import { createRibbons, type Ribbons } from "./ribbons";
import { layoutTree, renderTree, type TreeLayout } from "./worldTree";

export type SceneOptions = {
  tree: boolean;
  fireflyDensity: number; // 1 = 인트로 기준
  background: string | null; // null이면 투명
  interactive: boolean;
};

const PULSE_MS = 1000;

export function createScene(canvas: HTMLCanvasElement, opts: SceneOptions) {
  const ctx = canvas.getContext("2d")!;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let dpr = 1;
  let w = 0;
  let h = 0;
  let layout: TreeLayout | null = null;
  let treeImg: HTMLCanvasElement | null = null;
  let ribbons: Ribbons | null = null;
  let flies: Fireflies | null = null;
  let pulseAt = -1;
  let raf = 0;
  let last = performance.now();
  let resizeTimer = 0;

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const count = Math.round(Math.max(60, Math.min(150, (w * h) / 11000)) * opts.fireflyDensity);
    if (opts.tree) {
      layout = layoutTree(w, h);
      treeImg = renderTree(layout, w, h, dpr);
      ribbons = createRibbons(layout.anchors, layout.unit, SPIRITS);
      // 처음부터 축 늘어진 상태로 시작하도록 미리 몇 초 돌려 둔다
      for (let i = 0; i < 120; i++) ribbons.update(1 / 60, i / 60, (k) => layout!.anchors[k]);
      flies = createFireflies(w, h, count, layout.crown);
    } else {
      layout = null;
      treeImg = null;
      ribbons = null;
      flies = createFireflies(w, h, count, null);
    }
  }

  // 나무 전체가 밑동을 축으로 아주 살짝 흔들린다
  const swayAt = (t: number) => (reduced ? 0 : Math.sin(t * 0.42) * 0.006 + Math.sin(t * 0.97 + 1.1) * 0.0025);

  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = now / 1000;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (opts.background) {
      ctx.fillStyle = opts.background;
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.clearRect(0, 0, w, h);
    }

    // 박동: 짧게 부풀었다가 살짝 되돌아오는 한 번의 심장 박동
    let p = -1;
    let beat = 0;
    if (pulseAt >= 0) {
      p = (now - pulseAt) / PULSE_MS;
      if (p <= 1) beat = Math.exp(-5.5 * p) * Math.sin(p * Math.PI * 3.2);
    }
    const cx = layout ? layout.crown.cx : w / 2;
    const cy = layout ? layout.crown.cy + layout.crown.ry * 0.4 : h / 2;
    const scale = 1 + (reduced ? 0.02 : 0.11) * beat;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);

    if (layout && treeImg && ribbons) {
      const sway = swayAt(t);
      const by = layout.baseY;
      ctx.save();
      ctx.transform(1, 0, -sway, 1, sway * by, 0);
      ctx.drawImage(treeImg, 0, 0, w, h);
      ctx.restore();
      const anchors = layout.anchors;
      ribbons.update(dt, t, (i) => ({ x: anchors[i].x + sway * (by - anchors[i].y), y: anchors[i].y }), reduced);
      ribbons.draw(ctx, t);
    }

    if (p >= 0 && p <= 1) {
      // 중심에서 퍼져 나가는 빛의 파동
      const R = Math.hypot(w, h) * 0.75 * (1 - Math.pow(1 - p, 2.4));
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const ring = ctx.createRadialGradient(cx, cy, Math.max(0, R * 0.7), cx, cy, Math.max(1, R));
      ring.addColorStop(0, "rgba(120,255,170,0)");
      ring.addColorStop(0.8, `rgba(150,255,190,${0.35 * (1 - p)})`);
      ring.addColorStop(1, "rgba(120,255,170,0)");
      ctx.fillStyle = ring;
      ctx.fillRect(0, 0, w, h);
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.5);
      core.addColorStop(0, `rgba(170,255,200,${0.5 * Math.max(0, beat)})`);
      core.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    if (flies) {
      if (!reduced) flies.update(dt, t);
      flies.draw(ctx, t, opts.tree ? 1 : 0.8);
    }
    ctx.restore();

    raf = requestAnimationFrame(frame);
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(build, 180);
  }

  function onPointer(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    flies?.setPointer(e.clientX - rect.left, e.clientY - rect.top);
  }

  build();
  raf = requestAnimationFrame(frame);
  window.addEventListener("resize", onResize);
  if (opts.interactive) window.addEventListener("pointermove", onPointer);

  return {
    pulse() {
      pulseAt = performance.now();
      if (layout) {
        const cx = layout.crown.cx;
        const cy = layout.crown.cy + layout.crown.ry * 0.4;
        flies?.burst(cx, cy, reduced ? 0 : 260);
        ribbons?.impulse(cx, cy, reduced ? 0 : layout.unit * 0.02);
      }
    },
    destroy() {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
    },
  };
}
