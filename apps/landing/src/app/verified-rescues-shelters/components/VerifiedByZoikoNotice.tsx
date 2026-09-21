import { C } from "./theme";

function ShieldCheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Shield */}
      <path
        d="M10 1.67L16.67 4.17V9.17C16.67 13.33 13.92 16.08 10 18.33C6.08 16.08 3.33 13.33 3.33 9.17V4.17L10 1.67Z"
        stroke={C.verifiedIcon}
        strokeWidth="1.67"
        strokeLinejoin="round"
      />

      {/* Tick */}
      <path
        d="M7.5 9.83L9.17 11.5L12.5 8.17"
        stroke={C.verifiedIcon}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function VerifiedByZoikoNotice() {
  return (
    <section className="w-full px-5 py-6 lg:px-0">
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1232px]
          items-start
          gap-3.5
          rounded-3xl
          px-5
          py-4
        "
        style={{
          backgroundColor: C.verifiedBackground,
        }}
      >
        {/* Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
          <div className="flex h-5 w-5 items-center justify-center">
            <ShieldCheckIcon />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Heading */}
          <div
            className="text-base font-bold leading-6"
            style={{
              color: C.verifiedText,
            }}
          >
            &quot;Verified by Zoiko Social&quot; means the organization
            currently meets our approved verification requirements.
          </div>

          {/* Description */}
          <div className="pt-[1px]">
            <span
              className="text-sm font-normal leading-5"
              style={{
                color: C.verifiedMuted,
              }}
            >
              It does not guarantee suitability, availability, conduct,
              or outcomes.{" "}
            </span>

            <a
              href="#"
              className="text-sm font-semibold leading-5 underline"
              style={{
                color: C.verifiedIcon,
              }}
            >
              Read How We Verify
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}