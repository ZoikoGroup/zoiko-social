"use client";

export default function ApprovedPublicRatings() {
  return (
    <section className="w-full bg-[#F5F8F8]">
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1232px]
          lg:h-[550.95px]
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
            whitespace-nowrap
            text-[24px]
            font-extrabold
            leading-10
            tracking-[-0.4px]
            text-[#073B47]
          "
        >
          Approved public ratings, explained
        </h2>

        {/* ========================================================= */}
        {/* DESCRIPTION */}
        {/* ========================================================= */}

        <div
          className="
            absolute
            left-0
            top-[107px]
            w-[652.92px]
            text-[14px]
            font-normal
            leading-6
            text-[#5B7178]
          "
        >
          <div>
            The Zoiko Social News UI currently shows these two public labels.
            We explain only their approved
          </div>

          <div>
            definitions here — no undisclosed thresholds or invented tiers.
          </div>
        </div>

        {/* ========================================================= */}
        {/* TIER 1 CARD */}
        {/* ========================================================= */}

        <div
          className="
            absolute
            left-0
            top-[178.85px]
            h-[208px]
            w-[607px]
            rounded-3xl
            border
            border-[#DCEAEE]
            bg-white
          "
        >
          {/* Tier 1 badge */}
          <div
            className="
              absolute
              left-[25px]
              top-[23px]
              flex
              h-8
              w-44
              items-center
              rounded-lg
              bg-[#F0F7F8]
            "
          >
            <span
              className="
                ml-3
                text-[10px]
                font-bold
                leading-none
                text-[#073B47]
              "
            >
              ✓
            </span>

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

          {/* Tier 1 — Means */}
          <div
            className="
              absolute
              left-[25px]
              top-[73.5px]
              w-[550px]
              text-[13px]
              font-normal
              leading-5
              text-[#073B47]
            "
          >
            <div className="whitespace-nowrap">
              Means: the publisher currently meets our full published standards
              across identity,
            </div>

            <div className="whitespace-nowrap">
              sourcing, corrections, editorial practice, and reliability
              history.
            </div>
          </div>

          {/* Tier 1 — Does not mean */}
          <div
            className="
              absolute
              left-[25px]
              top-[123.34px]
              w-[550px]
              text-[13px]
              font-normal
              italic
              leading-5
              text-[#5B7178]
            "
          >
            <div className="whitespace-nowrap">
              Does not mean: every article from this publisher is accurate,
              complete, or beyond
            </div>

            <div className="whitespace-nowrap">
              question.
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TIER 2 CARD */}
        {/* ========================================================= */}

        <div
          className="
            absolute
            left-[625px]
            top-[178.85px]
            h-[208px]
            w-[607px]
            rounded-3xl
            border
            border-[#DCEAEE]
            bg-white
          "
        >
          {/* Tier 2 badge */}
          <div
            className="
              absolute
              left-[25px]
              top-[23px]
              flex
              h-8
              w-44
              items-center
              rounded-lg
              bg-[#FFF5E9]
            "
          >
            <span
              className="
                ml-3
                text-[10px]
                font-bold
                leading-none
                text-[#D88916]
              "
            >
              ✓
            </span>

            <span
              className="
                ml-[7px]
                whitespace-nowrap
                text-xs
                font-bold
                leading-5
                text-[#D88916]
              "
            >
              Tier 2 Source Verified
            </span>
          </div>

          {/* Tier 2 — Means */}
          <div
            className="
              absolute
              left-[25px]
              top-[73.5px]
              w-[555px]
              text-[13px]
              font-normal
              leading-5
              text-[#073B47]
            "
          >
            <div className="whitespace-nowrap">
              Means: the publisher meets our core published standards, with
              some dimensions
            </div>

            <div className="whitespace-nowrap">
              assessed under a more limited evidence set (for example, a newer
              or more specialized
            </div>

            <div className="whitespace-nowrap">
              outlet).
            </div>
          </div>

          {/* Tier 2 — Does not mean */}
          <div
            className="
              absolute
              left-[25px]
              top-[144.26px]
              w-[555px]
              text-[13px]
              font-normal
              italic
              leading-5
              text-[#5B7178]
            "
          >
            <div className="whitespace-nowrap">
              Does not mean: the publisher is less trustworthy in a general
              sense — context, not size or
            </div>

            <div className="whitespace-nowrap">
              resources, drives the distinction.
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM STATUS CARDS */}
        {/* ========================================================= */}

        {/* Under review */}
        <div
          className="
            absolute
            left-0
            top-[408.96px]
            h-20
            w-[288px]
            rounded-xl
            border
            border-[#DCEAEE]
            bg-white
          "
        >
          <div
            className="
              absolute
              left-[17px]
              top-[13px]
              whitespace-nowrap
              text-xs
              font-bold
              leading-5
              text-[#073B47]
            "
          >
            Under review
          </div>

          <div
            className="
              absolute
              left-[17px]
              top-[36.5px]
              text-xs
              font-normal
              leading-5
              text-[#5B7178]
            "
          >
            <div className="whitespace-nowrap">
              No provisional tier is inferred while a review is
            </div>

            <div>open.</div>
          </div>
        </div>

        {/* Rating updated */}
        <div
          className="
            absolute
            left-[311px]
            top-[408.96px]
            h-20
            w-[288px]
            rounded-xl
            border
            border-[#DCEAEE]
            bg-white
          "
        >
          <div
            className="
              absolute
              left-[17px]
              top-[13px]
              whitespace-nowrap
              text-xs
              font-bold
              leading-5
              text-[#073B47]
            "
          >
            Rating updated
          </div>

          <div
            className="
              absolute
              left-[17px]
              top-[36.5px]
              text-xs
              font-normal
              leading-5
              text-[#5B7178]
            "
          >
            <div className="whitespace-nowrap">
              Shown with an effective date and a public
            </div>

            <div>note on what changed.</div>
          </div>
        </div>

        {/* Not currently rated */}
        <div
          className="
            absolute
            left-[622px]
            top-[408.96px]
            h-20
            w-[288px]
            rounded-xl
            border
            border-[#DCEAEE]
            bg-white
          "
        >
          <div
            className="
              absolute
              left-[17px]
              top-[13px]
              whitespace-nowrap
              text-xs
              font-bold
              leading-5
              text-[#073B47]
            "
          >
            Not currently rated
          </div>

          <div
            className="
              absolute
              left-[17px]
              top-[36.5px]
              text-xs
              font-normal
              leading-5
              text-[#5B7178]
            "
          >
            <div className="whitespace-nowrap">
              Never styled as verified — we say so plainly
            </div>

            <div>instead.</div>
          </div>
        </div>

        {/* Retired / merged */}
        <div
          className="
            absolute
            left-[933px]
            top-[408.96px]
            h-20
            w-[288px]
            rounded-xl
            border
            border-[#DCEAEE]
            bg-white
          "
        >
          <div
            className="
              absolute
              left-[17px]
              top-[13px]
              whitespace-nowrap
              text-xs
              font-bold
              leading-5
              text-[#073B47]
            "
          >
            Retired / merged
          </div>

          <div
            className="
              absolute
              left-[17px]
              top-[36.5px]
              text-xs
              font-normal
              leading-5
              text-[#5B7178]
            "
          >
            <div className="whitespace-nowrap">
              Historical profile preserved with successor
            </div>

            <div>context.</div>
          </div>
        </div>
      </div>
    </section>
  );
}