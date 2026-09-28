import React from "react";
import Image from "next/image";

export default function PartnershipsSection() {
  return (
    <div className="w-full bg-[#FFFFFF] py-16 px-4 md:px-12 font-sans flex items-center justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Text & CTA Buttons */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">
              PARTNERSHIPS
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-[48px] font-bold text-[#066879] tracking-tight leading-tight">
              Build together for communities
            </h1>
          </div>

          <p className="text-sm md:text-base text-[#5a6e75] leading-relaxed">
            Explore strategic partnership opportunities with Zoiko Social. From
            rescues and shelters to corporate innovation partners, we work with
            organizations aligned on mission, trust, and impact.
          </p>

          <div className="flex flex-col flex-wrap sm:flex-row gap-4 pt-4 max-w-[400px]">
            <button className="bg-[#066879] w-full hover:bg-[#055563] text-white font-medium text-sm py-3.5 px-6 rounded-xl shadow-sm transition-all text-center">
              Start Partnership Inquiry
            </button>
            <button className="bg-white w-full hover:bg-gray-50 text-[#1a2d37] border border-[#DCE5E8] font-medium text-sm py-3.5 px-6 rounded-xl shadow-sm transition-all text-center">
              Explore Partnership Paths
            </button>
          </div>
        </div>

        {/* Right Column: Image Card */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full h-[350px] md:h-[480px] rounded-3xl overflow-hidden">
            <Image
              src="/partnerships/1.png"
              alt="People collaborating in a group session"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
