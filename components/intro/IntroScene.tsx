"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createScene } from "./scene";
import styles from "./IntroScene.module.css";

type Props = { onEnter: () => void };

export default function IntroScene({ onEnter }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<ReturnType<typeof createScene> | null>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const scene = createScene(canvasRef.current!, {
      tree: true,
      fireflyDensity: 1,
      background: "#000",
      interactive: true,
    });
    sceneRef.current = scene;
    return () => scene.destroy();
  }, []);

  const enter = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    sceneRef.current?.pulse();
    navigator.vibrate?.(40);
    window.setTimeout(onEnter, 1150);
  }, [leaving, onEnter]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") enter();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enter]);

  return (
    <div
      className={`${styles.intro} ${leaving ? styles.leaving : ""}`}
      onClick={enter}
      role="button"
      tabIndex={0}
      aria-label="화면을 눌러 로스트버스터 홈페이지로 들어가기"
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.caption}>
        <p className={styles.logo}>LOSTBUSTER</p>
        <p className={styles.hint}>화면을 눌러 숲으로</p>
      </div>
      <div className={styles.flash} />
    </div>
  );
}
