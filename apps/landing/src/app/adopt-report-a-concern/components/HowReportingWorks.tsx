"use client";

import { C } from "./theme";

type ReportingStep = {
  number: string;
  title: string;
  description: React.ReactNode;
};

const REPORTING_STEPS: ReportingStep[] = [
  {
    number: "1",
    title: "Submit",
    description: (
      <>
        You choose a category, add context, and
        <br className="hidden sm:block" />
        describe what happened.
      </>
    ),
  },
  {
    number: "2",
    title: "Triage",
    description: (
      <>
        We route your report based on category and
        <br className="hidden sm:block" />
        any urgency signal.
      </>
    ),
  },
  {
    number: "3",
    title: "Review",
    description: (
      <>
        Our team reviews the available information
        <br className="hidden sm:block" />
        against our policies.
      </>
    ),
  },
  {
    number: "4",
    title: "Status",
    description: (
      <>
        We take action where appropriate and keep a
        <br className="hidden sm:block" />
        status available to you.
      </>
    ),
  },
];

export default function HowReportingWorks() {
  return (
    <section
      className="w-full"
      style={{ backgroundColor: C.page }}
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 pb-20 sm:px-8 lg:px-10 lg:pb-24">

        {/* =====================================================
            HEADING
        ====================================================== */}
        <div className="mx-auto w-full max-w-[640px] pt-16 text-center">
          <h2
            className="text-3xl font-extrabold leading-[48px]"
            style={{ color: C.inkDeep }}
          >
            How reporting works
          </h2>
        </div>

        {/* =====================================================
            STEPS
        ====================================================== */}
        <div className="relative mt-16 w-full">

          {/* HORIZONTAL CONNECTING LINE */}
          <div
            className="
              absolute
              left-[12.5%]
              right-[12.5%]
              top-[18px]
              hidden
              h-0.5
              sm:block
            "
            style={{ backgroundColor: C.line }}
          />

          <div className="relative grid w-full grid-cols-1 gap-8 sm:grid-cols-4 sm:gap-5">
            {REPORTING_STEPS.map((step) => (
              <ReportingStep
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReportingStep({
  number,
  title,
  description,
}: ReportingStep) {
  return (
    <div className="flex w-full flex-col items-center gap-1 text-center">

      {/* NUMBER CIRCLE */}
      <div
        className="
          relative
          z-10
          flex
          size-9
          shrink-0
          items-center
          justify-center
          rounded-full
          border-2
          bg-white
        "
        style={{
          borderColor: C.brand,
        }}
      >
        <span
          className="text-sm font-extrabold leading-5"
          style={{ color: C.inkDeep }}
        >
          {number}
        </span>
      </div>

      {/* TITLE */}
      <div className="w-full pt-1.5">
        <h3
          className="text-sm font-bold leading-8"
          style={{ color: C.ink }}
        >
          {title}
        </h3>
      </div>

      {/* DESCRIPTION */}
      <div className="w-full">
        <p
          className="text-xs font-normal leading-4"
          style={{ color: C.muted }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}