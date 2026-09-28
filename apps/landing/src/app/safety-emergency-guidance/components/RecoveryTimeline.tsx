import React from "react";
import Image from "next/image";

interface MilestoneItem {
  timeframe: string;
  title: string;
  description: string;
}

const milestoneData: MilestoneItem[] = [
  {
    timeframe: "Week 1",
    title: "Crisis stabilization",
    description:
      "Immediate danger has passed. They're safe. They may feel numb or exhausted—that's normal. The goal is just getting through each day.",
  },
  {
    timeframe: "Weeks 2–4",
    title: "Engagement with support",
    description:
      "They're seeing a therapist or counselor regularly. They might be in a hospital or intensive program. They're starting to talk about what happened.",
  },
  {
    timeframe: "Months 2–3",
    title: "Understanding & coping",
    description:
      "They're understanding WHY the crisis happened. They're learning coping skills. Some good days mixed in with hard days.",
  },
  {
    timeframe: "Months 3–6",
    title: "Rebuilding",
    description:
      "They're reconnecting with friends, returning to activities, making plans. Good days outnumber hard days, but it's still a journey.",
  },
  {
    timeframe: "6+ months",
    title: "Integration",
    description:
      "They've integrated the experience. They know their triggers. They have a support system. They're living a full life again—not \"back to normal\" but forward to new normal.",
  },
];

export default function RecoveryTimeline() {
  return (
    <div className="w-full bg-[#FFFFFF] py-16 px-4 md:px-8 font-sans text-[#1a2d37] flex items-center justify-center">
      <div className="max-w-7xl w-full space-y-12">
        {/* Section Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Recovery: What it looks like over time
          </h1>
          <p className="text-xs md:text-sm text-[#5a6e75]">
            Recovery isn&apos;t linear, but here are realistic milestones that
            show progress and healing is happening.
          </p>
        </div>

        {/* Hero Image Card */}
        <div className="w-full h-[280px] md:h-[340px] relative rounded-3xl overflow-hidden">
          <Image
            src="/emergency/paper.png"
            alt="Person reviewing recovery health insurance document"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Milestones Card Container */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-[#DCE5E8]">
          <div className="divide-y divide-[#DCE5E8]">
            {milestoneData.map((item, index) => (
              <div
                key={index}
                className="py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8"
              >
                {/* Timeframe Badge */}
                <div className="w-fit bg-gradient-to-r from-[#EEF8F9] to-white text-[#066879] px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex-shrink-0">
                  {item.timeframe}
                </div>

                {/* Title & Description */}
                <div className="flex-1 space-y-1">
                  <h2 className="text-base md:text-lg font-bold text-[#1a2d37]">
                    {item.title}
                  </h2>
                  <p className="text-xs md:text-sm text-[#5a6e75] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
