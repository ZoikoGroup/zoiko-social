import Image from "next/image";
import { C } from "./theme";
import { IMAGES } from "./images";

export default function Hero() {
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
          py-12

          sm:px-8
          sm:py-16

          lg:px-10
          lg:py-20
        "
      >
        <div
          className="
            grid
            w-full
            grid-cols-1
            items-center
            gap-10

            lg:grid-cols-2
            lg:gap-12
          "
        >
          {/* LEFT CONTENT */}
          <div className="flex w-full flex-col items-start">
            {/* Badge */}
            <div
              className="
                inline-flex
                items-start
                justify-start
                rounded-[20px]
                px-3
                py-[5px]
              "
              style={{
                backgroundColor: C.chip,
              }}
            >
              <span
                className="
                  text-xs
                  font-semibold
                  leading-4
                  tracking-wide
                "
                style={{
                  color: C.brand,
                }}
              >
                Verified Rescues &amp; Shelters
              </span>
            </div>

            {/* Heading */}
            <h1
              className="
                mt-2
                w-full
                text-3xl
                font-extrabold
                leading-[44px]

                sm:text-4xl
                sm:leading-[51px]
              "
              style={{
                color: C.inkDeep,
              }}
            >
              Find rescues and shelters verified by
              <br className="hidden sm:block" />
              Zoiko Social.
            </h1>

            {/* Description */}
            <p
              className="
                mt-2
                w-full
                max-w-[520px]
                text-base
                font-normal
                leading-6
              "
              style={{
                color: C.muted,
              }}
            >
              Explore organizations Zoiko Social has verified directly, see
              the animals and foster needs they publish, and use approved
              contact paths to take the next step safely.
            </p>

            {/* Buttons */}
            <div className="mt-5 flex w-full flex-wrap items-center gap-2.5">
              <button
                type="button"
                className="
                  inline-flex
                  min-h-[48px]
                  items-center
                  justify-center
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  leading-5
                  text-white
                  transition-opacity
                  hover:opacity-90
                "
                style={{
                  backgroundColor: C.brand,
                }}
              >
                Find an Organization
              </button>

              <button
                type="button"
                className="
                  inline-flex
                  min-h-[48px]
                  items-center
                  justify-center
                  rounded-xl
                  border
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  leading-5
                  underline
                  transition-colors
                "
                style={{
                  borderColor: C.line,
                  color: C.ink,
                }}
              >
                How We Verify
              </button>
            </div>

            {/* Verification Notice */}
            <div
              className="
                mt-3
                w-full
                max-w-[560px]
                rounded-xl
                px-3.5
                py-2.5
              "
              style={{
                backgroundColor: C.chip,
              }}
            >
              <p
                className="
                  text-xs
                  font-normal
                  leading-5
                "
                style={{
                  color: C.muted,
                }}
              >
                Verification is a current Zoiko Social trust signal — not a
                guarantee of every listing, interaction, or adoption outcome.
                Report concerns at any time.
              </p>
            </div>
          </div>

          {/* RIGHT ORGANIZATION CARD */}
          <div
            className="
              w-full
              overflow-hidden
              rounded-[32px]
              border
              bg-white
              shadow-[0px_8px_24px_0px_rgba(7,59,71,0.10)]
            "
            style={{
              borderColor: C.line,
            }}
          >
            {/* Image */}
            <div className="relative h-[280px] w-full overflow-hidden sm:h-[319px]">
              <Image
                src={IMAGES.hero}
                alt="Downtown Humane Society"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 568px"
              />

              {/* Verified Badge */}
              <div
                className="
                  absolute
                  left-[10px]
                  top-[10px]
                  inline-flex
                  h-6
                  items-center
                  rounded-lg
                  px-2.5
                "
                style={{
                  backgroundColor: "rgba(7, 59, 71, 0.78)",
                }}
              >
                <svg
                  className="mr-1.5 shrink-0"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M6 1.25L9.75 2.7V5.45C9.75 7.8 8.2 9.65 6 10.5C3.8 9.65 2.25 7.8 2.25 5.45V2.7L6 1.25Z"
                    stroke={C.white}
                    strokeWidth="1.1"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M4.25 5.8L5.35 6.85L7.8 4.4"
                    stroke={C.white}
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span
                  className="
                    whitespace-nowrap
                    text-xs
                    font-bold
                    leading-4
                  "
                  style={{
                    color: C.white,
                  }}
                >
                  Verified by Zoiko Social
                </span>
              </div>
            </div>

            {/* Organization Details */}
            <div className="flex w-full flex-col px-4 py-4">
              {/* Organization Name */}
              <h2
                className="
                  text-base
                  font-extrabold
                  leading-6
                "
                style={{
                  color: C.ink,
                }}
              >
                Downtown Humane Society
              </h2>

              {/* Location */}
              <p
                className="
                  text-xs
                  font-normal
                  leading-5
                "
                style={{
                  color: C.muted,
                }}
              >
                Shelter · Sacramento, CA
              </p>

              {/* Tags */}
              <div className="flex flex-wrap items-start gap-2.5 pt-2">
                <div
                  className="
                    inline-flex
                    rounded-md
                    px-2
                    py-1
                  "
                  style={{
                    backgroundColor: C.chip,
                  }}
                >
                  <span
                    className="
                      text-xs
                      font-semibold
                      leading-4
                    "
                    style={{
                      color: C.ink,
                    }}
                  >
                    12 animals available
                  </span>
                </div>

                <div
                  className="
                    inline-flex
                    rounded-md
                    px-2
                    py-1
                  "
                  style={{
                    backgroundColor: C.chip,
                  }}
                >
                  <span
                    className="
                      text-xs
                      font-semibold
                      leading-4
                    "
                    style={{
                      color: C.ink,
                    }}
                  >
                    3 foster needs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}