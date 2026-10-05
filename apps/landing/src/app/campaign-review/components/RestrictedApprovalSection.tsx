"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  User,
  FileText,
  Link2,
  CheckCircle2,
  Scale,
} from "lucide-react";

export default function RestrictedApprovalSection() {
  const conditions = [
    { label: "United States only", icon: Globe },
    { label: "Ages 18 and over", icon: User },
    { label: "Must show policy terms link", icon: FileText },
    { label: "Approved landing page only", icon: Link2 },
  ];

  return (
    <section id="restricted-approval" className="w-full bg-white py-14 sm:py-16 lg:py-20 border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="max-w-[720px] mb-10 sm:mb-12">
          <h2 className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] text-[#073B47] tracking-[-0.02em] mb-2.5">
            Restricted approval
          </h2>
          <p className="font-jakarta text-[15px] sm:text-[16.5px] leading-relaxed text-[#5E7076]">
            Some campaigns can run with conditions. You&apos;ll always see them
            before launch.
          </p>
        </div>

        {/* 2-Column Sibling Layout matching Figma #1449:1346 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Card: Example & Conditions */}
          <div className="rounded-[28px] bg-white border border-[#DCE5E8] p-6 sm:p-8 flex flex-col justify-between shadow-2xs">
            <div>
              <h3 className="font-jakarta font-bold text-[20px] sm:text-[22px] text-[#073B47] mb-2">
                Example: Holiday Pet Insurance
              </h3>
              <p className="font-jakarta text-[14px] sm:text-[15px] text-[#5E7076] leading-relaxed mb-6">
                This campaign may run only with the conditions below.
              </p>

              {/* 4 Conditions Pills with exact icons matching Figma */}
              <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-8">
                {conditions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#066879] text-[#073B47] font-jakarta font-semibold text-[13px]"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#066879] shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons matching Figma */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[12px] bg-[#066879] hover:bg-[#073B47] text-white font-jakarta font-semibold text-[14px] transition-colors shadow-2xs"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Review and accept</span>
              </button>
              <Link
                href="/advertising-standards#rules"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[12px] bg-white hover:bg-[#F7F9FA] text-[#102A32] border border-[#DCE5E8] font-jakarta font-medium text-[14px] transition-colors"
              >
                <Scale className="w-4 h-4 text-[#102A32]" />
                <span>View rule 7.3</span>
              </Link>
            </div>
          </div>

          {/* Right: Standalone Photo Card */}
          <div className="relative w-full min-h-[260px] sm:min-h-[340px] rounded-[28px] overflow-hidden">
            <Image
              src="/campaign-review/restricted-approval-dog.png"
              alt="Restricted campaign example pet"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
