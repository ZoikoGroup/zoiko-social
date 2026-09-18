"use client";

import { C } from "./theme";

type HelpItem = {
  title: string;
  description: React.ReactNode;
  link?: string;
  icon: React.ReactNode;
};

const HELP_ITEMS: HelpItem[] = [
  {
    title: "Adoption Safety",
    description: (
      <>
        Full guidance on verifying sources, meeting safely, and
        <br className="hidden lg:block" />
        understanding fees and records.
      </>
    ),
    link: "Read Adoption Safety",
    icon: <AdoptionSafetyIcon />,
  },
  {
    title: "How We Verify",
    description: (
      <>
        Understand what a Verified badge means, and what it doesn&apos;t
        <br className="hidden lg:block" />
        guarantee.
      </>
    ),
    link: "How We Verify",
    icon: <VerifyIcon />,
  },
  {
    title: "Veterinary emergency",
    description: (
      <>
        For urgent animal health issues, contact a local veterinary or
        <br className="hidden lg:block" />
        emergency animal service directly.
      </>
    ),
    icon: <VeterinaryIcon />,
  },
];

export default function OtherHelp() {
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
        <div className="mx-auto w-full max-w-[640px] pt-8 text-center">
          <h2
            className="
              text-3xl
              font-extrabold
              leading-[48px]
            "
            style={{ color: C.ink }}
          >
            Other help
          </h2>
        </div>

        {/* =====================================================
            HELP ITEMS
        ====================================================== */}
        <div
          className="
            flex
            w-full
            flex-col
            items-start
            gap-8
            pt-16

            lg:flex-row
            lg:justify-center
            lg:gap-6
          "
        >
          {HELP_ITEMS.map((item, index) => (
            <HelpCard
              key={item.title}
              title={item.title}
              description={item.description}
              link={item.link}
              icon={item.icon}
              last={index === HELP_ITEMS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HELP CARD
========================================================= */

function HelpCard({
  title,
  description,
  link,
  icon,
  last = false,
}: HelpItem & { last?: boolean }) {
  return (
    <div
      className={`
        w-full
        lg:w-96
        ${last ? "pb-8" : ""}
        flex
        flex-col
        items-start
        gap-1
      `}
    >
      {/* ===================================================
          ICON
      ==================================================== */}
      <div
        className="
          flex
          size-11
          items-center
          justify-center
          rounded-xl
        "
        style={{
          backgroundColor: C.chip,
        }}
      >
        <div className="relative size-5 overflow-hidden">
          {icon}
        </div>
      </div>

      {/* ===================================================
          TITLE
      ==================================================== */}
      <div className="flex w-full flex-col items-start pt-1.5 pb-[0.75px]">
        <h3
          className="
            w-full
            text-sm
            font-bold
            leading-5
          "
          style={{
            color: C.ink,
          }}
        >
          {title}
        </h3>
      </div>

      {/* ===================================================
          DESCRIPTION
      ==================================================== */}
      <div className="flex w-full flex-col items-start">
        <p
          className="
            w-full
            text-xs
            font-normal
            leading-5
          "
          style={{
            color: C.muted,
          }}
        >
          {description}
        </p>
      </div>

      {/* ===================================================
          LINK
      ==================================================== */}
      {link && (
        <div className="inline-flex items-center gap-1.5 pt-[3.1px]">
          <span
            className="
              text-base
              font-semibold
              leading-6
            "
            style={{
              color: C.brand,
            }}
          >
            {link}
          </span>

          <div className="relative size-3 overflow-hidden">
            <ArrowRightIcon />
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   ADOPTION SAFETY ICON
========================================================= */

function AdoptionSafetyIcon() {
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
        d="M10 2.5L15.25 4.25V8.7C15.25 12.45 13.2 15.35 10 17.05C6.8 15.35 4.75 12.45 4.75 8.7V4.25L10 2.5Z"
        stroke={C.ink}
        strokeWidth="1.67"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   VERIFY ICON
========================================================= */

function VerifyIcon() {
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
        d="M10 2.1L11.95 4.25L14.85 4.05L15.7 6.85L18 8.5L16.45 10.95L17.2 13.75L14.4 14.6L12.75 17L10.15 15.55L7.35 16.2L6.55 13.4L4.2 11.8L5.7 9.3L5 6.5L7.8 5.65L9.4 3.2L10 2.1Z"
        stroke={C.ink}
        strokeWidth="1.67"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   VETERINARY ICON
========================================================= */

function VeterinaryIcon() {
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
        d="M10 16.8C8.1 15.35 3.4 12.3 3.4 8.55C3.4 6.55 4.7 5.1 6.45 5.1C7.95 5.1 9.1 6.05 10 7.25C10.9 6.05 12.05 5.1 13.55 5.1C15.3 5.1 16.6 6.55 16.6 8.55C16.6 12.3 11.9 15.35 10 16.8Z"
        stroke={C.ink}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   ARROW ICON
========================================================= */

function ArrowRightIcon() {
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
        d="M4.5 2.75L7.75 6L4.5 9.25"
        stroke={C.brand}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}