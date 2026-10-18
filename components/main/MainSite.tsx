"use client";

import { useEffect } from "react";
import BugReport from "./BugReport";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import PatchNotes from "./PatchNotes";
import PlayLink from "./PlayLink";
import DownloadSection from "./DownloadSection";
import RelationsSection from "./RelationsSection";
import SpiritsSection from "./SpiritsSection";
import SpoilerSection from "./SpoilerSection";
import WorldSection from "./WorldSection";
import styles from "./MainSite.module.css";

type Props = { fromIntro: boolean; onReplayIntro: () => void };

export default function MainSite({ fromIntro, onReplayIntro }: Props) {
  useEffect(() => {
    // 클라이언트에서 늦게 그려지므로 해시 위치로 직접 이동
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <div className={styles.site}>
      <Header onLogoClick={onReplayIntro} />
      <main>
        <Hero />
        <WorldSection />
        <SpiritsSection />
        <RelationsSection />
        <DownloadSection />
        <PatchNotes />
        <SpoilerSection />
      </main>
      <Footer />
      <PlayLink />
      <BugReport />
      {fromIntro && <div className={styles.flashOut} aria-hidden="true" />}
    </div>
  );
}
