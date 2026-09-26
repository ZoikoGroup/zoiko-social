import React from "react";

interface WarningSign {
  title: string;
  description: string;
}

const warningSigns: WarningSign[] = [
  {
    title: "Gradual withdrawal",
    description:
      "They stop posting, stop responding, stop engaging with communities they used to love. They're isolating.",
  },
  {
    title: "Mood changes over weeks",
    description:
      "Their posts shift from upbeat to darker. They're making self-deprecating jokes more often. Energy is lower.",
  },
  {
    title: "Expressing hopelessness",
    description:
      '"Nothing ever works out." "Why do I even try?" "I\'m just a burden." These statements become more frequent.',
  },
  {
    title: "Substance use increases",
    description:
      "They mention drinking more, using drugs more, or struggling with addiction in posts or DMs.",
  },
];

export default function PreventionEarlyWarningSigns() {
  return (
    <div className="w-full min-h-screen bg-[#F7F9FA] py-16 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Prevention: Recognize early warning signs
          </h1>
          <p className="text-[#5a6e75] text-sm md:text-base">
            Before someone reaches crisis level, there are earlier warning
            signs. Catching them early can prevent emergencies.
          </p>
        </div>

        {/* 2x2 Grid for Warning Signs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {warningSigns.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl p-6 md:p-8 shadow-sm border border-[#DCE5E8] space-y-2 flex flex-col justify-between"
            >
              <h2 className="text-base md:text-lg font-bold text-[#1a2d37]">
                {item.title}
              </h2>
              <p className="text-xs md:text-sm text-[#5a6e75] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Callout Box for Early Intervention Tip */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#DCE5E8] space-y-2">
          <h2 className="text-base md:text-lg font-bold text-[#1a2d37]">
            Early intervention tip
          </h2>
          <p className="text-xs md:text-sm text-[#5a6e75] leading-relaxed">
            If you notice these signs, reach out directly. &ldquo;Hey, I noticed
            you&apos;ve been quieter lately. Everything okay? I care about
            you.&rdquo; That one message can change someone&apos;s trajectory.
            They might not open up, but they know someone sees them and cares.
          </p>
        </div>
      </div>
    </div>
  );
}
