export type Benefit = {
  id: string;
  category: string;
  title: string;
  image: string;
};

export const benefits: Benefit[] = [
  {
    id: "bc-card",
    category: "카드혜택",
    title: "비씨카드 실적에 상관없이 전 회원 더블할인!",
    image: "/images/listImgFile_1655712161_0.webp",
  },
  {
    id: "partner-card",
    category: "카드혜택",
    title: "제휴카드 실적 충족 카드 본인 50% 할인",
    image: "/images/listImgFile_1650877008_0.webp",
  },
  {
    id: "hyundai-card",
    category: "카드혜택",
    title: "현대카드 M포인트 50% 사용 혜택!",
    image: "/images/listImgFile_1754013145_0.jpg",
  },
  {
    id: "lotte-card",
    category: "카드혜택",
    title: "롯데카드 제휴실적에 상관없이 40% 할인!",
    image: "/images/listImgFile_1653554002_0.webp",
  },
  {
    id: "skt",
    category: "멤버십혜택",
    title: "SKT 파크이용권 회원 본인 50%, 동반 2인 할인",
    image: "/images/mainImgFile_1770274190Hn4kr.jpg",
  },
  {
    id: "kt",
    category: "멤버십혜택",
    title: "KT 멤버십 특별할인! 본인 40%, 추가 할인",
    image: "/images/listImgFile_1653554299_0.webp",
  },
  {
    id: "lguplus",
    category: "멤버십혜택",
    title: "LGU+ 파크이용권 최대 50% 할인",
    image: "/images/listImgFile_1653554706_0.webp",
  },
  {
    id: "naverpay",
    category: "일반혜택",
    title: "네이버페이 포인트&머니 결제시 회원 및 동반 할인",
    image: "/images/listImgFile_1642647738_0.webp",
  },
];
