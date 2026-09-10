"use client";

import React, { useState } from "react";
import { Bookmark, MoreHorizontal, Clock } from "lucide-react";

interface CommunityCard {
  id: string;
  title: string;
  description: string;
  meta: string;
  location?: string;
  activityText: string;
  reasonPill: string;
  image: string;
  badges: string[];
  joined?: boolean;
  requestToJoin?: boolean;
  category: string;
}

const CATEGORIES = [
  "All",
  "Rescue & Foster",
  "Professional",
  "Training & Nutrition",
  "Memorial & Support",
  "Wildlife Conservation",
  "Care & Education",
  "Events & Local Coordination",
];

const RECOMMENDED_COMMUNITIES: CommunityCard[] = [
  {
    id: "1",
    title: "Golden Retriever Guardians",
    description:
      "A global community dedicated to Golden Retriever care and adoption.",
    meta: "Dogs · Species Community",
    location: "Sacramento, CA area",
    activityText: "Active today",
    reasonPill: "Because you follow Golden Retrievers",
    image: "/communities/c1.png",
    badges: ["Verified Community"],
    joined: true,
    category: "Care & Education",
  },
  {
    id: "2",
    title: "London Cat Rescue Coalition",
    description: "Coordinating rescue, foster, and adoption across London.",
    meta: "Cats · Rescue & Foster",
    location: "London, UK area",
    activityText: "Active this week",
    reasonPill: "Related to rescue communities you joined",
    image: "/communities/c2.png",
    badges: ["Verified Community", "Organization-led"],
    requestToJoin: true,
    category: "Rescue & Foster",
  },
  {
    id: "3",
    title: "Wildlife Photographers United",
    description:
      "A community for ethical wildlife photography and conservation storytelling.",
    meta: "Wildlife · Wildlife Conservation",
    activityText: "Active this week",
    reasonPill: "Popular in your selected region",
    image: "/communities/c3.png",
    badges: ["Verified Community"],
    joined: false,
    category: "Wildlife Conservation",
  },
  {
    id: "4",
    title: "Verified Vets Network",
    description:
      "A professional space for licensed veterinarians to share knowledge and cases.",
    meta: "Professional · Care & Education",
    activityText: "Active today",
    reasonPill: "Because you follow verified professionals",
    image: "/communities/c4.png",
    badges: ["Verified Community", "Professional-led"],
    requestToJoin: true,
    category: "Professional",
  },
];

export default function RecommendedCommunitiesSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCommunities =
    activeCategory === "All"
      ? RECOMMENDED_COMMUNITIES
      : RECOMMENDED_COMMUNITIES.filter(
          (c) => c.category === activeCategory
        );

  return (
    <section className="w-full bg-[#F7F9FA] py-10 md:py-14 text-[#0B2E2E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 scroll-smooth">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? "bg-[#0B5C66] text-white border-[#0B5C66]"
                    : "bg-white text-[#475569] border-[#E2E8F0] hover:bg-[#F1F5F9]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Section Header */}
        <div className="flex flex-col items-start text-left mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B2E2E] tracking-tight mb-1">
            Recommended for You
          </h2>
          <p className="text-xs sm:text-sm text-[#5B7171] font-normal">
            Governed by your follows, interests, and joined communities.
          </p>
        </div>

        {/* 4-Column Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {filteredCommunities.map((card) => {
            const isBookmarked = !!bookmarkedIds[card.id];

            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col justify-between shadow-xs transition-all hover:shadow-md"
              >
                {/* Header Image & Badges Overlay */}
                <div>
                  <div className="relative w-full h-36 bg-[#F1F5F9] overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Top Left Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 max-w-[80%] z-10">
                      {card.badges.map((badge) => (
                        <span
                          key={badge}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md ${
                            badge === "Verified Community"
                              ? "bg-white/90 text-[#0B2E2E]"
                              : "bg-[#0F172A]/80 text-white"
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    {/* Top Right Bookmark Icon */}
                    <button
                      type="button"
                      onClick={() => toggleBookmark(card.id)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center text-[#475569] shadow-xs cursor-pointer transition-all z-10"
                      aria-label="Save community"
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 ${
                          isBookmarked ? "fill-[#0B5C66] text-[#0B5C66]" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex flex-col items-start text-left">
                    {/* Title */}
                    <h3 className="text-sm font-bold text-[#0B2E2E] leading-snug mb-1">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#475569] leading-relaxed font-normal mb-3 min-h-[36px]">
                      {card.description}
                    </p>

                    {/* Tags / Metadata */}
                    <div className="text-[11px] text-[#64748B] mb-2 font-medium">
                      {card.meta}
                      {card.location && (
                        <span className="block text-[#64748B]">
                          {card.location}
                        </span>
                      )}
                    </div>

                    {/* Activity Indicator */}
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#0B5C66] mb-3">
                      <Clock className="w-3 h-3 text-[#0B5C66]" />
                      <span>{card.activityText}</span>
                    </div>

                    {/* Recommendation Reason Pill */}
                    <div className="inline-block px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#EBF5F5] text-[#0B5C66]">
                      {card.reasonPill}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-4 pb-4 pt-2 flex items-center gap-2 border-t border-[#F1F5F9]">
                  {card.joined ? (
                    <button
                      type="button"
                      className="flex-1 py-1.5 px-3 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155] text-xs font-semibold transition-all cursor-pointer text-center"
                    >
                      Joined
                    </button>
                  ) : card.requestToJoin ? (
                    <button
                      type="button"
                      className="flex-1 py-1.5 px-3 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0B2E2E] text-xs font-semibold transition-all cursor-pointer text-center"
                    >
                      Request to Join
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="flex-1 py-1.5 px-3 rounded-lg bg-[#0B5C66] hover:bg-[#084850] text-white text-xs font-semibold transition-all cursor-pointer text-center"
                    >
                      Join
                    </button>
                  )}

                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B] cursor-pointer transition-all shrink-0"
                    aria-label="More options"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}