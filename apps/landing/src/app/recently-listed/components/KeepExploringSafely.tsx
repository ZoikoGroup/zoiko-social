"use client";

import { C } from "./theme";

export default function KeepExploringSafely() {
  return (
    <section className="w-full px-5 py-8 lg:px-0">
      <div
        className="
          relative
          mx-auto
          flex
          w-full
          max-w-[1232px]
          flex-col
          items-start
          overflow-hidden
          rounded-[32px]
          px-6
          py-10
          sm:px-8
          lg:px-10
          lg:py-12
        "
        style={{
          backgroundColor: C.keepExploringBackground,
        }}
      >
        {/* Orange radial glow */}
        <div
          className="
            pointer-events-none
            absolute
            -right-[48px]
            -top-[140px]
            h-96
            w-96
            rounded-full
          "
          style={{
            background:
              `radial-gradient(circle, ${C.keepExploringGlow} 0%, rgba(247, 147, 30, 0) 70%)`,
          }}
        />

        {/* Content */}
        <div
          className="
            relative
            z-10
            flex
            w-full
            flex-col
            items-start
            justify-between
            gap-7
            lg:flex-row
            lg:items-center
            lg:gap-8
          "
        >
          {/* Left Content */}
          <div
            className="
              flex
              w-full
              min-w-0
              flex-col
              items-start
              gap-1.5
              lg:max-w-[594.38px]
            "
          >
            {/* Heading */}
            <div className="w-full">
              <h2
                className="
                  text-2xl
                  font-extrabold
                  leading-9
                "
                style={{
                  color: C.keepExploringText,
                }}
              >
                Keep exploring safely
              </h2>
            </div>

            {/* Description */}
            <div className="w-full max-w-[594.38px]">
              <p
                className="
                  text-sm
                  font-normal
                  leading-5
                "
                style={{
                  color: C.keepExploringDescription,
                }}
              >
                Browse every verified adoption listing, not just what&apos;s
                newest, or follow a rescue for
                <br className="hidden lg:block" />
                future updates.
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div
            className="
              relative
              z-10
              flex
              w-full
              flex-wrap
              items-start
              gap-2.5
              lg:w-auto
            "
          >
            {/* Primary CTA */}
            <button
              type="button"
              className="
                flex
                h-[48px]
                items-center
                justify-center
                rounded-xl
                px-6
                text-center
                text-base
                font-semibold
                leading-6
                transition-opacity
                hover:opacity-90
              "
              style={{
                backgroundColor: C.keepExploringPrimaryCta,
                border: `1px solid ${C.keepExploringPrimaryBorder}`,
                color: C.white,
              }}
            >
              Browse All Adopt Listings
            </button>

            {/* Secondary CTA */}
            <button
              type="button"
              className="
                flex
                h-[48px]
                items-center
                justify-center
                rounded-xl
                border
                px-6
                text-center
                text-base
                font-semibold
                leading-6
                transition-colors
                hover:bg-white/10
              "
              style={{
                color: C.keepExploringSecondaryText,
                borderColor: C.keepExploringSecondaryBorder,
                backgroundColor: "transparent",
              }}
            >
              Find Animals Near Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}