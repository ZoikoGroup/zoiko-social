"use client";

import React from "react";
import { MapPin, Clock, MoreHorizontal } from "lucide-react";

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

export default function LocalCommunitiesSection() {
  return (
    <section className="w-full bg-[#F7F9FA] py-8 md:py-12 text-[#0B2E2E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
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

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          {LOCAL_COMMUNITIES.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col justify-between shadow-xs transition-all hover:shadow-md"
            >
              <div>
                {/* Image Section */}
                <div className="relative w-full h-44 bg-[#F1F5F9] overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Badge */}
                  {card.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/90 text-[#0B2E2E] backdrop-blur-md">
                        {card.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
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

              {/* Action Buttons */}
              <div className="px-4 pb-4 pt-2 flex items-center gap-2">
                {card.joined ? (
                  <button
                    type="button"
                    className="flex-1 py-2 px-3 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155] text-xs font-semibold transition-all cursor-pointer text-center"
                  >
                    Joined
                  </button>
                ) : card.requestToJoin ? (
                  <button
                    type="button"
                    className="flex-1 py-2 px-3 rounded-lg border border-[#0B5C66] bg-white hover:bg-[#F0F7F7] text-[#0B5C66] text-xs font-semibold transition-all cursor-pointer text-center"
                  >
                    Request to Join
                  </button>
                ) : (
                  <button
                    type="button"
                    className="flex-1 py-2 px-3 rounded-lg bg-[#0B5C66] hover:bg-[#084850] text-white text-xs font-semibold transition-all cursor-pointer text-center"
                  >
                    Join
                  </button>
                )}

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
    </section>
  );
}
