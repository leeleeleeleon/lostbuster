import Reveal from "./Reveal";
import styles from "./WorldSection.module.css";

const CHAPTERS = [
  {
    no: "I",
    title: "지도에 없는 숲",
    body: "길을 잃은 것들만이 닿을 수 있는 숲이 있다. 그 한가운데, 하늘을 덮을 만큼 커다란 나무 한 그루가 천 년의 밤을 지키고 서 있다. 사람들은 그것을 세계수라 불렀다.",
  },
  {
    no: "II",
    title: "열 개의 천",
    body: "세계수의 가지에는 열 가지 빛깔의 천이 묶여 있다. 천 하나하나는 나무를 지키겠다는 정령의 약속. 바람이 불 때마다 천이 나부끼며 숲 구석구석에 그 약속을 전한다.",
  },
  {
    no: "III",
    title: "로스트버스터",
    body: "언제부턴가 숲에 '잃어버린 것들'이 스며들기 시작했다. 잊힌 이름, 버려진 기억, 길을 잃은 마음. 그것들은 세계수의 뿌리를 갉아먹는다. 정령들은 그들을 쫓는 자, 로스트버스터가 되기로 했다.",
  },
];

export default function WorldSection() {
  return (
    <section id="world" className={styles.section}>
      <div className="container">
        <Reveal>
          <p className="eyebrow">WORLD</p>
          <h2 className="section-title">세계수가 지키는 숲</h2>
        </Reveal>
        <div className={styles.chapters}>
          {CHAPTERS.map((c, i) => (
            <Reveal key={c.no} delay={i * 140} className={styles.chapter}>
              <span className={styles.no}>{c.no}</span>
              <h3 className={styles.title}>{c.title}</h3>
              <p className={styles.body}>{c.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
