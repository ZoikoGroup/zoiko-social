import React from "react";
import Image from "next/image";
import { Briefcase, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function PlanningALargerIntegration() {
  return (
    <section className="w-full bg-[#FFFFFF] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl">
        {/* Main Banner Card */}
        <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Side: Image */}
          <div className="relative lg:col-span-6 min-h-[300px] lg:min-h-[380px]">
            <Image
              src="/developer/img5.png"
              alt="Team in a meeting planning a larger integration"
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Right Side: Content */}
          <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              {/* Badge & Icon */}
              <div className="flex flex-col items-start gap-3">
                <div className="w-fit bg-[#FEF3C7] border border-amber-200/60 rounded-full px-3.5 py-1 flex items-center shadow-sm">
                  <span className="text-[10px] font-medium text-amber-800">
                    Shown only if an approved route exists
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-[#0A5C6F]" />
                </div>
              </div>

              {/* Headings */}
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111827]">
                  Planning a larger integration?
                </h3>
                <p className="text-xs md:text-sm text-gray-500 font-normal leading-relaxed">
                  Talk to the team about implementation help. This is separate
                  from fixing an issue.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <Link
              href="#request-developer-help"
              className="mt-8 w-fit inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#111827] border border-gray-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-[#0A5C6F]" />
              Ask about implementation help
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
