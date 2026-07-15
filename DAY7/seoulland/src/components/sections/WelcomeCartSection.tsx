import Image from "next/image";

export default function WelcomeCartSection() {
  return (
    <section className="park-bg relative px-5 pb-20 md:px-10">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <span className="mb-4 rounded-full border-2 border-seoul-teal-dark bg-white px-8 py-2 text-sm font-black tracking-wide text-seoul-teal-dark shadow">
          WELCOME
        </span>

        <div className="relative aspect-[1296/550] w-full overflow-hidden rounded-2xl shadow-xl">
          <Image
            src="/images/imgFile_1725856652_0.webp"
            alt="서울랜드 연간이용권을 사용한다면? 꿀혜택이 팡팡! 쏟아져요!"
            fill
            sizes="(min-width: 768px) 672px, 90vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
