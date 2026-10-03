"use client";

import React from "react";
import {
  UserCheck,
  Building2,
  Fingerprint,
  Layers,
  Award,
  ShieldCheck,
  Globe,
  MapPin,
  HeartHandshake,
  RotateCcw,
} from "lucide-react";
import { C } from "./theme";

interface CheckRow {
  name: string;
  icon: React.ElementType;
  professional: string;
  organization: string;
}

const CHECK_ROWS: CheckRow[] = [
  {
    name: "Identity",
    icon: Fingerprint,
    professional: "You, and that you own the account",
    organization: "The authorized representative, and their account",
  },
  {
    name: "Category fit",
    icon: Layers,
    professional: "Your professional role or service",
    organization: "Organization type, purpose and activity",
  },
  {
    name: "Credentials",
    icon: Award,
    professional: "License, registration or certification",
    organization: "Company, charity or nonprofit registration",
  },
  {
    name: "Authority",
    icon: ShieldCheck,
    professional: "That you control your practice profile",
    organization: "That you can act for the organization",
  },
  {
    name: "Online presence",
    icon: Globe,
    professional: "Practice website or public profiles",
    organization: "Official website and domain",
  },
  {
    name: "Region",
    icon: MapPin,
    professional: "Local professional rules",
    organization: "Local registration rules",
  },
  {
    name: "Standing",
    icon: HeartHandshake,
    professional: "Account and safety standing",
    organization: "Welfare and account standing",
  },
  {
    name: "Ongoing",
    icon: RotateCcw,
    professional: "Expiry dates and material changes",
    organization: "Entity status and material changes",
  },
];

export default function WhatWeCheckSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="mb-10 text-left">
          <h2
            className="font-jakarta font-extrabold text-[26px] sm:text-[34px] lg:text-[38px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            What we check
          </h2>
          <p
            className="font-jakarta text-[15px] sm:text-[17px] font-normal"
            style={{ color: C.nevada }}
          >
            The same eight areas for both paths, with different evidence.
          </p>
        </div>

        {/* Mobile View: Stacked Comparison Cards (< md) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {CHECK_ROWS.map((row) => {
            const Icon = row.icon;
            return (
              <div
                key={row.name}
                className="bg-white rounded-[20px] border p-4.5 shadow-sm flex flex-col gap-3.5"
                style={{ borderColor: C.geyser }}
              >
                {/* Area Title */}
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: C.blackSqueeze, color: C.mosque }}
                  >
                    <Icon className="w-4.5 h-4.5" strokeWidth={2.2} />
                  </div>
                  <h3
                    className="font-jakarta font-bold text-[16px]"
                    style={{ color: C.tarawera }}
                  >
                    {row.name}
                  </h3>
                </div>

                {/* Professional Info */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[12px] font-jakarta font-bold text-gray-500 uppercase tracking-wider">
                    <UserCheck className="w-3.5 h-3.5 text-[#066879]" />
                    <span>Professional</span>
                  </div>
                  <p
                    className="font-jakarta text-[13.5px] leading-[1.5] pl-5"
                    style={{ color: C.firefly }}
                  >
                    {row.professional}
                  </p>
                </div>

                {/* Organization Info */}
                <div className="flex flex-col gap-1 pt-1 border-t border-gray-50">
                  <div className="flex items-center gap-1.5 text-[12px] font-jakarta font-bold text-gray-500 uppercase tracking-wider">
                    <Building2 className="w-3.5 h-3.5 text-[#066879]" />
                    <span>Organization</span>
                  </div>
                  <p
                    className="font-jakarta text-[13.5px] leading-[1.5] pl-5"
                    style={{ color: C.firefly }}
                  >
                    {row.organization}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop / Tablet View: Full Comparison Table (>= md) */}
        <div
          className="hidden md:block w-full bg-white rounded-[20px] border overflow-x-auto shadow-sm"
          style={{ borderColor: C.geyser }}
        >
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr
                className="border-b"
                style={{ backgroundColor: C.athensGray, borderColor: C.geyser }}
              >
                <th className="py-4 px-5 font-jakarta font-bold text-[14px] w-[240px]" style={{ color: C.nevada }}>
                  Check
                </th>
                <th className="py-4 px-5 font-jakarta font-bold text-[14px]" style={{ color: C.nevada }}>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4.5 h-4.5 text-gray-500" />
                    <span>Professional</span>
                  </div>
                </th>
                <th className="py-4 px-5 font-jakarta font-bold text-[14px]" style={{ color: C.nevada }}>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4.5 h-4.5 text-gray-500" />
                    <span>Organization</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {CHECK_ROWS.map((row, idx) => {
                const Icon = row.icon;
                const isLast = idx === CHECK_ROWS.length - 1;
                return (
                  <tr
                    key={row.name}
                    className={`transition-colors hover:bg-slate-50/60 ${
                      !isLast ? "border-b" : ""
                    }`}
                    style={{ borderColor: C.geyser }}
                  >
                    {/* Check Column */}
                    <td className="py-4 px-5 font-jakarta font-bold text-[14.5px]">
                      <div className="flex items-center gap-2.5" style={{ color: C.tarawera }}>
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: C.blackSqueeze, color: C.mosque }}
                        >
                          <Icon className="w-4 h-4" strokeWidth={2.2} />
                        </div>
                        <span>{row.name}</span>
                      </div>
                    </td>

                    {/* Professional Column */}
                    <td
                      className="py-4 px-5 font-jakarta text-[14px] sm:text-[14.5px] leading-[1.5]"
                      style={{ color: C.firefly }}
                    >
                      {row.professional}
                    </td>

                    {/* Organization Column */}
                    <td
                      className="py-4 px-5 font-jakarta text-[14px] sm:text-[14.5px] leading-[1.5]"
                      style={{ color: C.firefly }}
                    >
                      {row.organization}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
