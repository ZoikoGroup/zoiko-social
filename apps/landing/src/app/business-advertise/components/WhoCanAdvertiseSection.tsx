"use client";

import React from "react";
import { Check, Clock, AlertTriangle, XCircle, Info } from "lucide-react";
import { C } from "./theme";

interface CategoryCard {
  id: string;
  badge: {
    text: string;
    style: "eligible" | "clientAuth" | "verifyFirst" | "extraReview" | "mustFit" | "notEligible";
  };
  title: string;
  description: string;
  isDashed?: boolean;
}

const CARDS: CategoryCard[] = [
  {
    id: "professionals",
    badge: { text: "Eligible", style: "eligible" },
    title: "Verified professionals",
    description: "Vets, trainers, groomers and other care professionals.",
  },
  {
    id: "organizations",
    badge: { text: "Eligible", style: "eligible" },
    title: "Verified organizations",
    description: "Rescues, nonprofits, institutions and animal-aligned businesses.",
  },
  {
    id: "agencies",
    badge: { text: "With client authorization", style: "clientAuth" },
    title: "Agencies",
    description: "Acting for an eligible, verified client.",
  },
  {
    id: "not-verified",
    badge: { text: "Verify first", style: "verifyFirst" },
    title: "Not yet verified",
    description: "Explore now, verify before your campaign launches.",
  },
  {
    id: "institutions",
    badge: { text: "Extra review", style: "extraReview" },
    title: "Institutions",
    description: "Public-interest and education campaigns.",
  },
  {
    id: "other",
    badge: { text: "Must fit", style: "mustFit" },
    title: "Other businesses",
    description: "Must be animal-aligned. See the Standards.",
    isDashed: true,
  },
  {
    id: "restricted",
    badge: { text: "Not eligible", style: "notEligible" },
    title: "Restricted accounts",
    description: "No new campaigns while restrictions apply.",
    isDashed: true,
  },
];

export default function WhoCanAdvertiseSection() {
  const getBadgeClasses = (style: CategoryCard["badge"]["style"]) => {
    switch (style) {
      case "eligible":
        return "bg-[#EEF8F9] text-[#066879] border-[#066879]";
      case "clientAuth":
        return "bg-[#EEF8F9] text-[#073B47] border-transparent";
      case "verifyFirst":
        return "bg-[#FFF5E8] text-[#7A430B] border-[#E88924]";
      case "extraReview":
        return "bg-white text-[#073B47] border-[#066879]";
      case "mustFit":
        return "bg-[#F7F9FA] text-[#5E7076] border-[#A9B8BD] border-dashed";
      case "notEligible":
        return "bg-[#073B47] text-white border-transparent";
      default:
        return "bg-[#F7F9FA] text-[#5E7076] border-[#DCE5E8]";
    }
  };

  const getBadgeIcon = (style: CategoryCard["badge"]["style"]) => {
    switch (style) {
      case "eligible":
      case "extraReview":
        return <Check className="w-3.5 h-3.5" />;
      case "clientAuth":
        return <Info className="w-3.5 h-3.5" />;
      case "verifyFirst":
        return <Clock className="w-3.5 h-3.5" />;
      case "mustFit":
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case "notEligible":
        return <XCircle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section className="w-full bg-[#F7F9FA] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[105px] border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}
        <div className="mb-10 sm:mb-12 max-w-[800px]">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[32px] lg:text-[36px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            Who can advertise
          </h2>
          <p
            className="font-jakarta text-[16px] sm:text-[17px] leading-[1.6]"
            style={{ color: C.nevada }}
          >
            Advertising is for verified, animal-aligned advertisers.
          </p>
        </div>

        {/* 7-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
          {CARDS.map((card) => {
            const isDashed = card.isDashed;
            return (
              <div
                key={card.id}
                className={`rounded-[20px] p-5 sm:p-5.5 flex flex-col justify-between transition-all hover:shadow-xs ${
                  isDashed
                    ? "bg-[#F7F9FA] border border-dashed border-[#DCE5E8]"
                    : "bg-white border border-[#DCE5E8] shadow-xs"
                }`}
              >
                <div>
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12.5px] font-jakarta font-semibold border mb-3.5 leading-none">
                    <span className={getBadgeClasses(card.badge.style) + " inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border"}>
                      {getBadgeIcon(card.badge.style)}
                      {card.badge.text}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-jakarta font-bold text-[16px] sm:text-[17px] text-[#073B47] mb-1.5">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="font-jakarta text-[13.5px] leading-relaxed text-[#5E7076]">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
