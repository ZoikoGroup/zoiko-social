"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "./images";
import { C } from "./theme";

export default function HeroSearchSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Any Location");
  const [animalType, setAnimalType] = useState("All Animals");

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Background Banner with Gradient Overlay */}
      <div className="relative min-h-[477px] w-full flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <Image
          src={IMAGES.heroBanner}
          alt="Adopt and Foster Animals"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Figma linear gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6, 104, 121, 0.72) 0%, rgba(6, 104, 121, 0.88) 100%)",
          }}
        />

        {/* Content Container (max-w-[900px]) */}
        <div className="relative z-10 mx-auto flex w-full max-w-[900px] flex-col items-center text-center">
          {/* Eyebrow */}
          <span className="inline-block text-xs font-bold uppercase tracking-[0.5px] text-white">
            Adopt & Foster
          </span>

          {/* Heading 1 */}
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.02em] text-white sm:text-4xl lg:text-[44px] lg:leading-[52.8px]">
            Find your perfect companion
          </h1>

          {/* Subtitle */}
          <p className="mt-3.5 max-w-[760px] text-base font-normal leading-relaxed text-white/95 sm:text-lg sm:leading-[29.7px]">
            Browse adoptable animals from trusted shelters and rescues. Or open your home to foster an animal in need.
          </p>

          {/* Search Card */}
          <div className="mt-8 w-full rounded-[20px] bg-white p-2.5 sm:p-2 shadow-[0_12px_36px_rgba(0,0,0,0.18)]">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              {/* Text Input */}
              <div className="flex flex-1 items-center gap-2.5 px-3 py-2 text-left">
                <svg
                  className="h-4 w-4 shrink-0 text-[#5E7076]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by animal name, breed, or type..."
                  className="w-full text-sm text-[#102A32] placeholder-[#5E7076] outline-none"
                />
              </div>

              {/* Location Dropdown */}
              <div className="relative w-full shrink-0 border-t border-[#DCE5E8] pt-2 md:w-auto md:border-t-0 md:border-l md:pt-0 md:pl-2">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full cursor-pointer rounded-full bg-[#F7F9FA] px-4 py-2.5 text-xs font-semibold text-[#102A32] outline-none transition hover:bg-[#EEF8F9] md:w-auto"
                >
                  <option value="Any Location">Any Location</option>
                  <option value="Chicago, IL">Chicago, IL</option>
                  <option value="Boston, MA">Boston, MA</option>
                  <option value="Denver, CO">Denver, CO</option>
                  <option value="Seattle, WA">Seattle, WA</option>
                  <option value="Austin, TX">Austin, TX</option>
                  <option value="Portland, OR">Portland, OR</option>
                  <option value="San Diego, CA">San Diego, CA</option>
                </select>
              </div>

              {/* Animal Type Dropdown */}
              <div className="relative w-full shrink-0 md:w-auto md:border-l md:border-[#DCE5E8] md:pl-2">
                <select
                  value={animalType}
                  onChange={(e) => setAnimalType(e.target.value)}
                  className="w-full cursor-pointer rounded-full bg-[#F7F9FA] px-4 py-2.5 text-xs font-semibold text-[#102A32] outline-none transition hover:bg-[#EEF8F9] md:w-auto"
                >
                  <option value="All Animals">All Animals</option>
                  <option value="Dogs">Dogs</option>
                  <option value="Cats">Cats</option>
                  <option value="Small Animals">Small Animals</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                type="button"
                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-[16px] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105 active:scale-[0.98] md:w-auto"
                style={{ backgroundColor: C.zest }}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Quick Action Pill Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
            <a
              href="#adoptable-animals"
              className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-[13.3px] font-bold shadow-sm transition hover:bg-white/90 active:scale-95"
              style={{ color: C.mosque }}
            >
              Find to Adopt
            </a>
            <a
              href="#shelter-spotlight"
              className="inline-flex items-center justify-center rounded-full border border-white/60 bg-white/10 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-[13.3px] font-bold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
            >
              Become a Foster
            </a>
            <a
              href="#how-adoption-works"
              className="inline-flex items-center justify-center rounded-full border border-white/60 bg-white/10 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-[13.3px] font-bold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
