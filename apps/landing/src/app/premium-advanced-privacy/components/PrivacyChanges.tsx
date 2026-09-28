"use client";

import React from "react";

const canControl = [
  "Profile field visibility",
  "Post/content audience",
  "Activity status visibility",
  "Search discoverability",
  "Connection/follow visibility",
  "Community participation visibility",
];

const cannotControl = [
  "Safety and abuse enforcement",
  "Legal or court-ordered access",
  "Already viewed/downloaded content",
  "Content reported to moderators",
  "Third-party external access",
  "Blocking/reporting features",
];

export default function PrivacyChanges() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-8 px-6 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-28 lg:py-20">
        {/* Heading + Description */}
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-6">
          <div className="flex w-full flex-col items-start">
            <h2
              className="w-full font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10"
              style={{ color: "#102F38" }}
            >
              What does not change
            </h2>
          </div>

          <div className="flex w-full flex-col items-start">
            <p
              className="w-full font-['Plus_Jakarta_Sans'] text-base leading-6"
              style={{ color: "#607780" }}
            >
              <span className="font-bold">
                Advanced Privacy does not change your data handling, safety
                features, or community enforcement.
              </span>{" "}
              Privacy settings control visibility, not data collection. Safety
              tools and reporting remain available to all members regardless of
              your privacy choices.
            </p>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-8 lg:flex-row">
          {/* You Can Control */}
          <div
            className="flex w-full flex-1 flex-col items-start gap-6 rounded-[20px] p-8"
            style={{
              backgroundColor: "rgba(8, 122, 139, 0.05)",
              border: "2px solid #D6E3E6",
            }}
          >
            {/* Header */}
            <div className="relative h-12 w-full border-b-2 border-[#087A8B]">
              <div
                className="absolute left-0 top-[-1px] font-['Plus_Jakarta_Sans'] text-lg font-bold leading-7"
                style={{ color: "#087A8B" }}
              >
                ✓ You can control
              </div>
            </div>

            {/* List */}
            <div className="flex w-full flex-col items-start">
              {canControl.map((item) => (
                <div
                  key={item}
                  className="flex w-full items-start gap-3 py-3"
                >
                  <div
                    className="shrink-0 font-['Plus_Jakarta_Sans'] text-sm font-extrabold leading-6"
                    style={{ color: "#087A8B" }}
                  >
                    ✓
                  </div>

                  <div
                    className="font-['Plus_Jakarta_Sans'] text-sm font-normal leading-6"
                    style={{ color: "#102F38" }}
                  >
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* You Cannot Control */}
          <div
            className="flex w-full flex-1 flex-col items-start gap-6 rounded-[20px] p-8"
            style={{
              backgroundColor: "rgba(185, 28, 28, 0.05)",
              border: "2px solid #D6E3E6",
              opacity: 0.9,
            }}
          >
            {/* Header */}
            <div className="relative h-12 w-full border-b-2 border-[#B91C1C]">
              <div
                className="absolute left-0 top-[-1px] font-['Plus_Jakarta_Sans'] text-lg font-bold leading-7"
                style={{ color: "#B91C1C" }}
              >
                ✕ You cannot control
              </div>
            </div>

            {/* List */}
            <div className="flex w-full flex-col items-start">
              {cannotControl.map((item) => (
                <div
                  key={item}
                  className="flex w-full items-start gap-3 py-3"
                >
                  <div
                    className="shrink-0 font-['Plus_Jakarta_Sans'] text-sm font-extrabold leading-6"
                    style={{ color: "#B91C1C" }}
                  >
                    ✕
                  </div>

                  <div
                    className="font-['Plus_Jakarta_Sans'] text-sm font-normal leading-6"
                    style={{ color: "#102F38" }}
                  >
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div
          className="flex w-full max-w-[1280px] flex-col items-start gap-3 rounded-[20px] px-8 pb-8 pt-12"
          style={{
            background:
              "linear-gradient(82deg, rgba(248, 246, 242, 1) 0%, rgba(255, 247, 237, 1) 100%)",
            border: "1px solid #D6E3E6",
          }}
        >
          {/* Notice Heading */}
          <div className="flex w-full items-center justify-start">
            <div
              className="flex-1 font-['Plus_Jakarta_Sans'] text-base font-bold leading-6"
              style={{ color: "#C56A12" }}
            >
              ⚠️ Important: What Advanced Privacy does NOT do
            </div>
          </div>

          {/* Notice Description */}
          <div className="flex w-full flex-col items-start">
            <p
              className="w-full font-['Plus_Jakarta_Sans'] text-xs font-normal leading-6"
              style={{ color: "#102F38" }}
            >
              Advanced Privacy gives you control over approved visibility
              settings. It does NOT: make you anonymous, prevent content
              sharing once it&apos;s been seen, bypass safety enforcement, hide
              content from legal requests, or remove your ability to be
              reported. If content is deleted, downloaded, or screenshotted
              before you change privacy settings, Advanced Privacy cannot
              retroactively hide it. Safety notices, blocking, and reporting
              remain available to all users regardless of Premium status.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}