"use client";

export default function RegionalCoverageSections() {
  return (
    <section className="w-full bg-[#F5F8F8]">
      <div className="mx-auto w-full max-w-[1232px] px-6 pb-20 lg:px-0">

        {/* =====================================================
            RESCUE & SHELTER
        ===================================================== */}
        <div className="w-full">

          {/* Heading Row */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold leading-6 text-[#073B47]">
              Rescue &amp; Shelter near your region
            </h2>

            <button
              type="button"
              className="text-base font-semibold leading-6 text-[#066879]"
            >
              See all Animal Welfare &gt;
            </button>
          </div>

          {/* Cards */}
          <div className="mt-[20px] grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

            {/* Card 1 */}
            <article className="h-36 rounded-[20px] border border-zinc-200 bg-white px-[21px] pt-[21px]">
              <div className="flex items-center">

                <div className="flex h-7 items-center rounded-full border border-zinc-200 bg-gray-50 px-[11px]">
                  <span className="text-xs font-bold leading-4 text-gray-500">
                    Rescue &amp; Shelter
                  </span>
                </div>

                <span className="ml-[13px] text-xs font-normal leading-5 text-gray-500">
                  5h ago
                </span>
              </div>

              <h3 className="mt-[11px] text-sm font-bold leading-5 text-[#073B47]">
                Global Wildlife Rescue Network shares seasonal
                <br />
                intake update
              </h3>

              <p className="mt-[7px] text-xs font-normal leading-4 text-gray-500">
                Global Wildlife Rescue Network · Tier 1
              </p>
            </article>

            {/* Card 2 */}
            <article className="h-36 rounded-[20px] border border-zinc-200 bg-white px-[21px] pt-[21px]">
              <div className="flex items-center">

                <div className="flex h-7 items-center rounded-full border border-zinc-200 bg-gray-50 px-[11px]">
                  <span className="text-xs font-bold leading-4 text-gray-500">
                    Rescue &amp; Shelter
                  </span>
                </div>

                <span className="ml-[13px] text-xs font-normal leading-5 text-gray-500">
                  8h ago
                </span>
              </div>

              <h3 className="mt-[11px] text-sm font-bold leading-5 text-[#073B47]">
                Second Chance Animal Shelter opens new intake
                <br />
                wing
              </h3>

              <p className="mt-[7px] text-xs font-normal leading-4 text-gray-500">
                Regional Wildlife Gazette · Rating unavailable
              </p>
            </article>

            {/* Card 3 */}
            <article className="h-36 rounded-[20px] border border-zinc-200 bg-white px-[21px] pt-[21px]">
              <div className="flex items-center">

                <div className="flex h-7 items-center rounded-full border border-zinc-200 bg-gray-50 px-[11px]">
                  <span className="text-xs font-bold leading-4 text-gray-500">
                    Rescue &amp; Shelter
                  </span>
                </div>

                <span className="ml-[13px] text-xs font-normal leading-5 text-gray-500">
                  1d ago
                </span>
              </div>

              <h3 className="mt-[11px] text-sm font-bold leading-5 text-[#073B47]">
                Sacramento Animal Rescue reports record
                <br />
                adoption month
              </h3>

              <p className="mt-[7px] text-xs font-normal leading-4 text-gray-500">
                World Animal News · Tier 1
              </p>
            </article>
          </div>
        </div>

        {/* =====================================================
            POLICY & LAW
        ===================================================== */}
        <div className="mt-[32px] w-full">

          {/* Heading Row */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold leading-6 text-[#073B47]">
              Policy &amp; Law relevant to your region
            </h2>

            <button
              type="button"
              className="text-base font-semibold leading-6 text-[#066879]"
            >
              See all Animal Welfare &gt;
            </button>
          </div>

          {/* Cards */}
          <div className="mt-[20px] grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

            {/* Card 1 */}
            <article className="h-36 rounded-[20px] border border-zinc-200 bg-white px-[21px] pt-[21px]">
              <div className="flex items-center">

                <div className="flex h-7 items-center rounded-full border border-zinc-200 bg-gray-50 px-[11px]">
                  <span className="text-xs font-bold leading-4 text-gray-500">
                    Policy &amp; Law
                  </span>
                </div>

                <span className="ml-[13px] rounded-full bg-slate-100 px-[9px] py-[4px] text-xs font-bold leading-4 text-[#062F39]">
                  Proposed
                </span>
              </div>

              <h3 className="mt-[11px] text-sm font-bold leading-5 text-[#073B47]">
                Updated minimum space standards proposed for
                <br />
                boarding kennels
              </h3>

              <p className="mt-[7px] text-xs font-normal leading-4 text-gray-500">
                Conservation Today · Rating under review
              </p>
            </article>

            {/* Card 2 */}
            <article className="h-36 rounded-[20px] border border-zinc-200 bg-white px-[21px] pt-[21px]">
              <div className="flex items-center">

                <div className="flex h-7 items-center rounded-full border border-zinc-200 bg-gray-50 px-[11px]">
                  <span className="text-xs font-bold leading-4 text-gray-500">
                    Policy &amp; Law
                  </span>
                </div>

                <span className="ml-[13px] rounded-full bg-gray-200 px-[9px] py-[4px] text-xs font-bold leading-4 text-green-700">
                  In effect
                </span>
              </div>

              <h3 className="mt-[11px] text-sm font-bold leading-5 text-[#073B47]">
                Farm animal welfare consultation concludes with
                <br />
                new standards
              </h3>

              <p className="mt-[7px] text-xs font-normal leading-4 text-gray-500">
                Policy &amp; Animals Bulletin · Tier 2
              </p>
            </article>

            {/* Card 3 */}
            <article className="h-36 rounded-[20px] border border-zinc-200 bg-white px-[21px] pt-[21px]">
              <div className="flex items-center">

                <div className="flex h-7 items-center rounded-full border border-zinc-200 bg-gray-50 px-[11px]">
                  <span className="text-xs font-bold leading-4 text-gray-500">
                    Enforcement &amp; Accountability
                  </span>
                </div>

                <span className="ml-[13px] text-xs font-normal leading-5 text-gray-500">
                  1d ago
                </span>
              </div>

              <h3 className="mt-[11px] text-sm font-bold leading-5 text-[#073B47]">
                Breeding facility operator convicted under state
                <br />
                welfare statute
              </h3>

              <p className="mt-[7px] text-xs font-normal leading-4 text-gray-500">
                Regional Wildlife Gazette · Rating unavailable
              </p>
            </article>
          </div>
        </div>

      </div>
    </section>
  );
}