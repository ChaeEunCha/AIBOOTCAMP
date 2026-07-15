import Image from "next/image";
import { attractions } from "@/data/attractions";
import SectionHeading from "@/components/ui/SectionHeading";

const zoneColors: Record<string, string> = {
  삼천리동산: "bg-sky-400",
  캐릭터타운: "bg-orange-400",
  미래의나라: "bg-violet-400",
};

export default function AttractionsSection() {
  return (
    <section
      id="attractions"
      className="park-bg relative px-5 pb-20 pt-4 md:px-10"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <SectionHeading title="어트랙션" className="mb-8" />

        <div className="grid w-full grid-cols-2 gap-x-3 gap-y-8 rounded-3xl bg-white/95 p-5 shadow-xl sm:gap-x-4 sm:p-8 md:grid-cols-4">
          {attractions.map((a) => (
            <div key={a.id} className="flex flex-col items-center text-center">
              <p className="text-sm font-bold text-gray-800 sm:text-base">
                {a.title}
              </p>
              <p className="mt-1 text-xs font-medium text-seoul-teal-dark">
                {a.heightLimit}
              </p>

              <div className="relative mt-3 h-24 w-24 overflow-hidden rounded-full ring-4 ring-gray-50 sm:h-28 sm:w-28">
                <Image
                  src={a.image}
                  alt={a.title}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>

              <span
                className={`relative z-10 -mt-3 rounded-full px-4 py-1 text-xs font-semibold text-white shadow ${
                  zoneColors[a.zone] ?? "bg-gray-400"
                }`}
              >
                {a.zone}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
