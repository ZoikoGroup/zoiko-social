"use client";

import React from "react";
import {
  Fingerprint,
  Home,
  File,
  MessageCircleMore,
  Gauge,
  User,
} from "lucide-react";
import { C } from "./theme";

interface PrivateItem {
  title: string;
  icon: React.ElementType;
}

const PRIVATE_ITEMS: PrivateItem[] = [
  { title: "ID documents", icon: Fingerprint },
  { title: "Home addresses", icon: Home },
  { title: "Uploaded documents", icon: File },
  { title: "Reviewer notes", icon: MessageCircleMore },
  { title: "Risk scores", icon: Gauge },
  { title: "Reviewer identity", icon: User },
];

export default function WhatStaysPrivateSection() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="mb-10 text-left">
          <h2
            className="font-jakarta font-extrabold text-[26px] sm:text-[34px] lg:text-[38px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            What stays private
          </h2>
          <p
            className="font-jakarta text-[15px] sm:text-[17px] font-normal"
            style={{ color: C.nevada }}
          >
            Your evidence is used only for review, never published.
          </p>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-[14px]">
          {PRIVATE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="min-h-[120px] sm:min-h-[131.2px] p-4 sm:p-[22px_16px] bg-white rounded-[20px] border flex flex-col items-center justify-center text-center transition-all hover:shadow-sm"
                style={{ borderColor: C.geyser }}
              >
                {/* Serenade warm peach/cream icon container */}
                <div
                  className="w-11 h-11 sm:w-[52px] sm:h-[52px] rounded-[14px] sm:rounded-[16px] flex items-center justify-center mb-2.5 shrink-0"
                  style={{ backgroundColor: C.serenade }}
                >
                  <Icon
                    className="w-4.5 h-4.5 sm:w-5 sm:h-5"
                    style={{ color: "#B85D19" }}
                    strokeWidth={1.85}
                  />
                </div>

                {/* Card Title */}
                <span
                  className="font-jakarta font-bold text-[13px] sm:text-[14.5px] leading-tight px-1"
                  style={{ color: C.tarawera }}
                >
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
