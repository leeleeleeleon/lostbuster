"use client";

import { useEffect, useState } from "react";
import styles from "./Header.module.css";

const NAV = [
  { href: "#world", label: "세계관" },
  { href: "#spirits", label: "정령" },
  { href: "#news", label: "소식" },
  { href: "#download", label: "다운로드" },
];

export default function Header({ onLogoClick }: { onLogoClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled || open ? styles.solid : ""}`}>
      <div className={`container ${styles.inner}`}>
        <button className={styles.logo} onClick={onLogoClick} title="인트로 다시 보기">
          LOSTBUSTER
        </button>
        <nav className={`${styles.nav} ${open ? styles.open : ""}`}>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
        </nav>
        <button
          className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-label="메뉴"
          aria-expanded={open}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
