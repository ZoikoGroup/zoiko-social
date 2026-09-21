"use client";

import Image from "next/image";

const sources = [
  {
    name: "World Animal News",
    details: "Tier 1 · 3 stories this week",
    image: "/your-region/1.png",
  },
  {
    name: "Regional Wildlife Gazette",
    details: "Rating unavailable · 2 stories this week",
    image: "/your-region/2.png",
  },
  {
    name: "Conservation Today",
    details: "Rating under review · 1 story this week",
    image: "/your-region/3.png",
  },
];

export default function RegionalSources() {
  return (
    <section className="w-full bg-[#F5F8F8]">
      <div className="mx-auto w-full max-w-[1232px] px-6 pb-20 lg:px-0">
        {/* Heading */}
        <div className="mx-auto flex h-20 w-[640px] max-w-full flex-col items-center">
          <h2 className="text-center text-[30px] font-extrabold leading-[48px] text-cyan-950">
            Sources covering your region
          </h2>

          <p className="mt-[12px] text-center text-base font-normal leading-6 text-gray-500">
            Source diversity and methodology context — not a popularity ranking.
          </p>
        </div>

        {/* Source Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <div
              key={source.name}
              className="
                relative
                h-20
                w-full
                rounded-[20px]
                border
                border-zinc-200
                bg-white
              "
            >
              {/* Source Image */}
              <div
                className="
                  absolute
                  left-[21px]
                  top-[21px]
                  size-11
                  overflow-hidden
                  rounded-[10px]
                "
              >
                <Image
                  src={source.image}
                  alt={source.name}
                  width={44}
                  height={44}
                  className="size-11 object-cover"
                />
              </div>

              {/* Source Name */}
              <p
                className="
                  absolute
                  left-[77px]
                  top-[21px]
                  right-4
                  truncate
                  text-sm
                  font-bold
                  leading-5
                  text-teal-950
                "
              >
                {source.name}
              </p>

              {/* Source Details */}
              <p
                className="
                  absolute
                  left-[77px]
                  top-[47.25px]
                  right-3
                  truncate
                  text-xs
                  font-normal
                  leading-4
                  text-gray-500
                "
              >
                {source.details}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}