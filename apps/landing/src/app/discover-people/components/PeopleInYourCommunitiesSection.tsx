"use client";

import React, { useState } from "react";
import Image from "next/image";
import UserProfileModal from "@/components/UserProfileModal";

interface CommunityPerson {
  id: string;
  name: string;
  username?: string;
  roleTitle: string;
  pillLabel: string;
  bio: string;
  tags: string[];
  bgImage: string;
  avatarImage: string;
  // Extended profile metadata for modal display
  specialty?: string;
  serviceArea?: string;
  organization?: string;
  broadRegion?: string;
}

const COMMUNITIES_DATA: CommunityPerson[] = [
  {
    id: "1",
    name: "Layla Haddad",
    username: "@laylahaddad",
    roleTitle: "Animal Lover",
    pillLabel: "Shares 4 communities",
    bio: "Coordinates weekend adoption events for a regional shelter network.",
    tags: ["Shelter volunteering", "Foster coordination"],
    bgImage: "/people/bg18.png",
    avatarImage: "/people/pf18.png",
    specialty: "Shelter Operations & Event Logistics",
    serviceArea: "Greater Philadelphia Area",
    organization: "Tri-State Rescue Network",
    broadRegion:
      "Philadelphia, Pennsylvania (broad area) — broad area only, never a precise location.",
  },
  {
    id: "2",
    name: "Ben Okoro",
    username: "@benokoro",
    roleTitle: "Animal Lover",
    pillLabel: "Shares 2 communities",
    bio: "Maps dog-friendly cafes and parks around the city for the community wiki.",
    tags: ["Urban dog walking", "Dog-friendly spaces"],
    bgImage: "/people/bg19.png",
    avatarImage: "/people/pf19.png",
    specialty: "Urban Canopy & Canine Accessibility",
    serviceArea: "Toronto Metropolitan",
    organization: "City Dog Parks Initiative",
    broadRegion:
      "Toronto, Ontario (broad area) — broad area only, never a precise location.",
  },
  {
    id: "3",
    name: "Sofia Marchetti",
    username: "@sofia_birds",
    roleTitle: "Animal Lover",
    pillLabel: "Shares 3 communities",
    bio: "Leads monthly birdwatching walks for the local conservation group.",
    tags: ["Birdwatching", "Habitat conservation"],
    bgImage: "/people/bg20.png",
    avatarImage: "/people/pf20.png",
    specialty: "Avian Habitat Conservation & Field Guides",
    serviceArea: "Pacific Northwest Coastal Region",
    organization: "Coastal Bird Society",
    broadRegion:
      "Vancouver, British Columbia (broad area) — broad area only, never a precise location.",
  },
];

export default function PeopleInYourCommunitiesSection() {
  const [selectedPerson, setSelectedPerson] = useState<CommunityPerson | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (person: CommunityPerson) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPerson(null);
  };

  return (
    <section className="flex flex-col items-center justify-center py-12 md:py-16 text-[#0F3838] bg-[#F7F9FA]">
      <div className="max-w-6xl w-full px-2 sm:px-4">
        {/* Section Header */}
        <div className="flex flex-col items-start text-left mb-6 px-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2E2E] tracking-tight mb-1">
            People in your communities
          </h2>
          <p className="text-xs sm:text-sm text-[#5B7171] leading-relaxed font-normal">
            Shown only when a shared community is visible to you.
          </p>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {COMMUNITIES_DATA.map((person) => (
            <div
              key={person.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col justify-between shadow-xs transition-all hover:shadow-md"
            >
              {/* Card Header & Content */}
              <div>
                {/* Banner & Full Circular Avatar */}
                <div className="relative w-full h-28 bg-[#F1F5F9]">
                  <Image
                    src={person.bgImage}
                    alt={`${person.name} background`}
                    fill
                    className="object-cover"
                  />

                  {/* Full Circular Avatar */}
                  <div className="absolute -bottom-5 left-4 w-11 h-11 rounded-full border-2 border-white overflow-hidden bg-white shadow-xs z-10 shrink-0">
                    <Image
                      src={person.avatarImage}
                      alt={person.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                </div>

                {/* Body Content */}
                <div className="pt-7 px-4 pb-4 flex flex-col items-start text-left">
                  {/* Name */}
                  <h3 className="text-sm font-bold text-[#0B2E2E] mb-0.5">
                    {person.name}
                  </h3>

                  {/* Role Title */}
                  <p className="text-xs text-[#64748B] mb-2 font-normal">
                    {person.roleTitle}
                  </p>

                  {/* Cyan Shares Community Pill */}
                  <div className="inline-block px-2.5 py-1 rounded-md text-[11px] font-medium mb-3 bg-[#E0F2FE] text-[#0369A1]">
                    {person.pillLabel}
                  </div>

                  {/* Bio Description */}
                  <p className="text-xs text-[#475569] leading-relaxed mb-3 font-normal min-h-[40px]">
                    {person.bio}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 w-full">
                    {person.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-medium text-[#64748B]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="px-4 pb-4 pt-2 border-t border-[#F1F5F9] flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(person)}
                    className="w-full py-1.5 px-2 rounded-lg bg-[#0B5C66] hover:bg-[#084850] text-white text-xs font-semibold transition-all cursor-pointer text-center"
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    className="w-full py-1.5 px-2 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#334155] text-xs font-semibold transition-all cursor-pointer text-center"
                  >
                    Follow
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(person)}
                    className="hover:underline cursor-pointer hover:text-[#64748B]"
                  >
                    Why this person?
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="hover:underline cursor-pointer hover:text-[#64748B]"
                    >
                      Hide
                    </button>
                    <button
                      type="button"
                      className="hover:underline cursor-pointer hover:text-[#64748B]"
                    >
                      Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Profile Modal Integration */}
      {selectedPerson && (
        <UserProfileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          profile={{
            name: selectedPerson.name,
            username: selectedPerson.username || "@community_member",
            verifiedRole: selectedPerson.roleTitle,
            roleTitle: selectedPerson.roleTitle,
            whyReason: selectedPerson.pillLabel,
            about: selectedPerson.bio,
            publicInterests: selectedPerson.tags,
            specialty: selectedPerson.specialty || "Community Leadership",
            serviceArea: selectedPerson.serviceArea || "Metropolitan Region",
            organization: selectedPerson.organization || "Local Community",
            broadRegion:
              selectedPerson.broadRegion ||
              "Broad area only, never a precise location.",
            bgImage: selectedPerson.bgImage,
            avatarImage: selectedPerson.avatarImage,
          }}
        />
      )}
    </section>
  );
}
