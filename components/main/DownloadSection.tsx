/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { DOWNLOAD_URL, LINKS } from "@/lib/download";
import Reveal from "./Reveal";
import styles from "./DownloadSection.module.css";

const MAP = "/maps/world.png";
// 같은 지도를 조금씩 아래로 겹쳐 쌓아 땅의 두께를 만든다
const DEPTH = 16;

function Sortie() {
  const inner = (
    <>
      <span className={styles.sortieSub}>READY · SORTIE</span>
      <span className={styles.sortieMain}>
        <span className={styles.chev} aria-hidden="true">›››</span>
        출전하기
        <span className={styles.chev} aria-hidden="true">‹‹‹</span>
      </span>
      <span className={styles.sortieSmall}>{DOWNLOAD_URL ? "게임 다운로드" : "게임 다운로드 · 준비 중"}</span>
    </>
  );
  return (
    <div className={styles.sortieWrap}>
      <span className={styles.ring} aria-hidden="true" />
      <span className={styles.ring} data-late aria-hidden="true" />
      {DOWNLOAD_URL ? (
        <a href={DOWNLOAD_URL} className={styles.sortie} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      ) : (
        <span className={`${styles.sortie} ${styles.disabled}`} aria-disabled="true">
          {inner}
        </span>
      )}
    </div>
  );
}

export default function DownloadSection() {
  return (
    <section id="download" className={styles.section}>
      {/* 지도를 눕혀 떠 있는 섬처럼 */}
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.plane}>
          {Array.from({ length: DEPTH }, (_, i) => (
            <img key={i} src={MAP} alt="" className={styles.layer} style={{ "--z": DEPTH - i } as CSSProperties} />
          ))}
          <img src={MAP} alt="" className={styles.top} />
        </div>
      </div>
      <div className={styles.veil} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <Reveal>
          <p className="eyebrow">다운로드</p>
          <h2 className="section-title">세계수의 부름에 답하기</h2>
          <p className={styles.lead}>지금 바로 숲으로 들어가세요.</p>
        </Reveal>
        <Reveal delay={120}>
          <Sortie />
        </Reveal>
        <Reveal delay={200}>
          <ul className={styles.links}>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
