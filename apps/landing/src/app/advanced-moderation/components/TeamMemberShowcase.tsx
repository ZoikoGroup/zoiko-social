"use client";

import React from "react";
import Image from "next/image";

const teamMembers = [
  {
    name: "Alex Chen",
    role: "Community Lead",
    permission: "All moderation powers",
    image: "/advanced-moderation/image1.png",
  },
  {
    name: "Morgan Davis",
    role: "Moderator",
    permission: "Review & flag management",
    image: "/advanced-moderation/image2.png",
  },
  {
    name: "Jordan Lee",
    role: "Assistant Mod",
    permission: "Report triage only",
    image: "/advanced-moderation/image3.png",
  },
];

export default function TeamMemberShowcase() {
  return (
    <section className="w-full bg-[#F7F9FA]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 py-12 sm:px-10 sm:py-16 lg:px-28 lg:py-20">
        <div className="flex w-full max-w-[1280px] flex-col gap-12">
          {/* Heading */}
          <div className="flex w-full flex-col items-start">
            <h2 className="m-0 text-3xl font-extrabold leading-10 tracking-[-0.5px] text-[#102A32]">
              Team member showcase
            </h2>
          </div>

          {/* Team Members */}
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="flex w-full items-start gap-6 rounded-[20px] border border-[#D5E1E4] bg-white px-8 py-6 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)] sm:px-10 lg:px-12"
              >
                {/* Profile Image */}
                <Image
                  src={member.image}
                  alt={member.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 shrink-0 rounded-full object-cover"
                />

                {/* Member Details */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="w-full py-px">
                    <h3 className="m-0 text-base font-bold leading-7 text-[#066879]">
                      {member.name}
                    </h3>
                  </div>

                  <div className="w-full pb-px">
                    <p className="m-0 text-xs font-normal leading-5 text-[#5E7076]">
                      {member.role}
                    </p>
                  </div>

                  <div className="w-full">
                    <p className="m-0 text-xs font-normal leading-5 text-[#5E7076]">
                      {member.permission}
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