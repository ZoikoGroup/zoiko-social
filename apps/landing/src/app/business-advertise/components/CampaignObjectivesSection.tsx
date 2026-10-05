"use client";

import React, { useState } from "react";
import {
  Megaphone,
  Link2,
  User,
  Calendar,
  Users,
  Mail,
  Heart,
  Smartphone,
  Check,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { C } from "./theme";

interface Objective {
  id: string;
  name: string;
  description: string;
  optimizedFor: string;
  youNeed: string;
  icon: React.ElementType;
}

const OBJECTIVES: Objective[] = [
  {
    id: "awareness",
    name: "Awareness",
    description: "Introduce your organization or service.",
    optimizedFor: "Reach and viewability",
    youNeed: "An image or video",
    icon: Megaphone,
  },
  {
    id: "website-visits",
    name: "Website visits",
    description: "Send people to your site.",
    optimizedFor: "Link clicks and CTR",
    youNeed: "Destination URL",
    icon: Link2,
  },
  {
    id: "profile-discovery",
    name: "Profile discovery",
    description: "Grow visits to your verified profile.",
    optimizedFor: "Profile clicks and follows",
    youNeed: "Verified profile setup",
    icon: User,
  },
  {
    id: "event-signups",
    name: "Event sign-ups",
    description: "Fill your event or open day.",
    optimizedFor: "RSVPs and registrations",
    youNeed: "Event date & registration link",
    icon: Calendar,
  },
  {
    id: "community-growth",
    name: "Community growth",
    description: "Invite people to your community.",
    optimizedFor: "Community join requests",
    youNeed: "Active public/moderated community",
    icon: Users,
  },
  {
    id: "inquiries",
    name: "Inquiries",
    description: "Get questions from potential clients.",
    optimizedFor: "Message initiations",
    youNeed: "Direct inquiry inbox enabled",
    icon: Mail,
  },
  {
    id: "fundraising",
    name: "Fundraising",
    description: "Raise money for a verified cause.",
    optimizedFor: "Verified campaign contributions",
    youNeed: "501(c)(3) or charity credentials",
    icon: Heart,
  },
  {
    id: "app-actions",
    name: "App actions",
    description: "Drive installs or in-app actions.",
    optimizedFor: "Mobile app installations",
    youNeed: "App Store or Google Play link",
    icon: Smartphone,
  },
];

export default function CampaignObjectivesSection() {
  const [selectedId, setSelectedId] = useState<string>("awareness");

  const currentObj = OBJECTIVES.find((o) => o.id === selectedId) || OBJECTIVES[0];

  return (
    <section className="w-full bg-[#F7F9FA] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[105px] border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}
        <div className="mb-8 sm:mb-10 max-w-[800px]">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[32px] lg:text-[36px] leading-[1.15] tracking-[-0.01em] mb-2"
            style={{ color: C.tarawera }}
          >
            Campaign objectives
          </h2>
          <p
            className="font-jakarta text-[16px] sm:text-[17px] leading-[1.6]"
            style={{ color: C.nevada }}
          >
            Pick what you want to achieve. You can change it before launch.
          </p>
        </div>

        {/* 8 Radio Option Cards (4 columns x 2 rows) */}
        <div
          role="radiogroup"
          aria-label="Campaign objective"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5"
        >
          {OBJECTIVES.map((obj) => {
            const isSelected = selectedId === obj.id;
            const Icon = obj.icon;
            return (
              <button
                key={obj.id}
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedId(obj.id)}
                className={`relative text-left p-4 sm:p-5 rounded-[20px] transition-all cursor-pointer flex flex-col justify-between min-h-[92px] sm:min-h-[98px] ${
                  isSelected
                    ? "bg-white border-2 border-[#066879] shadow-[0px_8px_24px_rgba(7,59,71,0.1)]"
                    : "bg-white border border-[#DCE5E8] hover:border-[#066879]/50 shadow-xs"
                }`}
              >
                {/* Top Row: Icon + Title on left, Radio circle on right */}
                <div className="flex items-center justify-between gap-2 w-full">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="w-4 h-4 text-[#066879] shrink-0" />
                    <h3 className="font-jakarta font-bold text-[15px] sm:text-[16px] text-[#073B47] truncate">
                      {obj.name}
                    </h3>
                  </div>

                  {/* Radio Button */}
                  <div
                    className={`w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? "bg-[#066879] text-white shadow-xs"
                        : "border border-[#DCE5E8] bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </div>
                </div>

                {/* Bottom Row: Description */}
                <p className="font-jakarta text-[13px] leading-snug text-[#5E7076] mt-1.5">
                  {obj.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* 2-Column Wide Info Cards Matching Image 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Card 1: Optimized for */}
          <div className="rounded-[16px] bg-white border border-[#DCE5E8] p-4 sm:p-4.5 flex flex-col gap-1 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-semibold text-[#5E7076]">
              <Compass className="w-3.5 h-3.5 text-[#066879]" />
              <span>Optimized for</span>
            </div>
            <span className="font-jakarta font-bold text-[14px] sm:text-[15px] text-[#073B47]">
              {currentObj.optimizedFor}
            </span>
          </div>

          {/* Card 2: You'll need */}
          <div className="rounded-[16px] bg-white border border-[#DCE5E8] p-4 sm:p-4.5 flex flex-col gap-1 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-semibold text-[#5E7076]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#066879]" />
              <span>You&apos;ll need</span>
            </div>
            <span className="font-jakarta font-bold text-[14px] sm:text-[15px] text-[#073B47]">
              {currentObj.youNeed}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
