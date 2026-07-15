import Image from "next/image";

export default function RiverDivider() {
  return (
    <section className="park-bg relative overflow-hidden">
      <div className="relative mx-auto flex max-w-6xl flex-col sm:flex-row">
        <div className="relative h-40 w-full sm:h-56 md:h-64">
          <Image
            src="/images/river_left.png"
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover object-left"
          />
        </div>
        <div className="relative h-40 w-full sm:h-56 md:h-64">
          <Image
            src="/images/river_right.png"
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover object-right"
          />
        </div>
      </div>
    </section>
  );
}
