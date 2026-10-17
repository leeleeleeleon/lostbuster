// 스포일러 섹션의 악당들. 사진은 public/villains/<id>.png 에 넣으면 자동으로 뜬다.
// color 는 캐릭터 설정화에서 뽑은 상징색이다.
export type Villain = {
  id: string;
  name: string;
  color: string;
  desc: string;
  tags: string[];
};

export const VILLAINS: Villain[] = [
  // 연분홍 머리와 보라 뿔
  { id: "dal", name: "달", color: "#e8a6d6", desc: "자몽산의 세계수를 습격한 인물. 모든 것이 베일에 싸여 있다.", tags: ["무기 · 흑마법"] },
  // 검은 옷에 노란 눈. 검정은 배경에 묻혀서 눈 색을 쓴다
  { id: "cop", name: "콥", color: "#f2c531", desc: "공개된 정보 없음.", tags: [] },
  // 얼음빛 하늘색 장갑과 망토
  { id: "soda", name: "소다", color: "#9fd8ee", desc: "공개된 정보 없음.", tags: [] },
  // 파란 촉수
  { id: "deguise", name: "디가이스", color: "#2f6bea", desc: "공개된 정보 없음.", tags: [] },
  { id: "gunjjang", name: "군쨩", color: "#ffffff", desc: "군군의 ■■■ ■■.", tags: [] },
  { id: "worldtree", name: "세계수", color: "#7f9f73", desc: "공개된 정보 없음.", tags: [] },
];
