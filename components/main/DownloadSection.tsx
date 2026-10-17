import { DOWNLOAD_URL, LINKS } from "@/lib/download";
import Reveal from "./Reveal";
import styles from "./DownloadSection.module.css";

export default function DownloadSection() {
  return (
    <section id="download" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <Reveal>
          <p className="eyebrow">다운로드</p>
          <h2 className="section-title">세계수의 부름에 답하기</h2>
          <p className={styles.lead}>지금 바로 숲으로 들어가세요.</p>
        </Reveal>
        <Reveal delay={120}>
          {DOWNLOAD_URL ? (
            <a href={DOWNLOAD_URL} className={styles.button} target="_blank" rel="noopener noreferrer">
              게임 다운로드
            </a>
          ) : (
            <span className={`${styles.button} ${styles.disabled}`} aria-disabled="true">
              게임 다운로드
              <small>준비 중</small>
            </span>
          )}
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
