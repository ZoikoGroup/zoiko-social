"use client";

export default function ConservationNewsHero() {
  return (
    <section className="w-full bg-[#F5F8F8]">
      <div className="w-full px-4 pt-10 pb-8 sm:px-6 sm:pt-14 sm:pb-10 lg:px-0 lg:pt-[80px] lg:pb-[40px]">
        {/* Hero — responsive: full width on mobile/tablet, 1232px on desktop */}
        <div
          className="
            relative
            mx-auto
            min-h-[460px]
            w-full
            max-w-[1232px]
            overflow-hidden
            rounded-[20px]
            bg-[#073B47]
            sm:min-h-[430px]
            sm:rounded-[24px]
            lg:h-[400px]
            lg:min-h-0
          "
        >
          {/* Base background */}
          <div className="absolute inset-0 bg-[#073B47]" />

          {/* Teal gradient */}
          <div
            className="
              absolute
              inset-0
              bg-[linear-gradient(90deg,#073B47_0%,#066879_65%,#066879_100%)]
            "
          />

          {/* Right-side soft teal lighting */}
          <div
            className="
              absolute
              inset-y-0
              right-0
              w-full
              bg-[radial-gradient(ellipse_at_75%_45%,rgba(255,255,255,0.10)_0%,rgba(62,109,110,0.10)_35%,rgba(29,82,88,0)_72%)]
              sm:w-[70%]
              lg:w-[58%]
            "
          />

          {/* Subtle center glow */}
          <div
            className="
              absolute
              left-[25%]
              top-[-20%]
              h-[140%]
              w-[70%]
              rounded-full
              bg-[#5C8580]/10
              blur-[45px]
              sm:left-[32%]
              sm:w-[55%]
              lg:left-[38%]
              lg:w-[48%]
            "
          />

          {/* Content */}
          <div
            className="
              relative
              z-10
              flex
              min-h-[460px]
              w-full
              flex-col
              items-start
              gap-3
              px-5
              py-7
              sm:min-h-[430px]
              sm:px-8
              sm:py-8
              lg:h-full
              lg:min-h-0
              lg:px-[44px]
              lg:pt-[40px]
              lg:pb-0
            "
          >
            {/* Badge */}
            <div
              className="
                inline-flex
                items-center
                justify-start
                rounded-[20px]
                bg-white/[0.18]
                px-3
                py-[5px]
              "
            >
              <span
                className="
                  whitespace-nowrap
                  font-['Plus_Jakarta_Sans']
                  text-[11px]
                  font-semibold
                  leading-4
                  tracking-wide
                  text-white
                  sm:text-xs
                "
              >
                News · Conservation
              </span>
            </div>

            {/* Heading */}
            <div className="w-full pt-1">
              <h1
                className="
                  font-['Plus_Jakarta_Sans']
                  text-[30px]
                  font-extrabold
                  leading-[38px]
                  text-white
                  sm:text-[34px]
                  sm:leading-[48px]
                  lg:whitespace-nowrap
                  lg:text-[36px]
                  lg:leading-[57px]
                "
              >
                Conservation News
              </h1>
            </div>

            {/* Description */}
            <div className="w-full">
              <p
                className="
                  max-w-[650px]
                  font-['Plus_Jakarta_Sans']
                  text-sm
                  font-normal
                  leading-[22px]
                  text-[#E7F0F0]
                  sm:text-base
                  sm:leading-6
                "
              >
                Verified-source reporting on wildlife, species recovery,
                habitats, protected areas, restoration, biodiversity science
                and conservation policy — with source, region, evidence and
                sensitive-location context kept clear.
              </p>
            </div>

            {/* Updated information */}
            <div
              className="
                flex
                min-h-[40px]
                w-full
                items-start
                gap-[6px]
                pt-1
                sm:items-center
                lg:h-[40px]
              "
            >
              {/* Info icon */}
              <div className="relative mt-1 h-3 w-[10px] shrink-0 sm:mt-0">
                <div
                  className="
                    absolute
                    left-[1.33px]
                    top-[2.5px]
                    h-2
                    w-2
                    rounded-full
                    border
                    border-[#DCEAEE]
                  "
                />

                <div
                  className="
                    absolute
                    left-[5.34px]
                    top-[4.72px]
                    h-[3.11px]
                    w-[1.33px]
                    bg-[#DCEAEE]
                  "
                />
              </div>

              <p
                className="
                  font-['Plus_Jakarta_Sans']
                  text-[11px]
                  font-normal
                  leading-[18px]
                  text-[#DCEAEE]
                  sm:text-xs
                  sm:leading-5
                "
              >
                Updated 34 minutes ago. Stories appear after source, safety,
                duplication, rights and sensitive-species/location checks.
              </p>
            </div>

            {/* CTA */}
            <div
              className="
                flex
                w-full
                flex-wrap
                items-start
                gap-2.5
                pt-2
                sm:pt-3
              "
            >
              <button
                type="button"
                className="
                  inline-flex
                  min-h-[44px]
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#F59A23]
                  px-4
                  py-2.5
                  text-center
                  font-['Plus_Jakarta_Sans']
                  text-sm
                  font-semibold
                  leading-5
                  text-white
                  transition-colors
                  duration-200
                  hover:bg-[#E98D16]
                  sm:w-auto
                "
              >
                Explore current conservation stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}