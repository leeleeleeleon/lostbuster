import { NOTICES, PATCHES } from "@/lib/patches";
import Reveal from "./Reveal";
import styles from "./PatchNotes.module.css";

/** 다운로드 바로 아래: 업데이트 내역과 펼쳐 보는 유의사항 */
export default function PatchNotes() {
  return (
    <section id="patch" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <Reveal>
          <p className="eyebrow">업데이트</p>
          <h2 className="section-title">패치 노트</h2>
        </Reveal>

        <Reveal>
          <ol className={styles.patches}>
            {PATCHES.map((p, i) => (
              <li key={p.version} className={styles.patch}>
                <div className={styles.meta}>
                  <p className={styles.version}>
                    {p.version}
                    {i === 0 && <span className={styles.latest}>최신</span>}
                  </p>
                  <time className={styles.date}>{p.date}</time>
                </div>
                <div className={styles.groups}>
                  {p.groups.map((g) => (
                    <div key={g.title}>
                      <h3 className={styles.groupTitle}>{g.title}</h3>
                      <ul className={styles.items}>
                        {g.items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal>
          <details className={styles.notice}>
            <summary>
              <span>유의사항</span>
              <span className={styles.count}>{NOTICES.length}</span>
            </summary>
            <ul className={styles.items}>
              {NOTICES.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </details>
        </Reveal>
      </div>
    </section>
  );
}
