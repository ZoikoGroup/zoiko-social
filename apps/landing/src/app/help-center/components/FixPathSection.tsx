import React from "react";
import Image from "next/image";
import {
  Search,
  CheckCircle2,
  Terminal,
  RefreshCw,
  MessageSquare,
  BookOpen,
} from "lucide-react";

export default function FixPathSection() {
  return (
    <section className="w-full bg-white py-16 px-4 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] tracking-tight mb-3">
            Every fix follows the same path
          </h2>
          <p className="text-sm md:text-base text-gray-500 font-normal mb-10">
            Clear steps, a way to check it worked, and help if it didn&apost.
          </p>

          {/* Steps Timeline / Process */}
          <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-2 mb-10 relative">
            {/* Step 1: Confirm */}
            <div className="flex flex-col items-start md:items-center text-left md:text-center relative z-10 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center text-[#0A5C6F] mb-3 shadow-sm">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#111827] mb-0.5">
                Confirm
              </h3>
              <p className="text-xs text-gray-400 font-normal">
                Match your problem
              </p>
            </div>

            {/* Step 2: Check */}
            <div className="flex flex-col items-start md:items-center text-left md:text-center relative z-10 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center text-[#0A5C6F] mb-3 shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#111827] mb-0.5">Check</h3>
              <p className="text-xs text-gray-400 font-normal">
                Before you start
              </p>
            </div>

            {/* Step 3: Fix */}
            <div className="flex flex-col items-start md:items-center text-left md:text-center relative z-10 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center text-[#0A5C6F] mb-3 shadow-sm">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#111827] mb-0.5">Fix</h3>
              <p className="text-xs text-gray-400 font-normal">
                Follow the steps
              </p>
            </div>

            {/* Step 4: Verify */}
            <div className="flex flex-col items-start md:items-center text-left md:text-center relative z-10 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center text-[#0A5C6F] mb-3 shadow-sm">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#111827] mb-0.5">
                Verify
              </h3>
              <p className="text-xs text-gray-400 font-normal">
                See it working
              </p>
            </div>

            {/* Step 5: Get help */}
            <div className="flex flex-col items-start md:items-center text-left md:text-center relative z-10 w-full md:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#0A5C6F] text-white flex items-center justify-center mb-3 shadow-md">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#111827] mb-0.5">
                Get help
              </h3>
              <p className="text-xs text-gray-400 font-normal">
                If it still fails
              </p>
            </div>
          </div>

          {/* Action Button */}
          <a
            href="#"
            className="flex items-center gap-2 bg-[#0A5C6F] hover:bg-[#084A59] text-white text-sm font-medium px-6 py-3 rounded-full transition-colors shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            Open a sample guide
          </a>
        </div>

        {/* Right Preview Card */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative w-[450px] h-[450px] rounded-3xl overflow-hidden">
            {/* Background Image inside Card */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/help/8.png"
                alt="Fix photo uploads preview"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Inner Floating Card */}
            <div className="relative z-10 bg-white rounded-3xl p-6 shadow-2xl flex flex-col w-[350px] h-[250px] mx-auto mt-40">
              <div className="inline-block bg-[#F0F9FA] text-[#0A5C6F] text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3 w-fit">
                Posts and media
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-4">
                Fix photo uploads that fail
              </h3>
              <div className="border-t border-gray-100 divide-y divide-gray-100">
                <div className="py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#0A5C6F] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span className="text-xs font-medium text-[#111827]">
                    Check your connection
                  </span>
                </div>
                <div className="py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#0A5C6F] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="text-xs font-medium text-[#111827]">
                    Check the file type
                  </span>
                </div>
                <div className="py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#E0F2F4] text-[#0A5C6F] text-xs font-semibold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span className="text-xs font-medium text-[#111827]">
                    Update the app
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
