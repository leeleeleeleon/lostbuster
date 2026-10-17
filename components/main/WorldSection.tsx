import Pixel from "./Pixel";
import Reveal from "./Reveal";
import styles from "./WorldSection.module.css";

const TREE = {
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

const SPIRIT = {
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

const SKULL = {
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

const MOUNTAIN = [
  "......cc......",
  ".....cccc.....",
  "....ccmcms....",
  "...mmmmmmss...",
  "..mmmmmmmsss..",
  ".mmmmmmmmssss.",
  "mmmmmmmmmsssss",
  "gggggggggggggg",
];

const CAT_MOUNTAIN = [
  ".c..........c.",
  ".cc........cs.",
  ".mmc......mss.",
  ".mmmmmmmmmmss.",
  "mmmkmmmmmkmsss",
  "mmmmmmkmmmmsss",
  "mmmmmmmmmmssss",
  "gggggggggggggg",
];

const GROUND = "#5d8a3e";

const CHAPTERS = [
  {
    no: "I",
    title: "세계수",
    icon: TREE,
    body: "태초부터 존재했다고 전해져 내려오는 엄청나게 큰 나무. 정령들이 지켜야 할 존재.",
  },
  {
    no: "II",
    title: "정령",
    icon: SPIRIT,
    body: "세계수가 자신을 지키기 위해 만들어 낸 스틱맨 같은 존재들. 마정석이라는, 심장과도 같은 존재가 동력이 되어 움직인다.",
  },
  {
    no: "III",
    title: "제3의 세력",
    icon: SKULL,
    body: "세계수를 지키기 위해 태어난 10명의 정령들. 몰려오는 여러 위험과 모험을 이겨내고 세계수를 무사히 지킬 수 있을까? 그리고, 세계수를 파괴하기 위한 제3의 세력은…?!",
  },
];

const REGIONS: { name: string; art: string[]; palette: Record<string, string>; body: string }[] = [
  {
    name: "자몽산",
    art: MOUNTAIN,
    palette: { m: "#e0786a", s: "#b8544a", c: "#f8c4ae", g: GROUND },
    body: "세계수와 정령들의 거주지가 있는 지역. 보통 정령들은 이곳의 마을에서 살아간다.",
  },
  {
    name: "너겟산",
    art: MOUNTAIN,
    palette: { m: "#e0a33a", s: "#b97a22", c: "#e2552e", g: GROUND },
    body: "여러 마을과 마물들이 사는 더운 지역.",
  },
  {
    name: "갈치산",
    art: MOUNTAIN,
    palette: { m: "#7fa6c9", s: "#5a7fa3", c: "#ffffff", g: "#cfe3ee" },
    body: "유일하게 인간들이 살고 있는 추운 지역. 유명한 갈치 제약이 이곳에 들어서 있다.",
  },
  {
    name: "냥산",
    art: CAT_MOUNTAIN,
    palette: { m: "#a99bc0", s: "#7f7199", c: "#e3d8f0", k: "#3a2614", g: GROUND },
    body: "공개된 정보 없음.",
  },
];

const ORNAMENT = {
  art: ["...k...", "..kyk..", ".kyyyk.", "kyyHyyk", ".kyyyk.", "..kyk..", "...k..."],
  palette: { k: "#6b4a2b", y: "#d9a441", H: "#fff1b8" },
};

const CORNER = {
  art: [
    "yyyyyyyy",
    "yHHHHHyk",
    "yHykkkk.",
    "yHk.yy..",
    "yHk.yk..",
    "yyk.....",
    "yk......",
    "yk......",
  ],
  palette: { y: "#d9a441", H: "#fff1b8", k: "#7a5418" },
};

const RIBBON = {
  art: [
    ...Array<string>(20).fill("hrrrrd"),
    "hrrrrd",
    "hr..rd",
    "h....d",
  ],
  palette: { h: "#d9524a", r: "#a8322b", d: "#6e1d18" },
};

// 펼친 책장의 위·아래 가장자리 곡선 (바깥쪽 → 책등, x는 %, y는 4px 칸)
const TOP_EDGE = [[0, 4], [3, 3], [7, 2], [12, 1], [20, 0], [70, 0], [80, 1], [88, 2], [94, 3], [98, 4]];
const BOTTOM_EDGE = [[0, 2], [5, 1], [12, 0], [82, 0], [92, 1], [98, 2]];

function pageShape(mirror: boolean) {
  const px = (x: number) => `${mirror ? 100 - x : x}%`;
  const pts: string[] = [];
  TOP_EDGE.forEach(([x, y], i) => {
    const next = TOP_EDGE[i + 1]?.[0] ?? 100;
    pts.push(`${px(x)} ${y * 4}px`, `${px(next)} ${y * 4}px`);
  });
  [...BOTTOM_EDGE].reverse().forEach(([x, y], i, arr) => {
    const next = arr[i - 1]?.[0] ?? 100;
    pts.push(`${px(next)} calc(100% - ${y * 4}px)`, `${px(x)} calc(100% - ${y * 4}px)`);
  });
  return `polygon(${pts.join(", ")})`;
}

const SHAPES = { left: pageShape(false), right: pageShape(true) };

function Page({ side, children }: { side: "left" | "right"; children: React.ReactNode }) {
  const clip = { clipPath: SHAPES[side] };
  return (
    <div className={styles.pageWrap} data-side={side}>
      <span className={styles.sheet} data-n="2" style={clip} />
      <span className={styles.sheet} data-n="1" style={clip} />
      <div className={styles.page} style={clip}>
        {children}
      </div>
    </div>
  );
}

function PageHead({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.pageHead}>
      <Pixel {...ORNAMENT} size={2} />
      {children}
      <Pixel {...ORNAMENT} size={2} />
    </p>
  );
}

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
            <div className={styles.cover} aria-hidden="true">
              <Pixel {...CORNER} size={4} className={`${styles.corner} ${styles.cornerL}`} />
              <Pixel {...CORNER} size={4} className={`${styles.corner} ${styles.cornerR}`} />
            </div>
            <Page side="left">
              <PageHead>제1장 · 숲의 기록</PageHead>
              {CHAPTERS.map((c) => (
                <article key={c.no} className={styles.chapter}>
                  <div className={styles.icon}>
                    <Pixel art={c.icon.art} palette={c.icon.palette} size={4} />
                    <span className={styles.no}>{c.no}</span>
                  </div>
                  <div>
                    <h3 className={styles.title}>{c.title}</h3>
                    <p className={styles.body}>{c.body}</p>
                  </div>
                </article>
              ))}
              <span className={styles.folio}>- 1 -</span>
            </Page>
            <Page side="right">
              <PageHead>제2장 · 지역</PageHead>
              <ul className={styles.regions}>
                {REGIONS.map((r) => (
                  <li key={r.name} className={styles.region}>
                    <Pixel art={r.art} palette={r.palette} size={4} className={styles.mountain} />
                    <div>
                      <h4 className={styles.regionName}>{r.name}</h4>
                      <p className={styles.body}>{r.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <span className={styles.folio}>- 2 -</span>
            </Page>
            <Pixel {...RIBBON} size={4} className={styles.ribbon} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
