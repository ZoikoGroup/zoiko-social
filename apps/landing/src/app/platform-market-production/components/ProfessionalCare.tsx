"use client";

import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

const categories = [
  {
    title: "Veterinarians",
    description: (
      <>
        Find certified vets in your area
        <br />
        accepting new patients
      </>
    ),
    image: "/platform-market-production/image1.png",
    button: "Explore",
    emergency: false,
  },
  {
    title: "Clinics & Hospitals",
    description: (
      <>
        Full-service facilities for
        <br />
        comprehensive animal care
      </>
    ),
    image: "/platform-market-production/image2.png",
    button: "Explore",
    emergency: false,
  },
  {
    title: "Specialists",
    description: (
      <>
        Dermatology, oncology, orthopedics,
        <br />
        and more
      </>
    ),
    image: "/platform-market-production/image3.png",
    button: "Explore",
    emergency: false,
  },
  {
    title: "Emergency Vet Care",
    description: <>Urgent care and emergency services</>,
    image: "/platform-market-production/image4.png",
    button: "Find Now",
    emergency: true,
  },
];

const providers = [
  {
    name: "Dr. Sarah Mitchell, DVM",
    description:
      "General Practice • 15+ years experience • Accepting new patients",
    image: "/platform-market-production/image5.png",
  },
  {
    name: "Riverside Veterinary Clinic",
    description:
      "Full-service clinic • Multiple vets • Open 7 days a week",
    image: "/platform-market-production/image6.png",
  },
];

export default function ProfessionalCare() {
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
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-12">
        {/* =========================================================
            SECTION HEADER
        ========================================================= */}
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
              text-[28px]
              font-extrabold
              leading-9
              text-[#087D8E]
              sm:text-[30px]
              sm:leading-10
            "
          >
            Professional Care
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
            Find veterinarians, clinics, hospitals, and specialists for
            routine and specialized care.
          </p>
        </div>

        {/* =========================================================
            CATEGORY CARDS
        ========================================================= */}
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
          {categories.map((category) => (
            <div
              key={category.title}
              className={`
                flex
                min-h-[288px]
                w-full
                flex-col
                items-center
                justify-between
                rounded-3xl
                p-8
                outline
                outline-2
                outline-offset-[-2px]
                ${
                  category.emergency
                    ? "bg-[#FFF5E9] outline-[#F58A19]"
                    : "bg-white outline-[#D9E5E8]"
                }
              `}
            >
              {/* Card Content */}
              <div className="flex w-full flex-col items-start gap-2.5">
                {/* Icon */}
                <div className="flex w-full flex-col items-center justify-start">
                  <Image
                    src={category.image}
                    alt={category.title}
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                  />
                </div>

                {/* Title */}
                <div className="flex w-full flex-col items-center justify-start pt-[4.8px]">
                  <h3 className="text-center text-base font-bold text-[#123B45]">
                    {category.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="flex w-full flex-col items-center justify-start pb-1.5">
                  <p className="text-center text-xs font-normal leading-5 text-[#52717A]">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Button */}
              <button
                type="button"
                className={`
                  rounded-[20px]
                  px-6
                  py-3
                  text-center
                  font-['Arial']
                  text-sm
                  font-bold
                  text-white
                  ${
                    category.emergency
                      ? "bg-[#F58A19]"
                      : "bg-[#087D8E]"
                  }
                `}
              >
                {category.button}
              </button>
            </div>
          ))}
        </div>

        {/* =========================================================
            VETERINARIANS
        ========================================================= */}
        <div className="flex w-full flex-col items-start gap-4">
          {/* Subsection Heading */}
          <div className="flex w-full flex-col items-start gap-2.5 pb-6">
            <h3
              className="
                text-2xl
                font-bold
                leading-8
                text-[#123B45]
              "
            >
              Veterinarians
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
              Licensed veterinarians providing routine checkups,
              vaccinations, and preventive care.
            </p>
          </div>

          {/* Provider Cards */}
          <div className="flex w-full flex-col gap-2.5">
            {providers.map((provider) => (
              <div
                key={provider.name}
                className="
                  flex
                  w-full
                  min-h-[144px]
                  items-center
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
                <div
                  className="
                    flex
                    w-full
                    flex-col
                    items-start
                    gap-5
                    sm:flex-row
                    sm:items-center
                    sm:gap-4
                  "
                >
                  {/* Provider Image */}
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

                  {/* Provider Information */}
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

                  {/* View Profile */}
                  <button
                    type="button"
                    className="
                      shrink-0
                      rounded-xl
                      bg-[#F5F7F8]
                      px-6
                      py-3
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
                    "
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}