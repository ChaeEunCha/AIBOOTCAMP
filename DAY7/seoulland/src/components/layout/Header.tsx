import Image from "next/image";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-5 pt-6 md:px-10 md:pt-8">
      <div className="flex items-center justify-between">
        <a href="#top" className="block w-28 md:w-36">
          <Image
            src="/images/img_logo_header2.svg"
            alt="Seoul Land"
            width={165}
            height={48}
            className="h-auto w-full"
            priority
          />
        </a>

        <button
          type="button"
          className="hidden items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-seoul-teal-dark shadow-sm sm:flex md:text-sm"
        >
          방문당일 맞춤정보
        </button>
      </div>
    </header>
  );
}
