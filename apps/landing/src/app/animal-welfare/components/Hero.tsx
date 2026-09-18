"use client";

import { C } from "./theme";

export default function Hero() {
  return (
    <section
      className="w-full"
      style={{
        backgroundColor: C.page,
      }}
    >
      <div className="w-full px-4 pt-10 pb-8 sm:px-6 sm:pt-14 sm:pb-10 lg:px-0 lg:pt-[80px] lg:pb-[40px]">
        {/* Rounded Hero Container */}
        <div
          className="
            relative
            mx-auto
            min-h-[520px]
            w-full
            max-w-[1232px]
            overflow-hidden
            rounded-[20px]
            sm:min-h-[500px]
            sm:rounded-[24px]
            lg:h-[400px]
            lg:min-h-0
          "
          style={{
            backgroundColor: C.ink,
          }}
        >
          {/* Base dark teal background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: C.ink,
            }}
          />

          {/* Teal gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #073B47 0%, #066879 65%, #066879 100%)",
            }}
          />

          {/* Right-side soft teal lighting */}
          <div
            className="
              absolute
              inset-y-0
              right-0
              w-full
              sm:w-[70%]
              lg:w-[58%]
            "
            style={{
              background:
                "radial-gradient(ellipse at 75% 45%, rgba(255,255,255,0.10) 0%, rgba(62,109,110,0.10) 35%, rgba(29,82,88,0) 72%)",
            }}
          />

          {/* Subtle center glow */}
          <div
            className="
              absolute
              left-[25%]
              top-[-20%]
              h-[140%]
              w-[70%]
              rounded-full
              blur-[45px]
              sm:left-[32%]
              sm:w-[55%]
              lg:left-[38%]
              lg:w-[48%]
            "
            style={{
              backgroundColor: "#5C8580",
              opacity: 0.1,
            }}
          />

          {/* Content */}
          <div
            className="
              relative
              z-10
              flex
              min-h-[520px]
              w-full
              flex-col
              items-start
              gap-3
              px-5
              py-7
              sm:min-h-[500px]
              sm:px-8
              sm:py-8
              lg:h-full
              lg:min-h-0
              lg:px-[44px]
              lg:pt-[40px]
              lg:pb-0
            "
          >
            {/* Category Badge */}
            <div
              className="
                inline-flex
                items-center
                justify-start
                rounded-[20px]
                px-3
                py-[5px]
              "
              style={{
                backgroundColor: "rgba(255,255,255,0.18)",
              }}
            >
              <span
                className="
                  whitespace-nowrap
                  text-[11px]
                  font-semibold
                  leading-4
                  tracking-wide
                  sm:text-xs
                "
                style={{
                  color: C.white,
                }}
              >
                News · Animal Welfare
              </span>
            </div>

            {/* Heading */}
            <div className="w-full pt-1">
              <h1
                className="
                  text-[30px]
                  font-extrabold
                  leading-[38px]
                  sm:text-[34px]
                  sm:leading-[48px]
                  lg:whitespace-nowrap
                  lg:text-[36px]
                  lg:leading-[57px]
                "
                style={{
                  color: C.white,
                }}
              >
                Animal Welfare News
              </h1>
            </div>

            {/* Description */}
            <div className="w-full">
              <p
                className="
                  max-w-[702px]
                  text-sm
                  font-normal
                  leading-[22px]
                  sm:text-base
                  sm:leading-6
                "
                style={{
                  color: "#E7F0F0",
                }}
              >
                Verified-source reporting on animal care, rescue, shelter
                systems, welfare standards, science, policy, and responsible
                enforcement — with source and jurisdiction context visible.
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className="
                flex
                w-full
                flex-wrap
                items-start
                gap-2.5
                pt-2
                sm:pt-3
              "
            >
              {/* Primary Button */}
              <button
                type="button"
                className="
                  inline-flex
                  min-h-[44px]
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  px-6
                  py-3
                  text-center
                  text-sm
                  font-semibold
                  leading-5
                  transition-colors
                  duration-200
                  sm:w-auto
                  sm:text-base
                  sm:leading-6
                "
                style={{
                  backgroundColor: C.orange53,
                  color: C.white,
                }}
              >
                Explore current welfare stories
              </button>

              {/* Secondary Button */}
              <button
                type="button"
                className="
                  inline-flex
                  min-h-[44px]
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  px-6
                  py-3
                  text-center
                  text-sm
                  font-semibold
                  leading-5
                  transition-colors
                  duration-200
                  sm:w-auto
                  sm:text-base
                  sm:leading-6
                "
                style={{
                  color: C.white,
                  border: `1px solid rgba(255,255,255,0.35)`,
                  backgroundColor: "rgba(255,255,255,0.08)",
                }}
              >
                Follow Animal Welfare
              </button>
            </div>

            {/* Bottom Information */}
            <div
              className="
                flex
                w-full
                flex-wrap
                items-start
                gap-x-4
                gap-y-2
                pt-2
                sm:items-center
              "
            >
              {/* Updated Status */}
              <div
                className="
                  flex
                  min-h-5
                  w-full
                  max-w-[645px]
                  items-start
                  sm:items-center
                "
              >
                <span
                  className="
                    mr-2
                    mt-[6px]
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-[3px]
                    sm:mt-0
                  "
                  style={{
                    backgroundColor: C.springGreen39,
                  }}
                />

                <span
                  className="
                    text-[11px]
                    font-normal
                    leading-[18px]
                    sm:text-xs
                    sm:leading-5
                  "
                  style={{
                    color: C.cyan89,
                  }}
                >
                  Updated moments ago · stories appear after source, safety,
                  duplication, rights, and welfare-location checks
                </span>
              </div>

              {/* Source Ratings */}
              <button
                type="button"
                className="
                  inline-flex
                  items-center
                  justify-start
                  text-[11px]
                  font-bold
                  leading-5
                  underline
                  transition-opacity
                  hover:opacity-80
                  sm:text-xs
                "
                style={{
                  color: C.white,
                }}
              >
                How source ratings work
              </button>

              {/* Report Concern */}
              <button
                type="button"
                className="
                  inline-flex
                  items-center
                  justify-start
                  text-[11px]
                  font-bold
                  leading-5
                  underline
                  transition-opacity
                  hover:opacity-80
                  sm:text-xs
                "
                style={{
                  color: C.white,
                }}
              >
                Report an animal welfare concern
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}