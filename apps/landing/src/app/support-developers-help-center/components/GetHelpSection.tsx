import React from "react";
import Image from "next/image";
import {
  MessageSquare,
  Accessibility,
  Users,
  ChevronRight,
} from "lucide-react";
import { SUPPORT_HREF } from "@/lib/support-links";

const helpCards = [
  {
    image: "/help/9.png",
    icon: MessageSquare,
    title: "Contact Us",
    description: "Reach support when a guide doesn't solve it.",
    linkText: "Contact support",
    badge: null,
  },
  {
    image: "/help/10.png",
    icon: Accessibility,
    title: "Accessibility Support",
    description: "Specialist help using Zoiko Social your way.",
    linkText: "Get accessibility help",
    badge: null,
  },
  {
    image: "/help/11.png",
    icon: Users,
    title: "Community Forums",
    description: "Ask other members and share tips.",
    linkText: "Visit the forums",
    badge: "Community answers, not official support",
  },
] as const;

export default function GetHelpSection() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 flex justify-center font-sans">
      <div className="w-full max-w-7xl">
        {/* Section Header */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-1.5">
            Get the right kind of help
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Each team owns its own answers.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className="flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all overflow-hidden group"
              >
                {/* Image Container */}
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content Container */}
                <div className="p-6 relative flex flex-col flex-grow">
                  {/* Floating Icon */}
                  <div className="absolute -top-6 left-6 w-12 h-12 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-[#0A5C6F]">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Text Details */}
                  <div className="mt-4 flex flex-col flex-grow">
                    {card.badge && (
                      <span className="inline-block bg-[#FDF8F0] text-[#B45309] border border-[#FDE6D2] text-[10px] font-medium px-2.5 py-0.5 rounded-full mb-2 w-fit">
                        {card.badge}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-[#111827] mb-1">
                      {card.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-normal mb-8 leading-relaxed">
                      {card.description}
                    </p>

                    {/* Link */}
                    <div className="mt-auto">
                      <a
                        href={SUPPORT_HREF[card.linkText] ?? "#"}
                        className="inline-flex items-center text-xs font-semibold text-[#0A5C6F] hover:text-[#084A59]"
                      >
                        <span>{card.linkText}</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
