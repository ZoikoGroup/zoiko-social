"use client";

import React from "react";
import Image from "next/image";
import { Building2, MapPin } from "lucide-react";
import { PRACTICES } from "./directoryData";
import { C } from "./theme";

export default function PracticesTeamsSection() {
  return (
    <section id="practices" className="w-full bg-white py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        <div className="max-w-[1180px] mx-auto">
          {/* Section Header - Left Aligned to match design */}
          <div className="mb-6 sm:mb-8 lg:mb-10 text-left">
            <h2
              className="font-jakarta font-extrabold text-[28px] sm:text-[36px] lg:text-[42px] leading-[1.15] tracking-[-0.015em] mb-2.5"
              style={{ color: C.tarawera }}
            >
              Practices and teams
            </h2>
            <p
              className="font-jakarta font-normal text-[15px] sm:text-[17.5px] leading-[1.6]"
              style={{ color: C.nevada }}
            >
              See which verified professionals work together.
            </p>
          </div>

          {/* 2 Practice Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            {PRACTICES.map((practice) => (
              <article
                key={practice.id}
                className="bg-white border rounded-[28px] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                style={{ borderColor: "#E2ECEB" }}
              >
                <div>
                  {/* Cover Image */}
                  <div className="relative w-full h-[200px] sm:h-[220px] overflow-hidden bg-gray-100">
                    <Image
                      src={practice.cover}
                      alt={practice.name}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Content Container */}
                  <div className="p-6 sm:p-7">
                    {/* Title & Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h3
                        className="font-jakarta font-bold text-[19px] sm:text-[20px] leading-tight"
                        style={{ color: C.tarawera }}
                      >
                        {practice.name}
                      </h3>
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold bg-[#EAF5F4] text-[#064E4E] border border-[#D5E3E4]">
                        <Building2 className="w-3.5 h-3.5 text-[#064E4E] stroke-[2]" />
                        Verified practice
                      </span>
                    </div>

                    {/* Location */}
                    <div
                      className="flex items-center gap-1.5 text-[13px] mb-3"
                      style={{ color: C.nevada }}
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#8A9BA1] shrink-0" />
                      <span>{practice.location}</span>
                    </div>

                    {/* Description */}
                    <p
                      className="font-jakarta text-[14px] sm:text-[14.5px] leading-relaxed mb-5"
                      style={{ color: C.nevada }}
                    >
                      {practice.description}
                    </p>

                    {/* Team Members & Status (Without dividing border) */}
                    <div className="flex items-center gap-3 mb-5">
                      {/* Overlapping Avatars */}
                      <div className="flex items-center -space-x-2.5 shrink-0">
                        {practice.teamAvatars.map((av, idx) => (
                          <div
                            key={idx}
                            className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-xs"
                          >
                            <Image
                              src={av}
                              alt="Team member"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>

                      <span
                        className="font-jakarta text-[12.5px] font-medium"
                        style={{ color: C.nevada }}
                      >
                        {practice.verifiedCountText}
                      </span>
                    </div>

                    {/* Action Button: Bordered button with building icon */}
                    <div>
                      <button
                        type="button"
                        className="font-jakarta font-semibold text-[13.5px] text-[#0A3E3F] flex items-center gap-2 px-3.5 py-2 rounded-[10px] border border-[#D9E5E6] bg-white hover:bg-gray-50 transition-colors shadow-xs"
                      >
                        <Building2 className="w-4 h-4 text-[#064E4E] stroke-[2]" />
                        <span>View practice</span>
                      </button>
                    </div>
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
