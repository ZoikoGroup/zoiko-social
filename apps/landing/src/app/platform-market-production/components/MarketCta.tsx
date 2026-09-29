"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

export default function MarketCta() {
  return (
    <section
      className={`${plusJakartaSans.className} w-full bg-white px-5 py-12 sm:px-8 sm:py-16 lg:px-20 lg:py-20`}
    >
      <div
        className="
          relative
          mx-auto
          flex
          min-h-[360px]
          w-full
          max-w-[1280px]
          items-center
          justify-center
          overflow-hidden
          rounded-3xl
        "
      >
        {/* Background Image */}
        <div
          className="
            absolute
            inset-0
            bg-cover
            bg-center
            bg-no-repeat
          "
          style={{
            backgroundImage:
              "url('/platform-market-production/bg2.png')",
          }}
        />

        {/* Content */}
        <div
          className="
            relative
            z-10
            flex
            w-full
            max-w-[900px]
            flex-col
            items-center
            justify-start
            gap-6
            px-5
            py-12
            sm:px-8
            md:px-12
          "
        >
          {/* Heading */}
          <div className="flex w-full flex-col items-center justify-start">
            <h2
              className="
                w-full
                text-center
                text-3xl
                font-extrabold
                leading-10
                text-white
                sm:text-4xl
                sm:leading-10
              "
            >
              Ready to explore Zoiko Market?
            </h2>
          </div>

          {/* Description */}
          <div className="flex w-full flex-col items-center justify-start">
            <p
              className="
                w-full
                max-w-[638px]
                text-center
                text-base
                font-normal
                leading-7
                text-white
              "
            >
              Find the right care, services, and supplies for your animals.
            </p>
          </div>

          {/* Buttons */}
          <div
            className="
              flex
              w-full
              flex-wrap
              content-start
              items-start
              justify-center
              gap-4
              pt-4
            "
          >
            {/* Browse All Categories */}
            <button
              type="button"
              className="
                min-h-14
                rounded-xl
                bg-white
                px-8
                py-4
                text-center
                text-sm
                font-bold
                text-[#087D8E]
                outline
                outline-1
                outline-offset-[-1px]
                outline-[#D9E5E8]
              "
            >
              Browse All Categories
            </button>

            {/* Get Support */}
            <button
              type="button"
              className="
                min-h-14
                rounded-xl
                bg-transparent
                px-8
                py-4
                text-center
                text-sm
                font-bold
                text-white
                outline
                outline-1
                outline-offset-[-1px]
                outline-white
              "
            >
              Get Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}