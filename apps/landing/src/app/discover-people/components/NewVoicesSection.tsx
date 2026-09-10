"use client";

import React, { useState } from "react";
import UserProfileModal from "@/components/UserProfileModal";

interface NewVoice {
  id: string;
  name: string;
  username?: string;
  roleTitle: string;
  pillLabel: string;
  bio: string;
  tags: string[];
  bgImage: string;
  avatarImage: string;
  // Extended metadata for modal display
  specialty?: string;
  serviceArea?: string;
  organization?: string;
  broadRegion?: string;
}

const NEW_VOICES_DATA: NewVoice[] = [
  {
    id: "1",
    name: "Tomas Reyes",
    username: "@tomasreyes",
    roleTitle: "Animal Lover",
    pillLabel: "New member",
    bio: "Just adopted his first puppy and is learning the ropes from the community.",
    tags: ["Dogs", "First-time owner"],
    bgImage: "/people/bg21.png",
    avatarImage: "/people/pf21.png",
    specialty: "Puppy Care & Training Basics",
    serviceArea: "San Diego Metro",
    organization: "New Pet Parent Network",
    broadRegion:
      "San Diego, California (broad area) — broad area only, never a precise location.",
  },
  {
    id: "2",
    name: "Aisha Bello",
    username: "@aishabello",
    roleTitle: "Animal Lover",
    pillLabel: "New member",
    bio: "New to the platform and looking for cat-community recommendations.",
    tags: ["Cats", "Apartment living"],
    bgImage: "/people/bg22.png",
    avatarImage: "/people/pf22.png",
    specialty: "Feline Enrichment & Small Space Care",
    serviceArea: "Chicago Area",
    organization: "Urban Cat Enthusiasts",
    broadRegion:
      "Chicago, Illinois (broad area) — broad area only, never a precise location.",
  },
  {
    id: "3",
    name: "Kenji Ishikawa",
    username: "@kenji_aquatics",
    roleTitle: "Animal Lover",
    pillLabel: "New member",
    bio: "Setting up his first planted tank and documenting the process.",
    tags: ["Aquariums", "Freshwater fish"],
    bgImage: "/people/bg23.png",
    avatarImage: "/people/pf23.png",
    specialty: "Aquascaping & Ecosystem Balance",
    serviceArea: "Seattle Metropolitan",
    organization: "Pacific Aquascaping Club",
    broadRegion:
      "Seattle, Washington (broad area) — broad area only, never a precise location.",
  },
  {
    id: "4",
    name: "Ruth Alcantara",
    username: "@ruth_fosters",
    roleTitle: "Animal Lover",
    pillLabel: "New member",
    bio: "Recently started fostering and is looking to connect with experienced fosters.",
    tags: ["Rescue & foster"],
    bgImage: "/people/bg24.png",
    avatarImage: "/people/pf24.png",
    specialty: "Animal Rescue & Foster Support",
    serviceArea: "Miami-Dade Area",
    organization: "Sunshine State Rescue Allies",
    broadRegion:
      "Miami, Florida (broad area) — broad area only, never a precise location.",
  },
];

export default function NewVoicesSection() {
  const [selectedPerson, setSelectedPerson] = useState<NewVoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (person: NewVoice) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPerson(null);
  };

  return (
    <section className="flex flex-col items-center justify-center py-12 md:py-16 text-[#0F3838] bg-white">
      <div className="max-w-6xl w-full px-2 sm:px-4">
        {/* Section Header */}
        <div className="flex flex-col items-start text-left mb-6 px-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2E2E] tracking-tight mb-1">
            New voices
          </h2>
          <p className="text-xs sm:text-sm text-[#5B7171] leading-relaxed font-normal max-w-3xl">
            Newer members who&apos;ve passed our quality and safety checks — so
            visibility isn&apos;t only for the already-popular.
          </p>
        </div>

        {/* 4-Column Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {NEW_VOICES_DATA.map((person) => (
            <div
              key={person.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col justify-between shadow-xs transition-all hover:shadow-md"
            >
              {/* Card Header & Content */}
              <div>
                {/* Banner & Full Circular Avatar */}
                <div className="relative w-full h-28 bg-[#F1F5F9]">
                  <img
                    src={person.bgImage}
                    alt={`${person.name} background`}
                    className="w-full h-full object-cover"
                  />

                  {/* Full Circular Avatar */}
                  <div className="absolute -bottom-5 left-4 w-11 h-11 rounded-full border-2 border-white overflow-hidden bg-white shadow-xs z-10 shrink-0">
                    <img
                      src={person.avatarImage}
                      alt={person.name}
                      className="w-full h-full object-cover rounded-full"
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

                  {/* New Member Pill */}
                  <div className="inline-block px-2.5 py-1 rounded-md text-[11px] font-medium mb-3 bg-[#EBF5F5] text-[#0B5C66]">
                    {person.pillLabel}
                  </div>

                  {/* Bio Description */}
                  <p className="text-xs text-[#475569] leading-relaxed mb-3 font-normal min-h-[48px]">
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
            username: selectedPerson.username || "@new_voice",
            verifiedRole: selectedPerson.roleTitle,
            roleTitle: selectedPerson.roleTitle,
            whyReason: selectedPerson.pillLabel,
            about: selectedPerson.bio,
            publicInterests: selectedPerson.tags,
            specialty: selectedPerson.specialty || "Community Enthusiast",
            serviceArea: selectedPerson.serviceArea || "Local Area",
            organization: selectedPerson.organization || "Community Member",
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
