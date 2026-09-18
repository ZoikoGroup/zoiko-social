import { C } from "./theme";

export default function SafetyReporting() {
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
          sm:py-8

          lg:px-10
          lg:py-8
        "
      >
        <div
          className="
            relative
            w-full
            overflow-hidden
            rounded-[28px]
            bg-cover
            bg-center
            bg-no-repeat
          "
          style={{
            backgroundImage:
              "url('/verified-rescues-shelters/bg.png')",
          }}
        >
          {/* Dark overlay for text readability */}
          <div
            className="
              absolute
              inset-0
              bg-[rgba(7,59,71,0.30)]
            "
          />

          {/* CONTENT */}
          <div
            className="
              relative
              z-10
              flex
              w-full
              flex-col
              px-6
              py-7

              sm:px-7
              sm:py-8

              lg:px-8
              lg:py-8
            "
          >
            {/* Heading */}
            <h2
              className="
                text-2xl
                font-extrabold
                leading-9
                text-white
              "
            >
              Safety &amp; reporting
            </h2>

            {/* Description */}
            <p
              className="
                mt-1
                w-full
                max-w-[560px]
                text-sm
                font-normal
                leading-6
              "
              style={{
                color: "rgba(255, 255, 255, 0.95)",
              }}
            >
              Verification is a trust signal, not a warranty. These paths stay
              available on every organization profile, regardless of status.
            </p>

            {/* INFORMATION BOXES */}
            <div
              className="
                mt-4
                grid
                w-full
                grid-cols-1
                gap-2.5

                lg:grid-cols-2
              "
            >
              {/* Adoption Safety */}
              <div
                className="
                  flex
                  min-h-[56px]
                  w-full
                  items-start
                  gap-2.5
                  rounded-2xl
                  border
                  px-4
                  py-3
                "
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.10)",
                  borderColor: "rgba(255, 255, 255, 0.25)",
                }}
              >
                {/* Lock Icon */}
                <div className="flex h-5 w-4 shrink-0 items-center justify-center pt-0.5">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.25 7H12.75V13C12.75 13.4142 12.4142 13.75 12 13.75H4C3.58579 13.75 3.25 13.4142 3.25 13V7Z"
                      stroke={C.white}
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.25 7V4.75C5.25 3.23122 6.48122 2 8 2C9.51878 2 10.75 3.23122 10.75 4.75V7"
                      stroke={C.white}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <p
                  className="
                    text-sm
                    font-normal
                    leading-5
                  "
                  style={{
                    color: "rgba(255, 255, 255, 0.95)",
                  }}
                >
                  Follow Adoption Safety guidance for meetings, communication,
                  and payment.
                </p>
              </div>

              {/* Report a Concern */}
              <div
                className="
                  flex
                  min-h-[56px]
                  w-full
                  items-start
                  gap-2.5
                  rounded-2xl
                  border
                  px-4
                  py-3
                "
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.10)",
                  borderColor: "rgba(255, 255, 255, 0.25)",
                }}
              >
                {/* Report Icon */}
                <div className="flex h-5 w-4 shrink-0 items-center justify-center pt-0.5">
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
                      r="6.75"
                      stroke={C.white}
                      strokeWidth="1.5"
                    />
                    <path
                      d="M6.1 6.1L9.9 9.9"
                      stroke={C.white}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9.9 6.1L6.1 9.9"
                      stroke={C.white}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <p
                  className="
                    w-full
                    text-sm
                    font-normal
                    leading-5
                  "
                  style={{
                    color: "rgba(255, 255, 255, 0.95)",
                  }}
                >
                  Report a Concern about any organization — never paywalled,
                  never hidden by verification status.
                </p>
              </div>
            </div>

            {/* BUTTONS */}
            <div
              className="
                mt-3
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              {/* Adoption Safety */}
              <button
                type="button"
                className="
                  inline-flex
                  min-h-[40px]
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
                "
                style={{
                  backgroundColor: "#F59A23",
                }}
              >
                Adoption Safety
              </button>

              {/* Report a Concern */}
              <button
                type="button"
                className="
                  inline-flex
                  min-h-[40px]
                  items-center
                  justify-center
                  rounded-xl
                  border
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  leading-5
                  text-white
                  underline
                  transition-colors
                  hover:bg-white/20
                "
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  borderColor: "rgba(255, 255, 255, 0.40)",
                }}
              >
                Report a Concern
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}