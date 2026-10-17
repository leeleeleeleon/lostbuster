// 세계수에 걸린 오색천 10개 = 세계수를 지키는 정령 10명.
// 배열 순서가 곧 천이 걸리는 순서(왼쪽 → 오른쪽)다.
export type Spirit = {
  id: string;
  name: string;
  romaji: string;
  title: string;
  color: string;
  glow: string;
  summary: string;
  story: string;
};

export const SPIRITS: Spirit[] = [
  {
    id: "raon",
    name: "라온",
    romaji: "RAON",
    title: "만개의 정령",
    color: "#d23c98",
    glow: "#ff6cc4",
    summary: "숲의 꽃이 한꺼번에 피어나는 밤에 깨어난다.",
    story:
      "라온이 지나간 자리에는 계절과 상관없이 꽃이 핀다. 웃음이 많지만, 꽃이 시드는 곳을 보면 누구보다 먼저 달려간다.",
  },
  {
    id: "saeum",
    name: "새움",
    romaji: "SAEUM",
    title: "새싹의 정령",
    color: "#9ccf4a",
    glow: "#c4f57a",
    summary: "부러진 가지 끝에서 다시 돋아나는 첫 잎.",
    story:
      "세계수의 가장 어린 정령. 상처 입은 뿌리와 줄기를 어루만져 다시 자라게 한다. 아직 말수가 적고 겁이 많다.",
  },
  {
    id: "geuneul",
    name: "그늘",
    romaji: "GEUNEUL",
    title: "그림자의 정령",
    color: "#17171a",
    glow: "#7d8ba0",
    summary: "빛이 닿지 않는 곳을 지키는 조용한 파수꾼.",
    story:
      "모두가 잠든 숲의 밤을 혼자 걷는다. 그림자 속에 숨어드는 '잃어버린 것'들의 기척을 가장 먼저 알아챈다.",
  },
  {
    id: "iseul",
    name: "이슬",
    romaji: "ISEUL",
    title: "새벽 이슬의 정령",
    color: "#f1eee4",
    glow: "#ffffff",
    summary: "밤과 아침 사이, 잎끝에 맺히는 한 방울.",
    story:
      "세계수의 잎에 맺힌 이슬에서 태어났다. 맑은 물방울에 비친 기억을 읽을 수 있어, 숲의 오래된 일들을 알고 있다.",
  },
  {
    id: "byeotnwi",
    name: "볕뉘",
    romaji: "BYEOTNWI",
    title: "햇살 조각의 정령",
    color: "#efc42f",
    glow: "#ffe06a",
    summary: "울창한 잎 사이로 새어 드는 작은 볕.",
    story:
      "깊은 숲에도 길을 잃지 않도록 작은 빛을 흩뿌린다. 장난기가 많아 여행자의 발밑을 비추며 앞서 걷곤 한다.",
  },
  {
    id: "bulti",
    name: "불티",
    romaji: "BULTI",
    title: "불씨의 정령",
    color: "#c8313a",
    glow: "#ff5a4a",
    summary: "꺼지지 않는 작은 불씨, 숲의 심장 박동.",
    story:
      "세계수 깊은 곳의 온기를 지킨다. 성질이 급하지만 정이 많다. 숲이 차갑게 식을 때면 가장 밝게 타오른다.",
  },
  {
    id: "seori",
    name: "서리",
    romaji: "SEORI",
    title: "서리의 정령",
    color: "#e6ecef",
    glow: "#d8f2ff",
    summary: "첫 추위와 함께 내려앉는 고요.",
    story:
      "이슬과 같은 흰 천을 두르고 있지만 성격은 정반대. 차분하고 엄격하며, 숲이 쉬어야 할 때를 정한다.",
  },
  {
    id: "dasom",
    name: "다솜",
    romaji: "DASOM",
    title: "봄바람의 정령",
    color: "#f2b4c6",
    glow: "#ffd2e0",
    summary: "멀리 있는 것들을 이어주는 따뜻한 바람.",
    story:
      "흩어진 정령들의 목소리를 바람에 실어 나른다. 다정하고 수다스럽다. 다솜의 바람이 불면 숲이 조금 들뜬다.",
  },
  {
    id: "noeul",
    name: "노을",
    romaji: "NOEUL",
    title: "황혼의 정령",
    color: "#7a48b8",
    glow: "#b583ff",
    summary: "낮이 끝나고 밤이 시작되는 경계에 선 자.",
    story:
      "경계를 다스리는 정령. 이 세계와 '잃어버린 것들의 세계' 사이의 문을 지킨다. 많은 것을 알지만 말하지 않는다.",
  },
  {
    id: "yunseul",
    name: "윤슬",
    romaji: "YUNSEUL",
    title: "물빛의 정령",
    color: "#38c3d4",
    glow: "#7cf0ff",
    summary: "햇빛과 달빛에 반짝이는 물결.",
    story:
      "세계수의 뿌리를 적시는 샘을 지킨다. 물결처럼 기분이 자주 바뀌지만, 샘이 흐려지는 것만은 절대 용서하지 않는다.",
  },
];
