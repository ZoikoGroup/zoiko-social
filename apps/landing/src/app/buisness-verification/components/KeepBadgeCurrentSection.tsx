"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  EyeOff,
  XCircle,
  FileText,
  User,
  Tag,
  Building,
  Key,
  Globe,
  MapPin,
} from "lucide-react";
import { C } from "./theme";

const STATUS_ITEMS = [
  {
    name: "Active",
    badgeBg: "#066879",
    badgeText: "#FFFFFF",
    icon: CheckCircle2,
    desc: "Badge shows on your profile.",
  },
  {
    name: "Expiring soon",
    badgeBg: "#FFF5E8",
    badgeText: "#7A430B",
    icon: Clock,
    desc: "We'll remind you 30 days ahead.",
  },
  {
    name: "Lapsed",
    badgeBg: "#F3F4F6",
    badgeText: "#4B5563",
    icon: AlertCircle,
    desc: "Badge removed until updated.",
  },
  {
    name: "Suspended",
    badgeBg: "#FFFBEB",
    badgeText: "#B45309",
    icon: EyeOff,
    desc: "Hidden during a safety review.",
  },
  {
    name: "Revoked",
    badgeBg: "#DC2626",
    badgeText: "#FFFFFF",
    icon: XCircle,
    desc: "Removed, with a reason and review route.",
  },
];

const CHANGE_TRIGGERS = [
  { label: "License or credential", icon: FileText },
  { label: "Your name", icon: User },
  { label: "Your category", icon: Tag },
  { label: "Legal name", icon: Building },
  { label: "Ownership or control", icon: Key },
  { label: "Website or domain", icon: Globe },
  { label: "New regions", icon: MapPin },
];

export default function KeepBadgeCurrentSection() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="mb-10 text-left">
          <h2
            className="font-jakarta font-extrabold text-[26px] sm:text-[34px] lg:text-[38px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            Keeping your badge current
          </h2>
          <p
            className="font-jakarta text-[15px] sm:text-[17px] font-normal"
            style={{ color: C.nevada }}
          >
            Verification is rechecked every 12 months, and when key details change.
          </p>
        </div>

        {/* 5 Status Lifecycle Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-8 sm:mb-10">
          {STATUS_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="p-4.5 sm:p-5 bg-white rounded-[20px] border flex flex-col items-start gap-2.5 sm:gap-3 shadow-sm hover:shadow-md transition-all"
                style={{ borderColor: C.geyser }}
              >
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] sm:text-[12.5px] font-jakarta font-bold"
                  style={{
                    backgroundColor: item.badgeBg,
                    color: item.badgeText,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span>{item.name}</span>
                </div>
                <p
                  className="font-jakarta text-[12.5px] sm:text-[13.5px] leading-[1.45]"
                  style={{ color: C.nevada }}
                >
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tell us when these change Chips */}
        <div className="flex flex-col gap-3 pt-2">
          <span
            className="font-jakarta font-semibold text-[13px] sm:text-[13.5px] tracking-wide"
            style={{ color: C.nevada }}
          >
            Tell us when these change:
          </span>

          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {CHANGE_TRIGGERS.map((trigger) => {
              const Icon = trigger.icon;
              return (
                <div
                  key={trigger.label}
                  className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white border text-[12.5px] sm:text-[13.5px] font-jakarta font-semibold hover:border-gray-400 transition-colors shadow-sm"
                  style={{ borderColor: C.geyser, color: C.firefly }}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#066879] shrink-0" />
                  <span>{trigger.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
