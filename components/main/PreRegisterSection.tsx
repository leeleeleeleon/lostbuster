"use client";

import { useState, type FormEvent } from "react";
import Reveal from "./Reveal";
import styles from "./PreRegisterSection.module.css";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PreRegisterSection() {
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL.test(email)) return setMsg({ ok: false, text: "올바른 이메일 주소를 입력해 주세요." });
    if (!agree) return setMsg({ ok: false, text: "개인정보 수집에 동의해 주세요." });
    // TODO: Vercel 배포 단계에서 실제 저장 API 연결
    setMsg({ ok: true, text: "사전예약이 완료되었습니다. 숲에서 다시 만나요." });
    setEmail("");
    setAgree(false);
  };

  return (
    <section id="preregister" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <Reveal>
          <p className="eyebrow">PRE-REGISTER</p>
          <h2 className="section-title">세계수의 부름에 답하기</h2>
          <p className={styles.lead}>사전예약하고 출시 소식과 한정 보상 &lsquo;첫 번째 천&rsquo;을 받아보세요.</p>
        </Reveal>
        <Reveal delay={120}>
          <form className={styles.form} onSubmit={submit} noValidate>
            <div className={styles.row}>
              <input
                type="email"
                className={styles.input}
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="이메일 주소"
              />
              <button type="submit" className={styles.submit}>사전예약</button>
            </div>
            <label className={styles.agree}>
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>출시 알림을 위한 이메일 수집에 동의합니다.</span>
            </label>
            <p className={`${styles.msg} ${msg?.ok ? styles.ok : styles.err}`} role="status">
              {msg?.text}
            </p>
          </form>
        </Reveal>
        <Reveal delay={200} className={styles.stores}>
          {["App Store", "Google Play", "PC"].map((s) => (
            <span key={s} className={styles.store}>
              {s}
              <small>출시 예정</small>
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
