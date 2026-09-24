"use client";

import React from "react";
import Image from "next/image";

const campaigns = [
  {
    image: "/fundraising-toolkit/image1.png",
    title: "Sanctuary expansion",
    description: "Help us build new habitats.",
    amount: "$8,500 of $12,000 (71%)",
    progress: 71,
  },
  {
    image: "/fundraising-toolkit/image2.png",
    title: "Emergency medical fund",
    description: "Support injured animals.",
    amount: "$3,200 of $5,000 (64%)",
    progress: 64,
  },
  {
    image: "/fundraising-toolkit/image3.png",
    title: "Education program launch",
    description: "Train the next generation.",
    amount: "$4,750 of $6,000 (79%)",
    progress: 79,
  },
];

export default function ExampleCampaigns() {
  return (
    <section className="w-full bg-[#F7F9FA]">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 sm:px-10 sm:py-16 lg:px-28 lg:py-20">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 lg:gap-20">

          {/* Section Heading */}
          <div className="w-full">
            <h2 className="m-0 text-3xl font-extrabold leading-10 tracking-[-0.5px] text-[#102A32]">
              Example campaigns
            </h2>
          </div>

          {/* Campaign Cards */}
          <div className="grid w-full grid-cols-1 justify-center gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <article
                key={campaign.title}
                className="w-full overflow-hidden rounded-[20px] border border-[#DADFE1] bg-white shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
              >
                {/* Campaign Image */}
                <div className="relative h-[200px] w-full overflow-hidden">
                  <Image
                    src={campaign.image}
                    alt={campaign.title}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 384px"
                    className="object-cover"
                  />
                </div>

                {/* Campaign Content */}
                <div className="flex w-full flex-col items-start gap-3.5 px-6 pb-10 pt-6">

                  {/* Title */}
                  <div className="w-full">
                    <h3 className="m-0 text-base font-bold leading-6 text-[#066879]">
                      {campaign.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="w-full">
                    <p className="m-0 text-xs font-normal leading-5 text-[#5E7076]">
                      {campaign.description}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="w-full py-px">
                    <p className="m-0 text-xs font-normal leading-5 text-[#5E7076]">
                      {campaign.amount}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full overflow-hidden rounded-xl bg-[#DADFE1]">
                    <div
                      className="h-full rounded-xl bg-[#066879]"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}