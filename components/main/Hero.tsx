"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { SPIRITS } from "@/lib/spirits";
import { faceStyle } from "@/lib/rooms";
import { CHARTS } from "@/lib/relations";
import PixelWindow from "./PixelWindow";
import { SKY_H, SKY_W, startSky } from "./skyField";
import styles from "./Hero.module.css";

const MENU = [
  { href: "#download", label: "게임 다운로드" },
  { href: "#world", label: "세계관 보기" },
  { href: "#spirits", label: "정령 도감" },
];

const nameOf = (id: string) => (id === "tree" ? "세계수" : SPIRITS.find((s) => s.id === id)!.name);

// 대사창에 띄울 관계도 코멘트. 말하는 정령이 번갈아 나오도록 차트를 한 줄씩 엮는다
const LINES = (() => {
  const out: { from: string; to: string; text: string }[] = [];
  const longest = Math.max(...CHARTS.map((c) => c.relations.length));
  for (let i = 0; i < longest; i++)
    for (const c of CHARTS) {
      const r = c.relations[i];
      if (r) out.push({ from: nameOf(c.from), to: nameOf(r.to), text: r.text });
    }
  return out;
})();

const TYPE_MS = 55;
const HOLD_MS = 3200;

function Dialogue() {
  const [line, setLine] = useState(0);
  const [shown, setShown] = useState(0);
  // 메인 화면은 마운트 뒤에만 그려지므로 바로 읽어도 된다
  const [still] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const cur = LINES[line];

  useEffect(() => {
    if (still || shown >= cur.text.length) {
      const id = setTimeout(() => {
        setLine((l) => (l + 1) % LINES.length);
        setShown(0);
      }, still ? HOLD_MS * 2 : HOLD_MS);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setShown((n) => n + 1), TYPE_MS);
    return () => clearTimeout(id);
  }, [shown, cur, still]);

  return (
    <PixelWindow className={styles.talk} aria-live="off">
      <small>
        {cur.from} <span aria-hidden="true">▸</span> {cur.to}
      </small>
      <p>
        {still ? cur.text : cur.text.slice(0, shown)}
        <span className={styles.caret}>_</span>
      </p>
    </PixelWindow>
  );
}

export default function Hero() {
  const sky = useRef<HTMLCanvasElement>(null);
  const items = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => startSky(sky.current!), []);

  // ↑↓ 로 ▶ 커서를 옮긴다. Enter 는 링크 기본 동작으로 이동
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowDown" ? 1 : MENU.length - 1)) % MENU.length;
    items.current[next]?.focus();
  };

  return (
    <section className={styles.hero}>
      <canvas ref={sky} className={styles.sky} width={SKY_W} height={SKY_H} aria-hidden="true" />

      <div className={styles.copy}>
        <p className={styles.start}>PRESS START</p>
        <h1 className={styles.title}>로스트버스터</h1>
        <p className={styles.sub}>세계수를 지키기 위해 태어난 10명의 정령들</p>
      </div>

      {/* 잔디 위에 선 정령들. 누르면 그 정령의 방으로 간다 */}
      <ul className={styles.lineup}>
        {SPIRITS.map((s, i) => (
          <li key={s.id} style={{ "--g": s.glow, "--i": i } as CSSProperties}>
            <a href={`#spirits/${s.id}`} className={styles.member}>
              {s.standing ? (
                <img src={s.standing} alt="" className={styles.standing} />
              ) : (
                <span className={styles.face} style={faceStyle(s.id)} />
              )}
              <span className={styles.name}>{s.name}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className={styles.windows}>
        <PixelWindow as="nav" className={styles.menu} aria-label="메뉴" onKeyDown={onKey}>
          {MENU.map((m, i) => (
            <a
              key={m.href}
              href={m.href}
              ref={(el: HTMLAnchorElement | null) => {
                items.current[i] = el;
              }}
              className={i === active ? styles.on : ""}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              {m.label}
            </a>
          ))}
        </PixelWindow>
        <Dialogue />
      </div>
    </section>
  );
}
