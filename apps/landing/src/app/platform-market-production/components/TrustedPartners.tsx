"use client";

import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

const partners = [
  {
    name: "American Veterinary Association",
    icon: "/platform-market-production/icon4.png",
  },
  {
    name: "Pet Health Institute",
    icon: "/platform-market-production/icon5.png",
  },
  {
    name: "Pet Insurance Alliance",
    icon: "/platform-market-production/icon6.png",
  },
  {
    name: "Global Animal Welfare",
    icon: "/platform-market-production/icon7.png",
  },
];

export default function TrustedPartners() {
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
            🤝 Trusted Partners
          </h2>
        </div>

        {/* Partner Cards */}
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
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="
                flex
                min-h-[144px]
                w-full
                flex-col
                items-start
                justify-start
                gap-4
                rounded-[20px]
                bg-white
                p-6
                outline
                outline-2
                outline-offset-[-2px]
                outline-[#D9E5E8]
              "
            >
              {/* Partner Logo */}
              <div className="flex w-full flex-col items-center justify-start">
                <Image
                  src={partner.icon}
                  alt={partner.name}
                  width={64}
                  height={48}
                  className="
                    h-12
                    w-16
                    object-contain
                  "
                />
              </div>

              {/* Partner Name */}
              <div className="flex w-full flex-col items-center justify-start">
                <p
                  className="
                    text-center
                    text-sm
                    font-bold
                    leading-5
                    text-[#123B45]
                  "
                >
                  {partner.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}