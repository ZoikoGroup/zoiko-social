"use client";

import React from "react";

export default function ReadyToVerifyCtaSection() {
  const scrollToWorkspace = () => {
    const el = document.getElementById("workspace");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToOrg = () => {
    const el = document.getElementById("org-verification");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-[#F7F9FA] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Banner with Linear Gradient */}
        <div
          className="relative rounded-[24px] sm:rounded-[28px] overflow-hidden px-5 py-10 sm:px-10 sm:py-12 lg:py-[47px] lg:px-12 flex flex-col items-center text-center shadow-lg"
          style={{
            background:
              "linear-gradient(164deg, rgba(6, 104, 121, 1) 0%, rgba(4, 83, 99, 1) 100%)",
          }}
        >
          {/* Subtle Decorative Background Glow */}
          <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Badge Icon Box */}
          <div className="w-[44px] h-[44px] rounded-[12px] bg-white/[0.12] flex items-center justify-center text-white mb-3.5 sm:mb-4 shrink-0">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M11 13.75C14.0376 13.75 16.5 11.2876 16.5 8.25C16.5 5.21243 14.0376 2.75 11 2.75C7.96243 2.75 5.5 5.21243 5.5 8.25C5.5 11.2876 7.96243 13.75 11 13.75Z"
                stroke="white"
                strokeWidth="1.83333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.79102 12.8333L6.41602 19.2499L10.9993 16.9583L15.5827 19.2499L14.2077 12.8333"
                stroke="white"
                strokeWidth="1.83333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.70898 8.24989L10.359 9.89989L13.2923 6.96655"
                stroke="white"
                strokeWidth="1.83333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="font-jakarta font-extrabold text-[26px] sm:text-[32px] lg:text-[36px] leading-[1.18] text-white mb-2.5 tracking-[-0.01em]">
            Ready to verify?
          </h2>

          {/* Subtitle */}
          <p className="font-jakarta text-[14.5px] sm:text-[16px] lg:text-[17px] leading-[1.55] sm:leading-[27px] text-[#CFE6EA] max-w-[498px] mb-6 sm:mb-7 font-normal">
            Start as a professional or an organization. It&apos;s free to apply.
          </p>

          {/* Action Buttons */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-3.5 z-10">
            <button
              type="button"
              onClick={scrollToWorkspace}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] font-jakarta font-semibold text-[14.5px] sm:text-[15px] text-white border border-white/45 bg-transparent hover:bg-white/10 hover:border-white/70 transition-all cursor-pointer"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M9.99935 9.99992C11.8403 9.99992 13.3327 8.50753 13.3327 6.66659C13.3327 4.82564 11.8403 3.33325 9.99935 3.33325C8.1584 3.33325 6.66602 4.82564 6.66602 6.66659C6.66602 8.50753 8.1584 9.99992 9.99935 9.99992Z"
                  stroke="white"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.33398 17.4999C3.33398 15.7318 4.03636 14.0361 5.28661 12.7859C6.53685 11.5356 8.23254 10.8333 10.0007 10.8333C11.7688 10.8333 13.4645 11.5356 14.7147 12.7859C15.9649 14.0361 16.6673 15.7318 16.6673 17.4999"
                  stroke="white"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Verify as a professional</span>
            </button>

            <button
              type="button"
              onClick={scrollToOrg}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] font-jakarta font-semibold text-[14.5px] sm:text-[15px] text-white border border-white/45 bg-transparent hover:bg-white/10 hover:border-white/70 transition-all cursor-pointer"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M3.33268 17.5001V4.16675L9.99935 1.66675V17.5001M9.99935 6.66675H16.666V17.5001M6.66602 6.66675H6.67435M6.66602 10.0001H6.67435M6.66602 13.3334H6.67435M13.3327 10.0001H13.341M13.3327 13.3334H13.341M1.66602 17.5001H18.3327"
                  stroke="white"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Verify an organization</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
