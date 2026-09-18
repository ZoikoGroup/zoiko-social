"use client";

import Image from "next/image";

export default function SourceProfileProof() {
  return (
    <section className="w-full bg-[#F5F8F8]">
      <div
        className="
          relative
          mx-auto
          h-[807.63px]
          w-full
          max-w-[1232px]
        "
      >
        {/* ========================================================= */}
        {/* HEADING */}
        {/* ========================================================= */}

        <h2
          className="
            absolute
            left-0
            top-[56px]
            m-0
            h-10
            w-64
            whitespace-nowrap
            text-[24px]
            font-extrabold
            leading-10
            tracking-[-0.4px]
            text-[#073B47]
          "
        >
          Source profile proof
        </h2>

        {/* ========================================================= */}
        {/* DESCRIPTION */}
        {/* ========================================================= */}

        <p
          className="
            absolute
            left-0
            top-[107px]
            m-0
            h-4
            w-[686.53px]
            whitespace-nowrap
            text-[14px]
            font-normal
            leading-6
            text-[#5B7178]
          "
        >
          This is exactly what a reader can inspect for any actively rated
          source — nothing more, nothing hidden.
        </p>

        {/* ========================================================= */}
        {/* MAIN PROFILE CARD */}
        {/* ========================================================= */}

        <div
          className="
            absolute
            left-0
            top-[154.92px]
            h-[596.70px]
            w-[1232px]
            overflow-hidden
            rounded-[24px]
            border
            border-[#E1E6E8]
            bg-white
            shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]
          "
        >
          {/* ======================================================= */}
          {/* NOTEBOOK IMAGE / TOP IMAGE */}
          {/* ======================================================= */}

          <div
            className="
              absolute
              left-0
              top-0
              h-[128px]
              w-full
              overflow-hidden
            "
          >
            <Image
              src="/source-standards/notebook.png"
              alt=""
              fill
              priority
              sizes="1232px"
              className="object-cover"
            />
          </div>

          {/* ======================================================= */}
          {/* PROFILE NAME */}
          {/* ======================================================= */}

          <div
            className="
              absolute
              left-[29px]
              top-[155px]
              h-7
              w-72
              whitespace-nowrap
              text-[18px]
              font-extrabold
              leading-7
              text-[#073B47]
            "
          >
            National Wildlife Press Bureau
          </div>

          {/* ======================================================= */}
          {/* PROFILE SUBTITLE */}
          {/* ======================================================= */}

          <div
            className="
              absolute
              left-[29px]
              top-[186.5px]
              h-5
              w-80
              whitespace-nowrap
              text-xs
              font-normal
              leading-5
              text-[#5B7178]
            "
          >
            Independent news publisher · United States · English
          </div>

          {/* ======================================================= */}
          {/* VERIFIED BADGE */}
          {/* ======================================================= */}

          <div
            className="
              absolute
              left-[1034.05px]
              top-[155px]
              flex
              h-8
              w-44
              items-center
              rounded-lg
              bg-[#F0F7F8]
            "
          >
            {/* Check icon */}
            <div
              className="
                ml-3
                flex
                h-2
                w-2
                items-center
                justify-center
              "
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1.4 4.1L3.1 5.8L6.6 2.2"
                  stroke="#073B47"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <span
              className="
                ml-[7px]
                whitespace-nowrap
                text-xs
                font-bold
                leading-5
                text-[#073B47]
              "
            >
              Tier 1 Source Verified
            </span>
          </div>

          {/* ======================================================= */}
          {/* WHAT THIS RATING MEANS */}
          {/* ======================================================= */}

          <div
            className="
              absolute
              left-[29px]
              top-[239.88px]
              h-4
              w-36
              whitespace-nowrap
              text-[11px]
              font-bold
              uppercase
              leading-4
              tracking-[0.3px]
              text-[#5B7178]
            "
          >
            What this rating means
          </div>

          <div
            className="
              absolute
              left-[29px]
              top-[264.38px]
              h-9
              w-[572.25px]
              text-xs
              font-normal
              leading-5
              text-[#073B47]
            "
          >
            Currently meets published standards for identity, sourcing,
            corrections, editorial practice, and
            <br />
            reliability history.
          </div>

          {/* ======================================================= */}
          {/* WHAT THIS RATING DOES NOT MEAN */}
          {/* ======================================================= */}

          <div
            className="
              absolute
              left-[624px]
              top-[239.88px]
              h-4
              w-52
              whitespace-nowrap
              text-[11px]
              font-bold
              uppercase
              leading-4
              tracking-[0.3px]
              text-[#5B7178]
            "
          >
            What this rating does not mean
          </div>

          <div
            className="
              absolute
              left-[624px]
              top-[262.38px]
              h-5
              w-[577.47px]
              whitespace-nowrap
              text-xs
              font-normal
              leading-5
              text-[#073B47]
            "
          >
            Not a guarantee that every article is accurate, complete, current,
            or right for a specific decision.
          </div>

          {/* ======================================================= */}
          {/* STANDARDS DIMENSION SUMMARIES */}
          {/* ======================================================= */}

          <div
            className="
              absolute
              left-[29px]
              top-[334.60px]
              h-4
              w-52
              whitespace-nowrap
              text-[11px]
              font-bold
              uppercase
              leading-4
              tracking-[0.3px]
              text-[#5B7178]
            "
          >
            Standards dimension summaries
          </div>

          <div
            className="
              absolute
              left-[29px]
              top-[357.10px]
              w-[579px]
              text-xs
              font-normal
              leading-5
              text-[#073B47]
            "
          >
            {/* Row 1 */}
            <div className="flex h-[20.8px] items-start">
              <span className="mr-2">•</span>
              <span>
                Identity &amp; accountability — established masthead and
                editorial contact
              </span>
            </div>

            {/* Row 2 */}
            <div className="flex h-[20.8px] items-start">
              <span className="mr-2">•</span>
              <span>
                Sourcing &amp; attribution — consistent use of named,
                attributable sources
              </span>
            </div>

            {/* Row 3 */}
            <div className="flex h-[20.8px] items-start">
              <span className="mr-2">•</span>
              <span>
                Corrections — published corrections policy with visible
                history
              </span>
            </div>
          </div>

          {/* ======================================================= */}
          {/* EDITORIAL TRANSPARENCY */}
          {/* ======================================================= */}

          <div
            className="
              absolute
              left-[624px]
              top-[334.60px]
              h-4
              w-40
              whitespace-nowrap
              text-[11px]
              font-bold
              uppercase
              leading-4
              tracking-[0.3px]
              text-[#5B7178]
            "
          >
            Editorial transparency
          </div>

          <div
            className="
              absolute
              left-[624px]
              top-[359.10px]
              h-9
              w-[531.81px]
              text-xs
              font-normal
              leading-5
              text-[#073B47]
            "
          >
            Reporting, opinion, and sponsored content are labeled separately.
            Bylines are standard
            <br />
            practice.
          </div>

          {/* ======================================================= */}
          {/* RECENT CITED STORIES */}
          {/* ======================================================= */}

          <div
            className="
              absolute
              left-[29px]
              top-[450.11px]
              h-4
              w-32
              whitespace-nowrap
              text-[11px]
              font-bold
              uppercase
              leading-4
              tracking-[0.3px]
              text-[#5B7178]
            "
          >
            Recent cited stories
          </div>

          <div
            className="
              absolute
              left-[29px]
              top-[472.61px]
              w-[579px]
              text-xs
              font-normal
              leading-5
              text-[#073B47]
            "
          >
            {/* Story 1 */}
            <div className="flex h-[20.8px] items-start">
              <span className="mr-2">•</span>
              <span>
                Regional wildlife corridor moves to active protection —
                Evidence: Official document
              </span>
            </div>

            {/* Story 2 */}
            <div className="flex h-[20.8px] items-start">
              <span className="mr-2">•</span>
              <span>
                Long-term reef monitoring shows mixed recovery signals —
                Evidence: Peer-reviewed study
              </span>
            </div>
          </div>

          {/* ======================================================= */}
          {/* CHANGE HISTORY */}
          {/* ======================================================= */}

          <div
            className="
              absolute
              left-[624px]
              top-[450.11px]
              h-4
              w-24
              whitespace-nowrap
              text-[11px]
              font-bold
              uppercase
              leading-4
              tracking-[0.3px]
              text-[#5B7178]
            "
          >
            Change history
          </div>

          <div
            className="
              absolute
              left-[624px]
              top-[472.61px]
              w-[579px]
              text-xs
              font-normal
              leading-5
              text-[#073B47]
            "
          >
            {/* History 1 */}
            <div className="flex h-[20.8px] items-start">
              <span className="mr-2">•</span>
              <span>
                Aug 12, 2026 — Rating reaffirmed under Standards v2.3
              </span>
            </div>

            {/* History 2 */}
            <div className="flex h-[20.8px] items-start">
              <span className="mr-2">•</span>
              <span>
                Jan 4, 2025 — Initial Tier 1 designation under Standards v2.1
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}