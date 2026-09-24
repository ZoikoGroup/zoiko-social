"use client";

import React from "react";

const campaigns = [
  {
    number: "1",
    title: "Launch",
    description:
      "Create your campaign with a goal, story, and timeline on Zoiko.",
  },
  {
    number: "2",
    title: "Track",
    description:
      "Watch donations come in real-time and share progress with your community.",
  },
  {
    number: "3",
    title: "Thank",
    description:
      "Send updates to supporters and thank them publicly on Zoiko.",
  },
];

export default function CampaignJourney() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 sm:px-10 sm:py-16 lg:px-28 lg:py-20">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 lg:gap-20">

          {/* Section Heading */}
          <div className="w-full">
            <h2 className="m-0 text-3xl font-extrabold leading-10 tracking-[-0.5px] text-[#102A32]">
              Campaign journey
            </h2>
          </div>

          {/* Journey Cards */}
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-9">
            {campaigns.map((campaign) => (
              <div
                key={campaign.number}
                className="flex w-full items-start gap-6 overflow-hidden rounded-2xl border border-[#066879]/40 bg-white p-6"
              >
                {/* Number */}
                <div className="flex shrink-0 items-center justify-center rounded-lg bg-[#066879] px-6 py-3">
                  <span className="text-center text-base font-bold leading-6 text-white">
                    {campaign.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col gap-4 pb-4">
                  {/* Title */}
                  <div className="w-full border-b border-transparent pb-px">
                    <h3 className="m-0 text-base font-bold leading-6 text-[#066879]">
                      {campaign.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="w-full">
                    <p className="m-0 text-base font-normal leading-6 text-[#5E7076]">
                      {campaign.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}