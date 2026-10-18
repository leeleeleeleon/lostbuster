import styles from "./PlayLink.module.css";

// 시뮬레이션·놀이 모음 사이트(asobilostbuster)로 가는 버튼. 버그제보 버튼 바로 아래에 붙는다
const PLAYGROUND_URL = "https://asobilostbuster.vercel.app/";

export default function PlayLink() {
  return (
    <a className={styles.link} href={PLAYGROUND_URL} target="_blank" rel="noopener noreferrer" aria-label="놀이터">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/playground.png" alt="" width={320} height={316} />
    </a>
  );
}
