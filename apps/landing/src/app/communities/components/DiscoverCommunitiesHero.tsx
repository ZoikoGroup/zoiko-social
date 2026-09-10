"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

export default function DiscoverCommunitiesHero() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search action here
    console.log("Searching for:", searchQuery);
  };

  return (
    <section className="w-full bg-[#F7F9FA] py-16 md:py-24 px-4 flex flex-col items-center justify-center text-center">
      <div className="max-w-4xl w-full flex flex-col items-center">
        {/* Eyebrow Label */}
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#0B5C66] mb-3">
          Discover Communities
        </span>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B2E2E] tracking-tight leading-tight mb-4">
          Find communities built around animals, purpose, and place.
        </h1>

        {/* Subtitle / Description */}
        <p className="text-sm sm:text-base text-[#5B7171] max-w-2xl font-normal leading-relaxed mb-8">
          Explore animal-centered communities for species, rescue, local care,
          professional knowledge, training, support, and conservation.
        </p>

        {/* Search Bar Input */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-xl relative mb-6"
        >
          <div className="relative flex items-center w-full">
            <Search className="absolute left-4 w-5 h-5 text-[#94A3B8] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search communities, species, causes, or places"
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#E2E8F0] rounded-full text-sm text-[#0B2E2E] placeholder-[#94A3B8] shadow-xs focus:outline-none focus:border-[#0B5C66] focus:ring-1 focus:ring-[#0B5C66] transition-all"
            />
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-8">
          <button
            type="button"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B5C66] hover:bg-[#084850] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs"
          >
            Browse all communities
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0B2E2E] text-sm font-semibold transition-all cursor-pointer shadow-xs"
          >
            Create a Community
          </button>
        </div>

        {/* Governance / Safety Note */}
        <p className="text-[11px] sm:text-xs text-[#94A3B8] font-normal max-w-lg leading-normal">
          Community discovery is governed by moderation, privacy, and
          animal-welfare safeguards.
        </p>
      </div>
    </section>
  );
}
