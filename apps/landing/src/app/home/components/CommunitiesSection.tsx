"use client";

import Image from "next/image";

const communities = [
  {
    image: "/images/golden-retriever.jpg",
    icon: "/golden-retriever-icon.png",
    title: "Golden Retriever Guardians",
    description:
      "A global community dedicated to Golden Retriever care and adoption.",
    members: "42.5K members",
    posts: "1.2K posts/week",
    tags: ["Verified Community", "Moderated"],
  },
  {
    image: "/images/cat-rescue.jpg",
    icon: "/cat-rescue-icon.png",
    title: "London Cat Rescue Coalition",
    description: (
      <>
        Coordinating rescue, foster, and adoption across<br />
        London
      </>
    ),
    members: "8.3K members",
    posts: "450 posts/week",
    tags: ["Verified Community", "Organization-led"],
  },
  {
    image: "/images/exotic-birds.jpg",
    icon: "/exotic-birds-icon.png",
    title: "Exotic Bird Keepers Network",
    description:
      "Expert advice and support for parrot and exotic bird owners.",
    members: "15.7K members",
    posts: "680 posts/week",
    tags: ["Verified Community", "Professional-led"],
  },
];

const categories = [
  { name: "Species Hubs", icon: "/images/species-hubs.png" },
  { name: "Local Groups", icon: "/images/local-groups.png" },
  { name: "Rescue Networks", icon: "/images/rescue-networks.png" },
  { name: "Professional Communities", icon: "/images/professional-communities.png" },
  { name: "Training & Nutrition", icon: "/images/training-nutrition.png" },
  { name: "Memorial & Support", icon: "/images/memorial-support.png" },
  { name: "Wildlife Conservation", icon: "/images/wildlife-conservation.png" },
];

export default function CommunitiesSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="mx-auto w-full text-center font-montserrat text-2xl font-extrabold leading-tight text-gray-900 md:text-3xl lg:text-[34px] lg:tracking-tight xl:whitespace-nowrap">
          Build Communities That Protect, Celebrate and Support Animal Life
        </h2>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-4">

          <button className="rounded-xl bg-[#066879] py-3 text-white font-semibold text-sm transition hover:bg-[#055260]">
            All
          </button>

          <button className="rounded-xl border-2 border-[#066879] py-3 font-semibold text-sm text-[#066879] bg-white transition hover:bg-[#066879]/10">
            + Create a Community
          </button>

          <button className="rounded-xl border-2 border-[#066879] py-3 font-semibold text-sm text-[#066879] bg-white transition hover:bg-[#066879]/10">
            Browse by Species
          </button>

          <button className="rounded-xl border-2 border-[#066879] py-3 font-semibold text-sm text-[#066879] bg-white transition hover:bg-[#066879]/10">
            Browse by Location
          </button>

          <button className="rounded-xl border-2 border-[#066879] py-3 font-semibold text-sm text-[#066879] bg-white transition hover:bg-[#066879]/10">
            Browse by Purpose
          </button>

        </div>

        <div className="my-12 border-t border-gray-300" />

        <div className="flex justify-start gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

          {categories.map((item, index) => (
            <button
              key={index}
              className={`flex items-center gap-3 whitespace-nowrap rounded-full border px-7 py-2.5 font-semibold text-[14px] transition ${
                index === 0
                  ? "bg-[#066879] text-white border-[#066879]"
                  : "bg-white border-gray-200 text-gray-700 hover:border-[#066879] hover:text-[#066879]"
              }`}
            >
              <Image src={item.icon} alt={item.name} width={24} height={24} className="object-contain scale-[2]" />
              {item.name}
            </button>
          ))}

        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">

          {communities.map((community) => (
            <div
              key={community.title}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition"
            >

              <div className="relative h-40 w-full">

                <Image
                  src={community.image}
                  alt={community.title}
                  fill
                  className="object-cover"
                />

              </div>

              <div className="px-6 pb-6">

                <div className="-mt-8 relative z-10 h-16 w-16">
                  <Image src={community.icon} alt={`${community.title} icon`} fill className="object-contain" />
                </div>

                <h3 className="mt-4 text-xl font-bold font-montserrat text-gray-900 tracking-tight">
                  {community.title}
                </h3>

                <p className="mt-3 text-[13px] leading-relaxed text-gray-500 font-medium">
                  {community.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                  <span>{community.members}</span>
                  <span>•</span>
                  <span>{community.posts}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">

                  {community.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-[#E8FBFF] px-2.5 py-1 text-[11px] font-bold text-[#066879]"
                    >
                      {tag}
                    </span>
                  ))}

                </div>

                <button className="mt-6 w-full rounded-xl bg-[#066879] py-2 font-bold text-white transition hover:bg-[#055260]">
                  Join
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}