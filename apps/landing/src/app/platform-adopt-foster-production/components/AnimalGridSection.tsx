"use client";

import { useState } from "react";
import Image from "next/image";
import { IMAGES } from "./images";
import { C } from "./theme";
import Link from "next/link";
import { appUrl } from "@/lib/app-links";

interface GridAnimal {
  id: string;
  name: string;
  type: "dog" | "cat" | "small" | "other";
  adoptionType: "adoption" | "foster" | "sponsor";
  ageGroup: "baby" | "young" | "adult" | "senior";
  subtitle: string;
  image: string;
}

const GRID_ANIMALS: GridAnimal[] = [
  {
    id: "charlie",
    name: "Charlie",
    type: "dog",
    adoptionType: "adoption",
    ageGroup: "young",
    subtitle: "German Shepherd • 4 years • Denver, CO",
    image: IMAGES.grid.charlie,
  },
  {
    id: "mittens",
    name: "Mittens",
    type: "cat",
    adoptionType: "adoption",
    ageGroup: "young",
    subtitle: "Calico Cat • 2 years • Austin, TX",
    image: IMAGES.grid.mittens,
  },
  {
    id: "daisy",
    name: "Daisy",
    type: "dog",
    adoptionType: "adoption",
    ageGroup: "baby",
    subtitle: "Labrador Mix • 1 year • Portland, OR",
    image: IMAGES.grid.daisy,
  },
  {
    id: "shadow",
    name: "Shadow",
    type: "cat",
    adoptionType: "foster",
    ageGroup: "young",
    subtitle: "Black Cat • 3 years • Minneapolis, MN",
    image: IMAGES.grid.shadow,
  },
  {
    id: "biscuit",
    name: "Biscuit",
    type: "dog",
    adoptionType: "adoption",
    ageGroup: "adult",
    subtitle: "Corgi Mix • 5 years • San Diego, CA",
    image: IMAGES.grid.biscuit,
  },
  {
    id: "smokey",
    name: "Smokey",
    type: "cat",
    adoptionType: "sponsor",
    ageGroup: "adult",
    subtitle: "Gray Tabby • 6 years • Nashville, TN",
    image: IMAGES.grid.smokey,
  },
];

export default function AnimalGridSection() {
  const [animalTypeFilter, setAnimalTypeFilter] = useState("All Animals");
  const [adoptionTypeFilter, setAdoptionTypeFilter] = useState("Adoption");
  const [ageFilter, setAgeFilter] = useState<string | null>(null);

  const animalTypes = ["All Animals", "Dogs", "Cats", "Small Animals", "Other"];
  const adoptionTypes = ["Adoption", "Foster", "Sponsor"];
  const ageOptions = [
    "Baby (0-1 yrs)",
    "Young (1-5 yrs)",
    "Adult (5-10 yrs)",
    "Senior (10+ yrs)",
  ];

  return (
    <section id="adoptable-animals" className="w-full bg-[#F7F9FA] pb-16 lg:pb-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Filter Container */}
        <div className="rounded-[24px] sm:rounded-[28px] border border-[#DCE5E8] bg-white p-4 sm:p-6 md:p-8">
          {/* Top Row: Animal Type & Adoption Type */}
          <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:gap-14">
            {/* Animal Type */}
            <div>
              <h4 className="text-sm font-bold text-[#066879] sm:text-base">
                Animal Type
              </h4>
              <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-4">
                {animalTypes.map((type) => {
                  const isActive = animalTypeFilter === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAnimalTypeFilter(type)}
                      className={`inline-flex h-[38px] sm:h-[41px] items-center justify-center rounded-full px-4 sm:px-6 text-xs sm:text-[13.3px] font-normal transition duration-150 active:scale-95 ${
                        isActive
                          ? "border border-[#066879] bg-[#066879] text-white"
                          : "border border-[#DCE5E8] bg-[#F7F9FA] text-[#102A32] hover:border-[#066879] hover:bg-white"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Adoption Type */}
            <div>
              <h4 className="text-sm font-bold text-[#066879] sm:text-base">
                Adoption Type
              </h4>
              <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-4">
                {adoptionTypes.map((type) => {
                  const isActive = adoptionTypeFilter === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAdoptionTypeFilter(type)}
                      className={`inline-flex h-[38px] sm:h-[41px] items-center justify-center rounded-full px-4 sm:px-6 text-xs sm:text-[13.3px] font-normal transition duration-150 active:scale-95 ${
                        isActive
                          ? "border border-[#066879] bg-[#066879] text-white"
                          : "border border-[#DCE5E8] bg-[#F7F9FA] text-[#102A32] hover:border-[#066879] hover:bg-white"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Row: Age */}
          <div className="mt-6 sm:mt-8">
            <h4 className="text-sm font-bold text-[#066879] sm:text-base">
              Age
            </h4>
            <div className="mt-3 sm:mt-4 flex max-w-full lg:max-w-[554px] flex-wrap items-center gap-2 sm:gap-x-4 sm:gap-y-2">
              {ageOptions.map((age) => {
                const isActive = ageFilter === age;
                return (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setAgeFilter(isActive ? null : age)}
                    className={`inline-flex h-[38px] sm:h-[41px] items-center justify-center rounded-full px-4 sm:px-6 text-xs sm:text-[13.3px] font-normal transition duration-150 active:scale-95 ${
                      isActive
                        ? "border border-[#066879] bg-[#066879] text-white"
                        : "border border-[#DCE5E8] bg-[#F7F9FA] text-[#102A32] hover:border-[#066879] hover:bg-white"
                    }`}
                  >
                    {age}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Adoptable Animals Title */}
        <div className="mt-12 sm:mt-16">
          <h2 className="text-2xl font-extrabold tracking-[-0.01em] text-[#102A32] sm:text-3xl lg:text-[36px] lg:leading-[43.2px]">
            Adoptable Animals
          </h2>

          {/* 6 Animal Cards Grid (3 columns x 2 rows) */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {GRID_ANIMALS.map((animal) => (
              <div
                key={animal.id}
                className="group flex items-center gap-3 sm:gap-4 overflow-hidden rounded-[20px] border border-[#DCE5E8] bg-white p-3 shadow-sm transition hover:shadow-md"
              >
                {/* Responsive Square Image */}
                <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-[150px] sm:w-[150px] lg:h-[160px] lg:w-[160px]">
                  <Image
                    src={animal.image}
                    alt={animal.name}
                    fill
                    className="object-cover object-center transition duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Card Info */}
                <div className="flex min-w-0 flex-1 flex-col justify-between py-1 pr-1 sm:pr-2">
                  <div>
                    <h3 className="truncate text-base sm:text-lg font-bold text-[#102A32]">
                      {animal.name}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#5E7076] line-clamp-2">
                      {animal.subtitle}
                    </p>
                  </div>

                  <div className="mt-3 sm:mt-4">
                    <Link
                      href={appUrl("/adoption")}
                      className="inline-flex items-center justify-center rounded-xl px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 active:scale-95"
                      style={{ backgroundColor: C.mosque }}
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
