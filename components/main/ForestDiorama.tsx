"use client";

import { useEffect, useRef } from "react";
import type { InstancedMesh } from "three";

const MAP = "/maps/tree.png";
const CELL = 39; // 지도 그림에서 한 칸의 픽셀 크기
const COLS = 24;
const ROWS = 876 / CELL;

// 지도에서 나무가 있는 칸. # = 나무, + = 가장자리 (절반만 심는다), . = 빈 땅
const FOREST = [
  ".+.+.+.+.+.+.+.+........",
  "########################",
  "#########+##############",
  "########+.+#############",
  "#######+...#############",
  "#######+...##+....######",
  "######+#######....######",
  "#####..######.....######",
  "####....+..#......######",
  "####....+..##.....+#####",
  "####..............######",
  "####+.............######",
  "#####+............######",
  "######+...........######",
  "#######..........#######",
  "#######..#+...#+.#######",
  "#######+.#....#..#######",
  "#######.+#+...#+.#######",
  "#######..#....#..#######",
  "#######..#+...#+.#######",
  "#######+.#....#..#######",
  "#######++#....#+.#######",
];

// 세계수 자리 (칸 단위). 이 둘레의 작은 나무는 지운다
const WORLD_TREE = { x: 10.1, z: 9.4, r: 3.9 };

// 늘 같은 숲이 나오도록 고정된 난수
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

type Tree = { x: number; z: number; s: number; delay: number; hue: number };

function plantTrees(): Tree[] {
  const rand = rng(7);
  const trees: Tree[] = [];
  FOREST.forEach((row, cz) =>
    [...row].forEach((c, cx) => {
      if (c === "." || (cx + cz) % 2 || (c === "+" && rand() < 0.5)) return;
      const x = cx + 0.5 + (rand() - 0.5) * 0.3;
      const z = cz + 0.5 + (rand() - 0.5) * 0.3;
      if (Math.hypot(x - WORLD_TREE.x, (z - (WORLD_TREE.z - 3)) * 0.9) < WORLD_TREE.r) return;
      const d = Math.hypot(x - WORLD_TREE.x, z - WORLD_TREE.z);
      trees.push({ x, z, s: 1.25 + rand() * 0.35, delay: 0.25 + d / 18 + rand() * 0.1, hue: rand() });
    }),
  );
  return trees;
}

/** 나무 그림을 지운 땅 그림. 3D 나무가 그 위에 선다 */
function paintGround(img: HTMLImageElement) {
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const g = c.getContext("2d")!;
  g.drawImage(img, 0, 0);
  const rand = rng(3);
  const fill = (x: number, y: number, w: number, h: number, base: [number, number, number]) => {
    g.fillStyle = `rgb(${base})`;
    g.fillRect(x, y, w, h);
    // 도트 느낌의 풀 무늬
    for (let i = 0; i < (w * h) / 60; i++) {
      const k = rand() < 0.5 ? -14 : 12;
      g.fillStyle = `rgb(${base.map((v) => v + k)})`;
      g.fillRect(x + Math.floor((rand() * w) / 4) * 4, y + Math.floor((rand() * h) / 4) * 4, 4, 4);
    }
  };
  FOREST.forEach((row, cz) =>
    [...row].forEach((ch, cx) => {
      if (ch !== "." && cz > 0) fill(cx * CELL, cz * CELL, CELL, CELL, [70, 138, 38]);
    }),
  );
  // 세계수 그림 자리
  g.save();
  g.beginPath();
  g.ellipse(392, 230, 150, 150, 0, 0, Math.PI * 2);
  g.ellipse(395, 360, 110, 50, 0, 0, Math.PI * 2);
  g.clip();
  fill(230, 70, 330, 350, [124, 192, 66]);
  g.restore();
  return c;
}

export default function ForestDiorama({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current!;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const img = new Image();
      await new Promise((ok, fail) => {
        img.onload = ok;
        img.onerror = fail;
        img.src = MAP;
      });
      if (disposed) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);

      // 지도 한가운데를 원점으로
      const ox = COLS / 2;
      const oz = ROWS / 2;
      const at = (x: number, z: number) => [x - ox, z - oz] as const;

      // 땅: 윗면은 지도, 옆면은 흙
      const tex = new THREE.CanvasTexture(paintGround(img));
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      const dirt = new THREE.MeshLambertMaterial({ color: 0x7a4e2a });
      const dirtDark = new THREE.MeshLambertMaterial({ color: 0x3a2412 });
      const top = new THREE.MeshLambertMaterial({ map: tex });
      const ground = new THREE.Mesh(new THREE.BoxGeometry(COLS, 1.6, ROWS), [dirt, dirt, top, dirtDark, dirt, dirt]);
      ground.position.y = -0.8;
      ground.receiveShadow = true;
      scene.add(ground);
      // 흙 아래 잔디 띠
      const lip = new THREE.Mesh(new THREE.BoxGeometry(COLS + 0.02, 0.18, ROWS + 0.02), new THREE.MeshLambertMaterial({ color: 0x4f9a2e }));
      lip.position.y = -0.1;
      scene.add(lip);

      // 작은 나무들: 줄기 + 2단 잎
      const trees = plantTrees();
      const box = new THREE.BoxGeometry(1, 1, 1);
      const trunk = new THREE.InstancedMesh(box, new THREE.MeshLambertMaterial({ color: 0x6b4423 }), trees.length);
      const leafLo = new THREE.InstancedMesh(box, new THREE.MeshLambertMaterial(), trees.length);
      const leafHi = new THREE.InstancedMesh(box, new THREE.MeshLambertMaterial(), trees.length);
      const greens = [0x3f8a2a, 0x4c9a30, 0x58a836, 0x367a24].map((c) => new THREE.Color(c));
      trees.forEach((t, i) => {
        const c = greens[Math.floor(t.hue * greens.length)];
        leafLo.setColorAt(i, c);
        leafHi.setColorAt(i, c.clone().offsetHSL(0, 0, 0.07));
      });
      for (const m of [trunk, leafLo, leafHi]) {
        m.castShadow = true;
        m.receiveShadow = true;
        scene.add(m);
      }

      // 세계수
      const world = new THREE.Group();
      const [wx, wz] = at(WORLD_TREE.x, WORLD_TREE.z);
      world.position.set(wx, 0, wz);
      const part = (w: number, h: number, d: number, x: number, y: number, z: number, color: number) => {
        const m = new THREE.Mesh(box, new THREE.MeshLambertMaterial({ color }));
        m.scale.set(w, h, d);
        m.position.set(x, y + h / 2, z);
        m.castShadow = true;
        m.receiveShadow = true;
        world.add(m);
      };
      part(1.0, 4.4, 1.0, 0, 0, 0, 0x5a3a1e);
      part(1.8, 0.45, 0.6, 0, 0, 0, 0x4a2e16);
      part(0.6, 0.45, 1.8, 0, 0, 0, 0x4a2e16);
      part(1.8, 0.5, 0.5, 0.8, 3.0, 0, 0x5a3a1e);
      part(0.5, 0.5, 1.6, -0.2, 3.4, -0.6, 0x5a3a1e);
      part(4.4, 2.0, 4.0, 0, 3.6, -0.3, 0x3f8a2a);
      part(2.6, 1.8, 2.6, -1.8, 4.3, 0.7, 0x4c9a30);
      part(2.6, 1.8, 2.6, 1.9, 4.5, 0.4, 0x4c9a30);
      part(3.4, 1.8, 3.2, 0, 5.4, -0.6, 0x58a836);
      part(2.2, 1.4, 2.2, 0.4, 6.9, -0.4, 0x6fbb44);
      part(1.6, 1.2, 1.6, -1.1, 6.3, -1.7, 0x63ad3e);
      part(1.2, 0.9, 1.2, 1.3, 7.7, -0.2, 0x8fd05a);
      part(0.9, 0.7, 0.9, -0.5, 8.2, -0.6, 0xa6dd6c);
      scene.add(world);

      scene.add(new THREE.HemisphereLight(0xeaf6ff, 0x3a3020, 1.6));
      const sun = new THREE.DirectionalLight(0xfff1d6, 2.4);
      sun.position.set(-10, 18, 8);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16 });
      sun.shadow.bias = -0.0005;
      sun.shadow.normalBias = 0.06;
      scene.add(sun);

      // 자라나기 (화면에 처음 보일 때 한 번)
      const tmp = new THREE.Object3D();
      const ease = (k: number) => {
        const c = 1.7;
        k = Math.min(Math.max(k, 0), 1) - 1;
        return 1 + (c + 1) * k * k * k + c * k * k;
      };
      const grow = (t: number) => {
        trees.forEach((tr, i) => {
          const k = ease((t - tr.delay) / 0.7) * tr.s;
          const [x, z] = at(tr.x, tr.z);
          const set = (m: InstancedMesh, w: number, h: number, y: number) => {
            tmp.position.set(x, y * k + (h * k) / 2, z);
            tmp.scale.set(w * Math.max(k, 0.001), h * Math.max(k, 0.001), w * Math.max(k, 0.001));
            tmp.updateMatrix();
            m.setMatrixAt(i, tmp.matrix);
          };
          set(trunk, 0.24, 0.6, 0);
          set(leafLo, 1.0, 0.7, 0.45);
          set(leafHi, 0.62, 0.5, 1.1);
        });
        for (const m of [trunk, leafLo, leafHi]) m.instanceMatrix.needsUpdate = true;
        const w = ease(t / 0.9);
        world.scale.set(Math.max(w, 0.001), Math.max(w, 0.001), Math.max(w, 0.001));
      };
      grow(reduce ? 9 : 0);

      // 크기와 카메라. 마우스로는 아주 살짝만 움직인다
      const look = new THREE.Vector3(wx, 1.2, wz - 1.5);
      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2) * 0.5);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        const half = Math.tan(((camera.fov / 2) * Math.PI) / 180);
        camera.userData.dist = Math.max(17 / half, 14.5 / (half * camera.aspect));
        camera.setViewOffset(w, h, 0, h * 0.12, w, h);
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      const pointer = { x: 0, y: 0 };
      const cam = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        pointer.x = e.clientX / window.innerWidth - 0.5;
        pointer.y = e.clientY / window.innerHeight - 0.5;
      };
      window.addEventListener("pointermove", onMove);

      let start = -1;
      let raf = 0;
      let visible = false;
      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        if (!reduce) {
          if (start < 0) start = now;
          const t = (now - start) / 1000;
          if (t < 3) grow(t);
          cam.x += (pointer.x - cam.x) * 0.04;
          cam.y += (pointer.y - cam.y) * 0.04;
        }
        const d = camera.userData.dist as number;
        const yaw = -0.18 + cam.x * 0.12;
        const pitch = 0.8 - cam.y * 0.05;
        camera.position.set(look.x + Math.sin(yaw) * Math.cos(pitch) * d, look.y + Math.sin(pitch) * d, look.z + Math.cos(yaw) * Math.cos(pitch) * d);
        camera.lookAt(look);
        renderer.render(scene, camera);
      };
      // 화면에 보일 때만 그린다
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(frame);
      });
      io.observe(host);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        renderer.dispose();
        tex.dispose();
        box.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={ref} className={className} aria-hidden="true" />;
}
