"use client";

import { useEffect, useState } from "react";
import { MENU } from "@/lib/download";
import styles from "./Header.module.css";

const NAV = [
  { href: "#world", label: "세계관" },
  { href: "#spirits", label: "정령" },
  { href: "#relations", label: "관계도" },
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
    <header className={`${styles.header} ${scrolled || open ? styles.solid : styles.light}`}>
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
          <span className={styles.divider} aria-hidden="true" />
          {MENU.map((m) =>
            m.href ? (
              <a key={m.label} href={m.href} target="_blank" rel="noopener noreferrer" className={styles.ext}>
                {m.label}
              </a>
            ) : (
              <span key={m.label} className={`${styles.ext} ${styles.soon}`} title="준비 중">
                {m.label}
              </span>
            ),
          )}
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
