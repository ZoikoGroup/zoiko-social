import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";

interface HelperCard {
  title: string;
  description: string;
  icon: string;
}

const helperCards: HelperCard[] = [
  {
    title: "It's normal to feel affected",
    description:
      "You just witnessed or helped in a crisis. It's natural to feel sad, anxious, or drained. This doesn't mean you failed.",
    icon: "/emergency/8.png",
  },
  {
    title: "Process the experience",
    description:
      "Talk to someone about what you experienced. A friend, therapist, or support group. Don't carry it alone.",
    icon: "/emergency/3.png",
  },
  {
    title: "Celebrate what you did",
    description:
      "You took action. You cared enough to help. You potentially saved a life. That's profound. Honor that.",
    icon: "/emergency/10.png",
  },
];

const resourceItems = [
  "First responder support programs if you're a professional helper",
  "Therapy for secondary trauma specific to helping in crisis",
  "Support groups for volunteers who work in crisis response",
  "Your own hotline or crisis support if you're struggling",
];

export default function SupportingTheHelpers() {
  return (
    <div className="w-full min-h-screen bg-[#F7F9FA] py-16 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Supporting the helpers: You matter too
          </h1>
          <p className="text-[#5a6e75] text-sm md:text-base">
            If you helped someone in crisis, you may be experiencing secondary
            trauma, guilt, or burnout. Your wellbeing matters. Get
            support.
          </p>
        </div>

        {/* Top 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {helperCards.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl bg-gradient-to-r from-[#EEF8F9] to-white p-8 shadow-sm border border-[#DCE5E8] flex flex-col justify-between space-y-6"
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
                  <h2 className="text-base md:text-lg font-bold text-[#066879]">
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

        {/* Bottom Resources Card */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-[#DCE5E8] space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden">
              <Image
                src="/emergency/9.png"
                alt="Brain icon"
                fill
                className="object-contain p-2"
              />
            </div>
            <h2 className="text-base md:text-lg font-bold text-[#066879]">
              Resources for helpers experiencing stress
            </h2>
          </div>

          <ul className="space-y-4">
            {resourceItems.map((item, index) => (
              <li
                key={index}
                className="flex items-start space-x-3 text-xs md:text-sm text-[#5a6e75]"
              >
                <div className="w-5 h-5 rounded-full bg-[#EEF8F9] flex items-center justify-center text-[#066879] flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
