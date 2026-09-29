"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

export default function MarketHero() {
  return (
    <section
      className={`${plusJakartaSans.className} relative w-full overflow-hidden`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/platform-market-production/bg.png')",
        }}
      />

      {/* Hero Content */}
      <div
        className="
          relative
          z-10
          flex
          min-h-[340px]
          w-full
          items-center
          justify-center
          px-5
          py-14
          sm:min-h-[360px]
          sm:px-8
          md:min-h-[380px]
          md:px-10
          lg:min-h-[380px]
          lg:px-10
        "
      >
        <div
          className="
            flex
            w-full
            max-w-[1280px]
            flex-col
            items-center
            justify-start
            gap-3
          "
        >
          {/* Zoiko Market */}
          <div className="flex w-full flex-col items-center justify-start">
            <div
              className="
                text-center
                text-xs
                font-bold
                uppercase
                leading-4
                tracking-wide
                text-white/80
              "
            >
              Zoiko Market
            </div>
          </div>

          {/* Heading */}
          <div className="flex w-full flex-col items-center justify-start">
            <h1
              className="
                w-full
                max-w-[729px]
                text-center
                text-[32px]
                font-extrabold
                leading-[38px]
                text-white
                sm:text-[38px]
                sm:leading-[44px]
                md:text-[44px]
                md:leading-[50px]
                lg:text-5xl
                lg:leading-[52.8px]
              "
            >
              Care, services, and supplies for animal needs
            </h1>
          </div>

          {/* Description */}
          <div
            className="
              flex
              w-full
              max-w-[700px]
              flex-col
              items-center
              justify-start
              pt-[3.34px]
            "
          >
            <p
              className="
                w-full
                text-center
                text-[15px]
                font-normal
                leading-6
                text-white/90
                sm:text-base
                sm:leading-[26px]
                md:text-lg
                md:leading-7
              "
            >
              Discover verified professionals, emergency services, and trusted
              products.
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              Everything you need to keep your animals healthy and happy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}