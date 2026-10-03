"use client";

import { C } from "./theme";

export default function WelfareBrief() {
  return (
    <section
      className="w-full"
      style={{
        backgroundColor: C.page,
      }}
    >
      <div
        className="
          w-full
          px-4
          pb-8
          sm:px-6
          sm:pb-10
          lg:px-0
          lg:pb-[40px]
        "
      >
        {/* Same width as Conservation News Hero */}
        <div
          className="
            relative
            mx-auto
            w-full
            max-w-[1232px]
            min-h-[208px]
            rounded-[20px]
            border
            sm:rounded-[24px]
          "
          style={{
            backgroundColor: C.white,
            borderColor: C.cyan89,
          }}
        >
          {/* Header */}
          <div
            className="
              flex
              items-center
              gap-2
              px-5
              pt-[21px]
              sm:px-8
              lg:px-9
            "
          >
            {/* Message Box Icon */}
            <div className="relative h-4 w-4 shrink-0">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 3.25H13C13.5523 3.25 14 3.69772 14 4.25V10.25C14 10.8023 13.5523 11.25 13 11.25H7.25L4.25 13.25V11.25H3C2.44772 11.25 2 10.8023 2 10.25V4.25C2 3.69772 2.44772 3.25 3 3.25Z"
                  stroke={C.cyan15}
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M5 6.5H11"
                  stroke={C.cyan15}
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />

                <path
                  d="M5 8.5H9"
                  stroke={C.cyan15}
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2
              className="
                text-base
                font-bold
                uppercase
                leading-6
                tracking-wide
              "
              style={{
                color: C.cyan15,
              }}
            >
              Welfare Brief — Lead Story
            </h2>
          </div>

          {/* Content */}
          <div
            className="
              grid
              grid-cols-1
              gap-x-8
              gap-y-6
              px-5
              pt-3
              pb-5
              sm:px-8
              md:grid-cols-2
              lg:grid-cols-3
              lg:px-9
            "
          >
            {/* Issue */}
            <BriefItem label="Issue">
              An international coalition has strengthened enforcement
              measures against illegal wildlife trafficking.
            </BriefItem>

            {/* Why it matters */}
            <BriefItem label="Why it matters">
              Coordinated cross-border enforcement can materially reduce
              trafficking routes that harm wild populations.
            </BriefItem>

            {/* Jurisdiction */}
            <BriefItem label="Jurisdiction">
              Multilateral — 47 participating nations
            </BriefItem>

            {/* Status */}
            <BriefItem label="Status">
              <span
                className="
                  inline-flex
                  items-center
                  rounded-full
                  px-2
                  py-[3px]
                  text-xs
                  font-bold
                  leading-4
                "
                style={{
                  backgroundColor: C.grey94,
                  color: "#3D8A54",
                }}
              >
                In effect
              </span>
            </BriefItem>

            {/* Source Basis */}
            <BriefItem label="Source basis">
              <div className="flex flex-wrap items-center gap-1">
                <span
                  className="
                    text-sm
                    font-normal
                    leading-5
                  "
                  style={{
                    color: C.cyan13,
                  }}
                >
                  World Animal News ·
                </span>

                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    border
                    px-2
                    py-[1.5px]
                    text-xs
                    font-semibold
                    leading-4
                  "
                  style={{
                    backgroundColor: C.grey97,
                    borderColor: C.cyan89,
                    color: C.azure42,
                  }}
                >
                  Official document
                </span>
              </div>
            </BriefItem>

            {/* What Changed */}
            <BriefItem label="What changed">
              New joint enforcement commitments were signed this week,
              expanding on a prior framework.
            </BriefItem>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------
   Reusable Brief Item
---------------------------------------------- */

type BriefItemProps = {
  label: string;
  children: React.ReactNode;
};

function BriefItem({ label, children }: BriefItemProps) {
  return (
    <div
      className="
        flex
        min-w-0
        flex-col
        items-start
        gap-1
      "
    >
      {/* Label */}
      <div
        className="
          text-xs
          font-bold
          uppercase
          leading-4
          tracking-wide
        "
        style={{
          color: C.azure42,
        }}
      >
        {label}
      </div>

      {/* Content */}
      <div
        className="
          text-sm
          font-normal
          leading-5
        "
        style={{
          color: C.cyan13,
        }}
      >
        {children}
      </div>
    </div>
  );
}