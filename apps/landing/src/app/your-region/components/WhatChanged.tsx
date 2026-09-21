"use client";

function CircularArrowsIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top/right circular arrow */}
      <path
        d="M11.85 5.1C11.15 3.45 9.52 2.3 7.62 2.3C5.58 2.3 3.85 3.62 3.27 5.47"
        stroke="#D97706"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M10.15 2.65L11.9 2.35L12.2 4.1"
        stroke="#D97706"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom/left circular arrow */}
      <path
        d="M3.15 9.9C3.85 11.55 5.48 12.7 7.38 12.7C9.42 12.7 11.15 11.38 11.73 9.53"
        stroke="#D97706"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M4.85 12.35L3.1 12.65L2.8 10.9"
        stroke="#D97706"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.25 7.65L6.15 10.45L11.75 4.75"
        stroke="#D97706"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function WhatChanged() {
  return (
    <section className="w-full bg-[#F5F8F8]">
      <div className="mx-auto w-full max-w-[1232px] px-6 pb-20 lg:px-0">

        {/* Heading */}
        <div className="mx-auto flex h-20 w-[640px] max-w-full flex-col items-center">
          <h2 className="text-center text-[30px] font-extrabold leading-[48px] text-cyan-950">
            What changed
          </h2>

          <p className="mt-[12px] text-center text-base font-normal leading-6 text-gray-500">
            Material updates to stories you&apos;ve followed, saved, or read.
          </p>
        </div>

        {/* Update Cards */}
        <div className="mt-8 flex flex-col gap-2">

          {/* First Update */}
          <div className="flex min-h-20 w-full items-start rounded-[10px] border border-zinc-200 bg-white px-[17px] py-[15px]">
            
            {/* Orange Icon Box */}
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-50">
              <CircularArrowsIcon />
            </div>

            {/* Content */}
            <div className="ml-3 min-w-0">
              <p className="text-xs font-bold leading-5 text-teal-950">
                &quot;Animal Shelter Capacity Initiative&quot; was corrected
              </p>

              <p className="mt-[7.5px] text-xs font-normal leading-4 text-gray-500">
                Funding figures were updated 1 hour ago. You saved this story.
              </p>
            </div>
          </div>

          {/* Second Update */}
          <div className="flex min-h-20 w-full items-start rounded-[10px] border border-zinc-200 bg-white px-[17px] py-[15px]">
            
            {/* Orange Icon Box */}
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-50">
              <CheckIcon />
            </div>

            {/* Content */}
            <div className="ml-3 min-w-0">
              <p className="text-xs font-bold leading-5 text-teal-950">
                Boarding kennel standards moved to &quot;Proposed&quot;
              </p>

              <p className="mt-[7.5px] text-xs font-normal leading-4 text-gray-500">
                Policy status changed since you last viewed this story.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}