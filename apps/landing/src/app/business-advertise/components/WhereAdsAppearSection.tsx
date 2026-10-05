"use client";

import React from "react";
import Image from "next/image";
import { Home, Search, Calendar, Ban, Tag } from "lucide-react";
import { C } from "./theme";

export default function WhereAdsAppearSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[105px]">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}
        <div className="mb-10 sm:mb-12 max-w-[800px]">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[32px] lg:text-[36px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            Where ads appear
          </h2>
          <p
            className="font-jakarta text-[16px] sm:text-[17px] leading-[1.6]"
            style={{ color: C.nevada }}
          >
            Three placements, each clearly labeled Sponsored.
          </p>
        </div>

        {/* 3 Placement Mockup Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-8 sm:mb-10">
          {/* Placement 1: Home Feed */}
          <div className="rounded-[28px] bg-[#F7F9FA] border border-[#DCE5E8] p-4 flex flex-col justify-between">
            {/* Inner Ad Mockup Card */}
            <div className="rounded-[14px] bg-white border border-[#DCE5E8] overflow-hidden flex flex-col min-h-[275px] justify-between shadow-xs">
              {/* Header */}
              <div className="flex items-center justify-between p-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-[#DCE5E8]">
                    <Image
                      src="/business-advertise/placement-vet-avatar.png"
                      alt="Harbor Point Veterinary Clinic"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-jakarta font-bold text-[11.5px] leading-tight text-[#102A32] truncate">
                      Harbor Point Veterinary Clinic
                    </span>
                    <span className="font-jakarta text-[10px] text-[#5E7076] leading-tight">
                      Ad · Verified practice
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[#EEF8F9] border border-[#C4D7DC] text-[#073B47] font-extrabold text-[10.5px]">
                  <Tag className="w-2.5 h-2.5" />
                  Sponsored
                </span>
              </div>

              {/* Creative Photo */}
              <div className="relative w-full h-[150px] bg-gradient-to-br from-[#066879] to-[#E88924] overflow-hidden">
                <Image
                  src="/business-advertise/placement-feed-cat.png"
                  alt="Cat Dental Check"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text & Action */}
              <div className="px-2.5 py-2">
                <p className="font-jakarta text-[11.5px] font-medium text-[#102A32] mb-2 leading-tight">
                  Book a dental check for your cat this October.
                </p>
                <div className="flex items-center justify-between text-[10.5px]">
                  <span className="text-[#5E7076] truncate max-w-[160px]">
                    harborpointvet.example
                  </span>
                  <button className="px-2.5 py-1 rounded-[7px] bg-[#066879] text-white font-bold text-[11px] hover:bg-[#055765] transition-colors">
                    Book now
                  </button>
                </div>
              </div>
            </div>

            {/* Figcaption at bottom inside column card */}
            <div className="mt-3.5 px-0.5 pb-0.5">
              <div className="flex items-center gap-2 mb-1">
                <Home className="w-4 h-4 text-[#073B47] shrink-0" />
                <h3 className="font-jakarta font-bold text-[16px] text-[#073B47]">
                  Home feed
                </h3>
              </div>
              <p className="font-jakarta text-[13px] text-[#5E7076] leading-relaxed">
                Sponsored cards between posts, always labeled.
              </p>
            </div>
          </div>

          {/* Placement 2: Discover */}
          <div className="rounded-[28px] bg-[#F7F9FA] border border-[#DCE5E8] p-4 flex flex-col justify-between">
            {/* Inner Ad Mockup Card */}
            <div className="rounded-[14px] bg-white border border-[#DCE5E8] overflow-hidden flex flex-col min-h-[275px] justify-between shadow-xs">
              {/* Header */}
              <div className="flex items-center justify-between p-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-[#DCE5E8]">
                    <Image
                      src="/business-advertise/placement-community-avatar.png"
                      alt="Northside Paws Training Co."
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-jakarta font-bold text-[11.5px] leading-tight text-[#102A32] truncate">
                      Northside Paws Training Co.
                    </span>
                    <span className="font-jakarta text-[10px] text-[#5E7076] leading-tight">
                      Ad · Verified practice
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[#EEF8F9] border border-[#C4D7DC] text-[#073B47] font-extrabold text-[10.5px]">
                  <Tag className="w-2.5 h-2.5" />
                  Sponsored
                </span>
              </div>

              {/* Creative Photo */}
              <div className="relative w-full h-[150px] bg-gradient-to-br from-[#066879] to-[#E88924] overflow-hidden">
                <Image
                  src="/business-advertise/placement-community-dog.png"
                  alt="Puppy Training Course"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text & Action */}
              <div className="px-2.5 py-2">
                <p className="font-jakarta text-[11.5px] font-medium text-[#102A32] mb-2 leading-tight">
                  Six-week puppy course. Small groups, positive methods.
                </p>
                <div className="flex items-center justify-between text-[10.5px]">
                  <span className="text-[#5E7076]">
                    In Discover · Dogs
                  </span>
                  <button className="px-2.5 py-1 rounded-[7px] bg-[#066879] text-white font-bold text-[11px] hover:bg-[#055765] transition-colors">
                    Learn more
                  </button>
                </div>
              </div>
            </div>

            {/* Figcaption at bottom inside column card */}
            <div className="mt-3.5 px-0.5 pb-0.5">
              <div className="flex items-center gap-2 mb-1">
                <Search className="w-4 h-4 text-[#073B47] shrink-0" />
                <h3 className="font-jakarta font-bold text-[16px] text-[#073B47]">
                  Discover
                </h3>
              </div>
              <p className="font-jakarta text-[13px] text-[#5E7076] leading-relaxed">
                Shown alongside related topics and communities.
              </p>
            </div>
          </div>

          {/* Placement 3: Events */}
          <div className="rounded-[28px] bg-[#F7F9FA] border border-[#DCE5E8] p-4 flex flex-col justify-between">
            {/* Inner Ad Mockup Card */}
            <div className="rounded-[14px] bg-white border border-[#DCE5E8] overflow-hidden flex flex-col min-h-[275px] shadow-xs">
              {/* Event Photo - Clean without overlay badge */}
              <div className="relative w-full h-[157px] bg-gradient-to-br from-[#066879] to-[#E88924] overflow-hidden shrink-0">
                <Image
                  src="/business-advertise/placement-search-dog.png"
                  alt="Hydrotherapy Open Day"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Event Details */}
              <div className="p-2.5 flex flex-col gap-1 justify-between flex-1">
                <div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[#EEF8F9] border border-[#C4D7DC] text-[#073B47] font-extrabold text-[10.5px] w-fit mb-1">
                    <Tag className="w-2.5 h-2.5" />
                    Sponsored
                  </span>
                  <h4 className="font-jakarta font-bold text-[13.5px] text-[#102A32] leading-snug">
                    Hydrotherapy Open Day
                  </h4>
                  <p className="font-jakarta text-[11.5px] text-[#102A32] leading-tight mt-0.5">
                    Sat, Oct 10, 2026 · San Francisco
                  </p>
                </div>
                <p className="font-jakarta text-[11px] text-[#5E7076] leading-tight">
                  Promoted by Harbor Point Veterinary Clinic
                </p>
              </div>
            </div>

            {/* Figcaption at bottom inside column card */}
            <div className="mt-3.5 px-0.5 pb-0.5">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-[#073B47] shrink-0" />
                <h3 className="font-jakarta font-bold text-[16px] text-[#073B47]">
                  Events
                </h3>
              </div>
              <p className="font-jakarta text-[13px] text-[#5E7076] leading-relaxed">
                Promoted events, labeled and listed with organic ones.
              </p>
            </div>
          </div>
        </div>

        {/* Safeguard Notice Strip */}
        <div className="rounded-[12px] bg-white border border-[#DCE5E8] border-l-[3px] border-l-[#066879] p-3.5 sm:p-4 flex items-center gap-3 text-[13.5px] sm:text-[14px] text-[#102A32] shadow-2xs">
          <Ban className="w-4 h-4 text-[#066879] shrink-0" />
          <span className="font-medium">
            Ads never appear inside verified news articles, adoption listings, safety tools or private messages.
          </span>
        </div>
      </div>
    </section>
  );
}
