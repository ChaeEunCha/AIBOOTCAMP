export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "baekilhong-garden",
    eyebrow: "백일홍 가든",
    title: "7월 25일 OPEN!",
    description: "1000평 가득 백일홍이 펼쳐지는 곳.\n수도권 최대 규모의 백일홍정원 탄생!",
    image: "/images/imgFile_1783995061_0.png",
    alt: "7.25 영원한 사랑이 피어난다 백일홍가든, 처음 만나는 핑크빛 테마가든",
  },
  {
    id: "water-wars",
    eyebrow: "워터파크 이벤트",
    title: "WATER WARS 워터워즈",
    description: "물총 들고 도파민 충전!\n서울랜드 K-썸머 도파민 Festival 오픈 기념!",
    image: "/images/imgFile_1782442281_0.jpg",
    alt: "Water Wars 워터워즈 이벤트, 물 오른 재미가 가득",
  },
  {
    id: "kpop-fireworks",
    eyebrow: "나이트 페스티벌",
    title: "2026 K-POP 불꽃판타지",
    description: "여름밤을 수놓는 화려한 불꽃과 K-POP의 만남.\n서울랜드에서 즐기는 특별한 밤!",
    image: "/images/imgFile_1783556587_0.jpg",
    alt: "2026 K-POP 불꽃판타지",
  },
  {
    id: "annual-concert",
    eyebrow: "연간 공연",
    title: "특별한 연간공연",
    description: "서울랜드에서 즐길 수 있는 특별한 연간공연.\n사계절 내내 이어지는 무대를 만나보세요.",
    image: "/images/imgFile_1680134858_0.webp",
    alt: "서울랜드에서 즐길 수 있는 특별한 연간공연",
  },
];
