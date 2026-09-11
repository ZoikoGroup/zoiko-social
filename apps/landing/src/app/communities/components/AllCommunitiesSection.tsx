"use client";

import React from "react";
import Image from "next/image";
import {
  MapPin,
  Clock,
  MoreHorizontal,
  SlidersHorizontal,
  Check,
} from "lucide-react";

interface LocalCommunityCard {
  id: string;
  title: string;
  description: string;
  meta: string;
  location: string;
  activityText: string;
  image: string;
  badge?: string;
  joined?: boolean;
  requestToJoin?: boolean;
}

interface CommunityCard {
  id: string;
  title: string;
  description: string;
  meta: string;
  location?: string;
  activityText?: string;
  image: string;
  badges?: string[];
  actionType:
    "join" | "joined" | "pending" | "request" | "details" | "unavailable";
}

const LOCAL_COMMUNITIES: LocalCommunityCard[] = [
  {
    id: "1",
    title: "UK Animal Rescue Volunteers",
    description:
      "Coordinating local volunteer efforts for rescues across the UK.",
    meta: "Events & Local Coordination",
    location: "United Kingdom",
    activityText: "Active this week",
    image: "/communities/c17.png",
  },
  {
    id: "2",
    title: "Meadowbrook Equine Sanctuary Support",
    description:
      "Supporting rescued and retired horses at Meadowbrook Sanctuary.",
    meta: "Horses · Rescue & Foster",
    location: "Yorkshire, UK area",
    activityText: "Active this week",
    image: "/communities/c18.png",
    badge: "Organization-led",
    requestToJoin: true,
  },
  {
    id: "3",
    title: "London Cat Rescue Coalition",
    description: "Coordinating rescue, foster, and adoption across London.",
    meta: "Cats · Rescue & Foster",
    location: "London, UK area",
    activityText: "Active this week",
    image: "/communities/c19.png",
    badge: "Verified Community",
    requestToJoin: true,
  },
];

const ALL_COMMUNITIES: CommunityCard[] = [
  {
    id: "1",
    title: "Exotic Bird Keepers Network",
    description: "Expert advice and support for parrot and exotic bird owners.",
    meta: "Birds · Care & Education",
    location: "London area",
    activityText: "Active today",
    image: "/communities/c20.png",
    badges: ["Verified Community"],
    actionType: "join",
  },
  {
    id: "2",
    title: "Senior Dog Sanctuary Network",
    description: "Dedicated to the care and rehoming of senior dogs.",
    meta: "Dogs · Rescue & Foster",
    activityText: "Established",
    image: "/communities/c21.png",
    badges: ["Organization-led"],
    actionType: "pending",
  },
  {
    id: "3",
    title: "Reptile & Exotic Pet Care",
    description:
      "Care guidance and community for reptile and exotic pet owners.",
    meta: "Reptiles · Care & Education",
    activityText: "Active this week",
    image: "/communities/c22.png",
    badges: ["Verified Community", "Organization-led"],
    actionType: "join",
  },
  {
    id: "4",
    title: "Pet Loss & Grief Support Circle",
    description:
      "A gentle space to remember companions and support one another through loss.",
    meta: "Memorial & Support",
    activityText: "Active this week",
    image: "/communities/c23.png",
    actionType: "join",
  },
  {
    id: "5",
    title: "Positive Training & Nutrition Circle",
    description:
      "Evidence-based training methods and nutrition guidance for dogs and cats.",
    meta: "Dogs, Cats · Training & Nutrition",
    activityText: "New",
    image: "/communities/c24.png",
    actionType: "join",
  },
  {
    id: "6",
    title: "Golden Retriever Guardians",
    description:
      "A global community dedicated to Golden Retriever care and adoption.",
    meta: "Dogs · Species Community",
    location: "Sacramento, CA area",
    activityText: "Active today",
    image: "/communities/c25.png",
    badges: ["Verified Community"],
    actionType: "joined",
  },
  {
    id: "7",
    title: "Verified Vets Network",
    description:
      "A professional space for licensed veterinarians to share knowledge and cases.",
    meta: "Professional · Care & Education",
    activityText: "Active today",
    image: "/communities/c26.png",
    badges: ["Verified Community", "Professional-led"],
    actionType: "details",
  },
  {
    id: "8",
    title: "Meadowbrook Equine Sanctuary Support",
    description:
      "Supporting rescued and retired horses at Meadowbrook Sanctuary.",
    meta: "Horses · Rescue & Foster",
    location: "Yorkshire, UK area",
    activityText: "Active this week",
    image: "/communities/c27.png",
    badges: ["Organization-led"],
    actionType: "request",
  },
  {
    id: "9",
    title: "Regional Wildlife Trade Response Network",
    description: "This community isn't currently available in your region.",
    meta: "Wildlife Conservation",
    image: "/communities/c28.png",
    actionType: "unavailable",
  },
];

export default function LocalAndAllCommunitiesSection() {
  const renderActionButton = (card: CommunityCard) => {
    switch (card.actionType) {
      case "join":
        return (
          <button
            type="button"
            className="flex-1 py-1.5 px-3 rounded-lg bg-[#0B5C66] hover:bg-[#084850] text-white text-xs font-semibold transition-all cursor-pointer text-center"
          >
            Join
          </button>
        );
      case "joined":
        return (
          <button
            type="button"
            className="flex-1 py-1.5 px-3 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155] text-xs font-semibold transition-all cursor-pointer text-center"
          >
            Joined
          </button>
        );
      case "pending":
        return (
          <button
            type="button"
            disabled
            className="flex-1 py-1.5 px-3 rounded-lg bg-[#FFF7ED] text-[#C2410C] text-xs font-semibold transition-all cursor-default text-center border border-[#FFEDD5]"
          >
            Request pending
          </button>
        );
      case "request":
        return (
          <button
            type="button"
            className="flex-1 py-1.5 px-3 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0B2E2E] text-xs font-semibold transition-all cursor-pointer text-center"
          >
            Request to Join
          </button>
        );
      case "details":
        return (
          <button
            type="button"
            className="flex-1 py-1.5 px-3 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0B2E2E] text-xs font-semibold transition-all cursor-pointer text-center"
          >
            View details
          </button>
        );
      case "unavailable":
        return (
          <button
            type="button"
            disabled
            className="flex-1 py-1.5 px-3 rounded-lg bg-[#F1F5F9] text-[#94A3B8] text-xs font-semibold transition-all cursor-not-allowed text-center"
          >
            Unavailable
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <section className="w-full bg-[#F7F9FA] py-8 md:py-12 text-[#0B2E2E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-12">
        {/* --- LOCAL COMMUNITIES SECTION --- */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B2E2E] tracking-tight mb-4 text-left">
            Local Communities
          </h2>

          {/* Region Banner */}
          <div className="w-full bg-[#EDF5F5] rounded-xl px-4 py-3 flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#334155]">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5 text-[#0B5C66]" />
              </div>
              <span>
                Showing communities near{" "}
                <strong className="font-bold text-[#0B2E2E]">
                  United Kingdom
                </strong>
              </span>
            </div>

            <button
              type="button"
              className="px-3 py-1.5 rounded-lg bg-white text-xs font-semibold text-[#0B2E2E] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-all shrink-0"
            >
              Change region
            </button>
          </div>

          {/* 3-Column Local Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
            {LOCAL_COMMUNITIES.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col justify-between shadow-xs transition-all hover:shadow-md"
              >
                <div>
                  <div className="relative w-full h-44 bg-[#F1F5F9] overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    {card.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/90 text-[#0B2E2E] backdrop-blur-md">
                          {card.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col items-start text-left">
                    <h3 className="text-sm font-bold text-[#0B2E2E] leading-tight mb-1">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#475569] leading-relaxed font-normal mb-3 min-h-[36px]">
                      {card.description}
                    </p>

                    <div className="text-[11px] text-[#64748B] mb-2 font-medium">
                      {card.meta} · {card.location}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#0B5C66]">
                      <Clock className="w-3 h-3 text-[#0B5C66]" />
                      <span>{card.activityText}</span>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                      card.joined
                        ? "border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155]"
                        : card.requestToJoin
                          ? "border border-[#0B5C66] bg-white hover:bg-[#F0F7F7] text-[#0B5C66]"
                          : "bg-[#0B5C66] hover:bg-[#084850] text-white"
                    }`}
                  >
                    {card.joined
                      ? "Joined"
                      : card.requestToJoin
                        ? "Request to Join"
                        : "Join"}
                  </button>

                  <button
                    type="button"
                    className="w-9 h-9 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B] cursor-pointer transition-all shrink-0"
                    aria-label="More options"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- ALL COMMUNITIES SECTION --- */}
        <div>
          {/* Header & Filter */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B2E2E] tracking-tight">
                All Communities
              </h2>
              <span className="text-xs text-[#64748B] font-medium self-end mb-0.5">
                — 214 results
              </span>
            </div>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-xs font-semibold text-[#334155] cursor-pointer transition-all shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Filters</span>
            </button>
          </div>

          {/* 3x3 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full mb-10">
            {ALL_COMMUNITIES.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col justify-between shadow-xs transition-all hover:shadow-md"
              >
                <div>
                  <div className="relative w-full h-40 bg-[#F1F5F9] overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />

                    {card.badges && card.badges.length > 0 && (
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[85%] z-10">
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
                    )}
                  </div>

                  <div className="p-4 flex flex-col items-start text-left">
                    <h3 className="text-sm font-bold text-[#0B2E2E] leading-snug mb-1">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#475569] leading-relaxed font-normal mb-3 min-h-[36px]">
                      {card.description}
                    </p>

                    <div className="text-[11px] text-[#64748B] mb-2 font-medium">
                      {card.meta}
                      {card.location && ` · ${card.location}`}
                    </div>

                    {card.activityText && (
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#0B5C66]">
                        <Clock className="w-3 h-3 text-[#0B5C66]" />
                        <span>{card.activityText}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 flex items-center gap-2 border-t border-[#F1F5F9]">
                  {renderActionButton(card)}

                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B] cursor-pointer transition-all shrink-0"
                    aria-label="More options"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* End of List Banner */}
          <div className="w-full rounded-2xl py-8 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center mb-3 shadow-xs">
              <Check className="w-4 h-4 text-[#0B5C66]" />
            </div>
            <h4 className="text-sm font-bold text-[#0B2E2E] mb-1">
              You&apos;ve seen all matching communities
            </h4>
            <p className="text-xs text-[#64748B] max-w-md">
              Try broadening your filters, exploring a different species or
              purpose, or changing your region.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
