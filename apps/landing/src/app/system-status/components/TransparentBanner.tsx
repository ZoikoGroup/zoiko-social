import React from "react";

export default function TransparentBanner() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 flex justify-center font-sans">
      <div className="w-full max-w-7xl bg-[#066879] rounded-3xl p-10 md:p-16 flex flex-col items-center text-center text-white shadow-sm relative overflow-hidden">
        {/* Icon / Graphic */}
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-md overflow-hidden p-2">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white to-gray-200 flex items-center justify-center overflow-hidden">
              <div className="w-1/2 h-full bg-[#FFFFFF] absolute left-0" />
              <div className="w-1/2 h-full absolute right-0 grid grid-cols-2 grid-rows-4 bg-white">
                <div className="bg-[#066879]" />
                <div className="bg-white" />
                <div className="bg-white" />
                <div className="bg-[#066879]" />
                <div className="bg-[#066879]" />
                <div className="bg-white" />
                <div className="bg-white" />
                <div className="bg-[#066879]" />
              </div>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
          We&apos;re Transparent About Everything
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base text-gray-100 font-normal max-w-5xl leading-relaxed">
          We publish detailed incident reports, historical uptime data, planned
          maintenance schedules, and monthly reliability metrics. You can hold
          us accountable. That&apos;s the Zoiko Social difference.
        </p>
      </div>
    </section>
  );
}
