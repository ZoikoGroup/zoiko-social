"use client";

import React from "react";
import Image from "next/image";

const features = [
  {
    icon: "/fundraising-toolkit/icon1.png",
    title: "Real-time progress",
    description:
      "Watch donations, donor counts, and progress toward your goal update in real-time.",
  },
  {
    icon: "/fundraising-toolkit/icon2.png",
    title: "Donor insights",
    description:
      "See where your support comes from and learn which communities are most engaged.",
  },
  {
    icon: "/fundraising-toolkit/icon3.png",
    title: "Impact updates",
    description:
      "Share progress stories and thank supporters publicly on Zoiko.",
  },
  {
    icon: "/fundraising-toolkit/icon4.png",
    title: "Report generation",
    description:
      "Export donation reports and impact summaries for your records or board.",
  },
];

export default function TrackingFeatures() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 sm:px-10 sm:py-16 lg:px-28 lg:py-20">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 lg:gap-20">

          {/* Section Heading */}
          <div className="w-full">
            <h2 className="m-0 text-3xl font-extrabold leading-10 tracking-[-0.5px] text-[#102A32]">
              Tracking features
            </h2>
          </div>

          {/* Feature Cards */}
          <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-3.5">

            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex min-h-[172px] w-full flex-col items-start gap-4 rounded-[20px] border border-[#DADFE1] bg-white px-6 pb-10 pt-6 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
              >
                {/* Icon + Title */}
                <div className="flex w-full items-center gap-2 pb-px">
                  <div className="relative h-7 w-7 shrink-0">
                    <Image
                      src={feature.icon}
                      alt=""
                      fill
                      sizes="28px"
                      className="object-contain"
                    />
                  </div>

                  <h3 className="m-0 text-base font-bold leading-6 text-[#066879]">
                    {feature.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="w-full">
                  <p className="m-0 text-base font-normal leading-6 text-[#5E7076]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}