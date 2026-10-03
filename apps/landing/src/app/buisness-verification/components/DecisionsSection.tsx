"use client";

import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  EyeOff,
  Clock,
  ArrowRight,
} from "lucide-react";
import { C } from "./theme";

interface DecisionCard {
  status: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder?: string;
  badgeIcon: React.ElementType;
  description: string;
  linkText: string;
  linkHref: string;
}

const DECISIONS: DecisionCard[] = [
  {
    status: "Verified",
    badgeBg: "#059669",
    badgeText: "#FFFFFF",
    badgeIcon: CheckCircle2,
    description: "Your badge goes live. Evidence stays private.",
    linkText: "Manage profile",
    linkHref: "#workspace",
  },
  {
    status: "Action needed",
    badgeBg: "#FEF3C7",
    badgeText: "#92400E",
    badgeBorder: "#F59E0B",
    badgeIcon: AlertCircle,
    description: "Outstanding tasks are listed in your workspace.",
    linkText: "Continue application",
    linkHref: "#workspace",
  },
  {
    status: "Unable to complete",
    badgeBg: "#FFF5E8",
    badgeText: "#7A430B",
    badgeBorder: "#E88924",
    badgeIcon: HelpCircle,
    description: "What couldn't be confirmed, and what may resolve it.",
    linkText: "See what's needed",
    linkHref: "#workspace",
  },
  {
    status: "Not verified",
    badgeBg: "#DC2626",
    badgeText: "#FFFFFF",
    badgeIcon: XCircle,
    description: "A clear reason tied to the requirement.",
    linkText: "Ask for a review",
    linkHref: "#faq",
  },
  {
    status: "Suspended",
    badgeBg: "#FFFBEB",
    badgeText: "#B45309",
    badgeBorder: "#FBBF24",
    badgeIcon: EyeOff,
    description: "Badge hidden while an issue is resolved.",
    linkText: "Resolve status",
    linkHref: "#workspace",
  },
  {
    status: "Expired",
    badgeBg: "#F3F4F6",
    badgeText: "#4B5563",
    badgeBorder: "#D1D5DB",
    badgeIcon: Clock,
    description: "Evidence expired or a recheck wasn't completed.",
    linkText: "Update verification",
    linkHref: "#workspace",
  },
];

export default function DecisionsSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="mb-10 text-left">
          <h2
            className="font-jakarta font-extrabold text-[26px] sm:text-[34px] lg:text-[38px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            Decisions
          </h2>
          <p
            className="font-jakarta text-[15px] sm:text-[17px] font-normal"
            style={{ color: C.nevada }}
          >
            Every outcome comes with a reason and a next step.
          </p>
        </div>

        {/* 6 Decision Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {DECISIONS.map((item) => {
            const Icon = item.badgeIcon;
            return (
              <div
                key={item.status}
                className="flex flex-col justify-between p-4.5 sm:p-6 bg-white rounded-[20px] sm:rounded-[24px] border hover:shadow-md transition-all duration-200"
                style={{ borderColor: C.geyser }}
              >
                <div>
                  {/* Status Badge */}
                  <div
                    className="mb-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] sm:text-[12.5px] font-jakarta font-bold border"
                    style={{
                      backgroundColor: item.badgeBg,
                      color: item.badgeText,
                      borderColor: item.badgeBorder || "transparent",
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span>{item.status}</span>
                  </div>

                  {/* Description */}
                  <p
                    className="font-jakarta text-[13.5px] sm:text-[14.5px] leading-[1.5] mb-5"
                    style={{ color: C.nevada }}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Link */}
                <a
                  href={item.linkHref}
                  className="inline-flex items-center gap-1.5 font-jakarta font-semibold text-[13.5px] sm:text-[14px] hover:underline"
                  style={{ color: C.mosque }}
                >
                  <span>{item.linkText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
