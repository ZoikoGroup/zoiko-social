"use client";

import { C } from "./theme";

export default function EvidencePrivacy() {
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
          sm:px-8
          lg:px-10
        "
      >
        {/* =========================
            SECTION HEADER
        ========================== */}
        <div className="flex w-full justify-center pt-12">
          <div className="flex w-full max-w-[640px] flex-col items-center gap-3">
            <h2
              className="
                text-center
                text-[30px]
                font-extrabold
                leading-[48px]
              "
              style={{ color: C.ink }}
            >
              Evidence &amp; privacy
            </h2>

            <p
              className="
                text-center
                text-base
                font-normal
                leading-6
              "
              style={{ color: C.muted }}
            >
              What helps, and what to leave out.
            </p>
          </div>
        </div>

        {/* =========================
            EVIDENCE CARDS
        ========================== */}
        <div
          className="
            grid
            w-full
            grid-cols-1
            gap-4
            pt-16
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {/* Evidence is optional */}
          <EvidenceCard
            icon={<EvidenceIcon />}
            title="Evidence is optional"
            description={
              <>
                Relevant context helps our review, but you&apos;re never
                <br className="hidden lg:block" />
                required to attach anything to submit a report.
              </>
            }
          />

          {/* Skip sensitive data */}
          <EvidenceCard
            icon={<LockIcon />}
            title="Skip sensitive data"
            description={
              <>
                Don&apos;t include passwords, full payment credentials,
                <br className="hidden lg:block" />
                government IDs, or unrelated third-party information.
              </>
            }
          />

          {/* Never put yourself at risk */}
          <EvidenceCard
            warning
            icon={<WarningIcon />}
            title="Never put yourself at risk"
            description={
              <>
                We never ask you to confront anyone or collect more
                <br className="hidden lg:block" />
                evidence than you already have safely.
              </>
            }
          />

          {/* Your identity is protected */}
          <EvidenceCard
            icon={<ShieldIcon />}
            title="Your identity is protected"
            description={
              <>
                We don&apos;t expose your identity to the reported person
                <br className="hidden lg:block" />
                or organization by default.
              </>
            }
          />
        </div>

        {/* Space before next section */}
        <div className="h-20 lg:h-24" />
      </div>
    </section>
  );
}

/* =========================================================
   CARD
========================================================= */

function EvidenceCard({
  icon,
  title,
  description,
  warning = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  warning?: boolean;
}) {
  return (
    <div
      className="
        min-h-[156px]
        w-full
        rounded-[20px]
        border
        px-5
        pt-5
        pb-7
      "
      style={{
        backgroundColor: warning ? "#FFF6E9" : C.white,
        borderColor: warning ? "#F2A64A" : C.line,
      }}
    >
      {/* Icon */}
      <div
        className="
          flex
          size-9
          shrink-0
          items-center
          justify-center
          rounded-[10px]
        "
        style={{
          backgroundColor: warning ? C.white : C.chip,
        }}
      >
        <div className="flex size-4 items-center justify-center">
          {icon}
        </div>
      </div>

      {/* Title */}
      <div className="pt-1.5">
        <h3
          className="
            text-sm
            font-bold
            leading-5
          "
          style={{ color: C.ink }}
        >
          {title}
        </h3>
      </div>

      {/* Description */}
      <div className="mt-[2px]">
        <p
          className="
            text-xs
            font-normal
            leading-5
          "
          style={{ color: C.muted }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   EVIDENCE ICON
========================================================= */

function EvidenceIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.5 3.75H13.5V10.25H5.9L3 12V10.25H2.5V3.75Z"
        stroke={C.ink}
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path
        d="M5.25 6.5H10.75"
        stroke={C.ink}
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   LOCK ICON
========================================================= */

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3.25"
        y="6.75"
        width="9.5"
        height="7"
        rx="1.2"
        stroke={C.ink}
        strokeWidth="1.35"
      />

      <path
        d="M5.25 6.75V4.9C5.25 3.38 6.48 2.25 8 2.25C9.52 2.25 10.75 3.38 10.75 4.9V6.75"
        stroke={C.ink}
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   WARNING ICON
========================================================= */

function WarningIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 1.75L14 13.5H2L8 1.75Z"
        stroke="#E89538"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />

      <path
        d="M8 6V9"
        stroke="#E89538"
        strokeWidth="1.35"
        strokeLinecap="round"
      />

      <circle
        cx="8"
        cy="11"
        r="0.75"
        fill="#E89538"
      />
    </svg>
  );
}

/* =========================================================
   SHIELD ICON
========================================================= */

function ShieldIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 2L12.25 3.5V7.1C12.25 10.05 10.55 12.35 8 13.75C5.45 12.35 3.75 10.05 3.75 7.1V3.5L8 2Z"
        stroke={C.ink}
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}