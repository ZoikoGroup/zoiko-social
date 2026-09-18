"use client";

import React from "react";

/* ============================================================
   SHIELD + CHECK ICON
============================================================ */
function ShieldCheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 1.67L13.33 4V7.47C13.33 10.86 11.13 13.86 8 14.67C4.87 13.86 2.67 10.86 2.67 7.47V4L8 1.67Z"
        stroke="#066879"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.33 8L7.11 9.78L10.67 6.22"
        stroke="#066879"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================================================
   TRIANGLE + EXCLAMATION ICON
============================================================ */
function TriangleWarningIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.03 2.67L1.78 11.78C1.25 12.7 1.92 13.83 2.98 13.83H13.02C14.08 13.83 14.75 12.7 14.22 11.78L8.97 2.67C8.54 1.93 7.46 1.93 7.03 2.67Z"
        stroke="#066879"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 5.67V8.67"
        stroke="#066879"
        strokeWidth="1.33"
        strokeLinecap="round"
      />
      <circle
        cx="8"
        cy="11"
        r="0.67"
        fill="#066879"
      />
    </svg>
  );
}

/* ============================================================
   CIRCLE + X ICON
============================================================ */
function CircleWrongIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="#066879"
        strokeWidth="1.33"
      />
      <path
        d="M5.67 5.67L10.33 10.33"
        stroke="#066879"
        strokeWidth="1.33"
        strokeLinecap="round"
      />
      <path
        d="M10.33 5.67L5.67 10.33"
        stroke="#066879"
        strokeWidth="1.33"
        strokeLinecap="round"
      />
    </svg>
  );
}

type ReportItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  secondLine: string;
};

function ReportItem({
  icon,
  title,
  description,
  secondLine,
}: ReportItemProps) {
  return (
    <button
      type="button"
      className="flex w-full items-start gap-3 rounded-xl border border-[#DCEAEE] bg-white px-3.5 py-3 text-left"
    >
      {/* ICON BOX */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5F7F7]">
        {icon}
      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start gap-x-1">
          <span className="text-xs font-bold leading-4 text-black">
            {title}
          </span>

          <span className="text-xs font-normal leading-4 text-[#6B8790]">
            {description}
          </span>
        </div>

        <p className="mt-0.5 text-xs font-normal leading-4 text-[#6B8790]">
          {secondLine}
        </p>
      </div>
    </button>
  );
}

export default function SourceStandards() {
  return (
    <section className="w-full bg-[#F5F8F8] py-6">
      <div className="mx-auto w-full max-w-[1232px] px-4 lg:px-0">

        {/* TWO CARDS */}
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">

          {/* ======================================================
              SOURCE STANDARDS
          ====================================================== */}
          <div className="flex min-h-[286px] flex-col rounded-3xl border border-[#DCEAEE] bg-white px-7 py-6">

            <h2 className="text-base font-extrabold leading-6 text-[#073B47]">
              Source Standards
            </h2>

            <p className="mt-1.5 text-xs font-normal leading-5 text-[#6B8790]">
              Source rating reflects the publisher against Zoiko Social&apos;s
              published standards — it is not a guarantee of every individual
              claim. Ratings can become unavailable during methodology review;
              when that happens, we show a neutral label rather than a stale
              tier.
            </p>

            <p className="mt-1 text-xs font-normal leading-5 text-[#6B8790]">
              Corrections, retractions, and material action/protection status
              changes always outrank reactions and community activity, and stay
              visible with a timestamp and what changed.
            </p>
          </div>

          {/* ======================================================
              REPORT SOMETHING
          ====================================================== */}
          <div className="flex min-h-[286px] flex-col rounded-3xl border border-[#DCEAEE] bg-white px-7 py-6">

            <h2 className="text-base font-extrabold leading-6 text-[#073B47]">
              Report something
            </h2>

            <p className="mt-1.5 text-xs font-normal leading-5 text-[#6B8790]">
              These routes are intentionally separate — misrouting a safety
              concern as an editorial note (or the reverse) slows down the
              right response.
            </p>

            {/* REPORT OPTIONS */}
            <div className="mt-2.5 flex flex-col gap-2.5">

              {/* 1. REPORT AN INACCURACY → SHIELD + CHECK */}
<ReportItem
  icon={<ShieldCheckIcon />}
  title="Report an Inaccuracy"
  description="Headline, summary, source, or media problem"
  secondLine="with a specific story."
/>

{/* 2. ANIMAL WELFARE SAFETY CONCERN → TRIANGLE + ! */}
<ReportItem
  icon={<TriangleWarningIcon />}
  title="Animal Welfare Safety Concern"
  description="Active animal abuse or exploitation"
  secondLine="— routes to the Safety Center, not this editorial queue."
/>

{/* 3. WILDLIFE CRIME / POACHING CONCERN → CIRCLE + X */}
<ReportItem
  icon={<CircleWrongIcon />}
  title="Wildlife Crime / Poaching Concern"
  description="Suspected trafficking or"
  secondLine="poaching — routes to Wildlife Crime reporting, not comments."
/>
            </div>

            {/* SAFETY NOTE */}
            <div className="mt-2.5 rounded-[10px] bg-[#F0F7F8] px-3 py-2.5">
              <p className="text-xs font-normal leading-5 text-[#6B8790]">
                Sensitive nesting, breeding, denning, release/reintroduction,
                and ranger-operation locations are withheld or broadened by
                default — reporting never requires you to disclose one.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}