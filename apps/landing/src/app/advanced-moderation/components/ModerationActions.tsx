"use client";

import React from "react";
import Image from "next/image";

const actions = [
  {
    title: "Flag & review",
    description:
      "Collect user reports and manage them in a unified queue.",
    icon: "/advanced-moderation/icon1.png",
  },
  {
    title: "Remove content",
    description:
      "Delete posts, comments, or media that violate community guidelines.",
    icon: "/advanced-moderation/icon2.png",
  },
  {
    title: "Manage members",
    description:
      "Mute, suspend, or remove members from your community.",
    icon: "/advanced-moderation/icon3.png",
  },
  {
    title: "Audit logs",
    description:
      "Track all moderation actions with timestamps and moderator names.",
    icon: "/advanced-moderation/icon4.png",
  },
  {
    title: "Bulk actions",
    description:
      "Apply moderation decisions to multiple items at once.",
    icon: "/advanced-moderation/icon5.png",
  },
  {
    title: "Guidelines",
    description:
      "Set and publish your own community rules and enforcement policies.",
    icon: "/advanced-moderation/icon6.png",
  },
];

export default function ModerationActions() {
  return (
    <section className="w-full bg-[#F7F9FA]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 py-12 sm:px-10 sm:py-16 lg:px-28 lg:py-20">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-12">
          {/* Heading */}
          <div className="w-full">
            <h2 className="m-0 text-3xl font-extrabold leading-10 text-[#102A32]">
              Moderation actions
            </h2>
          </div>

          {/* Action Cards */}
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {actions.map((action) => (
              <div
                key={action.title}
                className="flex min-h-[154px] w-full flex-col items-start gap-4 overflow-hidden rounded-[20px] border border-[#DCE5E7] bg-white px-6 pb-10 pt-6 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
              >
                {/* Icon + Title */}
                <div className="flex w-full items-start gap-2 pb-px">
                  <div className="relative h-6 w-6 shrink-0">
                    <Image
                      src={action.icon}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="24px"
                    />
                  </div>

                  <h3 className="m-0 text-base font-bold leading-6 text-[#066879]">
                    {action.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="w-full">
                  <p className="m-0 text-base font-normal leading-6 text-[#5E7076]">
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