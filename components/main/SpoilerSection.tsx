"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, type CSSProperties } from "react";
import { VILLAINS } from "@/lib/villains";
import PixelWindow from "./PixelWindow";
import Reveal from "./Reveal";
import styles from "./SpoilerSection.module.css";

export default function SpoilerSection() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  // 사진 파일이 아직 없는 악당은 점선 칸으로 대신한다
  const [missing, setMissing] = useState<Set<string>>(new Set());

  return (
    <section id="spoiler" className={styles.section}>
      <div className="container">
        <Reveal className={styles.head}>
          <div>
            <p className={styles.kicker}>SPOILER</p>
            <h2 className="section-title">베일 너머</h2>
          </div>
          <p className={styles.lead}>아래로는 게임의 스포일러가 등장합니다. 주의해주세요.</p>
        </Reveal>

        <div className={styles.stage}>
          {/* 캐릭터 셀렉트: 고른 띠가 넓게 펼쳐진다 */}
          <ul className={`${styles.row} ${open ? "" : styles.veiled}`} aria-hidden={!open}>
            {VILLAINS.map((v, i) => (
              <li
                key={v.id}
                className={`${styles.card} ${i === active ? styles.on : ""}`}
                style={{ "--c": v.color } as CSSProperties}
                tabIndex={open ? 0 : -1}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className={styles.vname}>{v.name}</span>
                <div className={styles.photo}>
                  {missing.has(v.id) ? (
                    <div className={styles.slot}>
                      <i>?</i>
                      <code>villains/{v.id}.png</code>
                    </div>
                  ) : (
                    <img
                      src={`/villains/${v.id}.png`}
                      alt={v.name}
                      onError={() => setMissing((m) => new Set(m).add(v.id))}
                    />
                  )}
                </div>
                <div className={styles.info}>
                  <h3>{v.name}</h3>
                  <p>{v.desc}</p>
                  {v.tags.map((t) => (
                    <em key={t}>{t}</em>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          {!open && (
            <PixelWindow as="button" interactive className={styles.gate} onClick={() => setOpen(true)}>
              ▶ 스포일러 보기
            </PixelWindow>
          )}
        </div>
      </div>
    </section>
  );
}
