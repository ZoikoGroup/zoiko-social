"use client";

import React, { useState } from "react";
import Image from "next/image";

interface CategoryItem {
  id: string;
  title: string;
  category: "Generally allowed" | "Special review" | "Restricted" | "Prohibited" | "Separate policy";
  image: string;
  link: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "pet-food",
    title: "Pet food and treats",
    category: "Generally allowed",
    image: "/advertising-standards/category-pet-food.png",
    link: "#standards-1",
  },
  {
    id: "grooming",
    title: "Grooming and care services",
    category: "Generally allowed",
    image: "/advertising-standards/category-grooming.png",
    link: "#standards-1",
  },
  {
    id: "rescue-awareness",
    title: "Rescue awareness and events",
    category: "Generally allowed",
    image: "/advertising-standards/category-rescue-awareness.png",
    link: "#standards-1",
  },
  {
    id: "veterinary",
    title: "Veterinary services",
    category: "Special review",
    image: "/advertising-standards/category-veterinary.png",
    link: "#standards-7",
  },
  {
    id: "fundraising",
    title: "Fundraising",
    category: "Restricted",
    image: "/advertising-standards/category-fundraising.png",
    link: "#standards-7",
  },
  {
    id: "insurance",
    title: "Pet insurance",
    category: "Restricted",
    image: "/advertising-standards/category-pet-insurance.png",
    link: "#standards-7",
  },
  {
    id: "supplements",
    title: "Supplements",
    category: "Restricted",
    image: "/advertising-standards/category-supplements.png",
    link: "#standards-7",
  },
  {
    id: "breeding",
    title: "Breeding services",
    category: "Restricted",
    image: "/advertising-standards/category-breeding.png",
    link: "#standards-2",
  },
  {
    id: "animal-sales",
    title: "Live animal sales",
    category: "Prohibited",
    image: "/advertising-standards/category-live-animal-sales.png",
    link: "#standards-2",
  },
  {
    id: "exotic-trade",
    title: "Exotic and wild animal trade",
    category: "Prohibited",
    image: "/advertising-standards/category-exotic-wildlife.png",
    link: "#standards-2",
  },
  {
    id: "political-ads",
    title: "Political and issue ads",
    category: "Separate policy",
    image: "/advertising-standards/category-political-issue.png",
    link: "#standards-2",
  },
  {
    id: "gambling-alcohol",
    title: "Gambling and alcohol",
    category: "Separate policy",
    image: "/advertising-standards/category-gambling-alcohol.png",
    link: "#standards-2",
  },
];

const FILTER_TABS = [
  "All",
  "Generally allowed",
  "Special review",
  "Restricted",
  "Prohibited",
  "Separate policy",
] as const;

export default function WhatYouCanAdvertise() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const filteredItems = CATEGORIES.filter((item) => {
    if (activeTab === "All") return true;
    return item.category === activeTab;
  });

  const getBadgeConfig = (category: CategoryItem["category"]) => {
    switch (category) {
      case "Generally allowed":
        return {
          bg: "bg-[#EEF8F9]",
          border: "border-transparent",
          text: "text-[#073B47]",
          icon: "/advertising-standards/badge-generally-allowed.svg",
        };
      case "Special review":
        return {
          bg: "bg-white",
          border: "border-[#066879]",
          text: "text-[#073B47]",
          icon: "/advertising-standards/badge-special-review.svg",
        };
      case "Restricted":
        return {
          bg: "bg-[#FFF5E8]",
          border: "border-[#E88924]",
          text: "text-[#7A430B]",
          icon: "/advertising-standards/badge-restricted.svg",
        };
      case "Prohibited":
        return {
          bg: "bg-[#073B47]",
          border: "border-transparent",
          text: "text-white",
          icon: "/advertising-standards/badge-prohibited.svg",
        };
      case "Separate policy":
      default:
        return {
          bg: "bg-[#F7F9FA]",
          border: "border-dashed border-[#A9B8BD]",
          text: "text-[#5E7076]",
          icon: "/advertising-standards/badge-separate-policy.svg",
        };
    }
  };

  return (
    <section id="what-you-can-advertise" className="w-full bg-[#F7F9FA] py-12 sm:py-16 lg:py-20 border-b border-[#DCE5E8]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[105px]">
        {/* Section Header - Left Aligned to match Figma */}
        <div className="text-left mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-[#073B47] tracking-[-0.01em] leading-[1.2] font-['Plus_Jakarta_Sans',sans-serif] mb-2 sm:mb-2.5">
            What you can advertise
          </h2>
          <p className="text-sm sm:text-base lg:text-[17px] text-[#5E7076] font-normal leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
            How common categories are treated. Each links to the full standard.
          </p>
        </div>

        {/* Filter Pills - Left Aligned with smooth horizontal touch scroll on mobile */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 sm:mb-10 scrollbar-none">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-3.5 sm:px-4 py-2 sm:py-[7.5px] rounded-full text-xs sm:text-[14px] font-semibold transition-all cursor-pointer whitespace-nowrap leading-[1.4] ${
                  isActive
                    ? "bg-[#066879] text-white border border-[#066879] shadow-xs"
                    : "bg-white text-[#102A32] border border-[#DCE5E8] hover:border-[#066879]"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Responsive Grid: 1 col (mobile) -> 2 cols (tablet) -> 3 cols (desktop small) -> 4 cols (large) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-[14px]">
          {filteredItems.map((item) => {
            const badge = getBadgeConfig(item.category);
            return (
              <article
                key={item.id}
                className="bg-white border border-[#DCE5E8] rounded-[20px] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group h-auto min-h-[273px]"
              >
                {/* Top Image Banner */}
                <div className="relative w-full h-[160px] sm:h-[154px] bg-[#E5E7EB] overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 295px"
                  />
                </div>

                {/* Card Content & Badge */}
                <div className="p-3.5 sm:p-[14px_16px] flex-1 flex flex-col justify-between gap-3 sm:gap-2">
                  <div className="flex flex-col gap-2">
                    {/* Badge */}
                    <div className="inline-flex">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 sm:px-[11px] py-1 sm:py-[3.5px] rounded-full text-xs sm:text-[13px] font-semibold leading-tight border ${badge.bg} ${badge.border} ${badge.text}`}
                      >
                        <Image
                          src={badge.icon}
                          alt=""
                          width={16}
                          height={16}
                          className="w-4 h-4 shrink-0"
                        />
                        <span>{item.category}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-[#073B47] text-[15px] leading-snug sm:leading-[24px] font-['Plus_Jakarta_Sans',sans-serif] line-clamp-2 sm:line-clamp-1">
                      {item.title}
                    </h3>
                  </div>

                  {/* Link / Action */}
                  <a
                    href={item.link}
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#066879] hover:text-[#055765] transition-colors leading-[20.8px] group/link mt-1 sm:mt-0"
                  >
                    <span>Read the standard</span>
                    <Image
                      src="/advertising-standards/icon-arrow-right.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4 shrink-0 group-hover/link:translate-x-0.5 transition-transform"
                    />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
