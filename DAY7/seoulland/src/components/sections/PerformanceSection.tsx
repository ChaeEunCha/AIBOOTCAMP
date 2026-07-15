"use client";

import Image from "next/image";
import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { performances } from "@/data/performances";
import SectionHeading from "@/components/ui/SectionHeading";

export default function PerformanceSection() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const show = performances[active];

  return (
    <section
      id="performance"
      className="park-bg relative px-5 pb-20 pt-4 md:px-10"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <SectionHeading title="공연안내" className="mb-8" />

        <div className="w-full overflow-hidden rounded-3xl bg-[#f3ead9] p-4 shadow-xl sm:p-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
            <Image
              key={show.id}
              src={show.image}
              alt={show.title}
              fill
              sizes="(min-width: 768px) 640px, 90vw"
              className="object-cover"
            />
          </div>

          <div className="mt-5 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                {show.stage}
              </span>
              <h3 className="text-lg font-bold text-gray-900">{show.title}</h3>
            </div>

            <div className="flex w-full max-w-xs items-center gap-3 text-sm font-semibold text-seoul-teal-dark">
              <span>{show.startTime}</span>
              <span className="relative h-1 flex-1 rounded-full bg-gray-200">
                <span className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-seoul-teal-dark" />
              </span>
              <span>{show.endTime}</span>
              <button
                type="button"
                aria-label={playing ? "일시정지" : "재생"}
                onClick={() => setPlaying((p) => !p)}
                className="text-gray-500 hover:text-gray-800"
              >
                {playing ? <Pause size={16} /> : <Play size={16} />}
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              {performances.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={p.title}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-6 bg-seoul-teal-dark" : "w-1.5 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
