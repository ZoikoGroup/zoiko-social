"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bookmark,
  Share2,
  MoreHorizontal,
  MapPin,
  CheckCircle2,
} from "lucide-react";

export default function LunaProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#F7F9FA] text-[#0B2E2E] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-[#64748B] mb-4 flex items-center gap-1.5 font-medium">
          <Link href="/discover" className="hover:underline">
            Discover
          </Link>
          <span>/</span>
          <Link href="/animals" className="hover:underline">
            Animals
          </Link>
          <span>/</span>
          <span className="text-[#0B2E2E] font-semibold">Luna</span>
        </nav>

        {/* Banner Image */}
        <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden bg-[#E2E8F0] shadow-xs">
          <Image
            src="/animal/a1.png"
            alt="Luna Cover Banner"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
        </div>

        {/* Profile Card Overlay Header */}
        <div className="relative bg-white rounded-2xl p-6 shadow-xs border border-[#E2E8F0] -mt-10 mb-8 mx-2 sm:mx-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            {/* Avatar & Title */}
            <div className="flex items-end gap-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white overflow-hidden shadow-md shrink-0 bg-white -mt-12 sm:-mt-14 z-10">
                <Image
                  src="/animal/a2.png"
                  alt="Luna Avatar"
                  fill
                  sizes="(max-width: 640px) 80px, 96px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#0B2E2E]">
                    Luna
                  </h1>
                  <CheckCircle2 className="w-4 h-4 text-[#0B5C66] fill-[#0B5C66]/10" />
                </div>
                <p className="text-xs sm:text-sm text-[#64748B] font-medium">
                  Golden Retriever · Dog
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex-1 sm:flex-initial px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isFollowing
                    ? "border border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]"
                    : "bg-[#0B5C66] hover:bg-[#084850] text-white"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>

              <button
                type="button"
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2.5 rounded-xl border border-[#CBD5E1] transition-all cursor-pointer ${
                  isSaved
                    ? "bg-[#0B5C66]/10 border-[#0B5C66] text-[#0B5C66]"
                    : "bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                }`}
                aria-label="Save profile"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              <button
                type="button"
                className="p-2.5 rounded-xl border border-[#CBD5E1] bg-white text-[#64748B] hover:bg-[#F8FAFC] transition-all cursor-pointer"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                className="p-2.5 rounded-xl border border-[#CBD5E1] bg-white text-[#64748B] hover:bg-[#F8FAFC] transition-all cursor-pointer"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub Header Info */}
          <div className="mt-4 pt-4 border-t border-[#F1F5F9] flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#64748B]">
            <span>
              Managed by{" "}
              <Link
                href="/communities/golden-retriever-guardians"
                className="font-bold text-[#0B2E2E] hover:underline"
              >
                Golden Retriever Guardians
              </Link>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
              Sacramento, CA area
            </span>
            <span>·</span>
            <span>
              <strong className="text-[#0B2E2E] font-bold">2,340</strong>{" "}
              followers
            </span>

            <div className="ml-auto flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EDF5F5] text-[#0B5C66]">
                Verified Community
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F1F5F9] text-[#475569]">
                Public Profile
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-8 text-left">
            {/* About Section */}
            <div className="p-6">
              <h2 className="text-base font-bold text-[#0B2E2E] mb-2">
                About Luna
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Three years old and full of energy. Luna loves long hikes,
                meeting new dogs at the park, and has become a bit of a local
                celebrity at her monthly community meetups. She’s a certified
                good girl with a weakness for tennis balls and belly rubs. 🐾
              </p>
            </div>

            {/* Photos Grid */}
            <div className="p-6">
              <h2 className="text-base font-bold text-[#0B2E2E] mb-3">
                Photos
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  "/animal/a4.png",
                  "/animal/a5.png",
                  "/animal/a6.png",
                  "/animal/a7.png",
                ].map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden bg-[#F1F5F9] cursor-pointer hover:opacity-95 transition-all border border-[#E2E8F0]"
                  >
                    <Image
                      src={img}
                      alt={`Luna Photo ${idx + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6 text-left">
            {/* Associated Communities */}
            <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs">
              <h3 className="text-xs font-bold text-[#0B2E2E] tracking-tight mb-3">
                Associated Communities
              </h3>
              <Link
                href="/communities/golden-retriever-guardians"
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8FAFC] transition-all border border-transparent hover:border-[#E2E8F0] group cursor-pointer"
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#F1F5F9] shrink-0">
                  <Image
                    src="/animal/a3.png"
                    alt="Community avatar"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0B2E2E] group-hover:text-[#0B5C66] transition-colors">
                    Golden Retriever Guardians
                  </span>
                  <span className="text-[11px] text-[#64748B]">
                    45.2k members
                  </span>
                </div>
              </Link>
            </div>

            {/* Trust & Safety Banner */}
            <div className="bg-[#EEF8F9] rounded-2xl p-5 border border-[#DCE5E8]">
              <h3 className="text-xs font-bold text-[#0B2E2E] mb-2">
                Trust & Safety
              </h3>
              <p className="text-[12.5px] text-[#5B7171] leading-relaxed mb-3">
                Location is shown only at a safe, approximate level. Zoiko
                Social never displays a precise pin or live tracking.
              </p>
              <p className="text-[12.5px] text-[#5B7171] leading-relaxed mb-3">
                Concerned about this profile? Reports are confidential and
                reviewed against our Community Standards.
              </p>
              <a
                href="#report"
                className="inline-flex items-center text-xs font-bold text-[#0B5C66] hover:underline"
              >
                Report this profile <span className="ml-1">›</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
