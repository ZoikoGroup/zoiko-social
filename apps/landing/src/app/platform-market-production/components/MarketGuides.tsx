"use client";

import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

const guides = [
  {
    title: "Finding the Right Veterinarian",
    description:
      "Tips for choosing a vet, understanding your options, and building a long-term care relationship.",
    icon: "/platform-market-production/icon1.png",
  },
  {
    title: "Understanding Pet Insurance",
    description:
      "Learn how pet insurance works, what it covers, and how to evaluate different plans.",
    icon: "/platform-market-production/icon2.png",
  },
  {
    title: "Preventive Care Essentials",
    description:
      "What every animal owner should know about vaccinations, screenings, and wellness checks.",
    icon: "/platform-market-production/icon3.png",
  },
];

export default function MarketGuides() {
  return (
    <section
      className={`
        ${plusJakartaSans.className}
        w-full
        bg-[#F5F7F8]
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
        {/* Heading */}
        <div className="flex w-full flex-col items-center justify-start">
          <h2
            className="
              text-center
              text-3xl
              font-extrabold
              leading-10
              text-[#123B45]
              sm:text-4xl
              sm:leading-10
            "
          >
            📚 Market Guides
          </h2>
        </div>

        {/* Guide Cards */}
        <div
          className="
            grid
            w-full
            grid-cols-1
            justify-center
            gap-6
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {guides.map((guide) => (
            <article
              key={guide.title}
              className="
                flex
                w-full
                min-h-[208px]
                flex-col
                items-start
                justify-start
                gap-3
                rounded-3xl
                bg-white
                p-8
                outline
                outline-1
                outline-offset-[-1px]
                outline-[#D9E5E8]
              "
            >
              {/* Icon */}
              <div className="flex w-full flex-col items-start justify-start">
                <Image
                  src={guide.icon}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              </div>

              {/* Title */}
              <div className="flex w-full flex-col items-start justify-start pt-1">
                <h3
                  className="
                    w-full
                    text-base
                    font-bold
                    leading-6
                    text-[#123B45]
                  "
                >
                  {guide.title}
                </h3>
              </div>

              {/* Description */}
              <div className="flex w-full flex-col items-start justify-start">
                <p
                  className="
                    w-full
                    text-sm
                    font-normal
                    leading-6
                    text-[#52717A]
                  "
                >
                  {guide.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}