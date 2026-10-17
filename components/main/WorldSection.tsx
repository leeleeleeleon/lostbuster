import Reveal from "./Reveal";
import styles from "./WorldSection.module.css";

const CHAPTERS = [
  {
    no: "I",
    title: "세계수",
    body: "태초부터 존재했다고 전해져 내려오는 엄청나게 큰 나무. 정령들이 지켜야 할 존재.",
  },
  {
    no: "II",
    title: "정령",
    body: "세계수가 자신을 지키기 위해 만들어 낸 스틱맨 같은 존재들. 마정석이라는, 심장과도 같은 존재가 동력이 되어 움직인다.",
  },
  {
    no: "III",
    title: "제3의 세력",
    body: "세계수를 지키기 위해 태어난 10명의 정령들. 몰려오는 여러 위험과 모험을 이겨내고 세계수를 무사히 지킬 수 있을까? 그리고, 세계수를 파괴하기 위한 제3의 세력은…?!",
  },
];

const REGIONS = [
  { name: "자몽산", body: "세계수와 정령들의 거주지가 있는 지역. 보통 정령들은 이곳의 마을에서 살아간다." },
  { name: "너겟산", body: "여러 마을과 마물들이 사는 더운 지역." },
  { name: "갈치산", body: "유일하게 인간들이 살고 있는 추운 지역. 유명한 갈치 제약이 이곳에 들어서 있다." },
  { name: "냥산", body: "공개된 정보 없음." },
];

export default function WorldSection() {
  return (
    <section id="world" className={styles.section}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">세계관</p>
          <h2 className="section-title">세계수가 지키는 숲</h2>
        </Reveal>
        <Reveal className={styles.bookWrap}>
          <div className={styles.book}>
            <span className={styles.ribbon} aria-hidden="true" />
            <div className={styles.page} data-side="left">
              <p className={styles.pageHead}>제1장 · 숲의 기록</p>
              {CHAPTERS.map((c) => (
                <article key={c.no} className={styles.chapter}>
                  <h3 className={styles.title}>
                    <span className={styles.no}>{c.no}</span>
                    {c.title}
                  </h3>
                  <p className={styles.body}>{c.body}</p>
                </article>
              ))}
              <span className={styles.folio}>- 1 -</span>
            </div>
            <div className={styles.page} data-side="right">
              <p className={styles.pageHead}>제2장 · 지역</p>
              <ul className={styles.regions}>
                {REGIONS.map((r) => (
                  <li key={r.name} className={styles.region}>
                    <h4 className={styles.regionName}>{r.name}</h4>
                    <p className={styles.body}>{r.body}</p>
                  </li>
                ))}
              </ul>
              <span className={styles.folio}>- 2 -</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
