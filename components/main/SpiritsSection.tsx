"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { SPIRITS, type Spirit } from "@/lib/spirits";
import Reveal from "./Reveal";
import styles from "./SpiritsSection.module.css";

const vars = (s: Spirit) => ({ "--c": s.color, "--g": s.glow }) as CSSProperties;

export default function SpiritsSection() {
  const [active, setActive] = useState<Spirit | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <section id="spirits" className={styles.section}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">SPIRITS</p>
          <h2 className="section-title">열 개의 천, 열 명의 정령</h2>
          <p className={styles.lead}>세계수에 걸린 천의 빛깔은 그 천을 묶은 정령의 빛깔이다.</p>
        </Reveal>
        <ul className={styles.grid}>
          {SPIRITS.map((s, i) => (
            <li key={s.id}>
              <Reveal delay={(i % 5) * 80}>
                <button className={styles.card} style={vars(s)} data-dark={s.id === "geuneul" || undefined} onClick={() => setActive(s)}>
                  <span className={styles.ribbon} />
                  <span className={styles.orb} />
                  <span className={styles.romaji}>{s.romaji}</span>
                  <span className={styles.name}>{s.name}</span>
                  <span className={styles.title}>{s.title}</span>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      {active && (
        <div className={styles.backdrop} onClick={() => setActive(null)}>
          <div
            className={styles.modal}
            style={vars(active)}
            role="dialog"
            aria-modal="true"
            aria-label={active.name}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.close} onClick={() => setActive(null)} aria-label="닫기">
              ×
            </button>
            <span className={`${styles.orb} ${styles.orbLarge}`} />
            <p className={styles.romaji}>{active.romaji}</p>
            <h3 className={styles.modalName}>{active.name}</h3>
            <p className={styles.title}>{active.title}</p>
            <p className={styles.summary}>{active.summary}</p>
            <p className={styles.story}>{active.story}</p>
          </div>
        </div>
      )}
    </section>
  );
}
