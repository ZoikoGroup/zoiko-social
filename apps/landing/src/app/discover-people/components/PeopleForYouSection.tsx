"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import UserProfileModal from "@/components/UserProfileModal";

interface Person {
  id: string;
  name: string;
  username?: string;
  isVerified?: boolean;
  roleTitle: string;
  pillLabel: string;
  pillVariant: "blue" | "orange" | "cyan";
  bio: string;
  tags: string[];
  bgImage: string;
  avatarImage: string;
  // Extended fields for the modal view
  specialty?: string;
  serviceArea?: string;
  organization?: string;
  broadRegion?: string;
}

const PEOPLE_DATA: Person[] = [
  {
    id: "1",
    name: "Maya Torres",
    username: "@mayatorres",
    roleTitle: "Animal Lover",
    pillLabel: "Interested in rescue & foster",
    pillVariant: "blue",
    bio: "Fosters senior dogs on weekends and shares their recovery stories with the community.",
    tags: ["Dogs", "Rescue & foster", "Senior pets"],
    bgImage: "/people/bg1.png",
    avatarImage: "/people/pf1.png",
    specialty: "Rescue & Senior Dog Foster",
    serviceArea: "Greater Austin",
    organization: "Austin Animal Rescue",
    broadRegion:
      "Austin, Texas (broad area) — broad area only, never a precise location.",
  },
  {
    id: "2",
    name: "Dr. Amara Okafor",
    username: "@dramara",
    isVerified: true,
    roleTitle: "Verified Veterinarian",
    pillLabel: "Verified veterinarian",
    pillVariant: "orange",
    bio: "Small-animal veterinarian focused on preventive care and low-stress handling techniques.",
    tags: ["Feline medicine", "Preventive care"],
    bgImage: "/people/bg2.png",
    avatarImage: "/people/pf2.png",
    specialty: "Small-Animal Medicine",
    serviceArea: "Seattle Metropolitan",
    organization: "Harmony Pet Clinic",
    broadRegion:
      "Seattle, Washington (broad area) — broad area only, never a precise location.",
  },
  {
    id: "3",
    name: "Jonah Kim",
    username: "@jonahbirds",
    roleTitle: "Animal Lover",
    pillLabel: "Shares 3 communities",
    pillVariant: "cyan",
    bio: "Keeps two African greys and volunteers with a local exotic-bird rescue.",
    tags: ["Parrots", "Aviary care"],
    bgImage: "/people/bg3.png",
    avatarImage: "/people/pf3.png",
    specialty: "Avian Care & Enrichment",
    serviceArea: "Portland Metro",
    organization: "Pacific Avian Sanctuary",
    broadRegion:
      "Portland, Oregon (broad area) — broad area only, never a precise location.",
  },
  {
    id: "4",
    name: "Priya Natarajan",
    username: "@priyatrains",
    isVerified: true,
    roleTitle: "Verified Dog Trainer",
    pillLabel: "Verified dog trainer",
    pillVariant: "orange",
    bio: "Certified trainer specializing in reward-based methods for anxious and reactive dogs.",
    tags: ["Positive reinforcement", "Puppy training"],
    bgImage: "/people/bg4.png",
    avatarImage: "/people/pf4.png",
    specialty: "Dog training & behavior",
    serviceArea: "Chicagoland area",
    organization: "Calm Paws Training",
    broadRegion:
      "Chicago, Illinois (broad area) — broad area only, never a precise location or distance.",
  },
  {
    id: "5",
    name: "Theo Marsh",
    username: "@theomarsh",
    roleTitle: "Animal Lover",
    pillLabel: "Interested in horses",
    pillVariant: "blue",
    bio: "Volunteers at a retired-racehorse sanctuary most weekends.",
    tags: ["Horses", "Equine rescue"],
    bgImage: "/people/bg5.png",
    avatarImage: "/people/pf5.png",
    specialty: "Equine Rehabilitation",
    serviceArea: "Lexington Tri-County",
    organization: "Bluegrass Equine Sanctuary",
    broadRegion:
      "Lexington, Kentucky (broad area) — broad area only, never a precise location.",
  },
  {
    id: "6",
    name: "Elena Rossi",
    username: "@elena_kittens",
    roleTitle: "Animal Lover",
    pillLabel: "Shares 2 communities",
    pillVariant: "cyan",
    bio: "Bottle-feeds neonatal kittens for a city shelter and posts their milestones.",
    tags: ["Cats", "Kitten fostering"],
    bgImage: "/people/bg6.png",
    avatarImage: "/people/pf6.png",
    specialty: "Neonatal Feline Nursery",
    serviceArea: "Denver Metro",
    organization: "City Animal Care",
    broadRegion:
      "Denver, Colorado (broad area) — broad area only, never a precise location.",
  },
  {
    id: "7",
    name: "Sam Whitfield",
    username: "@samwildlife",
    roleTitle: "Animal Lover",
    pillLabel: "Interested in wildlife",
    pillVariant: "blue",
    bio: "Documents local wildlife corridors and shares habitat-friendly gardening tips.",
    tags: ["Wildlife", "Backyard habitats"],
    bgImage: "/people/bg7.png",
    avatarImage: "/people/pf7.png",
    specialty: "Urban Wildlife Conservation",
    serviceArea: "Northern California",
    organization: "Wild Habitat Alliance",
    broadRegion:
      "Sacramento, California (broad area) — broad area only, never a precise location.",
  },
  {
    id: "8",
    name: "Grace Adebayo",
    username: "@gracepaws",
    isVerified: true,
    roleTitle: "Verified Nutritionist",
    pillLabel: "Verified nutritionist",
    pillVariant: "orange",
    bio: "Formulates nutrition plans for dogs with chronic conditions in partnership with local vets.",
    tags: ["Canine nutrition", "Weight management"],
    bgImage: "/people/bg8.png",
    avatarImage: "/people/pf8.png",
    specialty: "Clinical Canine Nutrition",
    serviceArea: "Atlanta Metro",
    organization: "Pet Wellness Labs",
    broadRegion:
      "Atlanta, Georgia (broad area) — broad area only, never a precise location.",
  },
];

export default function PeopleForYouSection() {
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
    <section className="flex flex-col items-center justify-center py-12 md:py-16 text-[#0F3838] bg-white">
      {/* Max-w-6xl with reduced horizontal padding (px-2 sm:px-4) */}
      <div className="max-w-6xl w-full px-2 sm:px-4">
        {/* Section Header */}
        <div className="flex flex-col items-start text-left mb-6 px-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2E2E] tracking-tight mb-1">
            People for you
          </h2>
          <p className="text-xs sm:text-sm text-[#5B7171] leading-relaxed font-normal">
            A relevant mix based on your interests, shared communities, and
            language — never popularity alone.
          </p>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {PEOPLE_DATA.map((person) => {
            let pillBgClass = "bg-[#EBF5FF] text-[#1E40AF]";
            if (person.pillVariant === "orange") {
              pillBgClass = "bg-[#FFF4E5] text-[#B45309]";
            } else if (person.pillVariant === "cyan") {
              pillBgClass = "bg-[#E0F2FE] text-[#0369A1]";
            }

            return (
              <div
                key={person.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col justify-between shadow-xs transition-all hover:shadow-md"
              >
                {/* Card Top / Header */}
                <div>
                  {/* Banner & Circular Avatar Container */}
                  <div className="relative w-full h-24 bg-[#F1F5F9]">
                    <Image
                      src={person.bgImage}
                      alt={`${person.name} background`}
                      fill
                      className="object-cover"
                    />

                    {/* Circular Avatar */}
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
                    {/* Name & Verified Badge */}
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="text-sm font-bold text-[#0B2E2E]">
                        {person.name}
                      </h3>
                      {person.isVerified && (
                        <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#0B5C66] text-white text-[9px] font-bold shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                      {person.isVerified && (
                        <span className="text-[10px] text-[#0B5C66] font-semibold">
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Role Title */}
                    <p className="text-xs text-[#64748B] mb-2 font-normal">
                      {person.roleTitle}
                    </p>

                    {/* Feature / Highlight Pill */}
                    <div
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-medium mb-3 ${pillBgClass}`}
                    >
                      {person.pillLabel}
                    </div>

                    {/* Bio Description */}
                    <p className="text-xs text-[#475569] leading-relaxed mb-3 font-normal min-h-[48px]">
                      {person.bio}
                    </p>

                    {/* Skill / Interest Tags */}
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

                {/* Card Bottom / Actions Footer */}
                <div className="px-4 pb-4 pt-2 border-t border-[#F1F5F9] flex flex-col gap-3">
                  {/* Primary CTA Buttons */}
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

                  {/* Micro Actions */}
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

      {/* Dynamic Modal populated from clicked card context */}
      {selectedPerson && (
        <UserProfileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          profile={{
            name: selectedPerson.name,
            username: selectedPerson.username || "@user",
            verifiedRole: selectedPerson.roleTitle,
            roleTitle: selectedPerson.roleTitle,
            whyReason: selectedPerson.pillLabel,
            about: selectedPerson.bio,
            publicInterests: selectedPerson.tags,
            specialty: selectedPerson.specialty || "Pet Care & Advocacy",
            serviceArea: selectedPerson.serviceArea || "Local Area",
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
