"use client";

import { useState } from "react";
import Image from "next/image";
import { APP_EVENTS_URL, CATEGORIES, EVENT_CARDS } from "./content";
import { C } from "./theme";

// Exact Figma color tokens
const ATHENS_GRAY_BG = "#F7F8F9"; // Section bg: Athens Gray
const GALLERY_BG = "#EEEEEE";     // Input bg: Gallery
const GEYSER_BORDER = "#DCEAEE";  // Input border: Geyser

const SELECTS = [
  { label: "When", value: "All dates" },
  { label: "Type", value: "All types" },
  { label: "Location", value: "All locations" },
] as const;

const EVENT_IMAGES = [
  "/platform-events/a.png",
  "/platform-events/b.png",
  "/platform-events/c.png",
];

export default function BrowseByCategory() {
  /** Which category chip is active. Card filtering matches by chip label. */
  const [category, setCategory] = useState<string>("All events");

  const shown =
    category === "All events"
      ? EVENT_CARDS
      : EVENT_CARDS.filter((e) => e.category === category.split(" ")[0]);

  return (
    <section
      className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
      style={{ backgroundColor: ATHENS_GRAY_BG }}
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        {/* Heading + Subtitle */}
        <div className="flex flex-col gap-2">
          <h2
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ color: C.ink }}
          >
            Browse by category
          </h2>
          <p className="text-base leading-7" style={{ color: C.muted }}>
            Filter events by type to find what interests you.
          </p>
        </div>

        {/* Category Chips */}
        <div
          role="group"
          aria-label="Filter events by category"
          className="flex flex-wrap items-center gap-3"
        >
          {CATEGORIES.map((c) => {
            const on = c === category;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => setCategory(c)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  on ? "shadow-sm" : "hover:bg-neutral-50"
                }`}
                style={
                  on
                    ? { background: C.brand, color: "#fff", border: "none" }
                    : { background: "#fff", color: C.ink, border: `1px solid ${C.line}` }
                }
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Filters (When, Type, Location) - No Dropdown Arrow */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SELECTS.map((s) => (
            <label key={s.label} className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold" style={{ color: C.ink }}>
                {s.label}
              </span>
              <select
                aria-label={s.label}
                defaultValue={s.value}
                className="w-full appearance-none rounded-xl px-4 py-3 text-sm font-medium outline-none transition [appearance:none] [-webkit-appearance:none] [-moz-appearance:none]"
                style={{
                  backgroundColor: GALLERY_BG,
                  border: `1px solid ${GEYSER_BORDER}`,
                  color: C.muted,
                  backgroundImage: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                }}
              >
                <option>{s.value}</option>
              </select>
            </label>
          ))}
        </div>

        {/* Event cards grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((e) => {
            const originalIndex = EVENT_CARDS.findIndex((item) => item.id === e.id);
            const imageSrc =
              EVENT_IMAGES[originalIndex >= 0 ? originalIndex % EVENT_IMAGES.length : 0];

            return (
              <article
                key={e.id}
                className="flex flex-col justify-between overflow-hidden rounded-[20px] bg-white shadow-[0px_1px_3px_0px_rgba(7,59,71,0.06)] transition hover:shadow-md"
                style={{ border: `1px solid ${C.line}` }}
              >
                <div>
                  {/* Thumbnail + Category Badge */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={imageSrc}
                      alt={e.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 394px, 100vw"
                      className="object-cover"
                    />
                    <span
                      className="absolute right-3.5 top-3.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm"
                      style={{ color: C.brand }}
                    >
                      {e.category}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-col gap-2.5 p-6">
                    <h3 className="text-lg font-bold leading-snug" style={{ color: C.ink }}>
                      {e.title}
                    </h3>

                    {/* Preserved Date Icon */}
                    <p className="flex items-center gap-2 text-xs font-medium" style={{ color: C.muted }}>
                      <Image
                        src="/platform-events/📅.png"
                        alt=""
                        width={14}
                        height={14}
                        className="inline-block shrink-0"
                      />
                      {e.date}
                    </p>

                    {/* Preserved Location Icon */}
                    <p className="flex items-center gap-2 text-xs font-medium" style={{ color: C.muted }}>
                      <Image
                        src="/platform-events/📍.png"
                        alt=""
                        width={14}
                        height={14}
                        className="inline-block shrink-0"
                      />
                      {e.location}
                    </p>

                    {/* Description */}
                    <p className="pt-1 text-xs leading-relaxed" style={{ color: C.muted }}>
                      {e.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Organizer & View event with small arrow */}
                <div className="flex flex-col gap-2 px-6 pb-6 pt-1">
                  <p className="text-xs" style={{ color: C.muted }}>
                    <span className="font-bold" style={{ color: C.ink }}>
                      Organizer:
                    </span>{" "}
                    {e.organizer}
                  </p>

                  <a
                    href={APP_EVENTS_URL}
                    className="inline-flex items-center text-xs font-bold transition hover:opacity-80"
                    style={{ color: C.brand }}
                  >
                    View event
                    <svg
                      className="ml-1 inline-block size-3.5 shrink-0"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.333 8h9.334M8.667 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}