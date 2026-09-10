"use client";

import React, { useState } from "react";
import UserProfileModal from "@/components/UserProfileModal";

interface Person {
  id: string;
  name: string;
  username?: string;
  roleTitle: string;
  pillLabel: string;
  pillVariant: "blue" | "cyan";
  bio: string;
  tags: string[];
  bgImage: string;
  avatarImage: string;
  // Extended fields for the profile modal
  specialty?: string;
  serviceArea?: string;
  organization?: string;
  broadRegion?: string;
}

const ANIMAL_LOVERS_DATA: Person[] = [
  {
    id: "1",
    name: "Nadia Farouk",
    username: "@nadiafarouk",
    roleTitle: "Animal Lover",
    pillLabel: "Interested in dogs",
    pillVariant: "blue",
    bio: "Competes in amateur agility with her two border collies most summers.",
    tags: ["Dogs", "Agility"],
    bgImage: "/people/bg9.png",
    avatarImage: "/people/pf9.png",
    specialty: "Canine Agility & Sports",
    serviceArea: "Denver Metro",
    organization: "Mile High Agility Club",
    broadRegion:
      "Denver, Colorado (broad area) — broad area only, never a precise location.",
  },
  {
    id: "2",
    name: "Owen Blackwood",
    username: "@owenherps",
    roleTitle: "Animal Lover",
    pillLabel: "Interested in reptiles",
    pillVariant: "blue",
    bio: "Builds bioactive enclosures and shares husbandry guides for beginners.",
    tags: ["Reptiles", "Habitat design"],
    bgImage: "/people/bg10.png",
    avatarImage: "/people/pf10.png",
    specialty: "Bioactive Enclosures & Herpetology",
    serviceArea: "Phoenix Metro",
    organization: "Southwest Herp Society",
    broadRegion:
      "Phoenix, Arizona (broad area) — broad area only, never a precise location.",
  },
  {
    id: "3",
    name: "Ines Dubois",
    username: "@ineshomestead",
    roleTitle: "Animal Lover",
    pillLabel: "Shares 1 community",
    pillVariant: "cyan",
    bio: "Keeps a small backyard flock and writes about urban homesteading.",
    tags: ["Backyard poultry", "Farm animals"],
    bgImage: "/people/bg11.png",
    avatarImage: "/people/pf11.png",
    specialty: "Urban Aviculture & Homesteading",
    serviceArea: "Portland Area",
    organization: "Pacific Homesteaders",
    broadRegion:
      "Portland, Oregon (broad area) — broad area only, never a precise location.",
  },
  {
    id: "4",
    name: "Marcus Webb",
    username: "@marcuspaws",
    roleTitle: "Animal Lover",
    pillLabel: "Interested in senior pets",
    pillVariant: "blue",
    bio: "Adopted three senior dogs in a row and writes about end-of-life pet care.",
    tags: ["Senior dogs", "Hospice care"],
    bgImage: "/people/bg12.png",
    avatarImage: "/people/pf12.png",
    specialty: "Senior Dog Care & Palliative Support",
    serviceArea: "Minneapolis Twin Cities",
    organization: "Golden Years Sanctuary",
    broadRegion:
      "Minneapolis, Minnesota (broad area) — broad area only, never a precise location.",
  },
  {
    id: "5",
    name: "Chloe Bennett",
    username: "@chloebunnies",
    roleTitle: "Animal Lover",
    pillLabel: "Interested in small mammals",
    pillVariant: "blue",
    bio: "Runs a small rabbit-proofing consultancy for new bunny owners.",
    tags: ["Rabbits", "Small mammals"],
    bgImage: "/people/bg13.png",
    avatarImage: "/people/pf13.png",
    specialty: "Lagomorph Care & Habitat Proofing",
    serviceArea: "San Diego County",
    organization: "House Rabbit Haven",
    broadRegion:
      "San Diego, California (broad area) — broad area only, never a precise location.",
  },
  {
    id: "6",
    name: "Diego Fuentes",
    username: "@diegotrails",
    roleTitle: "Animal Lover",
    pillLabel: "Interested in horses",
    pillVariant: "blue",
    bio: "Leads weekend trail rides for a therapeutic riding nonprofit.",
    tags: ["Horses", "Trail riding"],
    bgImage: "/people/bg14.png",
    avatarImage: "/people/pf14.png",
    specialty: "Therapeutic Riding & Trail Guidance",
    serviceArea: "Santa Fe Region",
    organization: "High Desert Therapy Horsemanship",
    broadRegion:
      "Santa Fe, New Mexico (broad area) — broad area only, never a precise location.",
  },
];

export default function AnimalLoversSection() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (person: Person) => {
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
            Animal lovers to discover
          </h2>
          <p className="text-xs sm:text-sm text-[#5B7171] leading-relaxed font-normal">
            Members with public animal interests close to yours.
          </p>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {ANIMAL_LOVERS_DATA.map((person) => {
            const pillBgClass =
              person.pillVariant === "cyan"
                ? "bg-[#E0F2FE] text-[#0369A1]"
                : "bg-[#EBF5FF] text-[#1E40AF]";

            return (
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
                    <h3 className="text-sm font-bold text-[#0B2E2E] mb-0.5">
                      {person.name}
                    </h3>

                    <p className="text-xs text-[#64748B] mb-2 font-normal">
                      {person.roleTitle}
                    </p>

                    <div
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-medium mb-3 ${pillBgClass}`}
                    >
                      {person.pillLabel}
                    </div>

                    <p className="text-xs text-[#475569] leading-relaxed mb-3 font-normal min-h-[40px]">
                      {person.bio}
                    </p>

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
            );
          })}
        </div>
      </div>

      {/* Dynamic Profile Modal Integration */}
      {selectedPerson && (
        <UserProfileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          profile={{
            name: selectedPerson.name,
            username: selectedPerson.username || "@member",
            verifiedRole: selectedPerson.roleTitle,
            roleTitle: selectedPerson.roleTitle,
            whyReason: selectedPerson.pillLabel,
            about: selectedPerson.bio,
            publicInterests: selectedPerson.tags,
            specialty: selectedPerson.specialty || "Animal Community Member",
            serviceArea: selectedPerson.serviceArea || "Local Community",
            organization: selectedPerson.organization || "Independent",
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
