import React from "react";
import Image from "next/image";
import {
  MessageCircle,
  Accessibility,
  Users,
  ChevronRight,
} from "lucide-react";

interface HelpCard {
  title: string;
  description: string;
  imageSrc: string;
  icon: React.ReactNode;
  linkText: string;
  linkHref: string;
  badge?: string;
}

const helpCards: HelpCard[] = [
  {
    title: "Contact Us",
    description: "General account or product questions.",
    imageSrc: "/developer/img6.png",
    icon: <MessageCircle className="w-4 h-4 text-[#0A5C6F]" />,
    linkText: "Contact support",
    linkHref: "/support-developers-contact-us",
  },
  {
    title: "Accessibility Support",
    description: "Specialist help using Zoiko Social your way.",
    imageSrc: "/developer/img7.png",
    icon: <Accessibility className="w-4 h-4 text-[#0A5C6F]" />,
    linkText: "Get accessibility help",
    linkHref: "/support-developers-accessibility-support",
  },
  {
    title: "Community Forums",
    description: "Swap tips with other developers.",
    imageSrc: "/developer/img8.png",
    icon: <Users className="w-4 h-4 text-[#0A5C6F]" />,
    linkText: "Visit the forums",
    linkHref: "/support-developers-community-forums",
    badge: "Community answers, not official support",
  },
];

export default function MorePlacesToGetHelp() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            More places to get help
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            The right team for each kind of question.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpCards.map((card, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-gray-300 transition-colors"
            >
              {/* Image Container with Floating Icon Badge */}
              <div className="relative w-full h-[220px]">
                <Image
                  src={card.imageSrc}
                  alt={card.title}
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute bottom-4 left-4 z-10 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-gray-100 flex items-center justify-center">
                  {card.icon}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  {card.badge && (
                    <div className="w-fit bg-[#FEF3C7] border border-amber-200/60 rounded-full px-3 py-0.5 mb-1 shadow-sm">
                      <span className="text-[10px] font-medium text-amber-800">
                        {card.badge}
                      </span>
                    </div>
                  )}
                  <h3 className="text-base font-bold text-[#111827]">
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
      </div>
    </section>
  );
}
