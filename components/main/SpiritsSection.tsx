"use client";
// 픽셀 지도를 원본 그대로(최적화 없이) 써야 해서 next/image 대신 img 를 쓴다.
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { SPIRITS, STAT_LABELS, STAT_MAX, type Spirit, type StatLabel } from "@/lib/spirits";
import { DOORS, LOBBY, faceStyle, type Door } from "@/lib/rooms";
import Reveal from "./Reveal";
import styles from "./SpiritsSection.module.css";

const vars = (s: Spirit) => ({ "--c": s.color, "--g": s.glow }) as CSSProperties;
const pct = (v: number, total: number) => `${(v / total) * 100}%`;
const byId = (id: string) => SPIRITS.find((s) => s.id === id)!;

// 카메라가 문 쪽으로 다가가는 시간(ms). CSS 의 .plane transition 과 맞춘다.
const ZOOM_MS = 750;

type Phase = "lobby" | "zoom" | "room" | "leave";

/** 방 배경 노트에 정령 색 볼펜으로 끄적인 낙서 */
function Doodles() {
  const pen = { fill: "none", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round", stroke: "currentColor" } as const;
  return (
    <>
      <span className={styles.tape} data-pos="l" />
      <span className={styles.tape} data-pos="r" />
      <svg className={styles.doodle} data-pos="star" viewBox="0 0 48 48" {...pen}>
        <path d="M24 5l5.6 12.2 13 1.4-9.8 8.8 2.8 12.9L24 33.6l-11.6 6.7 2.8-12.9-9.8-8.8 13-1.4z" />
      </svg>
      <svg className={styles.doodle} data-pos="heart" viewBox="0 0 48 48" {...pen}>
        <path d="M24 40C10 30 5 22 8 14c3-7 12-8 16-1 4-7 13-6 16 1 3 8-2 16-16 26z" />
        <path d="M14 16c1-2 3-3 5-3" />
      </svg>
      <svg className={styles.doodle} data-pos="leaf" viewBox="0 0 64 64" {...pen}>
        <path d="M12 52C10 30 24 12 52 10c2 26-14 42-40 42z" />
        <path d="M12 52L40 24M24 40l-2-10M32 32l8 2" />
      </svg>
      <svg className={styles.doodle} data-pos="swirl" viewBox="0 0 64 32" {...pen}>
        <path d="M4 20c6-14 14 8 20-4s14 8 20-4 12 6 16 0" />
      </svg>
      <svg className={styles.doodle} data-pos="spark" viewBox="0 0 40 40" {...pen}>
        <path d="M20 4v10M20 26v10M4 20h10M26 20h10" />
      </svg>
    </>
  );
}

export default function SpiritsSection() {
  const [door, setDoor] = useState<Door | null>(null);
  const [phase, setPhase] = useState<Phase>("lobby");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [look, setLook] = useState({ x: 0, y: 0 });
  const timer = useRef<number>(0);

  const enter = useCallback((d: Door) => {
    window.clearTimeout(timer.current);
    setDoor(d);
    setPhase("zoom");
    timer.current = window.setTimeout(() => setPhase("room"), ZOOM_MS);
  }, []);

  const leave = useCallback(() => {
    window.clearTimeout(timer.current);
    setPhase("leave");
    timer.current = window.setTimeout(() => {
      setPhase("lobby");
      setDoor(null);
    }, ZOOM_MS);
  }, []);

  const step = useCallback(
    (dir: number) => {
      if (!door) return;
      const i = DOORS.indexOf(door);
      setDoor(DOORS[(i + dir + DOORS.length) % DOORS.length]);
    },
    [door],
  );

  useEffect(() => {
    if (phase !== "room") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") leave();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [phase, leave, step]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // 첫 화면에서 정령을 누르면 #spirits/<id> 로 와서 그 방으로 바로 들어간다
  useEffect(() => {
    const open = () => {
      const m = window.location.hash.match(/^#spirits\/(.+)$/);
      const d = m && DOORS.find((x) => x.spirit === m[1]);
      if (!d) return;
      document.getElementById("spirits")?.scrollIntoView();
      history.replaceState(null, "", "#spirits");
      enter(d);
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [enter]);

  const onLobbyMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };

  const onRoomMove = (e: PointerEvent<HTMLDivElement>) => {
    setLook({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 });
  };

  // 문 중심이 화면 가운데 오도록 지도를 밀고 확대한다
  const zoomed = phase === "zoom" || phase === "room";
  const planeStyle: CSSProperties =
    zoomed && door
      ? {
          transform: `scale(3.2) translate(${50 - ((door.x + door.w / 2) / LOBBY.w) * 100}%, ${50 - ((door.y + door.h / 2) / LOBBY.h) * 100}%)`,
        }
      : { transform: `rotateX(${24 - tilt.y * 8}deg) rotateZ(${tilt.x * -4}deg)` };

  const spirit = door ? byId(door.spirit) : null;

  return (
    <section id="spirits" className={styles.section}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">정령</p>
          <h2 className="section-title">정령들의 집</h2>        </Reveal>

        <Reveal delay={120}>
          <div
            className={styles.scene}
            onPointerMove={onLobbyMove}
            onPointerLeave={() => setTilt({ x: 0, y: 0 })}
            data-zoomed={zoomed || undefined}
          >
            <div className={styles.plane} style={planeStyle}>
              <img src={LOBBY.src} alt="정령들이 사는 집의 로비 지도" className={styles.map} draggable={false} />
              {DOORS.map((d) => {
                const s = byId(d.spirit);
                return (
                  <button
                    key={d.spirit}
                    className={styles.door}
                    style={{
                      ...vars(s),
                      left: pct(d.x, LOBBY.w),
                      top: pct(d.y, LOBBY.h),
                      width: pct(d.w, LOBBY.w),
                      height: pct(d.h, LOBBY.h),
                    }}
                    onClick={() => enter(d)}
                    disabled={phase !== "lobby"}
                    aria-label={`${s.name}의 방`}
                  >
                    <span className={styles.doorLabel} data-below={d.side === "bottom" || undefined}>
                      {s.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <ul className={styles.chips}>
          {DOORS.map((d) => {
            const s = byId(d.spirit);
            return (
              <li key={d.spirit}>
                <button className={styles.chip} style={vars(s)} data-lead={s.lead || undefined} onClick={() => enter(d)}>
                  <span className={styles.dot} />
                  {s.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {phase === "room" &&
        door &&
        spirit &&
        createPortal(
          <div className={styles.room} style={vars(spirit)} data-dark={spirit.dark || undefined} onPointerMove={onRoomMove} role="dialog" aria-modal="true" aria-label={`${spirit.name}의 방`}>
            <div className={styles.roomGlow} style={{ transform: `translate(${look.x * -30}px, ${look.y * -20}px)` }} />
            <div className={styles.doodles} style={{ transform: `translate(${look.x * -24}px, ${look.y * -16}px)` }} aria-hidden="true">
              <Doodles />
            </div>

            <div key={spirit.id} className={styles.roomInner}>
              <div className={styles.standing} style={{ transform: `translate(${look.x * 18}px, ${look.y * 10}px)` }}>
                {spirit.standing ? (
                  <img src={spirit.standing} alt={spirit.name} />
                ) : (
                  <>
                    <span className={styles.face} style={faceStyle(spirit.id)} />
                    <span className={styles.pending}>스탠딩 준비 중</span>
                  </>
                )}
              </div>

              <div className={styles.info}>
                {spirit.title && <p className={styles.roomTitle}>{spirit.title}</p>}
                <h3 className={styles.roomName}>{spirit.name}</h3>
                <ul className={styles.traits}>
                  {spirit.traits.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <dl className={styles.stats}>
                  <div>
                    <dt>키</dt>
                    <dd>{spirit.height}</dd>
                  </div>
                  <div>
                    <dt>무기</dt>
                    <dd>{spirit.weapon ?? "—"}</dd>
                  </div>
                </dl>
                <div className={styles.combat}>
                  <p className={styles.combatNote}>※ 게임에는 반영되어 있지 않습니다.</p>
                  <p className={styles.combatHead}>
                    전투 능력치
                    <span>
                      {spirit.combat.role} · {spirit.combat.line}
                    </span>
                  </p>
                  <dl className={styles.combatGrid}>
                    {(Object.keys(STAT_LABELS) as StatLabel[]).map((k) => {
                      const v = spirit.combat.stats[k];
                      const n = parseInt(String(v), 10);
                      return (
                        <div key={k} data-top={n >= STAT_MAX || undefined}>
                          <dt>{STAT_LABELS[k]}</dt>
                          <dd>
                            <span className={styles.bar} style={{ "--v": n / STAT_MAX } as CSSProperties} />
                            <b>{v}</b>
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              </div>
            </div>

            <button className={styles.back} onClick={leave}>
              ← 로비로
            </button>
            <button className={`${styles.arrow} ${styles.prev}`} onClick={() => step(-1)} aria-label="이전 방">
              ‹
            </button>
            <button className={`${styles.arrow} ${styles.next}`} onClick={() => step(1)} aria-label="다음 방">
              ›
            </button>
          </div>,
          document.body,
        )}
    </section>
  );
}
