"use client";

import React from "react";

export default function CheckAccess() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1232px] px-6 sm:px-8">
        <div
          className="flex w-full flex-col items-start gap-4 rounded-3xl px-6 pb-10 pt-8 sm:px-8 sm:pb-12"
          style={{
            backgroundColor: "#F5F7F7",
            border: "1px solid #D6E3E6",
          }}
        >
          {/* Heading */}
          <div className="flex w-full flex-col items-start pb-[0.8px]">
            <h2
              className="w-full font-['Plus_Jakarta_Sans'] text-lg font-bold leading-7"
              style={{ color: "#087A8B" }}
            >
              Check your access
            </h2>
          </div>

          {/* Description */}
          <div className="flex w-full flex-col items-start">
            <p
              className="w-full font-['Plus_Jakarta_Sans'] text-base font-normal leading-6"
              style={{ color: "#102F38" }}
            >
              Sign in to see if Ad-Free Feed is available for your account and
              which plan includes this benefit.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex w-full flex-wrap items-start gap-4 pt-2">
            <button
              type="button"
              className="min-h-10 rounded-xl px-5 py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "#087A8B",
                color: "#FFFFFF",
              }}
            >
              Sign In to Check
            </button>

            <button
              type="button"
              className="min-h-10 rounded-xl px-5 py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-semibold transition-colors hover:bg-[#F5F7F7]"
              style={{
                backgroundColor: "#FFFFFF",
                color: "#087A8B",
                border: "1px solid #D6E3E6",
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}