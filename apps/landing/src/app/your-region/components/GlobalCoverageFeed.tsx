"use client";

import Image from "next/image";

/* =========================
   FOLLOW TOPIC — PLUS ICON
========================= */
function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 3V11"
        stroke="#6B7280"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M3 7H11"
        stroke="#6B7280"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================
   SAVE — BOOKMARK ICON
========================= */
function SaveIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 2.25H10C10.4142 2.25 10.75 2.58579 10.75 3V11.25L7 9.15L3.25 11.25V3C3.25 2.58579 3.58579 2.25 4 2.25Z"
        stroke="#6B7280"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================
   SHARE ICON
========================= */
function ShareIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 7L10.25 3.5"
        stroke="#6B7280"
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      <path
        d="M4 7L10.25 10.5"
        stroke="#6B7280"
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      <circle
        cx="3"
        cy="7"
        r="1.35"
        stroke="#6B7280"
        strokeWidth="1"
      />

      <circle
        cx="10.5"
        cy="3"
        r="1.35"
        stroke="#6B7280"
        strokeWidth="1"
      />

      <circle
        cx="10.5"
        cy="11"
        r="1.35"
        stroke="#6B7280"
        strokeWidth="1"
      />
    </svg>
  );
}

/* =========================
   MORE
========================= */
function MoreIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="3" cy="7" r="1" fill="#6B7280" />
      <circle cx="7" cy="7" r="1" fill="#6B7280" />
      <circle cx="11" cy="7" r="1" fill="#6B7280" />
    </svg>
  );
}

export default function GlobalCoverageFeed() {
  return (
    <section className="w-full bg-[#F5F8F8]">
      <div className="mx-auto w-full max-w-[1232px] px-6 pb-20 lg:px-0">

        {/* =========================================
            HEALTHY COVERAGE
        ========================================= */}
        <div className="flex h-16 w-full items-center justify-between rounded-[20px] border border-zinc-200 bg-white px-[25px]">
          <div className="flex items-center">
            <span className="mr-[9px] h-1.5 w-1.5 rounded-sm bg-green-700" />

            <span className="text-xs font-bold leading-5 text-[#073B47]">
              Healthy coverage
            </span>

            <span className="ml-[32px] text-xs font-normal leading-5 text-gray-500">
              Updated
            </span>

            <span className="ml-[7px] text-xs font-bold leading-5 text-[#073B47]">
              moments ago
            </span>

            <span className="ml-[28px] text-xs font-normal leading-5 text-gray-500">
              Sourced from
            </span>

            <span className="ml-[10px] text-xs font-bold leading-5 text-[#073B47]">
              4 verified publishers
            </span>
          </div>

          <button
            type="button"
            className="text-xs font-bold leading-4 text-[#066879]"
          >
            Corrections &amp; Source Standards &gt;
          </button>
        </div>

        {/* =========================================
            HEADING
        ========================================= */}
        <h2 className="mt-[17px] text-2xl font-bold leading-9 text-[#073B47]">
          Top stories for Global Coverage
        </h2>

        {/* =========================================
            FIRST STORY
        ========================================= */}
        <article className="mt-[7px] w-full overflow-hidden rounded-[20px] border border-[#066879] bg-white shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]">

          <div className="px-[21px] pt-[21px]">

            {/* TOP STORY */}
            <div className="flex items-center">
              <span className="mr-2 text-[11px] text-amber-600">
                ★
              </span>

              <span className="text-xs font-extrabold uppercase leading-4 tracking-wide text-amber-600">
                Top story
              </span>
            </div>

            {/* TAGS */}
            <div className="mt-[8px] flex flex-wrap items-center gap-2">
              <div className="flex h-7 items-center gap-2 rounded-full border border-zinc-200 bg-gray-50 px-[11px]">
                <span className="text-[10px] text-gray-500">
                  ▱
                </span>

                <span className="text-xs font-bold leading-4 text-gray-500">
                  Policy &amp; Law
                </span>
              </div>

              <span className="rounded-full bg-gray-200 px-[9px] py-[4px] text-xs font-bold leading-4 text-green-700">
                In effect
              </span>

              <span className="text-[10px] text-gray-500">
                ◷
              </span>

              <span className="text-xs font-normal leading-4 text-gray-500">
                47 nations
              </span>

              <span className="text-xs font-normal leading-5 text-gray-500">
                Published 2 hours ago
              </span>
            </div>

            {/* PUBLISHER */}
            <div className="mt-[10px] flex items-center gap-2">
              <span className="text-sm font-bold leading-5 text-[#073B47]">
                World Animal News
              </span>

              <span className="text-xs text-[#066879]">
                ●
              </span>

              <span className="rounded-full bg-slate-100 px-[9px] py-[3px] text-[10px] font-bold text-[#062F39]">
                Source rated Tier 1
              </span>
            </div>

            {/* SOURCE */}
            <p className="text-xs font-normal leading-5 text-gray-500">
              worldanimalnews.example · Global
            </p>

            {/* TITLE */}
            <h3 className="mt-[7px] text-xl font-bold leading-7 text-[#073B47]">
              Major Policy Update on Wildlife Trade Enforcement
            </h3>

            {/* DESCRIPTION */}
            <p className="mt-[4px] text-sm font-normal leading-6 text-[#073B47]">
              An international coalition has strengthened measures to combat
              illegal wildlife trafficking across 47 nations, according to a
              joint statement released Tuesday.
            </p>

            {/* IMAGE */}
            <div className="relative mt-[7px] h-[669px] w-full overflow-hidden rounded-2xl">
              <Image
                src="/your-region/image1.png"
                alt="Wildlife story"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1232px) calc(100vw - 48px), 1190px"
              />
            </div>

            {/* RELEVANCE */}
            <div className="py-[11px]">
              <p className="text-xs font-normal leading-4 text-gray-500">
                Relevant to Global Coverage
              </p>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="mx-[21px] border-t border-zinc-200" />

          {/* =========================================
              ACTION BAR
          ========================================= */}
          <div className="mx-[21px] flex h-12 items-center">

            {/* OPEN SOURCE */}
            <button
              type="button"
              className="ml-[12px] whitespace-nowrap text-xs font-bold leading-5 text-[#062F39]"
            >
              Open Source
            </button>

            {/* FOLLOW TOPIC — PLUS */}
            <button
              type="button"
              className="ml-[27px] flex items-center gap-[7px] whitespace-nowrap text-xs font-semibold leading-5 text-gray-500"
            >
              <PlusIcon />
              <span>Follow topic</span>
            </button>

            {/* SAVE — BOOKMARK */}
            <button
              type="button"
              className="ml-[27px] flex items-center gap-[7px] whitespace-nowrap text-xs font-semibold leading-5 text-gray-500"
            >
              <SaveIcon />
              <span>Save</span>
            </button>

            {/* SHARE */}
            <button
              type="button"
              className="ml-[27px] flex items-center gap-[7px] whitespace-nowrap text-xs font-semibold leading-5 text-gray-500"
            >
              <ShareIcon />
              <span>Share</span>
            </button>

            {/* MORE */}
            <button
              type="button"
              className="ml-[20px] flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-zinc-100"
              aria-label="More options"
            >
              <MoreIcon />
            </button>
          </div>
        </article>

        {/* =========================================
            SECOND STORY
        ========================================= */}
        <article className="mt-[12px] w-full overflow-hidden rounded-[20px] border border-zinc-200 bg-white">

          <div className="px-[21px] pt-[21px]">

            {/* CATEGORY + DATE */}
            <div className="flex items-center gap-3">
              <div className="flex h-7 items-center gap-2 rounded-full border border-zinc-200 bg-gray-50 px-[11px]">
                <span className="text-[10px] text-gray-500">
                  ♡
                </span>

                <span className="text-xs font-bold leading-4 text-gray-500">
                  Rescue &amp; Shelter
                </span>
              </div>

              <span className="text-xs font-normal leading-5 text-gray-500">
                Published 3 hours ago
              </span>
            </div>

            {/* PUBLISHER */}
            <div className="mt-[10px] flex items-center gap-2">
              <span className="text-sm font-bold leading-5 text-[#073B47]">
                Regional Wildlife Gazette
              </span>

              <span className="rounded-full bg-gray-50 px-[9px] py-[3px] text-[10px] font-bold text-gray-500">
                Rating unavailable
              </span>
            </div>

            {/* SOURCE */}
            <p className="text-xs font-normal leading-5 text-gray-500">
              regionalwildlifegazette.example · United States
            </p>

            {/* TITLE */}
            <h3 className="mt-[7px] text-base font-bold leading-5 text-[#073B47]">
              County Shelter Reports Record Intake After Storm
            </h3>

            {/* DESCRIPTION */}
            <p className="mt-[7px] text-sm font-normal leading-6 text-[#073B47]">
              Local officials say the shelter is at capacity following severe
              weather, and are calling for emergency foster volunteers.
            </p>

            {/* IMAGE */}
            <div className="relative mt-[8px] h-[669px] w-full overflow-hidden rounded-2xl">
              <Image
                src="/your-region/image2.png"
                alt="Animal shelter story"
                fill
                className="object-cover"
                sizes="(max-width: 1232px) calc(100vw - 48px), 1190px"
              />
            </div>

            {/* RELEVANCE */}
            <div className="py-[11px]">
              <p className="text-xs font-normal leading-4 text-gray-500">
                Relevant to Global Coverage
              </p>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="mx-[21px] border-t border-zinc-200" />

          {/* =========================================
              SECOND ACTION BAR
          ========================================= */}
          <div className="mx-[21px] flex h-12 items-center">

            {/* OPEN SOURCE */}
            <button
              type="button"
              className="ml-[12px] whitespace-nowrap text-xs font-bold leading-5 text-[#062F39]"
            >
              Open Source
            </button>

            {/* SAVE — BOOKMARK */}
            <button
              type="button"
              className="ml-[27px] flex items-center gap-[7px] whitespace-nowrap text-xs font-semibold leading-5 text-gray-500"
            >
              <SaveIcon />
              <span>Save</span>
            </button>

            {/* SHARE */}
            <button
              type="button"
              className="ml-[27px] flex items-center gap-[7px] whitespace-nowrap text-xs font-semibold leading-5 text-gray-500"
            >
              <ShareIcon />
              <span>Share</span>
            </button>

            {/* MORE */}
            <button
              type="button"
              className="ml-[20px] flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-zinc-100"
              aria-label="More options"
            >
              <MoreIcon />
            </button>
          </div>
        </article>

      </div>
    </section>
  );
}