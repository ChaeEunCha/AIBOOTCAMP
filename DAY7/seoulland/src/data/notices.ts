export type Notice = {
  id: string;
  title: string;
  date: string;
};

export const notices: Notice[] = [
  { id: "kpop-fireworks", title: "2026 K-POP 불꽃판타지", date: "2026.07.09" },
  { id: "transit-guide", title: "대중교통으로 서울랜드 가는 방법!", date: "2026.04.03" },
  { id: "etiquette", title: "서로를 배려하는 서울랜드 에티켓 안내", date: "2025.06.27" },
  { id: "gift-card", title: "제휴 상품권 사용 변경 안내", date: "2025.03.05" },
];
