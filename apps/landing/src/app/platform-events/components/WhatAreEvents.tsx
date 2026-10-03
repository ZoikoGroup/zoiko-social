import Image from "next/image";
import { PLATFORM_FEATURES } from "./content";
import { C, CARD_SHADOW } from "./theme";

// Exact Figma color token
const NEVADA_COLOR = "#646E73"; // text-color-nevada

/** "What are Zoiko Events?" — arrow rows beside a floating photo card. */
export default function WhatAreEvents() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        {/* Section Heading */}
        <h2
          className="text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: C.ink }}
        >
          What are Zoiko Events?
        </h2>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Paragraph (Nevada) */}
            <p
              className="max-w-xl text-base leading-7"
              style={{ color: NEVADA_COLOR }}
            >
              Zoiko Events is a community discovery platform for animal-related
              events hosted by verified organizations. Every event is
              source-backed and represents real, upcoming activities.
            </p>

            {/* Features List */}
            <div className="flex flex-col">
              {PLATFORM_FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-3 border-b py-3.5 sm:py-4"
                  style={{ borderColor: C.line }}
                >
                  {/* Small arrow icon */}
                  <svg
                    className="mt-1 size-4 shrink-0"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.333 8h9.334M8.667 4l4 4-4 4"
                      stroke={C.brand}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  {/* Feature Title */}
                  <span
                    className="w-44 shrink-0 text-sm font-bold sm:text-base"
                    style={{ color: C.ink }}
                  >
                    {f.title}
                  </span>

                  {/* Feature Detail (Nevada) */}
                  <span
                    className="text-sm leading-6 sm:text-base"
                    style={{ color: NEVADA_COLOR }}
                  >
                    — {f.detail.replace(/^[—–-]\s*/, "")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Photo Card */}
          <div className="w-full">
            <div
              className="relative h-[360px] w-full overflow-hidden rounded-[24px] shadow-[0px_20px_48px_0px_rgba(7,59,71,0.14)] sm:h-[440px] lg:h-[460px]"
              style={{ boxShadow: CARD_SHADOW }}
            >
              <Image
                src="/platform-events/oo.png"
                alt="A large community gathering at an animal welfare event"
                fill
                priority
                sizes="(min-width: 1024px) 591px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}