"use client";

import React, { useEffect } from "react";
import { X, Check, Clock } from "lucide-react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: {
    name: string;
    username: string;
    verifiedRole: string;
    roleTitle: string;
    whyReason: string;
    about: string;
    publicInterests: string[];
    specialty: string;
    serviceArea: string;
    organization: string;
    broadRegion: string;
    bgImage: string;
    avatarImage: string;
  };
}

const DEFAULT_PROFILE = {
  name: "Priya Natarajan",
  username: "@priyatrains",
  verifiedRole: "Dog Trainer",
  roleTitle: "Verified Dog Trainer",
  whyReason: "Verified trainer - matches your interests",
  about:
    "Certified trainer specializing in reward-based methods for anxious and reactive dogs.",
  publicInterests: ["Positive reinforcement", "Puppy training"],
  specialty: "Dog training & behavior",
  serviceArea: "Chicagoland area",
  organization: "Calm Paws Training",
  broadRegion:
    "Chicago, Illinois (broad area) — broad area only, never a precise location or distance.",
  bgImage: "/people/bg26.png",
  avatarImage: "/people/pf26.png",
};

export default function UserProfileModal({
  isOpen,
  onClose,
  profile = DEFAULT_PROFILE,
}: UserProfileModalProps) {
  // Prevent background layout shifts when modal opens
  useEffect(() => {
    if (isOpen) {
      // Calculate scrollbar width to prevent background layout jump
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card Wrapper */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E2E8F0] flex flex-col max-h-[90vh] overflow-y-auto">
        
        {/* Header / Banner Area */}
        <div className="relative w-full h-36 bg-[#F1F5F9] shrink-0">
          <img
            src={profile.bgImage}
            alt="Profile background"
            className="w-full h-full object-cover"
          />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all cursor-pointer z-20"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Profile Avatar */}
          <div className="absolute -bottom-6 left-5 w-16 h-16 rounded-full border-2 border-white bg-white overflow-hidden shadow-md z-10">
            <img
              src={profile.avatarImage}
              alt={profile.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Modal Content */}
        <div className="pt-9 px-6 pb-6 flex flex-col text-left">
          {/* User Name & Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h2 className="text-xl font-bold text-[#0B2E2E]">
              {profile.name}
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EBF5F5] text-[#0B5C66] text-[11px] font-semibold">
              <Check className="w-3 h-3 stroke-[3]" />
              {profile.verifiedRole}
            </span>
          </div>

          {/* Username */}
          <p className="text-xs text-[#64748B] mb-1 font-normal">
            {profile.username}
          </p>

          {/* Sub Role Title */}
          <p className="text-xs font-semibold text-[#0B5C66] mb-5">
            {profile.roleTitle}
          </p>

          {/* SECTION: WHY YOU'RE SEEING THIS */}
          <div className="mb-5">
            <span className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1.5">
              WHY YOU'RE SEEING THIS
            </span>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EBF5F5] text-[#0B5C66] text-xs font-medium">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{profile.whyReason}</span>
            </div>
          </div>

          {/* SECTION: ABOUT */}
          <div className="mb-5">
            <span className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1.5">
              ABOUT
            </span>
            <p className="text-xs text-[#334155] leading-relaxed font-normal">
              {profile.about}
            </p>
          </div>

          {/* SECTION: PUBLIC INTERESTS */}
          <div className="mb-5">
            <span className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-2">
              PUBLIC INTERESTS
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.publicInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] font-medium text-[#64748B]"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* SECTION: PROFESSIONAL DETAILS */}
          <div className="mb-5">
            <span className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-2">
              PROFESSIONAL DETAILS
            </span>
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-[#64748B]">Specialty</span>
                <span className="col-span-2 text-[#0B2E2E] font-medium">
                  {profile.specialty}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-[#64748B]">Service area</span>
                <span className="col-span-2 text-[#0B2E2E] font-medium">
                  {profile.serviceArea}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-[#64748B]">Organization</span>
                <span className="col-span-2 text-[#0B2E2E] font-medium">
                  {profile.organization}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION: BROAD REGION */}
          <div className="mb-6">
            <span className="block text-[10px] font-bold text-[#64748B] tracking-wider uppercase mb-1.5">
              BROAD REGION
            </span>
            <p className="text-xs text-[#334155] leading-relaxed font-normal">
              {profile.broadRegion}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2 mb-4">
            <button
              type="button"
              className="flex-1 py-2 px-4 rounded-xl bg-[#0B5C66] hover:bg-[#084850] text-white text-xs font-semibold transition-all cursor-pointer text-center"
            >
              Follow
            </button>
            <button
              type="button"
              className="flex-1 py-2 px-4 rounded-xl bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0B2E2E] text-xs font-semibold transition-all cursor-pointer text-center"
            >
              Save
            </button>
          </div>

          {/* MODAL FOOTER LINKS */}
          <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
            <button
              type="button"
              className="hover:underline cursor-pointer hover:text-[#0B2E2E]"
            >
              Hide suggestion
            </button>
            <button
              type="button"
              className="hover:underline cursor-pointer hover:text-[#0B2E2E]"
            >
              Report
            </button>
            <button
              type="button"
              className="text-[#DC2626] font-medium hover:underline cursor-pointer"
            >
              Block
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}