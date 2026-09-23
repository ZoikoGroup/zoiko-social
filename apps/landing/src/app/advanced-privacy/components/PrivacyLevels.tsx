"use client";

import React from "react";
import Image from "next/image";

const privacyLevels = [
  {
    title: "Public",
    description: (
      <>
        Everyone sees your posts and
        <br />
        profile.
      </>
    ),
    icon: "/advanced-privacy/icon1.png",
  },
  {
    title: "Community",
    description: (
      <>
        Your community members see your
        <br />
        posts.
      </>
    ),
    icon: "/advanced-privacy/icon2.png",
  },
  {
    title: "Friends",
    description: <>Only your followers see your posts.</>,
    icon: "/advanced-privacy/icon3.png",
  },
  {
    title: "Private",
    description: (
      <>
        Only you see your posts and
        <br />
        profile.
      </>
    ),
    icon: "/advanced-privacy/icon4.png",
  },
];

export default function PrivacyLevels() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-28 lg:py-20">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-12">
          {/* Heading */}
          <div className="flex w-full flex-col items-start">
            <h2
              className="w-full font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10"
              style={{ color: "#102F38" }}
            >
              Privacy levels
            </h2>
          </div>

          {/* Cards */}
          <div className="grid w-full grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {privacyLevels.map((level) => (
              <div
                key={level.title}
                className="flex min-h-[250px] w-full flex-col items-start gap-4 rounded-[20px] bg-white px-6 pb-10 pt-6 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
                style={{
                  border: "1px solid #D6E3E6",
                }}
              >
                {/* Icon */}
                <div className="flex w-full flex-col items-center pb-px">
                  <Image
                    src={level.icon}
                    alt={`${level.title} privacy`}
                    width={36}
                    height={36}
                    className="size-9 object-contain"
                  />
                </div>

                {/* Title */}
                <div className="flex w-full flex-col items-center pb-px">
                  <div
                    className="text-center font-['Plus_Jakarta_Sans'] text-base font-bold"
                    style={{ color: "#087A8B" }}
                  >
                    {level.title}
                  </div>
                </div>

                {/* Description */}
                <div className="flex w-full flex-col items-center">
                  <div
                    className="text-center font-['Plus_Jakarta_Sans'] text-base font-normal leading-6"
                    style={{ color: "#607780" }}
                  >
                    {level.description}
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