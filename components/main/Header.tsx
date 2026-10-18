"use client";

import { useState } from "react";
import { MENU } from "@/lib/download";
import PixelWindow from "./PixelWindow";
import styles from "./Header.module.css";

const NAV = [
  { href: "#world", label: "세계관" },
  { href: "#spirits", label: "정령" },
  { href: "#relations", label: "관계도" },
  { href: "#spoiler", label: "스포일러" },
];

export default function Header({ onLogoClick }: { onLogoClick: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <PixelWindow className={styles.inner}>
        <button className={styles.logo} onClick={onLogoClick} title="인트로 다시 보기">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="로스트버스터" width={1607} height={841} />
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
      </PixelWindow>
    </header>
  );
}
