"use client";

import { C } from "./theme";

type ReportCategory = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const REPORT_CATEGORIES: ReportCategory[] = [
  {
    title: "Animal welfare",
    description:
      "Possible neglect, abuse, unsafe handling, or an animal in danger.",
    icon: <HeartIcon />,
  },
  {
    title: "Suspicious adoption/foster listing",
    description:
      "Misleading details, a duplicate listing, or an inconsistent source.",
    icon: <MessageIcon />,
  },
  {
    title: "Scam / payment concern",
    description:
      "An unusual payment request, changed recipient, or fee deception.",
    icon: <DollarIcon />,
  },
  {
    title: "Trafficking / prohibited transfer",
    description:
      "Suspicious movement, sourcing, or transport patterns.",
    icon: <TransferIcon />,
  },
  {
    title: "Organization / verification concern",
    description:
      "Misuse of a verified badge, impersonation, or false affiliation.",
    icon: <VerificationIcon />,
  },
  {
    title: "Harassment / threat / coercion",
    description:
      "Threats, intimidation, abusive pressure, or unsafe messages.",
    icon: <HarassmentIcon />,
  },
  {
    title: "Privacy / sensitive data",
    description:
      "Exposure or a request for private addresses, IDs, or financial info.",
    icon: <LockIcon />,
  },
  {
    title: "Unsafe external link / contact",
    description:
      "A suspicious domain or an unexpected, phishing-like contact route.",
    icon: <ArrowIcon />,
  },
  {
    title: "Minor / vulnerable-user safety",
    description:
      "Age-inappropriate contact, coercion, or an unsafe request.",
    icon: <ShieldIcon />,
  },
  {
    title: "Other concern",
    description:
      "Something relevant that doesn't fit the categories above.",
    icon: <MoreIcon />,
  },
  {
    title: "Not sure",
    description:
      "Tell us what happened in your own words — we'll help classify it.",
    icon: <QuestionIcon />,
  },
];

export default function WhatCanIReport() {
  return (
    <section
      className="w-full"
      style={{ backgroundColor: C.page }}
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24">

        {/* =====================================================
            SECTION HEADING
        ====================================================== */}
        <div className="pt-16">
          <h2
            className="text-xl font-extrabold leading-8"
            style={{ color: C.inkDeep }}
          >
            What can I report?
          </h2>

          <p
            className="mt-0.5 text-sm font-normal leading-5"
            style={{ color: C.muted }}
          >
            Choose the option that&apos;s closest — you don&apos;t need to know
            the exact policy term.
          </p>
        </div>

        {/* =====================================================
            REPORT CATEGORY CARDS
        ====================================================== */}
        <div className="mt-14 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REPORT_CATEGORIES.map((category) => (
            <ReportCategoryCard
              key={category.title}
              title={category.title}
              description={category.description}
              icon={category.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   REPORT CATEGORY CARD
========================================================= */

function ReportCategoryCard({
  title,
  description,
  icon,
}: ReportCategory) {
  return (
    <div
      className="
        flex
        min-h-[96px]
        w-full
        items-start
        gap-3
        rounded-[20px]
        border
        bg-white
        p-5
      "
      style={{
        borderColor: C.line,
      }}
    >
      {/* ICON */}
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-[10px]"
        style={{
          backgroundColor: C.chip,
        }}
      >
        <div className="flex size-4 items-center justify-center">
          {icon}
        </div>
      </div>

      {/* TEXT */}
      <div className="min-w-0 flex-1 pr-1">
        <h3
          className="text-sm font-bold leading-5"
          style={{ color: C.ink }}
        >
          {title}
        </h3>

        <p
          className="mt-[2px] text-xs font-normal leading-4"
          style={{ color: C.muted }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   ICONS
========================================================= */

function HeartIcon() {
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
        d="M8 13.5S2.5 10.35 2.5 6.45C2.5 4.7 3.62 3.5 5.18 3.5C6.25 3.5 7.17 4.1 8 5.02C8.83 4.1 9.75 3.5 10.82 3.5C12.38 3.5 13.5 4.7 13.5 6.45C13.5 10.35 8 13.5 8 13.5Z"
        stroke={C.ink}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MessageIcon() {
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

function DollarIcon() {
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
        d="M8 1.5V14.5"
        stroke={C.ink}
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M10.5 4.2C10.1 3.65 9.3 3.3 8.35 3.3C6.95 3.3 6 4.05 6 5.05C6 6.15 6.85 6.55 8.15 6.85C9.55 7.15 10.4 7.65 10.4 8.85C10.4 10.05 9.35 10.8 7.9 10.8C6.8 10.8 5.85 10.4 5.4 9.65"
        stroke={C.ink}
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TransferIcon() {
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
        d="M2.25 8H13.75"
        stroke={C.ink}
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M10.5 5L13.75 8L10.5 11"
        stroke={C.ink}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VerificationIcon() {
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
        d="M8 1.75L9.55 2.45L11.2 2.35L12.05 3.8L13.5 4.65L13.4 6.3L14.1 7.85L13.05 9.1L12.7 10.7L11.2 11.3L10.15 12.55L8.55 12.3L7 12.9L5.85 11.65L4.3 11.2L3.75 9.7L2.6 8.5L3.05 6.9L2.8 5.3L4.15 4.35L4.7 2.8L6.3 2.65L8 1.75Z"
        stroke={C.ink}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HarassmentIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="5"
        cy="5"
        r="1.75"
        stroke={C.ink}
        strokeWidth="1.2"
      />

      <circle
        cx="11"
        cy="5.5"
        r="1.75"
        stroke={C.ink}
        strokeWidth="1.2"
      />

      <path
        d="M2.75 12C3.2 10.2 4.05 9.35 5 9.35C5.95 9.35 6.8 10.2 7.25 12"
        stroke={C.ink}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      <path
        d="M8.75 12C9.1 10.55 9.9 9.7 11 9.7C12.1 9.7 12.9 10.55 13.25 12"
        stroke={C.ink}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

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

function ArrowIcon() {
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
        d="M5.25 3.5L9.75 8L5.25 12.5"
        stroke={C.ink}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

function MoreIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="3.25"
        cy="8"
        r="1.2"
        fill={C.ink}
      />

      <circle
        cx="8"
        cy="8"
        r="1.2"
        fill={C.ink}
      />

      <circle
        cx="12.75"
        cy="8"
        r="1.2"
        fill={C.ink}
      />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke={C.ink}
        strokeWidth="1.35"
      />

      <path
        d="M6.45 6.15C6.6 5.15 7.35 4.55 8.3 4.55C9.4 4.55 10.1 5.25 10.1 6.2C10.1 7.05 9.55 7.5 8.85 7.95C8.25 8.35 8 8.7 8 9.3"
        stroke={C.ink}
        strokeWidth="1.35"
        strokeLinecap="round"
      />

      <circle
        cx="8"
        cy="11.35"
        r="0.75"
        fill={C.ink}
      />
    </svg>
  );
}