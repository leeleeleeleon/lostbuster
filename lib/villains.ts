// 스포일러 섹션의 악당들. 사진은 public/villains/<id>.png 에 넣으면 자동으로 뜬다.
// color 는 임시값이다.
export type Villain = {
  id: string;
  name: string;
  color: string;
  desc: string;
  tags: string[];
};

export const VILLAINS: Villain[] = [
  { id: "dal", name: "달", color: "#6b4fa0", desc: "자몽산의 세계수를 습격한 인물. 모든 것이 베일에 싸여 있다.", tags: ["무기 · 흑마법"] },
  { id: "cop", name: "콥", color: "#3d6e8f", desc: "공개된 정보 없음.", tags: [] },
  { id: "soda", name: "소다", color: "#3fa9c9", desc: "공개된 정보 없음.", tags: [] },
  { id: "deguise", name: "디가이스", color: "#8f3d4a", desc: "공개된 정보 없음.", tags: [] },
  { id: "gunjjang", name: "군쨩", color: "#3a3a44", desc: "군군의 ■■■ ■■.", tags: [] },
  { id: "worldtree", name: "세계수", color: "#3f7a45", desc: "공개된 정보 없음.", tags: [] },
];
