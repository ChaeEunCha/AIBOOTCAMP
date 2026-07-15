"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { heroSlides } from "@/data/heroSlides";

export default function HeroSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[active];

  return (
    <section
      id="event"
      className="relative overflow-hidden bg-seoul-teal pb-16 pt-28 md:pb-24 md:pt-32"
    >
      <Image
        src="/images/adballoon_left.png"
        alt=""
        width={600}
        height={600}
        aria-hidden
        className="pointer-events-none absolute -left-10 -top-8 w-28 opacity-90 md:w-40 lg:w-52"
      />
      <Image
        src="/images/adballoon_right.png"
        alt=""
        width={600}
        height={600}
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-10 w-28 opacity-90 md:w-40 lg:w-52"
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 md:grid-cols-2 md:gap-8 md:px-10">
        <div className="text-white">
          <p className="text-sm font-semibold text-white/80 md:text-base">
            {slide.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
            {slide.title}
          </h1>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white/90 md:text-base">
            {slide.description}
          </p>
          <button
            type="button"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-seoul-teal-dark"
          >
            VIEW MORE
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="relative mx-auto w-full max-w-md rotate-1 rounded-2xl border-[6px] border-white bg-white shadow-2xl md:rotate-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            <Image
              key={slide.id}
              src={slide.image}
              alt={slide.alt}
              fill
              sizes="(min-width: 768px) 420px, 90vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <div className="relative mt-10 flex items-center justify-center gap-2">
        {heroSlides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`${i + 1}번째 배너로 이동`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-6 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
