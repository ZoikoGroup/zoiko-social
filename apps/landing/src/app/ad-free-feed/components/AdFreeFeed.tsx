"use client";

import React from "react";

const feedItems = [
  {
    name: "Alex Chen",
    content:
      "Just published my guide on community building. Excited to see what you think!",
  },
  {
    name: "Design Team",
    content:
      "Weekly design tips: effective use of white space in UI. Check the thread below 👇",
  },
  {
    name: "Product Launch",
    content:
      "New feature coming soon: Advanced search filters. Early access for Premium members.",
  },
];

export default function AdFreeFeed() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] justify-center px-6 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-28 lg:py-20">
        <div className="flex w-full max-w-[1280px] flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-20">
          
          {/* Left Content */}
          <div className="flex w-full max-w-[594px] flex-col items-start">
            <div className="flex w-full flex-col items-start gap-6">
              
              <div className="flex w-full flex-col items-start gap-2.5 pb-8 pt-8">
                
                {/* Eyebrow */}
                <div className="flex w-full flex-col items-start">
                  <span
                    className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase leading-5 tracking-wide"
                    style={{ color: "#087A8B" }}
                  >
                    Premium · Ad-Free Feed
                  </span>
                </div>

                {/* Heading */}
                <div className="flex w-full max-w-[600px] flex-col items-start">
                  <h2
                    className="w-full font-['Plus_Jakarta_Sans'] text-4xl font-extrabold leading-[1.25] sm:text-5xl sm:leading-[59.8px]"
                    style={{ color: "#102F38" }}
                  >
                    Browse with fewer
                    <br />
                    interruptions.
                  </h2>
                </div>

                {/* Description */}
                <div className="w-full max-w-[550px] pt-3">
                  <p
                    className="font-['Plus_Jakarta_Sans'] text-base font-normal leading-7"
                    style={{ color: "#607780" }}
                  >
                    Experience a more continuous feed. Approved advertising
                    <br className="hidden sm:block" />
                    placements are removed, letting you focus on content from
                    people
                    <br className="hidden sm:block" />
                    and communities you care about.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex w-full flex-wrap items-start gap-4 pt-5">
                  <button
                    type="button"
                    className="min-h-10 rounded-xl px-5 py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: "#087A8B",
                      color: "#FFFFFF",
                    }}
                  >
                    Compare Plans
                  </button>

                  <button
                    type="button"
                    className="min-h-10 rounded-xl px-5 py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-semibold transition-colors hover:bg-[#F5F7F7]"
                    style={{
                      backgroundColor: "#FFFFFF",
                      color: "#087A8B",
                      border: "1px solid #D6E3E6",
                    }}
                  >
                    What changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Feed Preview */}
          <div className="w-full max-w-[613px]">
            <div
              className="w-full overflow-hidden rounded-3xl bg-white"
              style={{
                boxShadow: "0px 20px 48px 0px rgba(7, 59, 71, 0.16)",
              }}
            >
              {/* Feed Header */}
              <div
                className="flex w-full flex-col items-start border-b px-6 py-4"
                style={{
                  backgroundColor: "#F5F7F7",
                  borderColor: "#D6E3E6",
                }}
              >
                <span
                  className="font-['Plus_Jakarta_Sans'] text-xs font-semibold uppercase leading-5 tracking-wide"
                  style={{ color: "#087A8B" }}
                >
                  Your Feed (Premium)
                </span>
              </div>

              {/* Feed Content */}
              <div className="flex h-[453px] w-full flex-col items-start overflow-hidden p-6">
                {feedItems.map((item) => (
                  <div
                    key={item.name}
                    className="flex w-full flex-col items-start pb-4"
                  >
                    <div
                      className="flex w-full flex-col items-start gap-2 rounded-[20px] bg-white px-4 pb-7 pt-4"
                      style={{
                        border: "1px solid #D6E3E6",
                      }}
                    >
                      {/* Name */}
                      <div className="flex w-full flex-col items-start">
                        <span
                          className="w-full font-['Plus_Jakarta_Sans'] text-xs font-semibold leading-5"
                          style={{ color: "#102F38" }}
                        >
                          {item.name}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex w-full flex-col items-start">
                        <p
                          className="w-full font-['Plus_Jakarta_Sans'] text-xs font-normal leading-5"
                          style={{ color: "#607780" }}
                        >
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}