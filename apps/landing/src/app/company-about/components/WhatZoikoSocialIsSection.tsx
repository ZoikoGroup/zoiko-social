import Image from "next/image";
import { IMAGES } from "./images";
import { C } from "./theme";

const CAPABILITIES = [
  {
    icon: IMAGES.whatZoikoSocialIs.shareCommunicate,
    title: "Share & Communicate",
    description:
      "Photos, videos, stories, live experiences, messaging, group chats, and calls — all in a family-friendly environment.",
  },
  {
    icon: IMAGES.whatZoikoSocialIs.buildCommunities,
    title: "Build Communities",
    description:
      "Connect around species, location, rescue work, professional practice, and shared interests with verified members.",
  },
  {
    icon: IMAGES.whatZoikoSocialIs.verifiedInfo,
    title: "Follow Verified Information",
    description:
      "Access animal welfare, conservation, veterinary science, and rescue news from institutional and professional sources.",
  },
  {
    icon: IMAGES.whatZoikoSocialIs.adoptFoster,
    title: "Adopt & Foster",
    description:
      "Discover animals through verified rescues and shelters with built-in safety protections and responsible pathways.",
  },
  {
    icon: IMAGES.whatZoikoSocialIs.professionalSupport,
    title: "Professional Support",
    description:
      "Find and connect with verified vets, trainers, groomers, and care specialists in your area.",
  },
  {
    icon: IMAGES.whatZoikoSocialIs.createEvents,
    title: "Create Events & Rituals",
    description:
      "Host meetups, training workshops, fundraisers, adoptions, birthdays, memorials, and community gatherings.",
  },
  {
    icon: IMAGES.whatZoikoSocialIs.commerce,
    title: "Commerce",
    description:
      "Animal-aligned marketplace and professional commerce, all operating under platform safety and welfare standards.",
  },
];

export default function WhatZoikoSocialIsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24" style={{ background: C.white }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-3 sm:gap-4 max-w-[850px]">
          <h2
            className="text-2xl font-extrabold leading-[1.2] tracking-[-0.01em] sm:text-3xl lg:text-[36px] lg:leading-[43.2px]"
            style={{ color: C.firefly }}
          >
            What you can do on Zoiko Social
          </h2>
          <p
            className="text-sm font-normal leading-relaxed sm:text-base lg:text-[17px] sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            Zoiko Social combines seven core capabilities in one purpose-built environment:
          </p>
        </div>

        {/* 7 Capability Cards Grid */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center rounded-[18px] sm:rounded-[20px] p-6 sm:p-7 lg:p-8 text-center transition hover:-translate-y-1 hover:shadow-lg"
              style={{
                background: C.white,
                border: `3px solid ${C.geyser}`,
                boxShadow: "0px 8px 24px 0px rgba(7, 59, 71, 0.08)",
              }}
            >
              {/* Pale Cyan Icon Circle */}
              <div
                className="flex size-14 sm:size-16 shrink-0 items-center justify-center rounded-[18px] sm:rounded-[20px]"
                style={{ background: C.blackSqueeze }}
              >
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={32}
                  height={32}
                  className="size-7 sm:size-8 object-contain"
                />
              </div>

              {/* Title */}
              <h3
                className="mt-4 sm:mt-5 text-base sm:text-lg lg:text-[20px] font-bold leading-snug sm:leading-[26px]"
                style={{ color: C.mosque }}
              >
                {item.title}
              </h3>

              {/* Description */}
              <p
                className="mt-2.5 sm:mt-3 text-xs sm:text-sm lg:text-[16px] font-normal leading-relaxed sm:leading-[26px]"
                style={{ color: C.nevada }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
