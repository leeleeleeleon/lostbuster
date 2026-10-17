"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Pixel from "./Pixel";
import PixelWindow from "./PixelWindow";
import Reveal from "./Reveal";
import styles from "./WorldSection.module.css";

type Icon = { art: string[]; palette: Record<string, string> };

const TREE: Icon = {
  art: [
    "....dGGGd....",
    "..dGGggGGGd..",
    ".dGGgggGGGGd.",
    "dGGGggGGGGGGd",
    "dGGGGGGGGgGGd",
    "dGGgGGGGggGGd",
    ".dGGGGGGGGGd.",
    "..ddGGTGGdd..",
    "....dTTtd....",
    ".....TTt.....",
    ".....TTt.....",
    "....TTTTt....",
    "...TT...tt...",
  ],
  palette: { d: "#2f5a26", G: "#4f8a3c", g: "#86c25c", T: "#7a4e28", t: "#4a2e16" },
};

const SPIRIT: Icon = {
  art: [
    "...kkkkk...",
    "..kwwwwwk..",
    "..kwkwkwk..",
    "..kwwwwwk..",
    "...kkkkk...",
    ".....k.....",
    "..kkkkkkk..",
    "....kpk....",
    ".....k.....",
    ".....k.....",
    "....k.k....",
    "...k...k...",
    "..kk...kk..",
  ],
  palette: { k: "#3a2614", w: "#fff8e6", p: "#d6336c" },
};

const SKULL: Icon = {
  art: [
    "...kkkkk...",
    "..kPPPPPk..",
    ".kPPlPPPPk.",
    ".kPlPPPPPk.",
    ".kPkkPkkPk.",
    ".kPkkPkkPk.",
    ".kPPPkPPPk.",
    "..kPPPPPk..",
    "..kPkPkPk..",
    "...kkkkk...",
  ],
  palette: { k: "#2a1630", P: "#8a5cc0", l: "#c3a2ea" },
};

type Entry = {
  group: 1 | 2;
  title: string;
  no?: string;
  body: string;
  icon?: Icon;
  // 지역은 산 그림 대신 색 칸으로 구분한다
  color?: string;
  // 글에 나온 사실만 태그로 뽑는다
  tags?: string[];
};

const ENTRIES: Entry[] = [
  {
    group: 1,
    no: "I",
    title: "세계수",
    icon: TREE,
    body: "태초부터 존재했다고 전해져 내려오는 엄청나게 큰 나무. 정령들이 지켜야 할 존재.",
  },
  {
    group: 1,
    no: "II",
    title: "정령",
    icon: SPIRIT,
    body: "세계수가 자신을 지키기 위해 만들어 낸 스틱맨 같은 존재들. 마정석이라는, 심장과도 같은 존재가 동력이 되어 움직인다.",
  },
  {
    group: 1,
    no: "III",
    title: "제3의 세력",
    icon: SKULL,
    body: "세계수를 지키기 위해 태어난 10명의 정령들. 몰려오는 여러 위험과 모험을 이겨내고 세계수를 무사히 지킬 수 있을까? 그리고, 세계수를 파괴하기 위한 제3의 세력은…?!",
  },
  {
    group: 2,
    title: "자몽산",
    color: "#e0786a",
    tags: ["정령", "세계수", "정령 마을"],
    body: "세계수와 정령들의 거주지가 있는 지역. 보통 정령들은 이곳의 마을에서 살아간다.",
  },
  {
    group: 2,
    title: "너겟산",
    color: "#e0a33a",
    tags: ["더움", "여러 마을", "마물"],
    body: "여러 마을과 마물들이 사는 더운 지역.",
  },
  {
    group: 2,
    title: "갈치산",
    color: "#7fa6c9",
    tags: ["추움", "인간", "갈치 제약"],
    body: "유일하게 인간들이 살고 있는 추운 지역. 유명한 갈치 제약이 이곳에 들어서 있다.",
  },
  {
    group: 2,
    title: "냥산",
    color: "#a99bc0",
    body: "공개된 정보 없음.",
  },
];

const GROUPS = { 1: "제1장 · 숲의 기록", 2: "제2장 · 지역" } as const;

export default function WorldSection() {
  const [cur, setCur] = useState(0);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const e = ENTRIES[cur];

  // ↑↓ 로 항목을 옮긴다
  const onKey = (ev: KeyboardEvent) => {
    if (ev.key !== "ArrowDown" && ev.key !== "ArrowUp") return;
    ev.preventDefault();
    const next = (cur + (ev.key === "ArrowDown" ? 1 : ENTRIES.length - 1)) % ENTRIES.length;
    setCur(next);
    items.current[next]?.focus();
  };

  return (
    <section id="world" className={styles.section}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">세계관</p>
          <h2 className="section-title">세계수가 지키는 숲</h2>
        </Reveal>

        <Reveal>
          <PixelWindow className={styles.box}>
            <nav className={styles.list} aria-label="세계관 기록" onKeyDown={onKey}>
              {ENTRIES.map((en, i) => (
                <div key={en.title} className={styles.item}>
                  {ENTRIES[i - 1]?.group !== en.group && <p className={styles.group}>{GROUPS[en.group]}</p>}
                  <button
                    type="button"
                    ref={(el: HTMLButtonElement | null) => {
                      items.current[i] = el;
                    }}
                    aria-current={i === cur}
                    tabIndex={i === cur ? 0 : -1}
                    className={i === cur ? styles.on : ""}
                    onClick={() => setCur(i)}
                    onMouseEnter={() => setCur(i)}
                  >
                    {en.title}
                  </button>
                </div>
              ))}
            </nav>

            <article key={cur} className={styles.detail} aria-live="polite">
              <div className={styles.icon}>
                {e.icon ? (
                  <Pixel art={e.icon.art} palette={e.icon.palette} size={10} />
                ) : (
                  <span className={styles.swatch} style={{ "--rc": e.color } as CSSProperties} />
                )}
              </div>
              <div className={styles.text}>
                <p className={styles.kind}>{GROUPS[e.group]}</p>
                <h3 className={styles.title}>
                  {e.no && `${e.no}. `}
                  {e.title}
                </h3>
                <p className={styles.body}>{e.body}</p>
                {e.tags && (
                  <ul className={styles.tags}>
                    {e.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          </PixelWindow>
        </Reveal>
      </div>
    </section>
  );
}
