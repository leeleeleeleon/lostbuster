/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { SPIRITS } from "@/lib/spirits";
import { faceStyle } from "@/lib/rooms";
import styles from "./Hero.module.css";

/** 노트 귀퉁이에 볼펜으로 끄적인 낙서들 */
function Doodles() {
  const pen = { fill: "none", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <div className={styles.doodles} aria-hidden="true">
      <span className={styles.tape} data-pos="l" />
      <span className={styles.tape} data-pos="r" />
      <svg className={styles.doodle} data-pos="star" viewBox="0 0 48 48" {...pen} stroke="#e8a33a">
        <path d="M24 5l5.6 12.2 13 1.4-9.8 8.8 2.8 12.9L24 33.6l-11.6 6.7 2.8-12.9-9.8-8.8 13-1.4z" />
      </svg>
      <svg className={styles.doodle} data-pos="heart" viewBox="0 0 48 48" {...pen} stroke="#e46a8a">
        <path d="M24 40C10 30 5 22 8 14c3-7 12-8 16-1 4-7 13-6 16 1 3 8-2 16-16 26z" />
        <path d="M14 16c1-2 3-3 5-3" />
      </svg>
      <svg className={styles.doodle} data-pos="leaf" viewBox="0 0 64 64" {...pen} stroke="#5c9a4a">
        <path d="M12 52C10 30 24 12 52 10c2 26-14 42-40 42z" />
        <path d="M12 52L40 24M24 40l-2-10M32 32l8 2" />
      </svg>
      <svg className={styles.doodle} data-pos="swirl" viewBox="0 0 64 32" {...pen} stroke="#6f9bd1">
        <path d="M4 20c6-14 14 8 20-4s14 8 20-4 12 6 16 0" />
      </svg>
      <svg className={styles.doodle} data-pos="spark" viewBox="0 0 40 40" {...pen} stroke="#a77fd6">
        <path d="M20 4v10M20 26v10M4 20h10M26 20h10" />
      </svg>
      <svg className={styles.doodle} data-pos="arrow" viewBox="0 0 90 60" {...pen} stroke="#8a8f99">
        <path d="M6 8c20 0 40 10 56 38" />
        <path d="M50 44l12 4 2-13" />
      </svg>
    </div>
  );
}

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Doodles />
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
