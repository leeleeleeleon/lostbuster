"use client";

import { useState, type CSSProperties } from "react";
import { SPIRITS } from "@/lib/spirits";
import { faceStyle } from "@/lib/rooms";
import { CHARTS, KINDS, PENDING, type Relation } from "@/lib/relations";
import Reveal from "./Reveal";
import styles from "./RelationsSection.module.css";

const nameOf = (id: string) => (id === "tree" ? "세계수" : SPIRITS.find((s) => s.id === id)!.name);

// 원 둘레에서의 위치(%). 위쪽부터 시계 방향으로 고르게 놓는다.
const around = (i: number, n: number, r = 39) => {
  const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
  return { x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r };
};

function Node({ id, size }: { id: string; size: "lg" | "sm" }) {
  if (id === "tree") {
    return (
      <span className={`${styles.node} ${styles.tree} ${styles[size]}`} aria-hidden="true">
        세계수
      </span>
    );
  }
  return <span className={`${styles.node} ${styles[size]}`} style={faceStyle(id)} aria-hidden="true" />;
}

export default function RelationsSection() {
  const [from, setFrom] = useState(CHARTS[0].from);
  const [hover, setHover] = useState<string | null>(null);
  const chart = CHARTS.find((c) => c.from === from)!;
  const rels = chart.relations;

  // 원 위 배치는 spirits 순서를 따라 차트를 바꿔도 같은 정령이 비슷한 자리에 오게 한다
  const order = ["tree", ...SPIRITS.map((s) => s.id)];
  const placed = [...rels].sort((a, b) => order.indexOf(a.to) - order.indexOf(b.to));

  const lineColor = (r: Relation, k: number) => KINDS[r.kinds[k]].color;

  return (
    <section id="relations" className={styles.section}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">관계도</p>
          <h2 className="section-title">서로를 바라보는 시선</h2>
          <p className={styles.lead}>정령마다 다른 정령들에게 품은 첫인상. 정령을 골라 보세요.</p>
        </Reveal>

        <ul className={styles.picker}>
          {SPIRITS.map((s) => {
            const pending = PENDING.includes(s.id);
            return (
              <li key={s.id}>
                <button
                  className={styles.pick}
                  style={{ "--g": s.glow } as CSSProperties}
                  data-active={s.id === from || undefined}
                  disabled={pending}
                  onClick={() => {
                    setFrom(s.id);
                    setHover(null);
                  }}
                >
                  <span className={styles.pickFace} style={faceStyle(s.id)} />
                  <span>{s.name}</span>
                  {pending && <small>준비 중</small>}
                </button>
              </li>
            );
          })}
        </ul>

        <div className={styles.body}>
          <div className={styles.chart}>
            <svg viewBox="0 0 100 100" className={styles.lines} aria-hidden="true">
              {placed.map((r, i) => {
                const p = around(i, placed.length);
                const dim = hover && hover !== r.to;
                return (
                  <g key={r.to} opacity={dim ? 0.15 : 1}>
                    <line x1="50" y1="50" x2={p.x} y2={p.y} stroke={lineColor(r, 0)} strokeWidth={hover === r.to ? 1.1 : 0.7} strokeLinecap="round" />
                    {/* 두 관계가 섞인 선은 두 번째 색을 점선으로 겹친다 */}
                    {r.kinds[1] && <line x1="50" y1="50" x2={p.x} y2={p.y} stroke={lineColor(r, 1)} strokeWidth={hover === r.to ? 1.1 : 0.7} strokeDasharray="2 2" />}
                  </g>
                );
              })}
            </svg>

            <div className={styles.center}>
              <Node id={from} size="lg" />
              <span className={styles.centerName}>{nameOf(from)}</span>
            </div>

            {placed.map((r, i) => {
              const p = around(i, placed.length);
              return (
                <button
                  key={r.to}
                  className={styles.around}
                  style={{ left: `${p.x}%`, top: `${p.y}%`, "--k": lineColor(r, 0) } as CSSProperties}
                  data-dim={(hover && hover !== r.to) || undefined}
                  onMouseEnter={() => setHover(r.to)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(r.to)}
                  onBlur={() => setHover(null)}
                >
                  <Node id={r.to} size="sm" />
                  <span className={styles.aroundName}>{nameOf(r.to)}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.side}>
            <ul className={styles.legend}>
              {Object.values(KINDS).map((k) => (
                <li key={k.label}>
                  <span style={{ background: k.color }} />
                  {k.label}
                </li>
              ))}
            </ul>

            {chart.note && <p className={styles.note}>“{chart.note}”</p>}

            <ul className={styles.list}>
              {rels.map((r) => (
                <li
                  key={r.to}
                  className={styles.item}
                  data-active={hover === r.to || undefined}
                  onMouseEnter={() => setHover(r.to)}
                  onMouseLeave={() => setHover(null)}
                >
                  <Node id={r.to} size="sm" />
                  <div>
                    <p className={styles.itemHead}>
                      <strong>{nameOf(r.to)}</strong>
                      {r.kinds.map((k) => (
                        <span key={k} className={styles.badge} style={{ "--k": KINDS[k].color } as CSSProperties}>
                          {KINDS[k].label}
                        </span>
                      ))}
                      {r.tag && <span className={styles.tag}>{r.tag}</span>}
                    </p>
                    <p className={styles.text}>{r.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
