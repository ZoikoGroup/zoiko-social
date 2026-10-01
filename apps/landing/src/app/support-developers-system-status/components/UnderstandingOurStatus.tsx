import React from "react";
import Image from "next/image";

interface StatusCard {
  title: string;
  description: string;
  iconSrc: string;
}

const statusCards: StatusCard[] = [
  {
    title: "Operational",
    description:
      "Service is running normally. Users can access and use features without problems.",
    iconSrc: "/system/6.png",
  },
  {
    title: "Degraded",
    description:
      "Service is available but slower than normal or with some features limited. We're working on it.",
    iconSrc: "/system/7.png",
  },
  {
    title: "Down / Outage",
    description:
      "Service is unavailable. Users cannot access. We're treating this as our top priority.",
    iconSrc: "/system/8.png",
  },
];

export default function UnderstandingOurStatus() {
  return (
    <section className="w-full bg-white py-16 px-4 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col items-center">
        {/* Section Header */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-12 text-center">
          Understanding Our Status
        </h2>

        {/* Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {statusCards.map((card, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="w-12 h-12 relative mb-6 flex items-center justify-center">
                <Image
                  src={card.iconSrc}
                  alt={card.title}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-[#111827] mb-2">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-500 font-normal leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
