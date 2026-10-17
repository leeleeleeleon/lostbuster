"use client";

import { useEffect, useState } from "react";
import IntroScene from "@/components/intro/IntroScene";
import MainSite from "@/components/main/MainSite";

type Phase = "boot" | "intro" | "main";
const SEEN_KEY = "lb-intro-seen";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [fromIntro, setFromIntro] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    // /#news 처럼 특정 섹션 링크로 들어오면 인트로를 건너뛴다
    if (window.location.hash) seen = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage는 마운트 후에만 읽을 수 있다
    setPhase(seen ? "main" : "intro");
  }, []);

  const enter = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    setFromIntro(true);
    setPhase("main");
    window.scrollTo(0, 0);
  };

  const replay = () => {
    setFromIntro(false);
    setPhase("intro");
  };

  if (phase === "boot") return <div style={{ position: "fixed", inset: 0, background: "#000" }} />;
  if (phase === "intro") return <IntroScene onEnter={enter} />;
  return <MainSite fromIntro={fromIntro} onReplayIntro={replay} />;
}
