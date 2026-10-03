"use client";

import React from "react";
import Image from "next/image";
import { Info, ShieldCheck } from "lucide-react";
import { C } from "./theme";

interface CategoryItem {
  title: string;
  subtitle: string;
  imageSrc: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    title: "Veterinary professionals",
    subtitle: "Vets, vet nurses and technicians",
    imageSrc: "/buisness-verification/category_veterinary.png",
  },
  {
    title: "Trainers and behaviorists",
    subtitle: "Training and behavior experts",
    imageSrc: "/buisness-verification/category_trainers-c61f0f.png",
  },
  {
    title: "Groomers and caregivers",
    subtitle: "Groomers, sitters, walkers, nutritionists",
    imageSrc: "/buisness-verification/category_groomers.png",
  },
  {
    title: "Rescues and shelters",
    subtitle: "Plus welfare and adoption checks",
    imageSrc: "/buisness-verification/category_rescues.png",
  },
  {
    title: "Nonprofits and advocacy",
    subtitle: "Charities and animal advocacy groups",
    imageSrc: "/buisness-verification/category_nonprofits.png",
  },
  {
    title: "Research and education",
    subtitle: "Universities, colleges and institutes",
    imageSrc: "/buisness-verification/category_research.png",
  },
  {
    title: "Animal-aligned companies",
    subtitle: "Pet food, care products and services",
    imageSrc: "/buisness-verification/category_companies-ed402b.png",
  },
  {
    title: "Agencies",
    subtitle: "Can apply for a client, with authorization",
    imageSrc: "/buisness-verification/category_agencies.png",
  },
];

export default function WhoCanVerifySection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="mb-10 text-left">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            Who can verify
          </h2>
          <p
            className="font-jakarta text-[16px] sm:text-[17px] font-normal"
            style={{ color: C.nevada }}
          >
            Eligibility depends on your category and region.
          </p>
        </div>

        {/* 8-Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.title}
              className="flex items-center gap-3.5 p-3.5 bg-white rounded-[20px] border hover:shadow-md transition-all duration-200"
              style={{ borderColor: C.geyser }}
            >
              {/* Photo Thumbnail with Shield */}
              <div className="relative w-[56px] h-[56px] rounded-[16px] overflow-hidden shrink-0 bg-gray-100">
                <Image
                  src={cat.imageSrc}
                  alt={cat.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
                <div
                  className="absolute bottom-0 right-0 w-4.5 h-4.5 rounded-tl-[6px] flex items-center justify-center text-white"
                  style={{ backgroundColor: C.mosque }}
                >
                  <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
                </div>
              </div>

              {/* Text Info */}
              <div className="flex flex-col min-w-0">
                <h4
                  className="font-jakarta font-bold text-[14.5px] leading-tight truncate mb-1"
                  style={{ color: C.tarawera }}
                >
                  {cat.title}
                </h4>
                <p
                  className="font-jakarta font-medium text-[12.5px] leading-[1.38] line-clamp-2"
                  style={{ color: C.nevada }}
                >
                  {cat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Support Alert Box */}
        <div
          className="flex items-start gap-3.5 p-4 sm:p-5 bg-[#F7F9FA] rounded-[20px] border text-[14px] sm:text-[14.5px] leading-[1.5]"
          style={{ borderColor: C.geyser }}
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{ color: C.mosque }}
          >
            <Info className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <p style={{ color: C.firefly }}>
            Breeders, live-animal sellers and categories not listed above
            can&apos;t verify yet. Contact Support to ask about other options.
          </p>
        </div>
      </div>
    </section>
  );
}
