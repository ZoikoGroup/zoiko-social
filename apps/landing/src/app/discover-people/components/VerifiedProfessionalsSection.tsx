"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import UserProfileModal from "@/components/UserProfileModal";

interface Professional {
  id: string;
  name: string;
  username?: string;
  roleTitle: string;
  pillLabel: string;
  bio: string;
  tags: string[];
  bgImage: string;
  avatarImage: string;
  // Extended fields for modal view
  specialty?: string;
  serviceArea?: string;
  organization?: string;
  broadRegion?: string;
}

const VERIFIED_PROFESSIONALS_DATA: Professional[] = [
  {
    id: "1",
    name: "Dr. Felix Lindgren",
    username: "@drfelix",
    roleTitle: "Verified Veterinarian",
    pillLabel: "Verified veterinarian",
    bio: "Emergency and surgical veterinarian with fifteen years in small-animal practice.",
    tags: ["Emergency care", "Surgery"],
    bgImage: "/people/bg15.png",
    avatarImage: "/people/pf15.png",
    specialty: "Emergency Medicine & Soft Tissue Surgery",
    serviceArea: "Greater Boston Area",
    organization: "Metro Emergency Vet Hospital",
    broadRegion:
      "Boston, Massachusetts (broad area) — broad area only, never a precise location.",
  },
  {
    id: "2",
    name: "Hana Suzuki",
    username: "@hanagrooms",
    roleTitle: "Verified Groomer",
    pillLabel: "Verified groomer",
    bio: "Specializes in low-stress grooming for anxious and senior dogs.",
    tags: ["Breed-specific grooming", "Anxiety-aware handling"],
    bgImage: "/people/bg16.png",
    avatarImage: "/people/pf16.png",
    specialty: "Low-Stress & Fear-Free Grooming",
    serviceArea: "San Francisco Peninsula",
    organization: "Gentle Paws Grooming Studio",
    broadRegion:
      "San Francisco, California (broad area) — broad area only, never a precise location.",
  },
  {
    id: "3",
    name: "Dr. Ruth Van Dyk",
    username: "@drruthbehavior",
    roleTitle: "Verified Behaviorist",
    pillLabel: "Verified behaviorist",
    bio: "Clinical animal behaviorist working with reactive and anxious dogs and their families.",
    tags: ["Reactivity", "Separation anxiety"],
    bgImage: "/people/bg17.png",
    avatarImage: "/people/pf17.png",
    specialty: "Clinical Canine Behavior Modification",
    serviceArea: "Austin Tri-County Area",
    organization: "Mindful Pet Behavior Center",
    broadRegion:
      "Austin, Texas (broad area) — broad area only, never a precise location.",
  },
];

export default function VerifiedProfessionalsSection() {
  const [selectedPerson, setSelectedPerson] = useState<Professional | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (person: Professional) => {
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
            Verified professionals
          </h2>
          <p className="text-xs sm:text-sm text-[#5B7171] leading-relaxed font-normal">
            Vets, trainers, groomers, behaviorists, and nutritionists verified
            by Zoiko Social&apos;s Trust program.
          </p>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {VERIFIED_PROFESSIONALS_DATA.map((person) => (
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
                  {/* Name & Verified Badge */}
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="text-sm font-bold text-[#0B2E2E]">
                      {person.name}
                    </h3>
                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#0B5C66] text-white text-[9px] font-bold shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span className="text-[10px] text-[#0B5C66] font-semibold">
                      Verified
                    </span>
                  </div>

                  {/* Role Title */}
                  <p className="text-xs text-[#64748B] mb-2 font-normal">
                    {person.roleTitle}
                  </p>

                  {/* Orange Verified Highlight Pill */}
                  <div className="inline-block px-2.5 py-1 rounded-md text-[11px] font-medium mb-3 bg-[#FFF4E5] text-[#B45309]">
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

      {/* Profile Modal Integration */}
      {selectedPerson && (
        <UserProfileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          profile={{
            name: selectedPerson.name,
            username: selectedPerson.username || "@professional",
            verifiedRole: selectedPerson.roleTitle.replace("Verified ", ""),
            roleTitle: selectedPerson.roleTitle,
            whyReason: selectedPerson.pillLabel,
            about: selectedPerson.bio,
            publicInterests: selectedPerson.tags,
            specialty: selectedPerson.specialty || "Professional Pet Practice",
            serviceArea: selectedPerson.serviceArea || "Metropolitan Area",
            organization:
              selectedPerson.organization || "Independent Specialist",
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
