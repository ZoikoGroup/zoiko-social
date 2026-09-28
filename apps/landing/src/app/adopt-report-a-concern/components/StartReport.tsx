"use client";

import { C } from "./theme";

type ReportStep = {
  number: string;
  title: string;
};

const REPORT_STEPS: ReportStep[] = [
  {
    number: "1",
    title: "Concern",
  },
  {
    number: "2",
    title: "Context",
  },
  {
    number: "3",
    title: "What happened",
  },
  {
    number: "4",
    title: "Evidence",
  },
  {
    number: "5",
    title: "Safety check",
  },
  {
    number: "6",
    title: "Follow-up",
  },
  {
    number: "7",
    title: "Review",
  },
];

export default function StartReport() {
  return (
    <section
      className="w-full"
      style={{ backgroundColor: C.page }}
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1240px]
          px-5
          pb-20
          sm:px-8
          lg:px-10
          lg:pb-24
        "
      >
        {/* =====================================================
            SECTION HEADING
        ====================================================== */}
        <div className="mx-auto w-full max-w-[640px] pt-12 text-center">
          <h2
            className="
              text-3xl
              font-extrabold
              leading-[48px]
            "
            style={{ color: C.inkDeep }}
          >
            Start a report
          </h2>
        </div>

        {/* =====================================================
            REPORT CONTENT
        ====================================================== */}
        <div className="flex w-full items-start gap-8 pt-16">
          {/* ===================================================
              LEFT STEP NAVIGATION
          ==================================================== */}
          <div className="w-56 shrink-0">
            <div className="flex w-full flex-col gap-0.5">
              {REPORT_STEPS.map((step, index) => (
                <ReportStepItem
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  active={index === 0}
                />
              ))}
            </div>
          </div>

          {/* ===================================================
              RIGHT REPORT FORM
          ==================================================== */}
          <div
            className="
              flex
              min-w-0
              flex-1
              flex-col
              items-start
              gap-6
              rounded-[32px]
              border
              bg-white
              p-8
            "
            style={{
              borderColor: C.line,
            }}
          >
            {/* =================================================
                PROGRESS BAR
            ================================================= */}
            <div
              className="
                relative
                h-1.5
                w-full
                overflow-hidden
                rounded-full
              "
              style={{
                backgroundColor: "#F0F2F3",
              }}
            >
              <div
                className="
                  absolute
                  left-0
                  top-0
                  h-1.5
                  w-28
                  rounded-full
                "
                style={{
                  backgroundColor: C.brand,
                }}
              />
            </div>

            {/* =================================================
                FORM CONTENT
            ================================================= */}
            <div
              className="
                flex
                w-full
                flex-col
                items-start
                gap-[5px]
                pb-4
              "
            >
              {/* QUESTION */}
              <div className="flex w-full flex-col items-start">
                <h3
                  className="
                    w-full
                    text-xl
                    font-extrabold
                    leading-8
                  "
                  style={{
                    color: C.inkDeep,
                  }}
                >
                  What&apos;s your concern about?
                </h3>
              </div>

              {/* DESCRIPTION */}
              <div className="flex w-full flex-col items-start">
                <p
                  className="
                    w-full
                    text-sm
                    font-normal
                    leading-5
                  "
                  style={{
                    color: C.muted,
                  }}
                >
                  Choose a category — this updates automatically if you
                  selected one above.
                </p>
              </div>

              {/* CATEGORY STATUS */}
              <div className="flex w-full flex-col items-start pt-4">
                <p
                  className="
                    w-full
                    text-xs
                    font-bold
                    leading-5
                  "
                  style={{
                    color: C.ink,
                  }}
                >
                  No category selected yet
                </p>
              </div>
            </div>

            {/* =================================================
                ACTION BUTTONS
            ================================================= */}
            <div
              className="
                flex
                w-full
                items-start
                gap-2.5
                border-t
                pt-6
              "
              style={{
                borderColor: C.line,
              }}
            >
              {/* BACK */}
              <button
                type="button"
                className="
                  flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  bg-white
                  px-6
                  py-3
                  text-base
                  font-semibold
                "
                style={{
                  color: C.ink,
                  borderColor: C.line,
                }}
              >
                Back
              </button>

              {/* CONTINUE */}
              <button
                type="button"
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  rounded-xl
                  px-6
                  py-3
                  text-base
                  font-semibold
                "
                style={{
                  backgroundColor: C.brand,
                  color: C.white,
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   REPORT STEP ITEM
========================================================= */

function ReportStepItem({
  number,
  title,
  active,
}: {
  number: string;
  title: string;
  active: boolean;
}) {
  return (
    <div
      className="
        w-56
        px-3
        py-2.5
        rounded-lg
        border-2
        inline-flex
        justify-start
        items-center
        gap-2.5
      "
      style={{
        backgroundColor: active ? C.chip : "#F4F4F4",
        borderColor: "#000000",
      }}
    >
      {/* NUMBER CIRCLE */}
      <div
        className="
          size-6
          shrink-0
          rounded-xl
          flex
          items-center
          justify-center
        "
        style={{
          backgroundColor: active ? C.brand : "#F5F5F5",
        }}
      >
        <span
          className="
            text-center
            text-xs
            font-extrabold
            leading-5
          "
          style={{
            color: active ? C.white : C.muted,
          }}
        >
          {number}
        </span>
      </div>

      {/* STEP TITLE */}
      <div className="inline-flex flex-col items-center">
        <span
          className="
            text-center
            text-xs
            font-semibold
            leading-5
          "
          style={{
            color: active ? C.ink : C.muted,
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}