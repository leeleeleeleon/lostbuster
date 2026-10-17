import { DOWNLOAD_URL, LINKS } from "@/lib/download";
import ForestDiorama from "./ForestDiorama";
import Reveal from "./Reveal";
import styles from "./DownloadSection.module.css";

const ARROW = {
  rows: ["..##..", "..##..", "..##..", "######", ".####.", "..##..", "......", "######"],
};

function Arrow() {
  return (
    <svg className={styles.arrow} viewBox="0 0 6 8" shapeRendering="crispEdges" aria-hidden="true">
      {ARROW.rows.flatMap((r, y) => [...r].map((c, x) => (c === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null)))}
    </svg>
  );
}

/** 도트 게임 버튼처럼 눌리는 다운로드 버튼 */
function DownloadButton() {
  const inner = (
    <>
      <Arrow />
      <span className={styles.label}>
        <span className={styles.main}>DOWNLOAD</span>
        <span className={styles.small}>{DOWNLOAD_URL ? "게임 다운로드" : "게임 다운로드 · 준비 중"}</span>
      </span>
    </>
  );
  return DOWNLOAD_URL ? (
    <a href={DOWNLOAD_URL} className={styles.button} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <span className={`${styles.button} ${styles.disabled}`} aria-disabled="true">
      {inner}
    </span>
  );
}

export default function DownloadSection() {
  return (
    <section id="download" className={styles.section}>
      {/* 나무 하나하나가 서 있는 세계수 숲 */}
      <ForestDiorama className={styles.stage} />
      <div className={styles.veil} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <Reveal>
          <p className="eyebrow">다운로드</p>
          <h2 className="section-title">세계수의 부름에 답하기</h2>
          <p className={styles.lead}>지금 바로 숲으로 들어가세요.</p>
        </Reveal>
        <Reveal delay={120}>
          <DownloadButton />
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
