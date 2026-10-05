"use client";

import React from "react";
import Link from "next/link";
import {
  FileEdit,
  Globe,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  Info,
} from "lucide-react";

export default function AfterLaunchSection() {
  const cards = [
    {
      title: "Creative changed",
      description: "The new version is reviewed.",
      icon: FileEdit,
      linkText: "View policy",
      linkHref: "/advertising-standards",
    },
    {
      title: "Landing page changed",
      description: "May pause until rechecked.",
      icon: Globe,
      linkText: "View policy",
      linkHref: "/advertising-standards",
    },
    {
      title: "Verification lapsed",
      description: "Paused until renewed.",
      icon: ShieldAlert,
      linkText: "Get verified",
      linkHref: "/buisness-verification",
    },
    {
      title: "Safety concern",
      description: "Can pause right away to protect animals or people.",
      icon: AlertTriangle,
      linkText: "Campaign Review",
      linkHref: "#your-campaigns",
    },
  ];

  return (
    <section className="w-full bg-white py-14 sm:py-16 lg:py-20 border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="max-w-[720px] mb-10 sm:mb-12">
          <h2 className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] text-[#073B47] tracking-[-0.02em] mb-2.5">
            After launch
          </h2>
          <p className="font-jakarta text-[15px] sm:text-[16.5px] leading-relaxed text-[#5E7076]">
            Approved campaigns can be rechecked if something important changes.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="rounded-[20px] bg-white border border-[#DCE5E8] p-5 sm:p-5.5 flex flex-col justify-between hover:border-[#066879] hover:shadow-xs transition-all"
              >
                <div>
                  <div className="w-10 h-10 rounded-[12px] bg-[#EEF8F9] flex items-center justify-center mb-3.5 shrink-0">
                    <Icon className="w-5 h-5 text-[#066879]" />
                  </div>
                  <h3 className="font-jakarta font-bold text-[16px] text-[#073B47] mb-1.5 leading-snug">
                    {card.title}
                  </h3>
                  <p className="font-jakarta text-[13px] leading-relaxed text-[#5E7076] mb-4">
                    {card.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F0F4F6]">
                  <Link
                    href={card.linkHref}
                    className="inline-flex items-center gap-1 font-jakarta font-bold text-[12.5px] text-[#066879] hover:underline transition-all"
                  >
                    <span>{card.linkText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Policy Separation Notice */}
        <div className="rounded-[12px] bg-white border border-[#DCE5E8] border-l-[3px] border-l-[#066879] p-4 flex items-center gap-3 text-[13.5px] text-[#102A32] shadow-2xs">
          <Info className="w-4 h-4 text-[#066879] shrink-0" />
          <span>
            Billing or account pauses are labeled separately and are never
            described as policy issues.
          </span>
        </div>
      </div>
    </section>
  );
}
