"use client";

import Image from "next/image";

const communities = [
  {
    name: "Urban Bird Conservation Network",
    type: "Community · Habitat Conservation",
    image: true,
  },
  {
    name: "Elephant Conservation Discussion Group",
    type: "Community · Policy & Advocacy",
    image: false,
  },
  {
    name: "Coral Reef Watch Community",
    type: "Community · Habitat Conservation",
    image: false,
  },
];

export default function RelatedCommunityDiscussion() {
  return (
    <section className="w-full bg-[#F5F8F8] py-6">
      <div className="mx-auto w-full max-w-[1232px] px-4 lg:px-0">

        {/* HEADING */}
        <div className="flex w-full flex-col items-start">
          <h2 className="text-lg font-extrabold leading-7 text-[#073B47]">
            Related community discussion
          </h2>

          <p className="text-xs font-normal leading-5 text-[#6B8790]">
            Moderated community spaces — clearly separate from sourced
            journalism above.
          </p>
        </div>

        {/* COMMUNITY CARDS */}
        <div className="mt-3 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {communities.map((community) => (
            <div
              key={community.name}
              className="flex min-h-[76px] w-full items-center gap-3 rounded-[20px] border border-[#DCEAEE] bg-white p-4"
            >
              {/* IMAGE */}
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#F5F7F7]">
                {community.image && (
                  <Image
                    src="/conservation/image.png"
                    alt={community.name}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                )}
              </div>

              {/* TEXT */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold leading-5 text-[#066879]">
                  {community.name}
                </h3>

                <p className="mt-[2px] text-xs font-normal leading-4 text-[#6B8790]">
                  {community.type}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}