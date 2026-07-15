import Image from "next/image";
import { Rss, Plus } from "lucide-react";
import { quickLinks } from "@/data/quickLinks";
import QuickLinkIcon from "@/components/ui/QuickLinkIcon";
import SocialIcon from "@/components/ui/SocialIcon";

const footerLinks = [
  "서울랜드",
  "개인정보처리방침",
  "이메일 무단 수집 거부",
  "인재 채용",
  "서울랜드 스폰서",
  "제휴문의",
];

export default function Footer() {
  return (
    <footer className="relative bg-white">
      <section id="group" className="mx-auto max-w-6xl px-5 py-12 md:px-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {quickLinks.map((link) => (
            <div key={link.id} className="flex items-start gap-3">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${link.colorClass}`}
              >
                <QuickLinkIcon icon={link.icon} size={20} />
              </span>
              <div>
                <p className="font-bold text-gray-900">{link.title}</p>
                <p className="mt-1 text-xs leading-snug text-gray-500">
                  {link.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-gray-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 md:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-600 md:text-sm">
              {footerLinks.map((label, i) => (
                <li
                  key={label}
                  className={i === 1 ? "font-bold text-gray-900" : ""}
                >
                  {label}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4 text-gray-700">
              <SocialIcon name="facebook" size={18} />
              <Rss size={18} />
              <SocialIcon name="instagram" size={18} />
              <SocialIcon name="youtube" size={18} />
            </div>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Image
                src="/images/img_logo_header2.svg"
                alt="Seoul Land"
                width={140}
                height={40}
                className="mb-4 h-auto w-32 invert"
              />
              <p className="text-xs leading-relaxed text-gray-500 md:text-sm">
                13829 경기도 과천시 광명로 181 (주) 서울랜드 02-509-6000
                138-81-04654 통신판매업 신고번호 : 과천 제 137호
                <br />
                개인정보 관리책임자 : 마케팅팀 이관철 Webmaster@seoulland.co.kr
              </p>
              <p className="mt-4 text-xs text-gray-400">
                Copyright © Seoulland. All rights reserved.
              </p>
            </div>

            <button
              type="button"
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-600 md:w-56"
            >
              패밀리 사이트
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="빠른 상담"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-seoul-orange text-white shadow-lg shadow-orange-300/50 transition hover:scale-105"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
        </svg>
      </button>
    </footer>
  );
}
