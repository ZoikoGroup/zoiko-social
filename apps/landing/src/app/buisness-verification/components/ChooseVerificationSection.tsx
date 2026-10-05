"use client";

import React from "react";
import Image from "next/image";
import {
  UserCheck,
  Building2,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { C } from "./theme";

export default function ChooseVerificationSection() {
  const scrollToChecker = () => {
    const el = document.getElementById("eligibility-checker");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToOrg = () => {
    const el = document.getElementById("org-verification");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToWorkspace = () => {
    const el = document.getElementById("workspace");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="choose-path" className="w-full bg-[#F7F9FA] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12 text-left">
          <h2
            className="font-jakarta font-extrabold text-[26px] sm:text-[34px] lg:text-[38px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            Choose your verification
          </h2>
          <p
            className="font-jakarta text-[15px] sm:text-[17px] font-normal"
            style={{ color: C.nevada }}
          >
            Two separate paths, each with its own checks.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_0.75fr] gap-5 sm:gap-6 items-stretch">
          {/* Card 1: Professional */}
          <div
            className="flex flex-col bg-white rounded-[24px] sm:rounded-[28px] border overflow-hidden hover:shadow-lg transition-all duration-300"
            style={{ borderColor: C.geyser }}
          >
            {/* Banner Image */}
            <div className="relative h-[160px] sm:h-[195px] w-full overflow-hidden bg-gray-100">
              <Image
                src="/buisness-verification/path_professional_banner-196614.png"
                alt="Professional verification"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>

            {/* Content Area */}
            <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between">
              <div>
                {/* Title with icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: C.mosque }}
                  >
                    <UserCheck className="w-5 h-5" strokeWidth={2.2} />
                  </div>
                  <h3
                    className="font-jakarta font-bold text-[20px] sm:text-[24px]"
                    style={{ color: C.tarawera }}
                  >
                    Professional
                  </h3>
                </div>

                {/* Features List */}
                <ul className="flex flex-col gap-2.5 sm:gap-3 mb-7 sm:mb-8">
                  <li className="flex items-start gap-2.5 text-[13.5px] sm:text-[14.5px] leading-[1.48]">
                    <CheckCircle2
                      className="w-4.5 h-4.5 shrink-0 mt-0.5 text-emerald-600"
                      strokeWidth={2.2}
                    />
                    <span style={{ color: C.firefly }}>
                      Vets, trainers, groomers, behaviorists and caregivers
                    </span>
                  </li>

                  <li className="flex items-start gap-2.5 text-[13.5px] sm:text-[14.5px] leading-[1.48]">
                    <CheckCircle2
                      className="w-4.5 h-4.5 shrink-0 mt-0.5 text-emerald-600"
                      strokeWidth={2.2}
                    />
                    <span style={{ color: C.firefly }}>
                      Identity, category and credentials checked
                    </span>
                  </li>

                  <li className="flex items-start gap-2.5 text-[13.5px] sm:text-[14.5px] leading-[1.48]">
                    <CheckCircle2
                      className="w-4.5 h-4.5 shrink-0 mt-0.5 text-emerald-600"
                      strokeWidth={2.2}
                    />
                    <span style={{ color: C.firefly }}>
                      Badge: <strong className="font-semibold">Verified professional</strong>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={scrollToWorkspace}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[12px] font-jakarta font-semibold text-[14.5px] sm:text-[15px] text-white hover:brightness-105 transition-all cursor-pointer shadow-sm"
                style={{ backgroundColor: C.mosque }}
              >
                <ShieldCheck className="w-4.5 h-4.5" strokeWidth={2.2} />
                <span>Verify as professional</span>
              </button>
            </div>
          </div>

          {/* Card 2: Organization */}
          <div
            className="flex flex-col bg-white rounded-[24px] sm:rounded-[28px] border overflow-hidden hover:shadow-lg transition-all duration-300"
            style={{ borderColor: C.geyser }}
          >
            {/* Banner Image */}
            <div className="relative h-[160px] sm:h-[195px] w-full overflow-hidden bg-gray-100">
              <Image
                src="/buisness-verification/path_organization_banner-63551b.png"
                alt="Organization verification"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>

            {/* Content Area */}
            <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between">
              <div>
                {/* Title with icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: C.mosque }}
                  >
                    <Building2 className="w-5 h-5" strokeWidth={2.2} />
                  </div>
                  <h3
                    className="font-jakarta font-bold text-[20px] sm:text-[24px]"
                    style={{ color: C.tarawera }}
                  >
                    Organization
                  </h3>
                </div>

                {/* Features List */}
                <ul className="flex flex-col gap-2.5 sm:gap-3 mb-7 sm:mb-8">
                  <li className="flex items-start gap-2.5 text-[13.5px] sm:text-[14.5px] leading-[1.48]">
                    <CheckCircle2
                      className="w-4.5 h-4.5 shrink-0 mt-0.5 text-emerald-600"
                      strokeWidth={2.2}
                    />
                    <span style={{ color: C.firefly }}>
                      Rescues, shelters, nonprofits, institutions and companies
                    </span>
                  </li>

                  <li className="flex items-start gap-2.5 text-[13.5px] sm:text-[14.5px] leading-[1.48]">
                    <CheckCircle2
                      className="w-4.5 h-4.5 shrink-0 mt-0.5 text-emerald-600"
                      strokeWidth={2.2}
                    />
                    <span style={{ color: C.firefly }}>
                      Entity, authority and public presence checked
                    </span>
                  </li>

                  <li className="flex items-start gap-2.5 text-[13.5px] sm:text-[14.5px] leading-[1.48]">
                    <CheckCircle2
                      className="w-4.5 h-4.5 shrink-0 mt-0.5 text-emerald-600"
                      strokeWidth={2.2}
                    />
                    <span style={{ color: C.firefly }}>
                      Badge: <strong className="font-semibold">Verified organization</strong>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={scrollToOrg}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[12px] font-jakarta font-semibold text-[14.5px] sm:text-[15px] text-white hover:brightness-105 transition-all cursor-pointer shadow-sm"
                style={{ backgroundColor: C.mosque }}
              >
                <ShieldCheck className="w-4.5 h-4.5" strokeWidth={2.2} />
                <span>Verify organization</span>
              </button>
            </div>
          </div>

          {/* Card 3: Not sure which? */}
          <div
            className="flex flex-col justify-between p-6 sm:p-8 rounded-[24px] sm:rounded-[28px] text-white md:col-span-2 lg:col-span-1"
            style={{ backgroundColor: C.tarawera }}
          >
            <div>
              {/* Question Icon Box */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/12 flex items-center justify-center text-white mb-5 sm:mb-6">
                <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.2} />
              </div>

              <h3 className="font-jakarta font-bold text-[20px] sm:text-[24px] mb-2.5 sm:mb-3 leading-snug">
                Not sure which?
              </h3>

              <p className="font-jakarta text-[14px] sm:text-[15px] leading-[1.6] text-[#C5D8DE] mb-6 sm:mb-8">
                Answer a few questions and we&apos;ll point you to the right path,
                or another route if verification isn&apos;t needed.
              </p>
            </div>

            <button
              type="button"
              onClick={scrollToChecker}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[12px] font-jakarta font-semibold text-[14.5px] sm:text-[15px] text-white border border-white/45 hover:bg-white/10 transition-all cursor-pointer"
            >
              <span>Help me choose</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
