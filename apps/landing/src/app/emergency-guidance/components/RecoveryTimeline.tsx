import React from "react";

interface RecoveryStep {
  timeframe: string;
  title: string;
  description: string;
}

const recoverySteps: RecoveryStep[] = [
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
    <div className="w-full min-h-screen bg-[#F7F9FA] py-16 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Recovery: What it looks like over time
          </h1>
          <p className="text-[#5a6e75] text-sm md:text-base">
            Recovery isn&apos;t linear, but here are realistic milestones that
            show progress and healing is happening.
          </p>
        </div>

        {/* Timeline Container Card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-[#DCE5E8] divide-y divide-[#DCE5E8]">
          {recoverySteps.map((item, index) => (
            <div
              key={index}
              className="py-6 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center"
            >
              {/* Timeframe Badge */}
              <div className="md:col-span-3">
                <span className="inline-block px-4 py-2 rounded-full bg-[#EEF8F9] text-[#066879] text-xs font-bold tracking-wide">
                  {item.timeframe}
                </span>
              </div>

              {/* Title & Description */}
              <div className="md:col-span-9 space-y-1">
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
  );
}
