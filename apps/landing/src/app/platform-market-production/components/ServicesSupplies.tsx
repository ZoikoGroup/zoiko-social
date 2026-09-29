"use client";

import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

const serviceCategories = [
  {
    title: "Trainers & Groomers",
    description: (
      <>
        Professional training and grooming
        <br />
        services
      </>
    ),
    icon: "/platform-market-production/image7.png",
    highlighted: false,
  },
  {
    title: "Boarding & Sitting",
    description: <>Care services while you&apos;re away</>,
    icon: "/platform-market-production/image8.png",
    highlighted: false,
  },
  {
    title: "Nutrition & Supplies",
    description: (
      <>
        Food, toys, and essential care
        <br />
        products
      </>
    ),
    icon: "/platform-market-production/image9.png",
    highlighted: false,
  },
  {
    title: "Insurance & Care Plans",
    description: <>Coverage options and wellness plans</>,
    icon: "/platform-market-production/image10.png",
    highlighted: true,
  },
];

const providers = [
  {
    name: "Pawfect Grooming Studio",
    description:
      "Professional grooming • Bath, nail trim, full groom • Walk-ins welcome",
    image: "/platform-market-production/image11.png",
  },
  {
    name: "Good Boy Dog Training",
    description:
      "Obedience & behavior training • Group and private sessions • Certified trainer",
    image: "/platform-market-production/image12.png",
  },
];

export default function ServicesSupplies() {
  return (
    <section
      className={`
        ${plusJakartaSans.className}
        w-full
        bg-white
        px-5
        py-12
        sm:px-8
        sm:py-16
        lg:px-28
        lg:py-20
      `}
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1280px]
          flex-col
          items-start
          gap-12
        "
      >
        {/* SECTION HEADER */}
        <div
          className="
            flex
            w-full
            flex-col
            items-start
            gap-2.5
            border-b-2
            border-[#D9E5E8]
            pb-4
            pt-6
          "
        >
          <h2
            className="
              w-full
              text-3xl
              font-extrabold
              leading-10
              text-[#087D8E]
            "
          >
            Services &amp; Supplies
          </h2>

          <p
            className="
              w-full
              pb-[0.75px]
              text-base
              font-normal
              leading-6
              text-[#52717A]
            "
          >
            Trainers, groomers, boarding, food, and everything your animals
            need.
          </p>
        </div>

        {/* SERVICE CARDS */}
        <div
          className="
            grid
            w-full
            grid-cols-1
            gap-6
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {serviceCategories.map((service) => (
            <div
              key={service.title}
              className={`
                flex
                min-h-[288px]
                w-full
                flex-col
                items-center
                justify-start
                gap-3
                rounded-3xl
                p-8
                outline
                outline-2
                outline-offset-[-2px]
                ${
                  service.highlighted
                    ? "bg-[#F1F8F9] outline-[#087D8E]"
                    : "bg-white outline-[#D9E5E8]"
                }
              `}
            >
              {/* ICON */}
              <div className="flex w-full flex-col items-center justify-start">
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              </div>

              {/* TITLE */}
              <div className="flex w-full flex-col items-center justify-start pt-[4.8px]">
                <h3
                  className="
                    text-center
                    text-base
                    font-bold
                    text-[#123B45]
                  "
                >
                  {service.title}
                </h3>
              </div>

              {/* DESCRIPTION */}
              <div className="flex w-full flex-col items-center justify-start pb-1.5">
                <p
                  className="
                    text-center
                    text-xs
                    font-normal
                    leading-5
                    text-[#52717A]
                  "
                >
                  {service.description}
                </p>
              </div>

              {/* EXPLORE BUTTON */}
              <button
                type="button"
                className="
                  mt-auto
                  rounded-[20px]
                  bg-[#087D8E]
                  px-6
                  py-3
                  text-center
                  font-['Arial']
                  text-sm
                  font-bold
                  text-white
                  transition-opacity
                  hover:opacity-90
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#087D8E]
                  focus:ring-offset-2
                "
              >
                Explore
              </button>
            </div>
          ))}
        </div>

        {/* TRAINERS & GROOMERS */}
        <div className="flex w-full flex-col items-start gap-4">
          {/* SUBSECTION HEADER */}
          <div
            className="
              flex
              w-full
              flex-col
              items-start
              gap-2.5
              pb-6
            "
          >
            <h3
              className="
                text-2xl
                font-bold
                leading-8
                text-[#123B45]
              "
            >
              Trainers &amp; Groomers
            </h3>

            <p
              className="
                w-full
                pb-[0.75px]
                text-base
                font-normal
                leading-6
                text-[#52717A]
              "
            >
              Certified professionals offering obedience training and
              professional grooming
            </p>
          </div>

          {/* PROVIDER LIST */}
          <div
            className="
              flex
              w-full
              flex-col
              gap-8
              rounded-[20px]
              bg-white
              px-6
              py-6
              outline
              outline-1
              outline-offset-[-1px]
              outline-[#D9E5E8]
            "
          >
            {providers.map((provider) => (
              <div
                key={provider.name}
                className="
                  flex
                  min-h-24
                  w-full
                  flex-col
                  items-start
                  justify-start
                  gap-4
                  sm:flex-row
                  sm:items-center
                "
              >
                {/* PROVIDER IMAGE */}
                <Image
                  src={provider.image}
                  alt={provider.name}
                  width={80}
                  height={80}
                  className="
                    h-20
                    w-20
                    shrink-0
                    rounded-2xl
                    object-cover
                  "
                />

                {/* PROVIDER INFORMATION */}
                <div
                  className="
                    flex
                    min-w-0
                    flex-1
                    flex-col
                    items-start
                    gap-2
                  "
                >
                  <p
                    className="
                      pb-[0.75px]
                      text-base
                      font-bold
                      leading-6
                      text-[#52717A]
                    "
                  >
                    {provider.name}
                  </p>

                  <p
                    className="
                      text-sm
                      font-normal
                      leading-6
                      text-[#52717A]
                      sm:text-base
                    "
                  >
                    {provider.description}
                  </p>
                </div>

                {/* VIEW PROFILE */}
                <button
                  type="button"
                  className="
                    shrink-0
                    rounded-xl
                    bg-[#F5F7F8]
                    px-6
                    py-3
                    text-center
                    font-['Arial']
                    text-xs
                    font-bold
                    text-[#087D8E]
                    outline
                    outline-1
                    outline-offset-[-1px]
                    outline-[#087D8E]
                    transition-colors
                    hover:bg-[#EAF3F5]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#087D8E]
                    focus:ring-offset-2
                  "
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}