"use client";

import React from "react";

const privacyControls = [
  {
    title: "Profile visibility",
    description: "Set who can view your profile, bio, and photos.",
  },
  {
    title: "Post privacy",
    description: "Choose audience for each post individually.",
  },
  {
    title: "Activity privacy",
    description: "Control who sees your likes, comments, and follows.",
  },
  {
    title: "Message privacy",
    description: "Choose who can send you direct messages.",
  },
];

export default function PrivacyControls() {
  return (
    <section className="w-full bg-[#F5F7F7]">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20 lg:px-28 lg:py-20">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-12">

          {/* Heading */}
          <div className="flex w-full flex-col items-start">
            <h2
              className="w-full font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10"
              style={{ color: "#102F38" }}
            >
              Privacy controls included
            </h2>
          </div>

          {/* Controls - 2 Columns */}
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            {privacyControls.map((control) => (
              <div
                key={control.title}
                className="flex w-full flex-col items-start gap-4 rounded-[20px] bg-white px-6 pb-10 pt-6 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
                style={{
                  border: "1px solid #D6E3E6",
                }}
              >
                {/* Title */}
                <div className="flex w-full flex-col items-start pb-px">
                  <h3
                    className="w-full font-['Plus_Jakarta_Sans'] text-base font-bold"
                    style={{ color: "#087A8B" }}
                  >
                    {control.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="flex w-full flex-col items-start">
                  <p
                    className="w-full font-['Plus_Jakarta_Sans'] text-base font-normal leading-6"
                    style={{ color: "#607780" }}
                  >
                    {control.description}
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