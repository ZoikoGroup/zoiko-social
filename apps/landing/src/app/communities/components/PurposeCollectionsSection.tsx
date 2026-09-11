"use client";

import React from "react";
import Image from "next/image";

interface CollectionCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

const PURPOSE_COLLECTIONS: CollectionCard[] = [
  {
    id: "1",
    title: "Rescue Networks",
    subtitle: "Foster, rescue, and adoption coordination",
    image: "/communities/c11.png",
    href: "/collections/rescue-networks",
  },
  {
    id: "2",
    title: "Professional Communities",
    subtitle: "Verified vets, trainers, and specialists",
    image: "/communities/c12.png",
    href: "/collections/professional-communities",
  },
  {
    id: "3",
    title: "Training & Nutrition",
    subtitle: "Behavior, training, and diet guidance",
    image: "/communities/c13.png",
    href: "/collections/training-nutrition",
  },
  {
    id: "4",
    title: "Memorial & Support",
    subtitle: "Grief support and tribute spaces",
    image: "/communities/c14.png",
    href: "/collections/memorial-support",
  },
  {
    id: "5",
    title: "Wildlife Conservation",
    subtitle: "Habitat, conservation, and field work",
    image: "/communities/c15.png",
    href: "/collections/wildlife-conservation",
  },
  {
    id: "6",
    title: "Care & Education",
    subtitle: "Learning resources and everyday care",
    image: "/communities/c16.png",
    href: "/collections/care-education",
  },
];

export default function PurposeCollectionsSection() {
  return (
    <section className="w-full bg-[#F7F9FA] py-8 md:py-12 text-[#0B2E2E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#0B2E2E] tracking-tight mb-6 text-left">
          Purpose Collections
        </h2>

        {/* 3-Column x 2-Row Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {PURPOSE_COLLECTIONS.map((collection) => (
            <a
              key={collection.id}
              href={collection.href}
              className="group relative h-48 sm:h-52 w-full rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer block"
            >
              {/* Card Image */}
              <Image
                src={collection.image}
                alt={collection.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Card Text Content */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col items-start text-left">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mb-1">
                  {collection.title}
                </h3>
                <p className="text-xs text-white/80 font-normal leading-snug">
                  {collection.subtitle}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
