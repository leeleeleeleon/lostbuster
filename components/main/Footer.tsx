import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.logo}>LOSTBUSTER</p>
        <nav className={styles.links}>
          <a href="#">이용약관</a>
          <a href="#">개인정보처리방침</a>
          <a href="#">고객지원</a>
        </nav>
        <p className={styles.copy}>© 2026 LOSTBUSTER. All rights reserved.</p>
      </div>
    </footer>
  );
}
