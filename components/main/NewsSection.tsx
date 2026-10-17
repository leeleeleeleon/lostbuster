import { NEWS } from "@/lib/news";
import Reveal from "./Reveal";
import styles from "./NewsSection.module.css";

export default function NewsSection() {
  return (
    <section id="news" className={styles.section}>
      <div className="container">
        <Reveal className={styles.head}>
          <div>
            <p className="eyebrow">NEWS</p>
            <h2 className="section-title">숲의 소식</h2>
          </div>
          <a href="#news" className={styles.more}>전체 보기 →</a>
        </Reveal>
        <ul className={styles.list}>
          {NEWS.map((n, i) => (
            <li key={n.id}>
              <Reveal delay={i * 80}>
                <a href="#news" className={styles.item}>
                  <span className={styles.tag}>{n.category}</span>
                  <span className={styles.title}>{n.title}</span>
                  <time className={styles.date}>{n.date}</time>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
