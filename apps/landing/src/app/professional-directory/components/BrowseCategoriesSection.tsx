"use client";

import React from "react";
import Image from "next/image";
import {
  Stethoscope,
  Activity,
  Scissors,
  Soup,
  Heart,
} from "lucide-react";
import { CATEGORIES } from "./directoryData";
import { C } from "./theme";

// House with heart icon for Caregiving
function HomeHeartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.2L12 3l9 7.2V20a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.8z" />
      <path d="M12 9.2c-.6-.7-1.6-.7-2.1-.1-.5.6-.4 1.4.3 2.1l1.8 1.8 1.8-1.8c.7-.7.8-1.5.3-2.1-.5-.6-1.5-.6-2.1.1z" />
    </svg>
  );
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  veterinary: Stethoscope,
  training: Activity,
  grooming: Scissors,
  nutrition: Soup,
  caregiving: HomeHeartIcon,
  rehabilitation: Heart,
};

export default function BrowseCategoriesSection() {
  const handleCategoryClick = (_categoryTitle?: string) => {
    const resultsEl = document.getElementById("results");
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="categories" className="w-full bg-white py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        <div className="max-w-[1180px] mx-auto">
          {/* Section Header - Left Aligned to match Figma design */}
          <div className="mb-6 sm:mb-8 lg:mb-10 text-left">
            <h2
              className="font-jakarta font-extrabold text-[28px] sm:text-[36px] lg:text-[42px] leading-[1.15] tracking-[-0.015em] mb-2.5"
              style={{ color: C.tarawera }}
            >
              Browse by category
            </h2>
            <p
              className="font-jakarta font-normal text-[15px] sm:text-[17.5px] leading-[1.6]"
              style={{ color: C.nevada }}
            >
              Start with the kind of help your animal needs.
            </p>
          </div>

          {/* 6 Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-7">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] || Stethoscope;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.title)}
                  className="group relative h-[210px] sm:h-[235px] rounded-[24px] sm:rounded-[28px] overflow-hidden cursor-pointer shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  {/* Background Image */}
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Dark Teal Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#042C30]/95 via-[#042C30]/45 to-transparent" />

                  {/* Card Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Top: Solid White Rounded Icon Box */}
                    <div className="w-11 h-11 rounded-[14px] bg-white flex items-center justify-center text-[#064E4E] shadow-sm transition-transform duration-300 group-hover:scale-105">
                      <Icon className="w-[21px] h-[21px] stroke-[2.2]" />
                    </div>

                    {/* Bottom: Title & Subtitle */}
                    <div>
                      <h3 className="font-jakarta font-bold text-[19px] sm:text-[20px] text-white leading-tight mb-1">
                        {cat.title}
                      </h3>
                      <p className="font-jakarta text-[13px] sm:text-[13.5px] text-white/85 leading-snug">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
