"use client";

import React from "react";

export default function FundraisingCTA() {
  return (
    <section className="w-full bg-white pt-20 pb-20 sm:pt-20 sm:pb-20 lg:pt-20 lg:pb-20">
      <div className="mx-auto w-full max-w-[1230px]">
        {/* CTA Box */}
        <div
          className="relative flex min-h-[197px] w-full flex-col items-center justify-center overflow-hidden px-6 py-16 sm:px-10 lg:px-28 lg:py-20"
          style={{
            backgroundImage:
              "linear-gradient(93deg, rgba(7, 59, 71, 0.95) 35%, rgba(7, 59, 71, 0.60) 65%), url('/fundraising-toolkit/bg.png')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* CTA Content */}
          <div className="relative z-10 flex w-full max-w-[1280px] flex-col items-center gap-4">
            {/* Heading + Description */}
            <div className="flex w-full flex-col items-center">
              <h2 className="m-0 text-center text-3xl font-extrabold leading-[57.6px] text-white">
                Raise funds with confidence
              </h2>

              <p className="m-0 w-full max-w-[508px] text-center text-base font-normal leading-7 text-white/85">
                Fundraising tools are included with Premium+ plans.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex w-full flex-wrap justify-center gap-4 pt-8">
              <button
                type="button"
                className="min-h-10 rounded-xl bg-[#F59E0B] px-5 py-2.5 text-center text-sm font-semibold leading-5 text-white transition-opacity duration-200 hover:opacity-90"
              >
                Start a Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}