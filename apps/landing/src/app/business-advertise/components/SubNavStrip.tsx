"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Stethoscope,
  Users,
  Newspaper,
  Flag,
  HelpCircle,
} from "lucide-react";

const SUB_NAV_LINKS = [
  {
    label: "Get verified",
    href: "/buisness-verification",
    icon: ShieldCheck,
  },
  {
    label: "List your practice",
    href: "/professional-directory",
    icon: Stethoscope,
  },
  {
    label: "Partnerships",
    href: "/company-partnerships",
    icon: Users,
  },
  {
    label: "Press",
    href: "/company-press-media",
    icon: Newspaper,
  },
  {
    label: "Report an ad",
    href: "/safety-report-concern",
    icon: Flag,
  },
  {
    label: "Account help",
    href: "/support-developers-help-center",
    icon: HelpCircle,
  },
];

export default function SubNavStrip() {
  return (
    <nav
      aria-label="Alternate Navigation"
      className="w-full bg-white border-b border-[#DCE5E8] py-4 sm:py-4.5 px-4 sm:px-6 lg:px-[105px]"
    >
      <div className="mx-auto max-w-[1440px] flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-3.5">
        <span className="font-jakarta font-bold text-[14px] text-[#102A32] mr-1">
          Not here to advertise?
        </span>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {SUB_NAV_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1 rounded-full bg-white border border-[#DCE5E8] hover:border-[#066879] hover:bg-[#EEF8F9]/40 transition-all text-[#102A32] font-jakarta font-semibold text-[13px]"
              >
                <div className="w-7 h-7 rounded-full bg-[#EEF8F9] flex items-center justify-center text-[#066879] shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
