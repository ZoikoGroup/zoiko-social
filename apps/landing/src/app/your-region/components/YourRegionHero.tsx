"use client";

import { useState } from "react";
import Image from "next/image";
import RegionSelectorModal from "./RegionSelectorModal";

export default function YourRegionHero() {
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

  return (
    <section className="w-full bg-[#F5F8F8]">
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1232px]
          items-center
          justify-between
          gap-12
          px-6
          py-[80px]
          lg:px-0
        "
      >
        {/* LEFT CONTENT */}
        <div className="flex w-full max-w-[644px] flex-col">
          {/* Your Region */}
          <div className="mb-1 h-6 text-base font-normal leading-6 text-[#073B47]">
            Your Region
          </div>

          {/* Heading */}
          <h1
            className="
              mb-2
              text-[32px]
              font-extrabold
              leading-[48px]
              tracking-[-0.5px]
              text-[#062F39]
            "
          >
            Verified animal news for Global Coverage.
          </h1>

          {/* Description */}
          <p
            className="
              mb-3
              max-w-[629px]
              text-base
              font-normal
              leading-6
              text-[#073B47]
            "
          >
            Follow animal welfare, conservation, rescue, policy, and
            enforcement reporting
            <br className="hidden sm:block" />
            relevant to the region you choose — with source ratings and
            corrections kept visible.
          </p>

          {/* REGION SELECTOR */}
          <div
            className="
              mb-4
              flex
              h-9
              w-80
              items-center
              rounded-full
              bg-slate-100
            "
          >
            <div
              className="
                flex
                h-5
                w-[112px]
                items-center
                justify-center
                text-xs
                font-semibold
                leading-5
                text-[#062F39]
              "
            >
              Global Coverage
            </div>

            <div
              className="
                flex
                h-5
                w-24
                items-center
                justify-center
                rounded-full
                bg-white
              "
            >
              <span
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  leading-4
                  tracking-[-0.2px]
                  text-[#062F39]
                "
              >
                No region set
              </span>
            </div>

            {/* CHANGE BUTTON */}
            <button
              type="button"
              onClick={() => setIsRegionModalOpen(true)}
              className="
                ml-auto
                mr-3
                text-xs
                font-bold
                leading-4
                text-sky-900
                underline
                underline-offset-2
                transition
                hover:text-cyan-950
              "
            >
              Change
            </button>
          </div>

          {/* BUTTONS */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="
                flex
                h-12
                w-64
                items-center
                justify-center
                rounded-xl
                bg-[#066879]
                text-base
                font-semibold
                text-white
                transition
                hover:bg-[#055968]
              "
            >
              Join to follow Global Coverage
            </button>

            <button
              type="button"
              className="
                flex
                h-12
                w-56
                items-center
                justify-center
                rounded-xl
                border
                border-zinc-200
                bg-white
                text-base
                font-semibold
                leading-6
                text-[#062F39]
                transition
                hover:bg-slate-50
              "
            >
              Browse Global Coverage
            </button>
          </div>

          {/* NOTE */}
          <p className="text-base font-normal leading-6 text-[#073B47]">
            Your Region uses the region you set. Precise device location is
            not required.
          </p>
        </div>

        {/* RIGHT IMAGE COLLAGE */}
        <div
          className="
            relative
            hidden
            h-[320px]
            w-[490px]
            shrink-0
            rounded-[20px]
            bg-white
            p-3
            shadow-[0px_8px_24px_rgba(7,59,71,0.10)]
            lg:block
          "
        >
          <div className="relative flex h-full w-full gap-2">
            {/* LARGE IMAGE */}
            <div className="relative h-full w-[176px] overflow-hidden rounded-[10px]">
              <Image
                src="/your-region/hero1.png"
                alt="Animal rescue and shelter"
                fill
                className="object-cover"
                sizes="176px"
                priority
              />

              {/* TOP LABEL */}
              <div
                className="
                  absolute
                  left-2
                  top-2
                  rounded-full
                  bg-white/95
                  px-2
                  py-1
                  text-[9px]
                  font-semibold
                  text-[#073B47]
                "
              >
                Rescue &amp; Shelter
              </div>

              {/* BOTTOM LABEL */}
              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  bg-gradient-to-t
                  from-black/50
                  to-transparent
                  px-3
                  pb-3
                  pt-8
                  text-[9px]
                  font-medium
                  text-white
                "
              >
                Relevant to your region
              </div>
            </div>

            {/* RIGHT TWO IMAGES */}
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              {/* TOP RIGHT */}
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-[10px]">
                <Image
                  src="/your-region/hero2.png"
                  alt="Animal policy and law"
                  fill
                  className="object-cover"
                  sizes="278px"
                />

                <div
                  className="
                    absolute
                    left-2
                    top-2
                    rounded-full
                    bg-white/95
                    px-2
                    py-1
                    text-[9px]
                    font-semibold
                    text-[#073B47]
                  "
                >
                  Policy &amp; Law
                </div>
              </div>

              {/* BOTTOM RIGHT */}
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-[10px]">
                <Image
                  src="/your-region/hero3.png"
                  alt="Verified animal welfare sources"
                  fill
                  className="object-cover"
                  sizes="278px"
                />

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    bg-gradient-to-t
                    from-black/50
                    to-transparent
                    px-3
                    pb-3
                    pt-8
                    text-[9px]
                    font-medium
                    text-white
                  "
                >
                  Verified sources
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE IMAGE */}
      <div className="px-6 pb-10 lg:hidden">
        <div
          className="
            relative
            mx-auto
            h-[260px]
            w-full
            max-w-[490px]
            overflow-hidden
            rounded-[20px]
            bg-white
            p-2
            shadow-[0px_8px_24px_rgba(7,59,71,0.10)]
          "
        >
          <Image
            src="/your-region/hero1.png"
            alt="Animal rescue and shelter"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>

      {/* REGION SELECTOR POPUP */}
      <RegionSelectorModal
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
      />
    </section>
  );
}