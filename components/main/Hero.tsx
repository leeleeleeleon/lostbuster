import AmbientCanvas from "./AmbientCanvas";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <AmbientCanvas className={styles.tree} tree fireflyDensity={0.7} />
      <div className={styles.shade} />
      <div className={styles.copy}>
        <p className="eyebrow">THE SPIRITS OF THE WORLD TREE</p>
        <h1 className={styles.title}>로스트버스터</h1>
        <p className={styles.sub}>
          잃어버린 것들이 숲을 잠식하는 밤,
          <br />
          열 개의 천에 맹세한 정령들이 깨어난다.
        </p>
        <div className={styles.actions}>
          <a href="#preregister" className={styles.primary}>사전예약하기</a>
          <a href="#world" className={styles.ghost}>이야기 보기</a>
        </div>
      </div>
      <a href="#world" className={styles.scroll} aria-label="아래로">
        <span />
      </a>
    </section>
  );
}
