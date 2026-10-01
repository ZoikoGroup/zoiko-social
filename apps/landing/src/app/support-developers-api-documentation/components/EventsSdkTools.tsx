import React from "react";
import Image from "next/image";
import { Bell, Box, ChevronRight } from "lucide-react";

interface SdkCard {
  title: string;
  description: string;
  imageSrc: string;
  badgeText: string;
  icon: React.ReactNode;
  linkText: string;
  linkHref: string;
}

const sdkCards: SdkCard[] = [
  {
    title: "Events and webhooks",
    description: "Get notified when something changes.",
    imageSrc: "/api/9.png",
    badgeText: "Published only when approved",
    icon: <Bell className="w-4 h-4 text-[#0A5C6F]" />,
    linkText: "View when available",
    linkHref: "#",
  },
  {
    title: "SDKs and tools",
    description:
      "Official libraries, with version and support status.",
    imageSrc: "/api/10.png",
    badgeText: "Published only when approved",
    icon: <Box className="w-4 h-4 text-[#0A5C6F]" />,
    linkText: "View when available",
    linkHref: "#",
  },
];

export default function EventsSdkTools() {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-start">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-1.5">
            Events, SDKs and tools
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Listed here only when they&apos;re officially supported.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sdkCards.map((card, index) => (
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
                {/* Floating Icon Badge */}
                <div className="absolute bottom-4 left-4 z-10 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center">
                  {card.icon}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8 flex flex-col gap-4">
                <div className="w-fit bg-[#FEF3C7] border border-amber-200/60 rounded-full px-3 py-0.5 flex items-center shadow-sm">
                  <span className="text-[10px] font-medium text-amber-800">
                    {card.badgeText}
                  </span>
                </div>

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
      </div>
    </section>
  );
}
