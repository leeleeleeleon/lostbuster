"use client";

import { useState } from "react";
import styles from "./BugReport.module.css";

const EMAIL = "hurechimoff@gmail.com";

export default function BugReport() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className={styles.wrap}>
      {open && (
        <div className={styles.popup} role="dialog" aria-label="버그제보">
          <p className={styles.title}>버그제보</p>
          <a className={styles.email} href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <button type="button" className={styles.copy} onClick={copy}>
            {copied ? "복사됨" : "복사"}
          </button>
        </div>
      )}
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="버그제보"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bug-report.png" alt="" width={320} height={370} />
      </button>
    </div>
  );
}
