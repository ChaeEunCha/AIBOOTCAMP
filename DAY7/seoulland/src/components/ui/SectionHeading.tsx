import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  className?: string;
};

export default function SectionHeading({ title, className = "" }: Props) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-base font-bold text-gray-800 shadow-md md:text-lg ${className}`}
    >
      {title}
      <ArrowRight size={18} className="text-seoul-orange" />
    </div>
  );
}
