"use client";

import React from "react";
import Image from "next/image";

const actions = [
  {
    title: "Community enforcement",
    description:
      "Apply community-specific rules, warnings, and moderation policies. Set role-based permissions for your moderation team.",
    icon: "/advanced-moderation/icon7.png",
  },
  {
    title: "Safety reports",
    description:
      "Track safety metrics, generate moderation reports, and export enforcement data for your records.",
    icon: "/advanced-moderation/icon4.png",
  },
];

export default function WhatYouCanDo() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 py-12 sm:px-10 sm:py-16 lg:px-28 lg:py-20">
        <div className="flex w-full max-w-[1280px] flex-col gap-12">
          {/* Heading */}
          <div className="flex w-full flex-col items-start">
            <h2 className="m-0 text-3xl font-extrabold leading-10 tracking-[-0.5px] text-[#102A32]">
              What you can do
            </h2>
          </div>

          {/* Cards */}
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            {actions.map((action) => (
              <div
                key={action.title}
                className="flex w-full flex-col items-start gap-4 rounded-[20px] border border-[#D5E1E4] bg-white px-6 pb-10 pt-6 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
              >
                {/* Card Header */}
                <div className="flex w-full items-start gap-2 pb-px">
                  <Image
                    src={action.icon}
                    alt=""
                    width={24}
                    height={24}
                    className="h-6 w-6 shrink-0 object-contain"
                  />

                  <h3 className="m-0 text-base font-bold leading-6 text-[#066879]">
                    {action.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="flex w-full flex-col items-start">
                  <p className="m-0 w-full text-base font-normal leading-6 text-[#5E7076]">
                    {action.description}
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