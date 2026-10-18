// 세계수에 걸린 오색천 10개 = 열 명의 정령.
// 배열 순서가 곧 천이 걸리는 순서(왼쪽 → 오른쪽)다.
export type Spirit = {
  id: string;
  name: string;
  // 영문 이름. 오너가 정한 표기 그대로
  en: string;
  title: string;
  color: string;
  glow: string;
  // 소개 문장. 첫 줄이 카드 상세의 대표 문구가 된다.
  traits: string[];
  height: number;
  weapon?: string;
  // 스탠딩 일러스트 경로(public/ 기준). 없으면 얼굴 칩을 크게 띄운다.
  // 모두 같은 배율로 잘라 두어서 나란히 놓으면 키 차이가 그대로 보인다.
  standing?: string;
  combat: Combat;
  // 주인공조
  lead?: boolean;
  // 검은 천: 어두운 배경에 묻히지 않게 테두리를 밝힌다
  dark?: boolean;
};

// 전투 능력치는 0~6. 표를 넘치거나 모자라는 값은 "6+"·"1-"처럼 적는다.
export const STAT_LABELS = {
  atk: "공격",
  def: "방어",
  mag: "마력",
  agi: "민첩",
  spi: "정신",
  hp: "체력",
} as const;

export type StatLabel = keyof typeof STAT_LABELS;

export const STAT_MAX = 6;

export type StatValue = number | `${number}+` | `${number}-`;

export type Combat = {
  role: string;
  line: "전열" | "후열";
  stats: Record<StatLabel, StatValue>;
};

export const SPIRITS: Spirit[] = [
  {
    id: "magenta",
    name: "마젠타",
    en: "Majenta",
    title: "",
    color: "#d23c98",
    glow: "#ff6cc4",
    standing: "/standings/magenta.png",
    traits: ["홍차를 좋아하고 몸이 약하다.", "이든과 교제 중이다."],
    height: 165,
    weapon: "지팡이(검)",
    combat: { role: "딜러", line: "전열", stats: { atk: "6+", def: "1-", mag: 1, agi: 5, spi: 0, hp: 2 } },
  },
  {
    id: "oyu",
    name: "오유",
    en: "OU",
    title: "주인공조",
    color: "#9ccf4a",
    glow: "#c4f57a",
    standing: "/standings/oyu.png",
    traits: ["자몽 마을의 유일한 신부.", "마을에서 종교를 믿는 것은 본인뿐이다."],
    height: 170,
    weapon: "창",
    lead: true,
    combat: { role: "힐 · 딜러", line: "전열", stats: { atk: 3, def: 2, mag: 6, agi: 3, spi: 6, hp: 2 } },
  },
  {
    id: "gungun",
    name: "군군",
    en: "KunKun",
    title: "주인공조",
    color: "#17171a",
    glow: "#7d8ba0",
    standing: "/standings/gungun.png",
    traits: ["개찐따여서 모르는 사람이 말을 걸면 기절한 척을 한다."],
    height: 159,
    weapon: "식칼",
    lead: true,
    dark: true,
    combat: { role: "딜러", line: "전열", stats: { atk: 5, def: 3, mag: 1, agi: 5, spi: 1, hp: 4 } },
  },
  {
    id: "iden",
    name: "이든",
    en: "Eden",
    title: "",
    color: "#f1eee4",
    glow: "#ffffff",
    standing: "/standings/iden.png",
    traits: ["버릇으로 중지를 달고 다닌다.", "시안과 자주 싸운다.", "마젠타와 교제 중이다."],
    height: 187,
    weapon: "주먹과 너클",
    combat: { role: "딜러", line: "전열", stats: { atk: 3, def: 1, mag: 1, agi: 6, spi: 5, hp: 4 } },
  },
  {
    id: "ire",
    name: "이레",
    en: "Ireh",
    title: "",
    color: "#efc42f",
    glow: "#ffe06a",
    standing: "/standings/ire.png",
    traits: ["엔지니어로 일하며, 범블비라는 반려 드론이 있다.", "I와 무언가 관계가 있어 보인다."],
    height: 177,
    weapon: "렌치",
    combat: { role: "탱커 · 딜러", line: "전열", stats: { atk: 6, def: 4, mag: 1, agi: 2, spi: 4, hp: 4 } },
  },
  {
    id: "jamo",
    name: "자모",
    en: "Jamo",
    title: "",
    color: "#c8313a",
    glow: "#ff5a4a",
    standing: "/standings/jamo.png",
    traits: ["자몽의, 자몽을 위한, 자몽에 의한 삶을 산다.", "혈액이 자몽주스로 이루어져 있다."],
    height: 152,
    weapon: "자몽",
    combat: { role: "서포트 힐러", line: "후열", stats: { atk: 0, def: 1, mag: 6, agi: 2, spi: 5, hp: 2 } },
  },
  {
    id: "i",
    name: "I",
    en: "I",
    title: "",
    color: "#e6ecef",
    glow: "#d8f2ff",
    standing: "/standings/i.png",
    traits: [
      "유행하는 게 있으면 다 해본다.",
      "뭐든지 만들어 낼 수 있는 능력을 가지고 있다. (한계 있음)",
      "이레와 무언가 관계가 있는 것처럼 보인다.",
      "보통 싸우지 않는다.",
    ],
    height: 183,
    combat: { role: "서포터 · 딜러", line: "후열", stats: { atk: 4, def: 3, mag: 1, agi: 1, spi: 6, hp: 5 } },
  },
  {
    id: "innocent",
    name: "이노센트",
    en: "Innocent",
    title: "",
    color: "#f2b4c6",
    glow: "#ffd2e0",
    standing: "/standings/innocent.png",
    traits: ["온몸이 비누로 이루어져 있어, 미끌미끌하다."],
    height: 178,
    weapon: "막대기(철)",
    combat: { role: "딜러", line: "전열", stats: { atk: 6, def: 1, mag: 2, agi: "6+", spi: 4, hp: 3 } },
  },
  {
    id: "welsiet",
    name: "웰시엣",
    en: "Welsies",
    title: "",
    color: "#3b6fd8",
    glow: "#7aa8ff",
    standing: "/standings/welsiet.png",
    traits: ["정수리에 새싹이 자랐으며, IQ가 약 18 언저리.", "시안과 교제 중이다."],
    height: 160,
    weapon: "■■■과 마법",
    combat: { role: "마법 딜러", line: "후열", stats: { atk: 4, def: 4, mag: 5, agi: 3, spi: 6, hp: 5 } },
  },
  {
    id: "cyan",
    name: "시안",
    en: "Sian",
    title: "",
    color: "#38c3d4",
    glow: "#7cf0ff",
    standing: "/standings/cyan.png",
    traits: [
      "중2병이 심하다.",
      "자기 방에서 누가 봐도 중2병 같은 춤을 추다가 책장에 발이 찍혀 잠시 기절한 적이 있다.",
      "웰시엣과 교제 중이다.",
    ],
    height: 172,
    weapon: "도끼와 흑마법",
    combat: { role: "혼합 딜러", line: "후열", stats: { atk: 5, def: 1, mag: 4, agi: 4, spi: 3, hp: 6 } },
  },
];
