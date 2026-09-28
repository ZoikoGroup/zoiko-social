"use client";

function GlobeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer globe */}
      <circle
        cx="10"
        cy="10"
        r="7.5"
        stroke="#073B47"
        strokeWidth="1.67"
      />

      {/* Vertical globe line */}
      <path
        d="M10 2.5C7.95 4.45 6.83 7.1 6.83 10C6.83 12.9 7.95 15.55 10 17.5"
        stroke="#073B47"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      <path
        d="M10 2.5C12.05 4.45 13.17 7.1 13.17 10C13.17 12.9 12.05 15.55 10 17.5"
        stroke="#073B47"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Horizontal globe lines */}
      <path
        d="M3 7.25H17"
        stroke="#073B47"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      <path
        d="M3 12.75H17"
        stroke="#073B47"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SourceStandardsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Document/book shape */}
      <path
        d="M5.5 3.33H13.5C14.42 3.33 15.17 4.08 15.17 5V14.5C15.17 15.42 14.42 16.17 13.5 16.17H5.5C4.58 16.17 3.83 15.42 3.83 14.5V5C3.83 4.08 4.58 3.33 5.5 3.33Z"
        stroke="#073B47"
        strokeWidth="1.67"
        strokeLinejoin="round"
      />

      {/* Fold/detail */}
      <path
        d="M12.5 3.33V6.67H15.17"
        stroke="#073B47"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M6.67 9.17H12.33"
        stroke="#073B47"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      <path
        d="M6.67 12H10.83"
        stroke="#073B47"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.33 4.58C3.33 3.89 3.89 3.33 4.58 3.33H15.42C16.11 3.33 16.67 3.89 16.67 4.58V12.08C16.67 12.77 16.11 13.33 15.42 13.33H8.33L5 16.67V13.33H4.58C3.89 13.33 3.33 12.77 3.33 12.08V4.58Z"
        stroke="#073B47"
        strokeWidth="1.67"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4.5 3L7.5 6L4.5 9"
        stroke="#066879"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BeyondRegion() {
  return (
    <section className="w-full bg-[#F5F8F8]">
      <div className="mx-auto w-full max-w-[1232px] px-6 pb-20 lg:px-0">

        {/* Beyond your region */}
        <div className="flex flex-col">

          {/* Globe */}
          <div className="flex h-5 w-5 items-center justify-center">
            <GlobeIcon />
          </div>

          <h3 className="mt-[6px] text-lg font-bold leading-7 text-teal-950">
            Beyond your region
          </h3>

          <p className="mt-[1.08px] text-base font-normal leading-6 text-teal-950">
            See stories relevant to a broader parent region, or browse everything
            with no region filter.
          </p>

          <a
            href="#"
            className="mt-0 flex h-6 w-fit items-center text-base font-semibold leading-6 text-cyan-800"
          >
            <span>Browse Global Coverage</span>
            <span className="ml-[6px] flex size-3 items-center justify-center">
              <ChevronIcon />
            </span>
          </a>
        </div>

        {/* Source Standards */}
        <div className="mt-0 flex flex-col">

          {/* Source icon */}
          <div className="flex h-5 w-5 items-center justify-center">
            <SourceStandardsIcon />
          </div>

          <h3 className="mt-[6px] text-lg font-bold leading-7 text-teal-950">
            Source Standards
          </h3>

          <p className="mt-[1.08px] text-base font-normal leading-6 text-teal-950">
            Understand what a source rating means, and what it doesn&apos;t
            guarantee.
          </p>

          <a
            href="#"
            className="flex h-6 w-fit items-center text-base font-semibold leading-6 text-cyan-800"
          >
            <span>Read Source Standards</span>
            <span className="ml-[6px] flex size-3 items-center justify-center">
              <ChevronIcon />
            </span>
          </a>
        </div>

        {/* Report an Inaccuracy */}
        <div className="mt-0 flex flex-col">

          {/* Message icon */}
          <div className="flex h-5 w-5 items-center justify-center">
            <MessageIcon />
          </div>

          <h3 className="mt-[6px] text-lg font-bold leading-7 text-teal-950">
            Report an Inaccuracy
          </h3>

          <p className="mt-[1.08px] text-base font-normal leading-6 text-teal-950">
            See a factual error in a story? Report it separately from safety
            concerns.
          </p>

          <a
            href="#"
            className="flex h-6 w-fit items-center text-base font-semibold leading-6 text-cyan-800"
          >
            <span>Report an Inaccuracy</span>
            <span className="ml-[6px] flex size-3 items-center justify-center">
              <ChevronIcon />
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}