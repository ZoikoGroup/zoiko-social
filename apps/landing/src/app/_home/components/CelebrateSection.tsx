"use client";

import Image from "next/image";

const celebrations = [
  {
    title: "Birthdays & Adoptiversaries",
    description: (
      <>
        Celebrate special milestones with invitations,
        <br />
        livestreams, and photo albums
      </>
    ),
    image: "/images/birthday.jpg",
    action: "Create Event",
  },
  {
    title: "Community Meetups",
    description: (
      <>
        Organize local gatherings with RSVP tracking
        <br />
        and group coordination
      </>
    ),
    image: "/images/community-meetup.jpg",
    action: "Plan Meetup",
  },
  {
    title: "Fundraising Events",
    description: (
      <>
        Host verified fundraisers with transparent
        <br />
        donation tracking
      </>
    ),
    image: "/images/fundraiser.jpg",
    action: "Start Fundraiser",
  },
  {
    title: "Training Workshops",
    description: (
      <>
        Share knowledge through educational
        <br />
        sessions and demonstrations
      </>
    ),
    image: "/images/training-workshop.jpg",
    action: "Schedule Workshop",
  },
  {
    title: "Memorials & Tributes",
    description: (
      <>
        Honor beloved companions with tribute pages
        <br />
        and memorial services
      </>
    ),
    image: "/images/memorial.jpg",
    action: "Create Memorial",
  },
  {
    title: "Special Ceremonies",
    description: (
      <>
        Include pets in weddings and other
        <br />
        meaningful life celebrations
      </>
    ),
    image: "/images/ceremony.jpg",
    action: "Plan Ceremony",
  },
];

export default function CelebrateSection() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <h2 className="font-montserrat text-4xl font-extrabold text-gray-900">
            Celebrate and Honor Animal Life
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-7 text-gray-600">
            Create meaningful moments and lasting memories with your animal
            community.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {celebrations.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center justify-between rounded-2xl border border-[#E5E7EB] bg-white px-8 py-10 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-8 flex items-center justify-center">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>

              <div>
                <h3 className="font-inter text-lg font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-4 font-inter text-[14px] leading-6 text-gray-500">
                  {item.description}
                </p>
              </div>

              <button className="mt-8 font-inter text-[14px] font-bold text-[#066879] transition hover:underline">
                {item.action} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}