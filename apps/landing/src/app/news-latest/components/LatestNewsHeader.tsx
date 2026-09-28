"use client";

import { C } from "./theme";

export default function LatestNewsHeader() {
  return (
    <section
      className="w-full"
      style={{ backgroundColor: C.page }}
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1032px]
          flex-col
          items-start
          px-5
          pt-6
          pb-6
          sm:px-8
          lg:px-0
        "
      >
        {/* Breadcrumb */}
        <div className="flex w-full items-center">
          <p className="text-xs leading-5">
            <span
              className="font-normal"
              style={{ color: C.azure42 }}
            >
              News
            </span>

            <span
              className="mx-1"
              style={{ color: C.azure42 }}
            >
              /
            </span>

            <span
              className="font-semibold"
              style={{ color: C.cyan13 }}
            >
              Latest
            </span>
          </p>
        </div>

        {/* Heading */}
        <div className="pt-2">
          <h1
            className="
              text-3xl
              font-extrabold
              leading-[48px]
            "
            style={{ color: C.cyan15 }}
          >
            Latest Animal News
          </h1>
        </div>

        {/* Description */}
        <div className="w-full max-w-[794px]">
          <p
            className="
              text-base
              font-normal
              leading-6
            "
            style={{ color: C.azure42 }}
          >
            The newest verified-source stories across animal welfare,
            conservation, rescue, wildlife crime, veterinary science,
            and policy — with source and update context visible.
          </p>
        </div>

        {/* Updated + Global Coverage */}
        <div
          className="
            flex
            w-full
            flex-wrap
            items-center
            gap-3
            pt-3
          "
        >
          {/* Updated */}
          <div className="flex items-center gap-2">
            <span
              className="
                h-2
                w-2
                shrink-0
                rounded-full
              "
              style={{
                backgroundColor: "#63D38A",
              }}
            />

            <span
              className="
                text-sm
                font-semibold
                leading-5
              "
              style={{ color: C.azure42 }}
            >
              Updated moments ago · new eligible stories appear after
              source, safety, and duplication checks
            </span>
          </div>

          {/* Global coverage */}
          <div
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              border
              px-3.5
              py-1.5
            "
            style={{
              backgroundColor: C.grey95,
              borderColor: C.line,
            }}
          >
            {/* Location icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 21C12 21 19 14.9 19 9.5C19 5.91 15.866 3 12 3C8.134 3 5 5.91 5 9.5C5 14.9 12 21 12 21Z"
                stroke={C.cyan15}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                cx="12"
                cy="9.5"
                r="2.2"
                stroke={C.cyan15}
                strokeWidth="1.8"
              />
            </svg>

            <span
              className="
                text-xs
                font-bold
                leading-5
              "
              style={{ color: C.cyan15 }}
            >
              Global coverage
            </span>
          </div>
        </div>

        {/* How source ratings work */}
        <button
          type="button"
          className="
            mt-1
            inline-flex
            items-center
            gap-1.5
            transition-opacity
            hover:opacity-80
          "
        >
          <span
            className="
              text-base
              font-semibold
              leading-6
            "
            style={{ color: C.cyan25 }}
          >
            How source ratings work
          </span>

          {/* Arrow */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4.75 3.25L8 6L4.75 8.75"
              stroke={C.cyan25}
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}