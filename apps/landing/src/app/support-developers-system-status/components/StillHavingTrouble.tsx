import React from "react";
import Image from "next/image";
import {
  BookOpen,
  MessageSquare,
  Code,
  Terminal,
  Accessibility,
  Users,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { SUPPORT_HREF } from "@/lib/support-links";

interface SupportCard {
  title: string;
  description: string;
  imageSrc: string;
  icon: React.ReactNode;
  linkText: string;
  linkHref: string;
}

interface BottomCard {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const mainCards: SupportCard[] = [
  {
    title: "Help Center",
    description: "Fixes for sign-in, uploads and notifications.",
    imageSrc: "/system/3.png",
    icon: <BookOpen className="w-4 h-4 text-[#0A5C6F]" />,
    linkText: "Find troubleshooting steps",
    linkHref: "/support-developers-help-center",
  },
  {
    title: "Contact Us",
    description: "Still stuck? Reach the support team.",
    imageSrc: "/system/4.png",
    icon: <MessageSquare className="w-4 h-4 text-[#0A5C6F]" />,
    linkText: "Contact support",
    linkHref: "/support-developers-contact-us",
  },
];

const bottomCards: BottomCard[] = [
  {
    title: "API Documentation",
    subtitle: "API reference",
    icon: <Code className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Developer Support",
    subtitle: "Integration help",
    icon: <Terminal className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Accessibility Support",
    subtitle: "Specialist support",
    icon: <Accessibility className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    title: "Community Forums",
    subtitle: "Member discussion",
    icon: <Users className="w-4 h-4 text-[#0A5C6F]" />,
  },
];

export default function StillHavingTrouble() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-start">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-1.5">
            Still having trouble?
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Your service isn&apos;t affected but something&apos;s wrong? Start
            here.
          </p>
        </div>

        {/* Top 2 Large Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mainCards.map((card) => (
            <div
              key={card.title}
              className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              {/* Image Container with Floating Icon Badge */}
              <div className="relative w-full h-[220px]">
                <Image
                  src={card.imageSrc}
                  alt={card.title}
                  fill
                  className="object-cover object-center"
                />
                {/* Floating Icon Badge */}
                <div className="absolute bottom-4 left-4 z-10 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center">
                  {card.icon}
                </div>
              </div>

              {/* Content Container */}
              <div className="p-8 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-bold text-[#111827]">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-normal leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <a
                  href={card.linkHref}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0A5C6F] hover:underline pt-2"
                >
                  {card.linkText}
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom 4 Small Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bottomCards.map((item) => (
            <Link
              key={item.title}
              href={SUPPORT_HREF[item.title] ?? "#"}
              className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 hover:border-gray-300 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#111827]">
                  {item.title}
                </span>
                <span className="text-[11px] text-gray-400 font-normal">
                  {item.subtitle}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
