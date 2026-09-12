import React from "react";

const REPORT_CATEGORIES = [
  "Wildlife harm or cruelty",
  "Illegal wildlife trade",
  "Sensitive-location exposure",
  "Poaching / exploitation facilitation",
  "Dangerous wildlife interaction",
  "Impersonation / misrepresentation",
  "Misinformation",
];

export default function TrustModerationReporting() {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="text-cyan-950 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-[33px] tracking-[-0.22px]">
        Trust, moderation &amp; reporting
      </div>
      <div className="max-w-[645px] text-gray-500 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-[21px]">
        Purpose, operator context, affiliation, verification, and moderation
        are separate, source-governed fields — a community name or subject
        never implies official status on its own.
      </div>
      <div className="flex flex-wrap gap-2.5">
        {REPORT_CATEGORIES.map((category) => (
          <div
            key={category}
            className="h-[31px] px-3 bg-cyan-50 rounded-full flex items-center justify-center"
          >
            <span className="text-cyan-950 text-xs font-semibold font-['Plus_Jakarta_Sans']">
              {category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
