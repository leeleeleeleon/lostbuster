/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { SPIRITS } from "@/lib/spirits";
import { faceStyle } from "@/lib/rooms";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <p className="eyebrow">모든 것을 속고 있으니까.</p>
        <h1 className={styles.title}>로스트버스터</h1>
        <p className={styles.sub}>세계수를 지키기 위해 태어난 10명의 정령들</p>
      </div>

      {/* 정령들을 천 순서대로 한 줄로. 누르면 그 정령의 방으로 간다 */}
      <ul className={styles.lineup}>
        {SPIRITS.map((s, i) => (
          <li key={s.id} style={{ "--g": s.glow, "--i": i } as CSSProperties}>
            <a href={`#spirits/${s.id}`} className={styles.member}>
              {s.standing ? (
                <img src={s.standing} alt="" className={styles.standing} />
              ) : (
                <span className={styles.face} style={faceStyle(s.id)} />
              )}
              <span className={styles.name}>{s.name}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <a href="#download" className={styles.primary}>게임 다운로드</a>
        <a href="#world" className={styles.ghost}>세계관 보기</a>
      </div>
    </section>
  );
}
