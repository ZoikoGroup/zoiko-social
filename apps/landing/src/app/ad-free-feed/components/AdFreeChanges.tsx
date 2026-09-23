"use client";

import React from "react";

const changes = [
  {
    title: "Safety tools remain",
    description:
      "Report, block, and mute features work exactly the same for all members.",
  },
  {
    title: "Ranking unchanged",
    description:
      "Your feed order is based on community engagement, not Premium status.",
  },
];

export default function AdFreeChanges() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-12 px-6 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-28 lg:py-20">

        {/* Main Content */}
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-6">

          {/* Heading */}
          <div className="flex w-full flex-col items-start">
            <h2
              className="w-full font-['Plus_Jakarta_Sans'] text-2xl font-extrabold leading-8 sm:text-3xl sm:leading-10"
              style={{ color: "#102F38" }}
            >
              What does not change
            </h2>
          </div>

          {/* Intro */}
          <div className="flex w-full flex-col items-start">
            <p
              className="w-full font-['Plus_Jakarta_Sans'] text-base leading-6"
              style={{ color: "#607780" }}
            >
              <span className="font-bold">
                Premium does not change your privacy, safety, feed ranking, or
                community moderation.
              </span>{" "}
              Safety notices, reporting tools, and community guidelines remain
              the same. Organic posts and legitimate community updates continue
              as usual.
            </p>
          </div>

          {/* Cards */}
          <div className="grid w-full grid-cols-1 gap-6 pt-8 sm:pt-10 lg:grid-cols-2 lg:pt-14">
            {changes.map((item) => (
              <div
                key={item.title}
                className="flex w-full flex-col items-start gap-4 rounded-[20px] bg-white px-6 pb-10 pt-6 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
                style={{
                  border: "1px solid #D6E3E6",
                }}
              >
                {/* Card Title */}
                <div className="flex w-full flex-col items-start pb-px">
                  <h3
                    className="w-full font-['Plus_Jakarta_Sans'] text-base font-bold"
                    style={{ color: "#087A8B" }}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Card Description */}
                <div className="flex w-full flex-col items-start">
                  <p
                    className="w-full font-['Plus_Jakarta_Sans'] text-base font-normal leading-6"
                    style={{ color: "#607780" }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notice */}
        <div className="flex w-full max-w-[1232px] flex-col items-start gap-3 rounded-[20px] border border-[#D6E3E6] bg-[linear-gradient(82deg,rgba(248,246,242,1)_0%,rgba(255,247,237,1)_100%)] p-6 sm:p-8">

          {/* Notice Heading */}
          <div className="flex w-full items-center">
            <h3
              className="flex-1 font-['Plus_Jakarta_Sans'] text-base font-bold leading-6"
              style={{ color: "#C56A12" }}
            >
              ⚠️ Important: What Ad-Free Feed is NOT
            </h3>
          </div>

          {/* Notice Description */}
          <div className="flex w-full flex-col items-start">
            <p
              className="w-full font-['Plus_Jakarta_Sans'] text-xs font-normal leading-6"
              style={{ color: "#102F38" }}
            >
              Ad-Free Feed removes approved advertising placements only. It
              does NOT: guarantee zero ads everywhere, change your privacy or
              data use, hide safety notices, affect how organic content ranks,
              or bypass any platform policies. Organic posts from communities
              and people you follow still appear as normal. If you see content
              that looks like an ad, it may be organic sponsored content from
              your communities, which is not covered by this benefit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}