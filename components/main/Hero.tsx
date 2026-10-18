"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { SPIRITS } from "@/lib/spirits";
import { faceStyle } from "@/lib/rooms";
import PixelWindow from "./PixelWindow";
import styles from "./Hero.module.css";

// 첫 화면 그림은 public/heroes/<id>.png 에 넣으면 자동으로 뜬다. 없으면 스탠딩으로 대신한다
const artOf = (id: string) => `/heroes/${id}.png`;

// 밝은 배경엔 검은 글자, 어두운 배경엔 크림 글자
const inkOn = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const l = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return l > 0.55 ? "#16161a" : "#fff8e4";
};

export default function Hero() {
  const [cur, setCur] = useState(0);
  const [missing, setMissing] = useState<Set<string>>(new Set());
  const chips = useRef<(HTMLButtonElement | null)[]>([]);
  const s = SPIRITS[cur];
  // 검은 정령은 검은 배경에 묻히니 빛 색을 깐다
  const bg = s.dark ? s.glow : s.color;

  // ←→ 로 정령을 바꾼다
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (cur + (e.key === "ArrowRight" ? 1 : SPIRITS.length - 1)) % SPIRITS.length;
    setCur(next);
    chips.current[next]?.focus();
  };

  return (
    <section className={styles.hero} style={{ "--c": bg, "--ink": inkOn(bg) } as CSSProperties}>
      <p className={styles.giant} aria-hidden="true">
        LOST
        <br />
        BUSTER
      </p>

      {/* 모든 그림을 겹쳐 두고 고른 것만 보여서 바꿀 때 깜빡이지 않게 한다 */}
      <div className={styles.stage}>
        {SPIRITS.map((sp, i) => (
          <img
            key={sp.id}
            src={missing.has(sp.id) ? sp.standing : artOf(sp.id)}
            alt={i === cur ? sp.name : ""}
            className={`${styles.art} ${i === cur ? styles.on : ""}`}
            onError={() => setMissing((m) => new Set(m).add(sp.id))}
          />
        ))}
      </div>

      <div className={styles.corner}>
        <h1 className={styles.title}>로스트버스터</h1>
        <PixelWindow as="a" href="#download" interactive className={styles.cta}>
          ▶ 게임 다운로드
        </PixelWindow>
      </div>

      <div className={styles.pick}>
        <p className={styles.now} aria-live="polite">
          No.{String(cur + 1).padStart(2, "0")} {s.name} {s.en !== s.name && <span className={styles.en}>{s.en}</span>}
        </p>
        <PixelWindow className={styles.party} role="tablist" aria-label="정령 고르기" onKeyDown={onKey}>
          {SPIRITS.map((sp, i) => (
            <button
              key={sp.id}
              ref={(el: HTMLButtonElement | null) => {
                chips.current[i] = el;
              }}
              role="tab"
              aria-selected={i === cur}
              aria-label={sp.en !== sp.name ? `${sp.name} ${sp.en}` : sp.name}
              tabIndex={i === cur ? 0 : -1}
              className={`${styles.chip} ${i === cur ? styles.on : ""}`}
              onClick={() => setCur(i)}
            >
              <span style={faceStyle(sp.id)} />
            </button>
          ))}
        </PixelWindow>
      </div>
    </section>
  );
}
