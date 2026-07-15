export type Performance = {
  id: string;
  stage: string;
  title: string;
  startTime: string;
  endTime: string;
  image: string;
};

export const performances: Performance[] = [
  {
    id: "fantastic-music-show",
    stage: "지구별무대",
    title: "판타스틱 뮤직쇼",
    startTime: "14:00",
    endTime: "16:00",
    image: "/images/listImgFile_1775189565_0.jpg",
  },
  {
    id: "busking-band",
    stage: "라라스퀘어",
    title: "버스킹 라이브 밴드",
    startTime: "12:30",
    endTime: "18:30",
    image: "/images/listImgFile_1783062762_0.png",
  },
  {
    id: "outdoor-night-stage",
    stage: "달빛광장",
    title: "나이트 스페셜 무대",
    startTime: "19:00",
    endTime: "21:00",
    image: "/images/listImgFile_1783646769_0.png",
  },
];
