"use client";

import React from "react";
import { BadgeCheck, Shield, User, MessageSquareWarning } from "lucide-react";

interface FeatureItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

const TRUST_FEATURES: FeatureItem[] = [
  {
    id: "1",
    icon: BadgeCheck,
    title: "Verified Community",
    description:
      "Confirmed by our team against a verification record — never inferred from popularity.",
    linkText: "Read Standards",
    linkHref: "#",
  },
  {
    id: "2",
    icon: Shield,
    title: "Moderated",
    description:
      "Confirmed moderation coverage keeps discussions respectful and on-purpose.",
    linkText: "Moderation Policy",
    linkHref: "#",
  },
  {
    id: "3",
    icon: User,
    title: "Organization / Professional-led",
    description:
      "Only shown when the community's leadership is explicitly source-backed.",
    linkText: "Learn More",
    linkHref: "#",
  },
  {
    id: "4",
    icon: MessageSquareWarning,
    title: "Report a Concern",
    description:
      "Every community can be reported. Reports are reviewed against our Community Standards.",
    linkText: "Report a Concern",
    linkHref: "#",
  },
];

export default function TrustAndSafetySection() {
  return (
    <section className="w-full bg-[#F7F9FA] py-12 md:py-16 text-[#0B2E2E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center max-w-2xl mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2E2E] tracking-tight mb-2">
            Trust & Safety
          </h2>
          <p className="text-xs sm:text-sm text-[#5B7171] font-normal">
            What our badges mean, and how communities stay safe and accountable.
          </p>
        </div>

        {/* 4-Column Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full mb-12">
          {TRUST_FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex flex-col items-start text-left"
              >
                {/* Icon Circle */}
                <div className="w-9 h-9 rounded-lg bg-[#E6F0F2] flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-[#0B5C66]" />
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-[#0B2E2E] mb-1.5">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#5B7171] leading-relaxed font-normal mb-3 min-h-[48px]">
                  {item.description}
                </p>

                {/* Arrow Link */}
                <a
                  href={item.linkHref}
                  className="inline-flex items-center text-xs font-bold text-[#0B5C66] hover:underline"
                >
                  {item.linkText} <span className="ml-1">›</span>
                </a>
              </div>
            );
          })}
        </div>

        {/* Start a Community Callout Card */}
        <div className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 shadow-xs">
          <div className="max-w-3xl text-left">
            <h3 className="text-lg sm:text-xl font-bold text-[#0B2E2E] mb-2">
              Start a community of your own
            </h3>
            <p className="text-xs sm:text-sm text-[#5B7171] leading-relaxed">
              Creators are responsible for their community&apos;s purpose,
              rules, moderation, and animal-welfare compliance. High-risk
              categories — rescue coordination, professional advice, wildlife,
              fundraising, adoption — require additional review before public
              discovery.
            </p>
          </div>

          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-[#066879] hover:bg-[#084850] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
          >
            Create a Community
          </button>
        </div>

        {/* Join CTA Banner */}
        <div className="w-full bg-[#073B47] rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
          <div className="max-w-2xl text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              Join to follow, save, and take part
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Create a free account to join communities, save recommendations,
              and take part in discussions — public discovery stays open either
              way.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#E88924] hover:bg-[#D97706] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer text-center"
            >
              Join Free
            </button>
            <button
              type="button"
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-white/30 bg-transparent hover:bg-white/10 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
