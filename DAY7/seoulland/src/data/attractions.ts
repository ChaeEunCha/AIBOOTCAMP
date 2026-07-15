export type Attraction = {
  id: string;
  title: string;
  heightLimit: string;
  zone: string;
  image: string;
};

export const attractions: Attraction[] = [
  {
    id: "ghost-cave",
    title: "귀신동굴 : 미래의 골동품가게",
    heightLimit: "제한없음",
    zone: "삼천리동산",
    image: "/images/thumbnailImgFile_1759206838_0.png",
  },
  {
    id: "vroomiz-land",
    title: "브루미즈 동산",
    heightLimit: "90cm ~ 135cm",
    zone: "캐릭터타운",
    image: "/images/thumbnailImgFile_1650343844_0.webp",
  },
  {
    id: "best-kids",
    title: "베스트키즈",
    heightLimit: "~125cm",
    zone: "삼천리동산",
    image: "/images/thumbnailImgFile_1650342841_0.webp",
  },
  {
    id: "kart-rider-bumper",
    title: "카트라이더 범퍼",
    heightLimit: "100cm ~",
    zone: "캐릭터타운",
    image: "/images/thumbnailImgFile_1621843921_0.webp",
  },
  {
    id: "turning-mecard-racing",
    title: "터닝메카드 레이싱",
    heightLimit: "100cm ~",
    zone: "캐릭터타운",
    image: "/images/thumbnailImgFile_1650517888_0.webp",
  },
  {
    id: "super-wings",
    title: "출동! 슈퍼윙스",
    heightLimit: "80cm ~",
    zone: "미래의나라",
    image: "/images/thumbnailImgFile_1650342582_0.webp",
  },
  {
    id: "floating-airship",
    title: "둥실비행선",
    heightLimit: "제한없음",
    zone: "미래의나라",
    image: "/images/thumbnailImgFile_1650337304_0.webp",
  },
  {
    id: "big-carousel",
    title: "빅회전목마",
    heightLimit: "제한없음",
    zone: "캐릭터타운",
    image: "/images/thumbnailImgFile_1650337319_0.webp",
  },
];
