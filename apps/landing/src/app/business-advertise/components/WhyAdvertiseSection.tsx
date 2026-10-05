"use client";

import React from "react";
import Image from "next/image";
import {
  PawPrint,
  ShieldCheck,
  BadgeCheck,
  Target,
  BarChart3,
  Newspaper,
  HeartHandshake,
} from "lucide-react";
import { C } from "./theme";

export default function WhyAdvertiseSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[105px]">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}
        <div className="mb-10 sm:mb-12 max-w-[800px]">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[32px] lg:text-[36px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            Why advertise on Zoiko Social
          </h2>
          <p
            className="font-jakarta text-[16px] sm:text-[17px] leading-[1.6]"
            style={{ color: C.nevada }}
          >
            A trusted space built around animals and the people who care for them.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Purpose-built for animals (2 cols, 2 rows on lg) */}
          <div className="relative md:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[340px] lg:min-h-[416px] rounded-[28px] overflow-hidden flex flex-col justify-end p-6 sm:p-8 border border-[#DCE5E8]/40 shadow-xs group">
            <Image
              src="/business-advertise/why-purpose-built.png"
              alt="Purpose-built for animals"
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#073B47]/95 via-[#073B47]/50 to-transparent" />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-[12px] bg-white flex items-center justify-center text-[#066879] mb-4 shadow-sm">
                <PawPrint className="w-5 h-5" />
              </div>
              <h3 className="font-jakarta font-bold text-[20px] sm:text-[22px] text-white mb-2">
                Purpose-built for animals
              </h3>
              <p className="font-jakarta text-[14px] sm:text-[15px] leading-relaxed text-[#D8EEF1] max-w-[480px]">
                Your ads appear among animal communities, not a general-interest feed.
              </p>
            </div>
          </div>

          {/* Card 2: Trust built in (1 col) */}
          <div className="min-h-[200px] rounded-[28px] bg-white border border-[#DCE5E8] p-6 flex flex-col justify-end hover:border-[#066879]/50 transition-colors shadow-xs">
            <div className="w-11 h-11 rounded-[12px] bg-[#EEF8F9] flex items-center justify-center text-[#066879] mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-jakarta font-bold text-[18px] text-[#073B47] mb-1.5">
              Trust built in
            </h3>
            <p className="font-jakarta text-[13.5px] leading-relaxed text-[#5E7076]">
              Vetting, review, moderation and welfare rules protect the people who see your ads.
            </p>
          </div>

          {/* Card 3: Verified identity (1 col) */}
          <div className="min-h-[200px] rounded-[28px] bg-white border border-[#DCE5E8] p-6 flex flex-col justify-end hover:border-[#066879]/50 transition-colors shadow-xs">
            <div className="w-11 h-11 rounded-[12px] bg-[#EEF8F9] flex items-center justify-center text-[#066879] mb-3">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <h3 className="font-jakarta font-bold text-[18px] text-[#073B47] mb-1.5">
              Verified identity
            </h3>
            <p className="font-jakarta text-[13.5px] leading-relaxed text-[#5E7076]">
              Campaigns connect to your verified professional or organization profile.
            </p>
          </div>

          {/* Card 4: Relevant reach (1 col with photo) */}
          <div className="relative min-h-[200px] rounded-[28px] overflow-hidden flex flex-col justify-end p-6 border border-[#DCE5E8]/40 shadow-xs group">
            <Image
              src="/business-advertise/why-cat.png"
              alt="Relevant reach"
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#073B47]/95 via-[#073B47]/50 to-transparent" />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-[12px] bg-white flex items-center justify-center text-[#066879] mb-3 shadow-sm">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-jakarta font-bold text-[18px] text-white mb-1.5">
                Relevant reach
              </h3>
              <p className="font-jakarta text-[13.5px] leading-relaxed text-[#D8EEF1]">
                Reach people by interests and region, within strict privacy rules.
              </p>
            </div>
          </div>

          {/* Card 5: Clear reporting (1 col with photo) */}
          <div className="relative min-h-[200px] rounded-[28px] overflow-hidden flex flex-col justify-end p-6 border border-[#DCE5E8]/40 shadow-xs group">
            <Image
              src="/business-advertise/why-dog.png"
              alt="Clear reporting"
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#073B47]/95 via-[#073B47]/50 to-transparent" />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-[12px] bg-white flex items-center justify-center text-[#066879] mb-3 shadow-sm">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-jakarta font-bold text-[18px] text-white mb-1.5">
                Clear reporting
              </h3>
              <p className="font-jakarta text-[13.5px] leading-relaxed text-[#D8EEF1]">
                See delivery and results, without access to anyone&apos;s private data.
              </p>
            </div>
          </div>

          {/* Card 6: Kept apart from news (2 cols on lg) */}
          <div className="md:col-span-2 lg:col-span-2 min-h-[200px] rounded-[28px] bg-white border border-[#DCE5E8] p-6 sm:p-7 flex flex-col justify-end hover:border-[#066879]/50 transition-colors shadow-xs">
            <div className="w-11 h-11 rounded-[12px] bg-[#EEF8F9] flex items-center justify-center text-[#066879] mb-3">
              <Newspaper className="w-5 h-5" />
            </div>
            <h3 className="font-jakarta font-bold text-[18px] text-[#073B47] mb-1.5">
              Kept apart from news
            </h3>
            <p className="font-jakarta text-[14px] leading-relaxed text-[#5E7076] max-w-[480px]">
              Ads never look like, or influence, verified news.
            </p>
          </div>

          {/* Card 7: Real communities (2 cols on lg with photo) */}
          <div className="relative md:col-span-2 lg:col-span-2 min-h-[200px] rounded-[28px] overflow-hidden flex flex-col justify-end p-6 sm:p-7 border border-[#DCE5E8]/40 shadow-xs group">
            <Image
              src="/business-advertise/why-community.png"
              alt="Real communities"
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#073B47]/95 via-[#073B47]/50 to-transparent" />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-[12px] bg-white flex items-center justify-center text-[#066879] mb-3 shadow-sm">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-jakarta font-bold text-[18px] text-white mb-1.5">
                Real communities
              </h3>
              <p className="font-jakarta text-[14px] leading-relaxed text-[#D8EEF1] max-w-[480px]">
                Be part of the communities your audience already loves.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
