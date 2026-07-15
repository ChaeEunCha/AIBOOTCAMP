import { Bell, ChevronDown, ChevronUp } from "lucide-react";
import { notices } from "@/data/notices";

export default function NoticeSection() {
  const [left, right] = [notices.slice(0, 2), notices.slice(2, 4)];

  return (
    <section className="bg-seoul-orange px-5 py-4 text-white md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-1 md:flex-row md:gap-10">
          {[left, right].map((col, colIdx) => (
            <ul key={colIdx} className="flex flex-1 flex-col gap-2">
              {col.map((n) => (
                <li
                  key={n.id}
                  className="flex items-center justify-between gap-4 text-xs sm:text-sm"
                >
                  <span className="flex items-center gap-2 truncate">
                    <Bell size={14} className="shrink-0" />
                    {n.title}
                  </span>
                  <span className="shrink-0 text-white/80">{n.date}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-1 self-end text-white/80 md:self-auto">
          <ChevronUp size={16} />
          <ChevronDown size={16} />
        </div>
      </div>
    </section>
  );
}
