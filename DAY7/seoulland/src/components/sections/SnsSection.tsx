import Image from "next/image";
import { snsPosts } from "@/data/sns";
import SectionHeading from "@/components/ui/SectionHeading";

export default function SnsSection() {
  return (
    <section id="sns" className="park-bg relative px-5 pb-20 pt-4 md:px-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <SectionHeading title="서울랜드 SNS" className="mb-8" />

        <div className="w-full rounded-3xl border-8 border-[#a97a4b] bg-white p-3 shadow-xl sm:p-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {snsPosts.map((post) => (
              <div
                key={post.id}
                className="relative aspect-square overflow-hidden rounded-lg"
              >
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  sizes="200px"
                  className="object-cover transition hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
