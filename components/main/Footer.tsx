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
      </div>
    </footer>
  );
}
