"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { C } from "./theme";

export default function CanIAdvertiseSection() {
  const [q1, setQ1] = useState<string>("");
  const [q2, setQ2] = useState<string>("");
  const [q3, setQ3] = useState<string>("");
  const [q4, setQ4] = useState<string>("");

  const allAnswered = Boolean(q1 && q2 && q3 && q4);

  // Compute recommendation
  const getRecommendation = () => {
    if (!allAnswered) {
      return {
        title: "Your next step appears here",
        description: "Answer the questions on the left.",
        actionText: "",
        actionHref: "",
      };
    }

    if (q3.startsWith("Yes")) {
      return {
        title: "You are ready to advertise!",
        description:
          "Your verified account qualifies to create campaigns in Ads Manager immediately. Once created, your ad goes to welfare review.",
        actionText: "Start advertising in Ads Manager",
        actionHref: "#start-advertising",
      };
    }

    if (q3.includes("pending")) {
      return {
        title: "Complete verification review",
        description:
          "Your verification application is currently under review. You can draft your campaign now, and it will be ready to launch as soon as verification completes.",
        actionText: "Check verification status",
        actionHref: "/buisness-verification",
      };
    }

    return {
      title: "Verify your identity first",
      description:
        "Zoiko Social requires all advertisers to be verified professionals or organizations to ensure trust and animal safety. Verification is free.",
      actionText: "Start free verification",
      actionHref: "/buisness-verification",
    };
  };

  const rec = getRecommendation();

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[105px]">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}
        <div className="mb-8 sm:mb-10 max-w-[800px]">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[32px] lg:text-[36px] leading-[1.15] tracking-[-0.01em] mb-2"
            style={{ color: C.tarawera }}
          >
            Can I advertise?
          </h2>
          <p
            className="font-jakarta text-[16px] sm:text-[17px] leading-[1.6]"
            style={{ color: C.nevada }}
          >
            Four questions to see your next step.
          </p>
        </div>

        {/* 2-Column Assessment Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.20fr_0.80fr] gap-6 items-start">
          {/* Left Form Card (2x2 Grid) */}
          <div className="rounded-[24px] sm:rounded-[28px] bg-white border border-[#DCE5E8] p-4.5 sm:p-6 md:p-8 shadow-[0px_1px_2px_rgba(7,59,71,0.06)] flex flex-col gap-[18px]">
            {/* Row 1: Questions 1 & 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Question 1 */}
              <div className="flex flex-col gap-1.5">
                <label className="font-jakarta font-semibold text-[13px] text-[#5E7076]">
                  What will you advertise?
                </label>
                <div className="relative">
                  <select
                    value={q1}
                    onChange={(e) => setQ1(e.target.value)}
                    className="w-full h-[44px] px-3.5 pr-10 rounded-[12px] bg-white border border-[#DCE5E8] font-jakarta text-[14px] text-[#102A32] appearance-none focus:outline-none focus:border-[#066879] focus:ring-1 focus:ring-[#066879] transition-all cursor-pointer"
                  >
                    <option value="">Choose one</option>
                    <option value="supplies">Pet food, treats &amp; supplies</option>
                    <option value="vet">Veterinary or clinical care services</option>
                    <option value="services">Training, grooming or care services</option>
                    <option value="adoption">Rescue awareness or adoption event</option>
                    <option value="education">Animal welfare education or cause</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5E7076] pointer-events-none" />
                </div>
              </div>

              {/* Question 2 */}
              <div className="flex flex-col gap-1.5">
                <label className="font-jakarta font-semibold text-[13px] text-[#5E7076]">
                  Who&apos;s the advertiser?
                </label>
                <div className="relative">
                  <select
                    value={q2}
                    onChange={(e) => setQ2(e.target.value)}
                    className="w-full h-[44px] px-3.5 pr-10 rounded-[12px] bg-white border border-[#DCE5E8] font-jakarta text-[14px] text-[#102A32] appearance-none focus:outline-none focus:border-[#066879] focus:ring-1 focus:ring-[#066879] transition-all cursor-pointer"
                  >
                    <option value="">Choose one</option>
                    <option value="pro">Individual certified professional</option>
                    <option value="org">Registered business, clinic, or shelter</option>
                    <option value="agency">Agency representing a client</option>
                    <option value="nonprofit">Charity or welfare nonprofit</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5E7076] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Row 2: Questions 3 & 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Question 3 */}
              <div className="flex flex-col gap-1.5">
                <label className="font-jakarta font-semibold text-[13px] text-[#5E7076]">
                  Verified on Zoiko Social?
                </label>
                <div className="relative">
                  <select
                    value={q3}
                    onChange={(e) => setQ3(e.target.value)}
                    className="w-full h-[44px] px-3.5 pr-10 rounded-[12px] bg-white border border-[#DCE5E8] font-jakarta text-[14px] text-[#102A32] appearance-none focus:outline-none focus:border-[#066879] focus:ring-1 focus:ring-[#066879] transition-all cursor-pointer"
                  >
                    <option value="">Choose one</option>
                    <option value="Yes - Professional">Yes - Professional badge</option>
                    <option value="Yes - Organization">Yes - Organization badge</option>
                    <option value="pending">Application submitted / review pending</option>
                    <option value="no">Not yet verified</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5E7076] pointer-events-none" />
                </div>
              </div>

              {/* Question 4 */}
              <div className="flex flex-col gap-1.5">
                <label className="font-jakarta font-semibold text-[13px] text-[#5E7076]">
                  Where will it run?
                </label>
                <div className="relative">
                  <select
                    value={q4}
                    onChange={(e) => setQ4(e.target.value)}
                    className="w-full h-[44px] px-3.5 pr-10 rounded-[12px] bg-white border border-[#DCE5E8] font-jakarta text-[14px] text-[#102A32] appearance-none focus:outline-none focus:border-[#066879] focus:ring-1 focus:ring-[#066879] transition-all cursor-pointer"
                  >
                    <option value="">Choose one</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="EU">European Union</option>
                    <option value="multi">Multiple countries / Worldwide</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5E7076] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Aside) */}
          <div className="flex flex-col gap-3.5">
            {/* Top Box: Recommendation / Placeholder */}
            <div className="rounded-[28px] bg-white border border-[#DCE5E8] p-7 flex flex-col justify-center min-h-[120px]">
              <h3 className="font-jakarta font-bold text-[16px] text-[#073B47] mb-1.5">
                {rec.title}
              </h3>
              <p className="font-jakarta font-medium text-[13px] leading-[1.45] text-[#5E7076]">
                {rec.description}
              </p>

              {allAnswered && rec.actionText && (
                <div className="pt-3">
                  <Link
                    href={rec.actionHref}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[10px] bg-[#066879] text-white font-jakarta font-semibold text-[13px] hover:bg-[#055765] transition-all"
                  >
                    <span>{rec.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Middle Box: Review Disclaimer Notice */}
            <div className="rounded-[12px] bg-[#F7F9FA] border border-dashed border-[#A9B8BD] py-3 px-3.5 flex items-start gap-2.5 text-[13px] leading-[1.45] text-[#5E7076]">
              <div className="w-4 h-4 rounded-full border border-[#066879] text-[#066879] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                i
              </div>
              <span className="font-jakarta text-[13px] text-[#5E7076]">
                A quick guide, not an approval. Every campaign is reviewed before
                it runs.
              </span>
            </div>

            {/* Bottom Box: Photo Card */}
            <div className="relative w-full h-[200px] rounded-[28px] overflow-hidden">
              <Image
                src="/business-advertise/can-i-advertise.png"
                alt="Can I advertise guide"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
