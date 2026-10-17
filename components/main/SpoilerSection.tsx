"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import styles from "./SpoilerSection.module.css";

const ENTRIES = [
  { name: "달", traits: ["자몽산의 세계수를 습격한 인물.", "모든 것이 베일에 싸여 있다."], weapon: "흑마법" },
  { name: "콥", traits: ["공개된 정보 없음."] },
  { name: "소다", traits: ["공개된 정보 없음."] },
  { name: "디가이스", traits: ["공개된 정보 없음."] },
  { name: "군쨩", traits: ["군군의 ■■■ ■■."] },
  { name: "세계수", traits: ["공개된 정보 없음."] },
];

export default function SpoilerSection() {
  const [open, setOpen] = useState(false);

  return (
    <section id="spoiler" className={styles.section}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">스포일러</p>
          <h2 className="section-title">베일 너머</h2>
          <p className={styles.lead}>아래로는 게임의 스포일러가 등장합니다. 주의해주세요.</p>
        </Reveal>

        {open ? (
          <ul className={styles.grid}>
            {ENTRIES.map((e) => (
              <li key={e.name} className={styles.card}>
                <h3 className={styles.name}>{e.name}</h3>
                {e.traits.map((t) => (
                  <p key={t} className={styles.body}>{t}</p>
                ))}
                {e.weapon && <p className={styles.weapon}>무기 · {e.weapon}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <Reveal delay={120}>
            <button className={styles.gate} onClick={() => setOpen(true)}>
              스포일러 보기
            </button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
