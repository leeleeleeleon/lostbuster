export type NewsItem = {
  id: number;
  category: "공지" | "업데이트" | "이벤트" | "개발노트";
  title: string;
  date: string;
};

export const NEWS: NewsItem[] = [
  { id: 4, category: "공지", title: "로스트버스터 다운로드 안내", date: "2026.10.17" },
  { id: 3, category: "개발노트", title: "세계수는 어떻게 그려졌나: 숲의 아트 디렉션 이야기", date: "2026.10.10" },
  { id: 2, category: "업데이트", title: "정령 10인의 이름과 상징색 공개", date: "2026.10.03" },
  { id: 1, category: "공지", title: "로스트버스터 공식 홈페이지 오픈", date: "2026.09.26" },
];
