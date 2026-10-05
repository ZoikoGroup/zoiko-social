"use client";

import React from "react";
import Image from "next/image";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Building2,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { C } from "./theme";

export default function BadgeMeaningSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="mb-10 text-left">
          <h2
            className="font-jakarta font-extrabold text-[26px] sm:text-[34px] lg:text-[38px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            What the badge means
          </h2>
          <p
            className="font-jakarta text-[15px] sm:text-[17px] font-normal"
            style={{ color: C.nevada }}
          >
            A clear, bounded promise, shown the same way everywhere.
          </p>
        </div>

        {/* Two Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-10 sm:mb-12">
          {/* Card A: Verification Means */}
          <div
            className="p-5 sm:p-8 bg-white rounded-[24px] sm:rounded-[28px] border shadow-sm flex flex-col justify-between"
            style={{ borderColor: C.geyser }}
          >
            <div>
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: C.mosque }}
                >
                  <CheckCircle2 className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <h3
                  className="font-jakarta font-bold text-[18px] sm:text-[20px]"
                  style={{ color: C.tarawera }}
                >
                  Verification means
                </h3>
              </div>

              <ul className="flex flex-col gap-3 sm:gap-3.5">
                {[
                  "We completed the checks for that category at the time",
                  "The identity or organization matched the evidence",
                  "The badge shows which kind of verification it is",
                  "It's rechecked when evidence expires or details change",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 sm:gap-3 text-[13.5px] sm:text-[15px] leading-[1.5]">
                    <CheckCircle2 className="w-4.5 h-4.5 shrink-0 mt-0.5 text-emerald-600" />
                    <span style={{ color: C.firefly }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card B: Verification Doesn't Mean */}
          <div
            className="p-5 sm:p-8 bg-[#F7F9FA] rounded-[24px] sm:rounded-[28px] border border-dashed flex flex-col justify-between"
            style={{ borderColor: C.towerGray }}
          >
            <div>
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#DCE5E8] flex items-center justify-center text-rose-500 shrink-0">
                  <XCircle className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <h3
                  className="font-jakarta font-bold text-[18px] sm:text-[20px]"
                  style={{ color: C.tarawera }}
                >
                  Verification doesn&apos;t mean
                </h3>
              </div>

              <ul className="flex flex-col gap-3 sm:gap-3.5">
                {[
                  "A guarantee of conduct, service quality or outcomes",
                  "An endorsement, sponsorship or higher ranking",
                  "It came from Premium, advertising, sales or popularity",
                  "It's permanent. It can lapse, be suspended or revoked",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 sm:gap-3 text-[13.5px] sm:text-[15px] leading-[1.5]">
                    <XCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-rose-400" />
                    <span style={{ color: C.firefly }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 3 Profile Previews Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Profile 1: Dr. Lena Ruiz */}
          <div
            className="bg-white rounded-[20px] sm:rounded-[24px] border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            style={{ borderColor: C.geyser }}
          >
            <div>
              {/* Banner */}
              <div className="relative h-[110px] w-full overflow-hidden bg-gray-100">
                <Image
                  src="/buisness-verification/profile_preview_ruiz_banner-210fca.png"
                  alt="Dr. Lena Ruiz profile cover"
                  fill
                  sizes="380px"
                  className="object-cover"
                />
              </div>

              {/* Avatar + Content */}
              <div className="p-4 sm:p-5 pt-0 relative">
                <div className="relative -mt-7 mb-3 w-[52px] h-[52px] rounded-full border-2 border-white overflow-hidden shadow-md bg-white">
                  <Image
                    src="/buisness-verification/profile_preview_ruiz_avatar.png"
                    alt="Dr. Lena Ruiz avatar"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <h4
                  className="font-jakarta font-bold text-[16.5px] sm:text-[17px] mb-2"
                  style={{ color: C.tarawera }}
                >
                  Dr. Lena Ruiz
                </h4>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] sm:text-[12.5px] font-jakarta font-bold mb-3 border bg-[#EEF8F9] border-[#C5D8DE] text-[#073B47]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#066879]" strokeWidth={2.5} />
                  <span>Verified professional</span>
                </div>

                <p
                  className="font-jakarta text-[12.5px] sm:text-[13px] leading-[1.5] mb-4"
                  style={{ color: C.nevada }}
                >
                  Veterinary rehabilitation · verified Mar 2025, rechecked Sep 2026
                </p>
              </div>
            </div>

            <div className="px-4 sm:px-5 pb-4 sm:pb-5">
              <a
                href="#workspace"
                className="inline-flex items-center gap-1 font-jakarta font-semibold text-[13px] sm:text-[13.5px] text-[#066879] hover:underline"
              >
                <span>View verification details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Profile 2: Harbor Animal Rescue */}
          <div
            className="bg-white rounded-[20px] sm:rounded-[24px] border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            style={{ borderColor: C.geyser }}
          >
            <div>
              {/* Banner */}
              <div className="relative h-[110px] w-full overflow-hidden bg-gray-100">
                <Image
                  src="/buisness-verification/profile_preview_harbor_banner.png"
                  alt="Harbor Animal Rescue profile cover"
                  fill
                  sizes="380px"
                  className="object-cover"
                />
              </div>

              {/* Avatar + Content */}
              <div className="p-4 sm:p-5 pt-0 relative">
                <div className="relative -mt-7 mb-3 w-[52px] h-[52px] rounded-full border-2 border-white overflow-hidden shadow-md bg-white">
                  <Image
                    src="/buisness-verification/profile_preview_harbor_avatar-77b761.png"
                    alt="Harbor Animal Rescue avatar"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <h4
                  className="font-jakarta font-bold text-[16.5px] sm:text-[17px] mb-2"
                  style={{ color: C.tarawera }}
                >
                  Harbor Animal Rescue
                </h4>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] sm:text-[12.5px] font-jakarta font-bold mb-3 border bg-[#EEF8F9] border-[#C5D8DE] text-[#073B47]">
                  <Building2 className="w-3.5 h-3.5 text-[#066879]" strokeWidth={2.5} />
                  <span>Verified organization</span>
                </div>

                <p
                  className="font-jakarta text-[12.5px] sm:text-[13px] leading-[1.5] mb-4"
                  style={{ color: C.nevada }}
                >
                  501(c)(3) Rescue · entity &amp; welfare checks completed
                </p>
              </div>
            </div>

            <div className="px-4 sm:px-5 pb-4 sm:pb-5">
              <a
                href="#org-verification"
                className="inline-flex items-center gap-1 font-jakarta font-semibold text-[13px] sm:text-[13.5px] text-[#066879] hover:underline"
              >
                <span>View organization checks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Profile 3: Riverbend Veterinary Hospital */}
          <div
            className="bg-white rounded-[20px] sm:rounded-[24px] border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            style={{ borderColor: C.geyser }}
          >
            <div>
              {/* Banner */}
              <div className="relative h-[110px] w-full overflow-hidden bg-gray-100">
                <Image
                  src="/buisness-verification/profile_preview_riverbend_banner.png"
                  alt="Riverbend Veterinary Hospital cover"
                  fill
                  sizes="380px"
                  className="object-cover"
                />
              </div>

              {/* Avatar + Content */}
              <div className="p-4 sm:p-5 pt-0 relative">
                <div className="relative -mt-7 mb-3 w-[52px] h-[52px] rounded-full border-2 border-white overflow-hidden shadow-md bg-white">
                  <Image
                    src="/buisness-verification/profile_preview_riverbend_avatar-f8e7ac.png"
                    alt="Riverbend Veterinary Hospital avatar"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <h4
                  className="font-jakarta font-bold text-[16.5px] sm:text-[17px] mb-2"
                  style={{ color: C.tarawera }}
                >
                  Riverbend Veterinary Hospital
                </h4>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] sm:text-[12.5px] font-jakarta font-bold mb-3 border bg-[#EEF8F9] border-[#C5D8DE] text-[#073B47]">
                  <Stethoscope className="w-3.5 h-3.5 text-[#066879]" strokeWidth={2.5} />
                  <span>Verified organization</span>
                </div>

                <p
                  className="font-jakarta text-[12.5px] sm:text-[13px] leading-[1.5] mb-4"
                  style={{ color: C.nevada }}
                >
                  Clinical facility · licensed facility registry verified
                </p>
              </div>
            </div>

            <div className="px-4 sm:px-5 pb-4 sm:pb-5">
              <a
                href="#org-verification"
                className="inline-flex items-center gap-1 font-jakarta font-semibold text-[13px] sm:text-[13.5px] text-[#066879] hover:underline"
              >
                <span>View facility details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
