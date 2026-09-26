import React from "react";
import Image from "next/image";
import { FileText, ShieldCheck, Lock } from "lucide-react";

export default function MentalHealthInsuranceMatters() {
  return (
    <div className="w-full min-h-screen bg-[#F7F9FA] py-12 px-4 md:px-8 font-sans text-[#066879]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Heading */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#066879] tracking-tight">
          Why mental health insurance matters
        </h1>

        {/* Hero Image Container */}
        <div className="w-full relative overflow-hidden rounded-3xl">
          <Image
            src="/market/2.png"
            alt="Mental health support session"
            width={1400}
            height={500}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* Three Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#066879] mb-2">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-[#066879] text-lg font-bold">
              Coverage support
            </h2>
            <p className="text-[#5a6e75] text-sm leading-relaxed">
              Insurance covers therapy sessions, medications, crisis care, and
              hospital visits. Understand what&apos;s included in your plan.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#066879] mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-[#066879] text-lg font-bold">
              Access to providers
            </h2>
            <p className="text-[#5a6e75] text-sm leading-relaxed">
              Expand your options to licensed therapists, psychiatrists, and
              counselors. In-network care costs less out of pocket.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#066879] mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-[#066879] text-lg font-bold">
              Legal protection
            </h2>
            <p className="text-[#5a6e75] text-sm leading-relaxed">
              Mental health parity laws ensure mental health coverage matches
              physical health benefits. Know your rights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
