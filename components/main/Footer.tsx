import { LINKS } from "@/lib/download";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.logo}>LOSTBUSTER</p>
        <nav className={styles.links}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </nav>
        <p className={styles.copy}>© 2026 LOSTBUSTER. All rights reserved.</p>
        {/* 지금 보고 있는 사이트가 어느 커밋으로 만들어졌는지. 업데이트 확인용 */}
        <p className={styles.version} title={process.env.BUILD_MESSAGE}>
          버전 {process.env.BUILD_SHA} · {process.env.BUILD_TIME} 빌드
          {process.env.BUILD_MESSAGE && <span> · {process.env.BUILD_MESSAGE}</span>}
        </p>
      </div>
    </footer>
  );
}
