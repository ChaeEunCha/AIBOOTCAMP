"use client";

import { useState } from "react";

const options = [
  { id: "kids", label: "아이와 함께" },
  { id: "friends", label: "친구와 함께" },
] as const;

export default function CompanionSection() {
  const [selected, setSelected] = useState<(typeof options)[number]["id"]>(
    "kids"
  );

  return (
    <section
      className="relative flex items-end justify-center bg-seoul-teal bg-cover bg-top bg-no-repeat pb-10 md:pb-14"
      style={{
        backgroundImage: "url(/images/sections/companion-bg.webp)",
        aspectRatio: "3400 / 1300",
      }}
    >
      <div className="relative z-10 flex flex-col items-center gap-6 px-5 text-center">
        <h2 className="text-xl font-bold text-white drop-shadow md:text-3xl">
          누구와 함께 하시나요?
        </h2>
        <div className="flex overflow-hidden rounded-full bg-white/90 p-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelected(opt.id)}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition md:px-8 md:text-base ${
                selected === opt.id
                  ? "bg-seoul-orange text-white shadow"
                  : "text-gray-500"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
