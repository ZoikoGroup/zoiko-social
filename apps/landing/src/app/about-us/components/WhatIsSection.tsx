import React from "react";

export default function WhatIsSection() {
  return (
    <section className="mx-auto w-full max-w-[1440px] bg-white px-6 pb-12 pt-8 md:px-[80px] lg:pb-16 lg:pt-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Card 1: What ZoikoSocial Is */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border-2 border-[#10B981] bg-gradient-to-br from-[#10B981]/5 via-[#10B981]/30 to-gray-50 p-8 md:p-12">
          {/* Header */}
          <div className="flex items-center gap-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 shrink-0 text-[#066879]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="font-montserrat text-2xl font-extrabold text-gray-900 md:text-[30px] lg:leading-[54.40px]">
              What ZoikoSocial Is
            </h2>
          </div>

          <p className="mt-8 font-inter text-lg font-semibold leading-7 text-gray-900">
            ZoikoSocial is a global, multi-modal social platform that integrates the core functions people rely on daily — sharing, messaging, calling, community building, news consumption, events, and commerce — within a purpose-built environment for animal life.
          </p>

          <div className="mt-10 flex flex-col gap-6">
            {/* List Item 1 */}
            <div className="flex items-start gap-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mt-0.5 h-6 w-6 shrink-0 text-[#10B981]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-inter text-base font-normal leading-6 text-gray-700">
                A hybrid platform combining visual storytelling, real-time communication, and community organization
              </p>
            </div>
            {/* List Item 2 */}
            <div className="flex items-start gap-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mt-0.5 h-6 w-6 shrink-0 text-[#10B981]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-inter text-base font-normal leading-6 text-gray-700">
                A verified information system with institutional rigor
              </p>
            </div>
            {/* List Item 3 */}
            <div className="flex items-start gap-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mt-0.5 h-6 w-6 shrink-0 text-[#10B981]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-inter text-base font-normal leading-6 text-gray-700">
                Meaningful, safe, and globally scalable connections
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: What ZoikoSocial Is Not */}
        <div className="flex flex-1 flex-col rounded-2xl border-2 border-gray-200 bg-white p-8 md:p-12">
          {/* Header */}
          <div className="flex items-center gap-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 shrink-0 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 10l4 4m0-4l-4 4m11-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="font-montserrat text-2xl font-extrabold text-gray-900 md:text-[30px] lg:leading-[54.40px]">
              What ZoikoSocial Is Not
            </h2>
          </div>

          <p className="mt-8 font-inter text-lg font-semibold leading-7 text-gray-900">
            ZoikoSocial is intentionally governed. Structure, safety, and accountability are architectural decisions, not afterthoughts.
          </p>

          <div className="mt-10 flex flex-col gap-6">
            {/* List Item 1 */}
            <div className="flex items-start gap-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mt-0.5 h-6 w-6 shrink-0 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 10l4 4m0-4l-4 4m11-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-inter text-base font-normal leading-6 text-gray-700">
                Not an entertainment-first platform optimized for outrage or engagement loops
              </p>
            </div>
            {/* List Item 2 */}
            <div className="flex items-start gap-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mt-0.5 h-6 w-6 shrink-0 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 10l4 4m0-4l-4 4m11-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-inter text-base font-normal leading-6 text-gray-700">
                Not an unmoderated network where misinformation, abuse, or exploitation can flourish
              </p>
            </div>
            {/* List Item 3 */}
            <div className="flex items-start gap-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mt-0.5 h-6 w-6 shrink-0 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 10l4 4m0-4l-4 4m11-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-inter text-base font-normal leading-6 text-gray-700">
                Not a marketplace enabling unethical breeding, trafficking, or deceptive health claims
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
