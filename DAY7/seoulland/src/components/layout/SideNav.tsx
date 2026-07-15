"use client";

import { Calendar, Globe, Menu, ArrowUp } from "lucide-react";

const quickAnchors = [
  { id: "event", label: "이벤트" },
  { id: "benefits", label: "맞춤혜택" },
  { id: "attractions", label: "어트랙션" },
  { id: "performance", label: "공연안내" },
  { id: "sns", label: "SNS" },
  { id: "group", label: "단체안내" },
];

export default function SideNav() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-6 lg:flex">
      <div className="flex flex-col items-center gap-4 text-white">
        <button
          type="button"
          aria-label="전체 메뉴"
          className="rounded-full p-2 transition hover:bg-white/20"
        >
          <Menu size={20} />
        </button>
        <button
          type="button"
          aria-label="방문일 캘린더"
          className="rounded-full p-2 transition hover:bg-white/20"
        >
          <Calendar size={20} />
        </button>
        <button
          type="button"
          aria-label="언어 선택"
          className="rounded-full p-2 transition hover:bg-white/20"
        >
          <Globe size={20} />
        </button>
      </div>

      <ul className="flex flex-col items-center gap-3 text-[11px] font-medium tracking-wide text-white/80">
        {quickAnchors.map((a) => (
          <li key={a.id}>
            <a href={`#${a.id}`} className="transition hover:text-white">
              {a.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="맨 위로"
        className="flex flex-col items-center gap-1 rounded-lg bg-white/15 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-white/25"
      >
        <ArrowUp size={16} />
        TOP
      </button>
    </nav>
  );
}
