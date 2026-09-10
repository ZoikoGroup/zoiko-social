"use client";

import React, { useState } from "react";
import { Search, Lock } from "lucide-react";

export default function DiscoverPeopleSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All People");

  const filterOptions = [
    "All People",
    "Animal Lovers",
    "Verified Professionals",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search action
    console.log("Searching for:", searchTerm, "Filter:", activeFilter);
  };

  return (
    <section className="flex flex-col items-center justify-center py-16 md:py-24 text-[#0F3838] bg-white">
      <div className="max-w-4xl w-full px-4 sm:px-6 flex flex-col items-center text-center">
        {/* Pill Label / Eyebrow */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#EEF8F9] border border-[#D5EBEB] text-xs font-semibold text-[#066879] mb-6">
          Discover people
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-[44px] font-bold text-[#073B47] tracking-tight leading-tight max-w-3xl mb-4">
          Meet animal lovers and trusted professionals.
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[#5B7171] leading-relaxed max-w-2xl mb-8 font-normal">
          Find people who share your animal interests, contribute to your
          communities, or provide verified animal-care expertise — with privacy,
          safety, and trust built in.
        </p>

        {/* Search Bar & Button Form */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-2xl flex flex-col sm:flex-row items-center gap-3 mb-6"
        >
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-4 flex items-center text-[#8C9E9E] pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search people, interests, specialties, or communities"
              className="w-full pl-11 pr-4 py-3.5 bg-white rounded-[14px] border border-[#D0DCDC] text-xs text-[#0B2E2E] placeholder-[#8C9E9E] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#0E5C5C]"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto shrink-0 px-8 py-3.5 rounded-2xl sm:rounded-xl bg-[#066879] hover:bg-[#084850] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {filterOptions.map((option) => {
            const isActive = activeFilter === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setActiveFilter(option)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#066879] text-white shadow-xs"
                    : "bg-white text-[#5B7171] border border-[#D0DCDC] hover:border-[#8C9E9E] hover:text-[#0B2E2E]"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Privacy Note with Lock Icon */}
        <div className="flex items-start sm:items-center justify-center gap-2 text-[11px] text-[#7C8E8E] max-w-xl text-left sm:text-center leading-relaxed">
          <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 sm:mt-0 text-[#7C8E8E]" />
          <span>
            Suggestions use public or permissioned profile signals. Precise
            location, private communities, and private contact details are never
            exposed through discovery.
          </span>
        </div>
      </div>
    </section>
  );
}
