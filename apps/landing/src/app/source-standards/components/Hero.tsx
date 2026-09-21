"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full bg-[#F5F8F8]">
      <div
        className="
          w-full
          px-4
          pt-10
          pb-[120px]
          sm:px-6
          sm:pt-14
          sm:pb-[130px]
          lg:px-0
          lg:pt-[80px]
          lg:pb-[120px]
        "
      >
        {/* HERO WRAPPER */}
        <div
          className="
            relative
            mx-auto
            w-full
            max-w-[1232px]
          "
        >
          {/* HERO IMAGE / CONTENT */}
          <div
            className="
              relative
              h-auto
              min-h-[560px]
              w-full
              overflow-hidden
              rounded-[20px]
              sm:min-h-[600px]
              sm:rounded-[24px]
              lg:h-[636.22px]
              lg:min-h-0
              lg:rounded-[24px]
            "
          >
            {/* Background image */}
            <Image
              src="/source-standards/hero.png"
              alt=""
              fill
              priority
              aria-hidden="true"
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1232px"
            />

            {/* Main Figma dark overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(19deg, rgba(6,47,57,0.95) 0%, rgba(6,47,57,0.95) 40%, rgba(6,47,57,0.30) 92%)",
              }}
            />

            {/* Additional teal overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(7,59,71,0.90) 0%, rgba(7,59,71,0.72) 45%, rgba(7,59,71,0.12) 100%)",
              }}
            />

            {/* Hero content */}
            <div
              className="
                relative
                z-10
                flex
                h-full
                flex-col
                items-start
                px-5
                pt-20
                sm:px-8
                sm:pt-24
                lg:px-[100px]
                lg:pt-[130px]
              "
            >
              {/* Source Standards */}
              <div
                className="
                  -mt-[20px]
                  flex
                  h-7
                  items-center
                  rounded-[20px]
                  bg-white/20
                  px-3
                "
              >
                <span
                  className="
                    whitespace-nowrap
                    text-xs
                    font-semibold
                    leading-4
                    tracking-wide
                    text-white
                  "
                >
                  Source Standards
                </span>
              </div>

              {/* Heading */}
              <h1
                className="
                  mt-[18px]
                  max-w-[650px]
                  text-[32px]
                  font-extrabold
                  leading-[36px]
                  tracking-[-0.6px]
                  text-white
                  sm:text-[38px]
                  sm:leading-[40px]
                  lg:text-[48px]
                  lg:leading-[40px]
                  lg:tracking-[-0.8px]
                "
              >
                See how Zoiko Social rates the publishers behind animal
                <br />
                news.
              </h1>

              {/* Description */}
              <p
                className="
                  mt-[22px]
                  max-w-[539.25px]
                  text-[16px]
                  font-normal
                  leading-[24px]
                  text-slate-100
                  sm:leading-7
                  lg:mt-[20px]
                  lg:leading-7
                "
              >
                We assess publishers against published standards for identity,
                sourcing, accountability, corrections, editorial practice, and
                reliability. Ratings are reviewed over time and are separate
                from article-level evidence and corrections.
              </p>

              {/* Button */}
              <button
                type="button"
                className="
                  mt-[20px]
                  flex
                  h-11
                  w-44
                  items-center
                  justify-center
                  rounded-xl
                  bg-orange-500
                  text-center
                  text-sm
                  font-semibold
                  leading-5
                  text-white
                  transition-opacity
                  hover:opacity-90
                "
              >
                Read Animal News
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Figma WHITE INFORMATION CARD */}
          {/* ========================================================= */}
          <div
            className="
              absolute
              left-1/2
              z-20
              w-[calc(100%-32px)]
              -translate-x-1/2
              rounded-3xl
              border
              border-zinc-200
              bg-white
              shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)]

              bottom-[-80px]

              min-h-[192px]
              px-6
              py-7

              sm:w-[calc(100%-48px)]
              sm:px-7

              lg:h-48
              lg:w-[1184px]
              lg:px-0
              lg:py-0
            "
          >
            {/* ===================================================== */}
            {/* COLUMN 1 */}
            {/* ===================================================== */}
            <div
              className="
                lg:absolute
                lg:left-[27px]
                lg:top-[37.62px]
                lg:w-[350px]
              "
            >
              {/* Label */}
              <div
                className="
                  text-xs
                  font-bold
                  uppercase
                  leading-4
                  tracking-tight
                  text-gray-500
                "
              >
                Approved public label
              </div>

              {/* Tier badge */}
              <div
                className="
                  mt-[6px]
                  flex
                  h-8
                  w-44
                  items-center
                  rounded-lg
                  bg-slate-100
                "
              >
                {/* Check icon */}
                <div
                  className="
                    ml-3
                    flex
                    h-2.5
                    w-2.5
                    items-center
                    justify-center
                  "
                >
                  <span
                    className="
                      text-[11px]
                      font-bold
                      leading-none
                      text-cyan-950
                    "
                  >
                    ✓
                  </span>
                </div>

                <div
                  className="
                    ml-[6px]
                    text-xs
                    font-bold
                    leading-5
                    text-cyan-950
                  "
                >
                  Tier 1 Source Verified
                </div>
              </div>

              {/* Publisher information */}
              <div
                className="
                  mt-[9.5px]
                  max-w-[320px]
                  text-xs
                  font-normal
                  leading-5
                  text-gray-500
                "
              >
                National Wildlife Press Bureau · Effective Aug 12, 2026 ·
                <br />
                Standards v2.3
              </div>
            </div>

            {/* ===================================================== */}
            {/* COLUMN 2 */}
            {/* ===================================================== */}
            <div
              className="
                mt-7

                lg:absolute
                lg:left-[410px]
                lg:top-[37.62px]
                lg:mt-0
                lg:w-[320px]
              "
            >
              {/* Label */}
              <div
                className="
                  text-xs
                  font-bold
                  uppercase
                  leading-4
                  tracking-tight
                  text-gray-500
                "
              >
                Registry-owned fields
              </div>

              {/* Description */}
              <div
                className="
                  mt-[10.16px]
                  text-xs
                  font-normal
                  leading-5
                  text-gray-500
                "
              >
                Rating label, state, effective date, and methodology
                <br />
                version are all server-authoritative — never computed
                <br />
                or renamed on the client.
              </div>
            </div>

            {/* ===================================================== */}
            {/* COLUMN 3 */}
            {/* ===================================================== */}
            <div
              className="
                mt-7

                lg:absolute
                lg:left-[793.66px]
                lg:top-[37.62px]
                lg:mt-0
                lg:w-[360px]
              "
            >
              {/* Label */}
              <div
                className="
                  text-xs
                  font-bold
                  uppercase
                  leading-4
                  tracking-tight
                  text-gray-500
                "
              >
                Inspect further
              </div>

              {/* Description */}
              <div
                className="
                  mt-[10.5px]
                  text-xs
                  font-normal
                  leading-5
                  text-gray-500
                "
              >
                See the full profile this reader would see for any actively
                rated
                <br className="hidden lg:block" />
                source.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}