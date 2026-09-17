"use client";

import Link from "next/link";
import { C } from "./theme";

export default function Hero() {
  return (
    <section
      className="w-full"
      style={{ backgroundColor: C.page }}
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">

          {/* LEFT COLUMN */}
          <div className="flex w-full flex-col items-start">
            <div
              className="w-full text-base font-normal leading-6"
              style={{ color: C.ink }}
            >
              Adoption &amp; Foster Safety
            </div>

            <h1
              className="mt-1 w-full text-3xl font-extrabold leading-[48px] sm:text-4xl"
              style={{ color: C.inkDeep }}
            >
              See something that doesn&apos;t look right?
              <br className="hidden sm:block" />
              Tell us.
            </h1>

            <p
              className="mt-3 w-full max-w-[640px] text-base font-normal leading-6"
              style={{ color: C.ink }}
            >
              Report suspicious listings, unsafe adoption or foster behavior,
              animal-welfare concerns, impersonation, scams, harassment, or
              other activity that may violate Zoiko Social&apos;s safety rules.
            </p>

            <div className="mt-5 flex w-full flex-wrap items-center gap-3">
              <Link
                href="#report-form"
                className="inline-flex min-h-[50px] items-center justify-center rounded-xl px-6 py-3 text-base font-semibold leading-6 text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: C.brand }}
              >
                Start a report
              </Link>

              <Link
                href="/adoption-safety"
                className="inline-flex min-h-[50px] items-center justify-center rounded-xl border bg-white px-6 py-3 text-base font-semibold leading-6 transition-colors"
                style={{
                  borderColor: C.line,
                  color: C.inkDeep,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = C.page;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = C.white;
                }}
              >
                Review Adoption Safety
              </Link>
            </div>

            <div className="mt-5 w-full max-w-[640.5px]">
              <p
                className="text-xs font-normal leading-5"
                style={{ color: C.muted }}
              >
                Reporting does not automatically mean a person, listing, or
                organization violated policy. Zoiko Social reviews the
                available information and takes action where appropriate.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div
            className="w-full rounded-[32px] border bg-white px-5 pt-7 pb-4 shadow-[0px_8px_24px_0px_rgba(7,59,71,0.10)]"
            style={{ borderColor: C.line }}
          >
            <p
              className="text-xs font-bold uppercase leading-5 tracking-wide"
              style={{ color: C.muted }}
            >
              What happens after you report
            </p>

            <div className="mt-5 flex flex-col">
              <ReportStep
                number="1"
                title="Submit"
                description="You send us the details, on your terms."
                showLine
              />

              <ReportStep
                number="2"
                title="Triage"
                description="We route it based on category and urgency."
                showLine
              />

              <ReportStep
                number="3"
                title="Review"
                description="Our team reviews the available information."
                showLine
              />

              <ReportStep
                title="Status & closure"
                description="Action where appropriate; status stays available to you."
                completed
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type ReportStepProps = {
  number?: string;
  title: string;
  description: string;
  showLine?: boolean;
  completed?: boolean;
};

function ReportStep({
  number,
  title,
  description,
  showLine,
  completed,
}: ReportStepProps) {
  return (
    <div className="relative flex items-start gap-3.5 pb-5 last:pb-0">
      <div
        className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: completed ? C.brand : C.chip,
        }}
      >
        {completed ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3.1 7.1L5.7 9.55L10.9 4.45"
              stroke={C.white}
              strokeWidth="1.52"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span
            className="text-xs font-extrabold leading-5"
            style={{ color: C.inkDeep }}
          >
            {number}
          </span>
        )}
      </div>

      {showLine && (
        <div
          className="absolute left-[15px] top-[34px] h-9 w-0.5"
          style={{ backgroundColor: C.line }}
        />
      )}

      <div className="min-w-0 flex-1">
        <h3
          className="text-sm font-bold leading-5"
          style={{ color: C.ink }}
        >
          {title}
        </h3>

        <p
          className="mt-[6px] text-xs font-normal leading-4"
          style={{ color: C.muted }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}