export type QuickLink = {
  id: string;
  title: string;
  description: string;
  colorClass: string;
  icon: "map" | "ticket" | "gift" | "group";
};

export const quickLinks: QuickLink[] = [
  {
    id: "guide-map",
    title: "가이드맵",
    description: "서울랜드를 한눈에 둘러보세요!",
    colorClass: "bg-orange-100 text-seoul-orange",
    icon: "map",
  },
  {
    id: "attraction-reservation",
    title: "어트랙션 예약 앱",
    description: "이거 없으면 손해! 간편하게 예약해요",
    colorClass: "bg-blue-100 text-blue-500",
    icon: "ticket",
  },
  {
    id: "annual-pass",
    title: "연간이용혜택",
    description: "서울랜드를 내집처럼! 틈만나면 간다",
    colorClass: "bg-pink-100 text-pink-500",
    icon: "gift",
  },
  {
    id: "group-event",
    title: "단체·행사",
    description: "서울랜드 같이 가자~ 단체는 더 재밌다!",
    colorClass: "bg-amber-100 text-amber-500",
    icon: "group",
  },
];
