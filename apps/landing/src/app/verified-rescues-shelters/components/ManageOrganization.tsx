import { C } from "./theme";

export default function ManageOrganization() {
  return (
    <section
      className="w-full"
      style={{ backgroundColor: C.page }}
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1232px]
          px-5
          py-6

          sm:px-8
          sm:py-7

          lg:px-10
          lg:py-7
        "
      >
        <div
          className="
            flex
            w-full
            items-center
            justify-between
            gap-6
            rounded-3xl
            border
            bg-white
            px-5
            py-6

            sm:px-6
            sm:py-7

            lg:px-8
            lg:py-7

            max-sm:flex-col
            max-sm:items-start
          "
          style={{
            borderColor: C.line,
          }}
        >
          {/* LEFT CONTENT */}
          <div
            className="
              flex
              w-full
              max-w-[520px]
              flex-col
              items-start
            "
          >
            {/* Heading */}
            <h2
              className="
                text-base
                font-extrabold
                leading-6
              "
              style={{
                color: C.inkDeep,
              }}
            >
              Are you a rescue or shelter?
            </h2>

            {/* Description */}
            <p
              className="
                mt-1
                w-full
                max-w-[520px]
                text-sm
                font-normal
                leading-5
              "
              style={{
                color: C.muted,
              }}
            >
              Represent or claim your organization&apos;s profile, or check
              eligibility to start verification. Payment never buys
              verification or directory placement.
            </p>
          </div>

          {/* CTA */}
          <button
            type="button"
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              rounded-xl
              px-4
              py-2.5
              text-sm
              font-semibold
              leading-5
              text-white
              underline
              transition-opacity
              hover:opacity-90
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
            "
            style={{
              backgroundColor: C.brand,
            }}
          >
            Manage or Claim Organization
          </button>
        </div>
      </div>
    </section>
  );
}