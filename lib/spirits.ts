// 세계수에 걸린 오색천 10개 = 열 명의 정령.
// 배열 순서가 곧 천이 걸리는 순서(왼쪽 → 오른쪽)다.
export type Spirit = {
  id: string;
  name: string;
  title: string;
  color: string;
  glow: string;
  summary: string;
  story?: string;
  // 주인공
  lead?: boolean;
  // 검은 천: 어두운 배경에 묻히지 않게 테두리를 밝힌다
  dark?: boolean;
};

const TBA = "자세한 이야기는 곧 공개됩니다.";

export const SPIRITS: Spirit[] = [
  {
    id: "magenta",
    name: "마젠타",
    title: "마젠타의 천",
    color: "#d23c98",
    glow: "#ff6cc4",
    summary: TBA,
  },
  {
    id: "oyu",
    name: "오유",
    title: "연두의 천 · 주인공",
    color: "#9ccf4a",
    glow: "#c4f57a",
    summary: TBA,
    lead: true,
  },
  {
    id: "gungun",
    name: "군군",
    title: "검정의 천",
    color: "#17171a",
    glow: "#7d8ba0",
    summary: TBA,
    dark: true,
  },
  {
    id: "iden",
    name: "이든",
    title: "흰색의 천",
    color: "#f1eee4",
    glow: "#ffffff",
    summary: TBA,
  },
  {
    id: "ire",
    name: "이레",
    title: "노랑의 천",
    color: "#efc42f",
    glow: "#ffe06a",
    summary: TBA,
  },
  {
    id: "jamo",
    name: "자모",
    title: "빨강의 천",
    color: "#c8313a",
    glow: "#ff5a4a",
    summary: TBA,
  },
  {
    id: "i",
    name: "I",
    title: "흰색의 천",
    color: "#e6ecef",
    glow: "#d8f2ff",
    summary: TBA,
  },
  {
    id: "innocent",
    name: "이노센트",
    title: "연분홍의 천",
    color: "#f2b4c6",
    glow: "#ffd2e0",
    summary: TBA,
  },
  {
    id: "welsiet",
    name: "웰시엣",
    title: "보라의 천",
    color: "#7a48b8",
    glow: "#b583ff",
    summary: TBA,
  },
  {
    id: "cyan",
    name: "시안",
    title: "시안의 천",
    color: "#38c3d4",
    glow: "#7cf0ff",
    summary: TBA,
  },
];
