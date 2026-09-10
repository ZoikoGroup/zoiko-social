"use client";

import React from "react";

interface SpeciesHub {
  id: string;
  name: string;
  image: string;
}

const SPECIES_HUBS: SpeciesHub[] = [
  {
    id: "1",
    name: "Dogs",
    image: "/communities/c5.png",
  },
  {
    id: "2",
    name: "Cats",
    image: "/communities/c6.png",
  },
  {
    id: "3",
    name: "Birds",
    image: "/communities/c7.png",
  },
  {
    id: "4",
    name: "Horses",
    image: "/communities/c8.png",
  },
  {
    id: "5",
    name: "Reptiles",
    image: "/communities/c9.png",
  },
  {
    id: "6",
    name: "Small Animals",
    image: "/communities/c10.png",
  },
];

export default function SpeciesHubsSection() {
  return (
    <section className="w-full bg-[#F7F9FA] py-8 md:py-12 text-[#0B2E2E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B2E2E] tracking-tight">
            Species Hubs
          </h2>
          <button
            type="button"
            className="text-xs sm:text-sm font-semibold text-[#0B5C66] hover:underline cursor-pointer"
          >
            View all species
          </button>
        </div>

        {/* Grid of Species Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
          {SPECIES_HUBS.map((hub) => (
            <a
              key={hub.id}
              href={`/species/${hub.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="group relative h-48 sm:h-52 w-full rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer block"
            >
              {/* Background Image */}
              <img
                src={hub.image}
                alt={hub.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Bottom Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Title Text */}
              <div className="absolute bottom-3 left-3.5 right-3.5 z-10">
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  {hub.name}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
