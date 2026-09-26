import React from "react";
import Image from "next/image";

interface PathwayCard {
  title: string;
  description: string;
  icon: string;
}

const pathways: PathwayCard[] = [
  {
    title: "Mental health therapy",
    description:
      "Professional counselors can help process trauma, grief, and difficult emotions. Many therapists work with insurance or offer sliding scale fees.",
    icon: "/emergency/9.png",
  },
  {
    title: "Support groups",
    description:
      "Connect with others who've been through similar crises. Shared experience heals. Many groups meet online and in-person.",
    icon: "/emergency/11.png",
  },
  {
    title: "Wellness practices",
    description:
      "Sleep, exercise, nutrition, and mindfulness help. Small things—a 10-minute walk, meditation app, journaling—make a difference.",
    icon: "/emergency/12.png",
  },
  {
    title: "Lean on your people",
    description:
      "Tell trusted friends or family what you're experiencing. You don't have to go through recovery alone.",
    icon: "/emergency/13.png",
  },
  {
    title: "Educational resources",
    description:
      "Learning about what happened—mental illness, addiction, trauma—helps you understand and support better.",
    icon: "/emergency/14.png",
  },
  {
    title: "Crisis-specific tools",
    description:
      "Apps like Calm, Headspace, or 7 Cups offer meditation, journaling, and peer support when you need it.",
    icon: "/emergency/15.png",
  },
];

export default function EmotionalSupportPathways() {
  return (
    <div className="w-full min-h-screen bg-white py-16 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Emotional support & healing pathways
          </h1>
          <p className="text-[#5a6e75] text-sm md:text-base">
            After an emergency, everyone needs support—including the person
            helping. Resources for recovery and self-care.
          </p>
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pathways.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-[#EEF8F9] to-white rounded-3xl p-8 shadow-sm border border-[#DCE5E8] flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h2 className="text-base md:text-lg font-bold text-[#1a2d37]">
                    {item.title}
                  </h2>
                  <p className="text-xs md:text-sm text-[#5a6e75] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
