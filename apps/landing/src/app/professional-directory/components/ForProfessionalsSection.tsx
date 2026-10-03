"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, Award, Building2 } from "lucide-react";
import { C } from "./theme";

export default function ForProfessionalsSection() {
  return (
    <section id="for-professionals" className="w-full bg-white py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        <div className="max-w-[1180px] mx-auto">
          {/* Section Header - Left Aligned to match design */}
          <div className="mb-6 sm:mb-8 lg:mb-10 text-left">
            <h2
              className="font-jakarta font-extrabold text-[28px] sm:text-[36px] lg:text-[42px] leading-[1.15] tracking-[-0.015em] mb-2.5"
              style={{ color: C.tarawera }}
            >
              For animal–care professionals
            </h2>
            <p
              className="font-jakarta font-normal text-[15px] sm:text-[17.5px] leading-[1.6]"
              style={{ color: C.nevada }}
            >
              Two separate paths. Verification never comes with a listing purchase.
            </p>
          </div>

          {/* 2-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            {/* Path 1: Get Verified */}
            <article
              className="bg-white border rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              style={{ borderColor: "#E2ECEB" }}
            >
              <div>
                {/* Cover Image with Floating Icon */}
                <div className="relative w-full h-[190px] sm:h-[220px] lg:h-[240px] overflow-hidden bg-gray-100">
                  <Image
                    src="/professional-directory/for-pro-get-verified.png"
                    alt="Get verified as an animal care professional"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {/* Floating White Squircle with Award Icon at Bottom Left */}
                  <div className="absolute left-4 bottom-3 sm:left-6 sm:bottom-4 w-10 h-10 sm:w-11 sm:h-11 rounded-[12px] sm:rounded-[14px] bg-white flex items-center justify-center text-[#064E4E] shadow-sm z-10">
                    <Award className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-7 lg:p-8">
                  <h3
                    className="font-jakarta font-bold text-[20px] sm:text-[22px] leading-tight mb-2"
                    style={{ color: C.tarawera }}
                  >
                    Get Verified
                  </h3>

                  <p
                    className="font-jakarta text-[14.5px] leading-relaxed mb-6"
                    style={{ color: C.nevada }}
                  >
                    Confirm your identity and professional status to earn the badge.
                  </p>

                  {/* Features List (No horizontal line) */}
                  <ul className="space-y-3.5 mb-8">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#0A7B7E] stroke-[2] shrink-0 mt-0.5" />
                      <span
                        className="font-jakarta text-[14px] sm:text-[14.5px] leading-normal"
                        style={{ color: C.firefly }}
                      >
                        Free to apply
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#0A7B7E] stroke-[2] shrink-0 mt-0.5" />
                      <span
                        className="font-jakarta text-[14px] sm:text-[14.5px] leading-normal"
                        style={{ color: C.firefly }}
                      >
                        Most reviews finish in 3–5 business days
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#0A7B7E] stroke-[2] shrink-0 mt-0.5" />
                      <span
                        className="font-jakarta text-[14px] sm:text-[14.5px] leading-normal"
                        style={{ color: C.firefly }}
                      >
                        Rechecked every 12 months
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Button with Icon on Left */}
              <div className="px-6 lg:px-8 pb-7 pt-0">
                <button
                  type="button"
                  className="w-full font-jakarta font-semibold text-[14px] text-white py-3.5 px-6 rounded-[12px] bg-[#064E4E] hover:bg-[#085C5D] flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Award className="w-4 h-4 stroke-[2.2]" />
                  <span>Start verification</span>
                </button>
              </div>
            </article>

            {/* Path 2: List Your Practice */}
            <article
              className="bg-white border rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              style={{ borderColor: "#E2ECEB" }}
            >
              <div>
                {/* Cover Image with Floating Icon */}
                <div className="relative w-full h-[190px] sm:h-[220px] lg:h-[240px] overflow-hidden bg-gray-100">
                  <Image
                    src="/professional-directory/for-pro-list-practice.png"
                    alt="List your veterinary or training practice"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {/* Floating White Squircle with Building Icon at Bottom Left */}
                  <div className="absolute left-4 bottom-3 sm:left-6 sm:bottom-4 w-10 h-10 sm:w-11 sm:h-11 rounded-[12px] sm:rounded-[14px] bg-white flex items-center justify-center text-[#064E4E] shadow-sm z-10">
                    <Building2 className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-7 lg:p-8">
                  <h3
                    className="font-jakarta font-bold text-[20px] sm:text-[22px] leading-tight mb-2"
                    style={{ color: C.tarawera }}
                  >
                    List Your Practice
                  </h3>

                  <p
                    className="font-jakarta text-[14.5px] leading-relaxed mb-6"
                    style={{ color: C.nevada }}
                  >
                    Create a practice page and add your verified team.
                  </p>

                  {/* Features List (No horizontal line) */}
                  <ul className="space-y-3.5 mb-8">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#0A7B7E] stroke-[2] shrink-0 mt-0.5" />
                      <span
                        className="font-jakarta text-[14px] sm:text-[14.5px] leading-normal"
                        style={{ color: C.firefly }}
                      >
                        Practice name, location and website
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#0A7B7E] stroke-[2] shrink-0 mt-0.5" />
                      <span
                        className="font-jakarta text-[14px] sm:text-[14.5px] leading-normal"
                        style={{ color: C.firefly }}
                      >
                        Link verified team members
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#0A7B7E] stroke-[2] shrink-0 mt-0.5" />
                      <span
                        className="font-jakarta text-[14px] sm:text-[14.5px] leading-normal"
                        style={{ color: C.firefly }}
                      >
                        Manage who can edit
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Button with Icon on Left */}
              <div className="px-6 lg:px-8 pb-7 pt-0">
                <button
                  type="button"
                  className="w-full font-jakarta font-semibold text-[14px] text-[#0A3E3F] py-3.5 px-6 rounded-[12px] bg-white border border-[#D5E3E4] hover:bg-gray-50 flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Building2 className="w-4 h-4 stroke-[2]" />
                  <span>List your practice</span>
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
