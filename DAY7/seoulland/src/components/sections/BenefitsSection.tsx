import Image from "next/image";
import { benefits } from "@/data/benefits";
import SectionHeading from "@/components/ui/SectionHeading";

export default function BenefitsSection() {
  return (
    <section id="benefits" className="park-bg relative px-5 pb-20 pt-4 md:px-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <SectionHeading title="맞춤혜택" className="mb-8" />

        <div className="grid w-full grid-cols-2 gap-3 rounded-3xl bg-white/95 p-4 shadow-xl backdrop-blur sm:gap-4 sm:p-6 md:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.id}
              className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-3 transition hover:shadow-md sm:p-4"
            >
              <div className="relative flex h-20 items-center justify-center overflow-hidden rounded-lg bg-gray-50 sm:h-24">
                <Image
                  src={b.image}
                  alt={b.title}
                  fill
                  sizes="200px"
                  className="object-contain p-2"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-seoul-teal-dark">
                  {b.category}
                </p>
                <p className="mt-1 text-xs font-medium leading-snug text-gray-700 sm:text-sm">
                  {b.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
