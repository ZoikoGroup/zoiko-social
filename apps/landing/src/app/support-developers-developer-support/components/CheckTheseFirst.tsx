import React from "react";
import Image from "next/image";
import { Code, Activity, BookOpen, ChevronRight } from "lucide-react";

interface CheckCard {
  title: string;
  description: string;
  imageSrc: string;
  icon: React.ReactNode;
  linkText: string;
  linkHref: string;
}

const checkCards: CheckCard[] = [
  {
    title: "API Documentation",
    description: "The official reference for how the API behaves.",
    imageSrc: "/developer/img2.png",
    icon: <Code className="w-4 h-4 text-[#0A5C6F]" />,
    linkText: "Open API Documentation",
    linkHref: "/support-developers-api-documentation",
  },
  {
    title: "System Status",
    description: "See if a known incident is affecting the API.",
    imageSrc: "/developer/img3.png",
    icon: <Activity className="w-4 h-4 text-[#0A5C6F]" />,
    linkText: "Check System Status",
    linkHref: "/support-developers-system-status",
  },
  {
    title: "Help Center",
    description: "Product questions that aren't about code.",
    imageSrc: "/developer/img4.png",
    icon: <BookOpen className="w-4 h-4 text-[#0A5C6F]" />,
    linkText: "Visit the Help Center",
    linkHref: "/support-developers-help-center",
  },
];

export default function CheckTheseFirst() {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-start">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-1.5">
            Check these first
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Many issues are answered before you need to write in.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checkCards.map((card, index) => (
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
