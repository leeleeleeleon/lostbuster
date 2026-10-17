"use client";

import { useEffect, useRef } from "react";
import { createScene, type SceneOptions } from "../intro/scene";

type Props = Partial<SceneOptions> & { className?: string };

/** 메인 페이지 곳곳에서 인트로의 세계수/반딧불이를 다시 쓰기 위한 캔버스 */
export default function AmbientCanvas({ className, tree = false, fireflyDensity = 0.5, background = null, interactive = false }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const scene = createScene(ref.current!, { tree, fireflyDensity, background, interactive });
    return () => scene.destroy();
  }, [tree, fireflyDensity, background, interactive]);
  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
