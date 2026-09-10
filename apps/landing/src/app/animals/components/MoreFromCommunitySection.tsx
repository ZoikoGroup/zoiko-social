"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";

interface AnimalCard {
  id: string;
  name: string;
  breed: string;
  species: string;
  managedBy: string;
  image: string;
}

const ANIMALS: AnimalCard[] = [
  {
    id: "max",
    name: "Max",
    breed: "Golden Retriever",
    species: "Dog",
    managedBy: "Golden Retriever Guardians",
    image: "/animal/a9.png",
  },
  {
    id: "buddy",
    name: "Buddy",
    breed: "Golden Retriever",
    species: "Dog",
    managedBy: "Golden Retriever Guardians",
    image: "/animal/a10.png",
  },
  {
    id: "daisy",
    name: "Daisy",
    breed: "Golden Retriever",
    species: "Dog",
    managedBy: "Golden Retriever Guardians",
    image: "/animal/a11.png",
  },
];

export default function MoreFromCommunitySection() {
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});

  const toggleFollow = (id: string) => {
    setFollowingMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = (id: string) => {
    setSavedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="w-full font-sans">
      {/* Container aligned to the left edge with a outer padding gap */}
      <div className="w-full max-w-7xl py-8 mx-auto pl-4 sm:pl-6 md:pl-10">
        <h2 className="text-base sm:text-lg font-bold text-[#0B2E2E] mb-5 text-left">
          More from Golden Retriever Guardians
        </h2>

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
          {ANIMALS.map((animal) => {
            const isFollowing = !!followingMap[animal.id];
            const isSaved = !!savedMap[animal.id];

            return (
              <div
                key={animal.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all"
              >
                <div>
                  {/* Card Media Banner */}
                  <div className="relative w-full h-48 bg-[#F1F5F9] overflow-hidden">
                    <img
                      src={animal.image}
                      alt={animal.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Bookmark Floating Action */}
                    <button
                      type="button"
                      onClick={() => toggleSave(animal.id)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-lg backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                        isSaved
                          ? "bg-[#0B5C66] text-white"
                          : "bg-white/90 text-[#334155] hover:text-[#0B5C66]"
                      }`}
                      aria-label="Save animal"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Metadata Body */}
                  <div className="p-4 text-left">
                    <h3 className="text-sm font-bold text-[#0B2E2E] mb-0.5">
                      {animal.name}
                    </h3>
                    <p className="text-xs text-[#64748B] mb-2 font-medium">
                      {animal.breed} · {animal.species}
                    </p>
                    <p className="text-[11px] text-[#94A3B8]">
                      From {animal.managedBy}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="px-4 pb-4 pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleFollow(animal.id)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                      isFollowing
                        ? "border border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]"
                        : "bg-[#0B5C66] hover:bg-[#084850] text-white"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>

                  <Link
                    href={`/animals/${animal.id}`}
                    className="px-3.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#0B2E2E] text-xs font-semibold transition-all text-center cursor-pointer"
                  >
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
