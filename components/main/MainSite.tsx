"use client";

import { useEffect } from "react";
import AmbientCanvas from "./AmbientCanvas";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import NewsSection from "./NewsSection";
import DownloadSection from "./DownloadSection";
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
      <AmbientCanvas className={styles.fireflies} fireflyDensity={0.35} />
      <Header onLogoClick={onReplayIntro} />
      <main>
        <Hero />
        <WorldSection />
        <SpiritsSection />
        <NewsSection />
        <DownloadSection />
        <SpoilerSection />
      </main>
      <Footer />
      {fromIntro && <div className={styles.flashOut} aria-hidden="true" />}
    </div>
  );
}
