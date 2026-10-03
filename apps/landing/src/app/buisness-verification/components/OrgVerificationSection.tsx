"use client";

import React from "react";
import Image from "next/image";
import {
  Building2,
  FileCheck,
  UserCheck,
  Globe,
  Heart,
  ShieldCheck,
} from "lucide-react";
import { C } from "./theme";

const ORG_STEPS = [
  {
    title: "Confirm the organization",
    desc: "Legal name, registration and type",
    icon: FileCheck,
  },
  {
    title: "Show your authority",
    desc: "That you can act for it",
    icon: UserCheck,
  },
  {
    title: "Link official presence",
    desc: "Website, domain or official records",
    icon: Globe,
  },
  {
    title: "Welfare checks",
    desc: "For rescues and adoption activity",
    icon: Heart,
  },
  {
    title: "Badge goes live",
    desc: "On your organization profile",
    icon: ShieldCheck,
  },
];

export default function OrgVerificationSection() {
  return (
    <section id="org-verification" className="w-full bg-[#F7F9FA] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="mb-10 text-left">
          <h2
            className="font-jakarta font-extrabold text-[26px] sm:text-[34px] lg:text-[38px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            Organization verification
          </h2>
          <p
            className="font-jakarta text-[15px] sm:text-[17px] font-normal"
            style={{ color: C.nevada }}
          >
            For rescues, nonprofits, institutions and companies.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 items-center">
          {/* Left Column: Image with Floating Badge */}
          <div className="relative h-[260px] sm:h-[400px] lg:h-[598px] w-full rounded-[24px] sm:rounded-[28px] overflow-hidden bg-gradient-to-br from-[#066879] to-[#E88924] shadow-md">
            <Image
              src="/buisness-verification/org_verification_dogs.png"
              alt="Rescues and dogs running"
              fill
              sizes="(max-width: 1024px) 100vw, 510px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Floating Pill on bottom left */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-white rounded-[14px] shadow-[0px_8px_24px_rgba(7,59,71,0.18)]">
              <div
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: C.mosque }}
              >
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
              </div>
              <span
                className="font-jakarta font-bold text-[12.5px] sm:text-[14px] leading-tight"
                style={{ color: C.tarawera }}
              >
                Verified organization
              </span>
            </div>
          </div>

          {/* Right Column: 5-step numbered list + claim banner + CTA */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:gap-3.5">
              {ORG_STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 bg-white rounded-2xl border transition-all hover:shadow-sm"
                    style={{ borderColor: C.geyser }}
                  >
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: C.mosque }}
                    >
                      <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={2.2} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-jakarta font-bold text-[11px] sm:text-[11.5px] uppercase tracking-wider text-gray-400"
                        >
                          Step {idx + 1}
                        </span>
                      </div>
                      <h4
                        className="font-jakarta font-bold text-[14.5px] sm:text-[16px] leading-tight truncate"
                        style={{ color: C.tarawera }}
                      >
                        {step.title}
                      </h4>
                      <p
                        className="font-jakarta text-[12.5px] sm:text-[13.5px] text-gray-500 mt-0.5 leading-snug"
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Claim Existing Page Callout */}
            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-4 p-4 sm:p-4.5 rounded-[20px] border"
              style={{
                backgroundColor: C.blackSqueeze,
                borderColor: C.geyser,
              }}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5 sm:mt-0"
                  style={{ backgroundColor: C.mosque }}
                >
                  <Building2 className="w-4.5 h-4.5" />
                </div>
                <p className="font-jakarta text-[13px] sm:text-[14px] leading-[1.45] text-gray-800">
                  <strong className="font-bold">Already on Zoiko Social?</strong>{" "}
                  Claim your existing organization page instead of starting a new one.
                </p>
              </div>

              <button
                type="button"
                className="w-full sm:w-auto px-4 py-2 bg-white border border-[#DCE5E8] rounded-xl font-jakarta font-semibold text-[13px] text-[#102A32] hover:bg-gray-50 whitespace-nowrap shadow-sm cursor-pointer shrink-0 text-center"
              >
                Claim a page
              </button>
            </div>

            {/* Primary Action Button */}
            <div>
              <button
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[12px] font-jakarta font-semibold text-[15px] text-white hover:brightness-105 transition-all shadow-sm cursor-pointer"
                style={{ backgroundColor: C.mosque }}
              >
                <ShieldCheck className="w-5 h-5" strokeWidth={2.2} />
                <span>Verify organization</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
