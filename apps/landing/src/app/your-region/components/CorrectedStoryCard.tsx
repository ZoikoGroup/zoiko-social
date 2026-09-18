"use client";

export default function CorrectedStoryCard() {
  return (
    <section className="w-full bg-[#F5F8F8]">
      <div className="mx-auto w-full max-w-[1232px] px-6 pb-20 lg:px-0">

        {/* =====================================================
            CORRECTED STORY CARD
        ===================================================== */}
        <article className="w-full overflow-hidden rounded-[20px] border border-zinc-200 bg-white">

          {/* ===================================================
              CARD CONTENT
          =================================================== */}
          <div className="px-[21px] pt-[21px]">

            {/* -----------------------------------------------
                TOP ROW
            ----------------------------------------------- */}
            <div className="flex items-center">

              {/* Corrected */}
              <div className="flex h-6 items-center gap-[7px] rounded-full border border-zinc-200 bg-slate-100 px-[10px]">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle
                    cx="5.5"
                    cy="5.5"
                    r="3.25"
                    stroke="#062F39"
                    strokeWidth="0.9"
                  />

                  <path
                    d="M3.7 5.5L4.8 6.55L7.35 4"
                    stroke="#062F39"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="text-xs font-bold leading-4 text-[#062F39]">
                  Corrected
                </span>
              </div>

              {/* Policy & Law */}
              <div className="ml-[13px] flex h-7 items-center gap-2 rounded-full border border-zinc-200 bg-gray-50 px-[11px]">

                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M2 3.2H8L7.2 7H2.8L2 3.2Z"
                    stroke="#6B7280"
                    strokeWidth="0.8"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M3.2 3.2L4 2H6L6.8 3.2"
                    stroke="#6B7280"
                    strokeWidth="0.8"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="text-xs font-bold leading-4 text-gray-500">
                  Policy &amp; Law
                </span>
              </div>

              {/* Published */}
              <span className="ml-[13px] text-xs font-normal leading-5 text-gray-500">
                Published 9 hours ago
              </span>
            </div>

            {/* -----------------------------------------------
                PUBLISHER
            ----------------------------------------------- */}
            <div className="mt-[10px] flex items-center">

              <span className="text-sm font-bold leading-5 text-[#073B47]">
                World Animal News
              </span>

              {/* Verified icon */}
              <svg
                className="ml-[4px]"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M7 1.3L8.45 2.25L10.15 2.2L10.9 3.75L12.25 4.8L11.8 6.4L12.25 8L10.9 9.05L10.15 10.6L8.45 10.55L7 11.5L5.55 10.55L3.85 10.6L3.1 9.05L1.75 8L2.2 6.4L1.75 4.8L3.1 3.75L3.85 2.2L5.55 2.25L7 1.3Z"
                  fill="#066879"
                />

                <path
                  d="M4.5 6.4L6.1 7.8L9.55 4.55"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Source rated */}
              <span className="ml-[5px] rounded-full bg-slate-100 px-[9px] py-[3px] text-[10px] font-bold text-[#062F39]">
                Source rated Tier 1
              </span>
            </div>

            {/* -----------------------------------------------
                SOURCE
            ----------------------------------------------- */}
            <p className="text-xs font-normal leading-5 text-gray-500">
              worldanimalnews.example · Global
            </p>

            {/* -----------------------------------------------
                TITLE
            ----------------------------------------------- */}
            <h2 className="mt-[7px] text-base font-bold leading-5 text-[#073B47]">
              Animal Shelter Capacity Initiative Figures Corrected
            </h2>

            {/* -----------------------------------------------
                DESCRIPTION
            ----------------------------------------------- */}
            <p className="mt-[7px] text-sm font-normal leading-6 text-[#073B47]">
              A national program aims to increase shelter resources and
              adoption rates across the country.
            </p>

            {/* -----------------------------------------------
                CORRECTION NOTICE
            ----------------------------------------------- */}
            <div className="mt-[8px] flex min-h-[44px] w-full items-center rounded-[10px] border border-orange-500 bg-orange-50 px-[15px]">

              {/* Warning icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-[10px] shrink-0"
                aria-hidden="true"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="5"
                  stroke="#D97706"
                  strokeWidth="1.2"
                />

                <path
                  d="M8 4.8V8.5"
                  stroke="#D97706"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />

                <circle
                  cx="8"
                  cy="10.8"
                  r="0.7"
                  fill="#D97706"
                />
              </svg>

              <p className="text-xs leading-5 text-yellow-900">
                <span className="font-bold">
                  Corrected 1 hour ago:
                </span>{" "}
                <span className="font-normal">
                  Funding figures were corrected from an earlier version of
                  this story. Original publish time is unchanged.
                </span>
              </p>
            </div>

            {/* -----------------------------------------------
                RELEVANCE
            ----------------------------------------------- */}
            <div className="py-[11px]">
              <p className="text-xs font-normal leading-4 text-gray-500">
                Relevant to Global Coverage
              </p>
            </div>
          </div>

          {/* =================================================
              DIVIDER
          ================================================= */}
          <div className="mx-[21px] border-t border-zinc-200" />

          {/* =================================================
              ACTION BAR
          ================================================= */}
          <div className="mx-[21px] flex h-12 items-center">

            {/* Open Source */}
            <button
              type="button"
              className="ml-[12px] whitespace-nowrap text-xs font-bold leading-5 text-[#062F39]"
            >
              Open Source
            </button>

            {/* Save */}
            <button
              type="button"
              className="ml-[27px] flex items-center gap-[7px] whitespace-nowrap text-xs font-semibold leading-5 text-gray-500"
            >
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

              <span>Save</span>
            </button>

            {/* Share */}
            <button
              type="button"
              className="ml-[27px] flex items-center gap-[7px] whitespace-nowrap text-xs font-semibold leading-5 text-gray-500"
            >
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

              <span>Share</span>
            </button>

            {/* More */}
            <button
              type="button"
              aria-label="More options"
              className="ml-[20px] flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-zinc-100"
            >
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
            </button>
          </div>
        </article>

      </div>
    </section>
  );
}