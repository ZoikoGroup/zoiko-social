import React from "react";
import Image from "next/image";
import { Activity, Terminal } from "lucide-react";

export default function NotRespondingCard() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl">
        {/* Main Banner Card */}
        <div className="w-full bg-[#073B47] rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 text-white items-stretch">
          {/* Left Side: Image */}
          <div className="relative lg:col-span-4 min-h-[260px] lg:min-h-[320px]">
            <Image
              src="/api/11.png"
              alt="Developer working on code"
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Middle: Not Responding Section */}
          <div className="lg:col-span-4 p-8 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#0A4D5C]">
            <div className="flex flex-col gap-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                  Not responding?
                </h3>
                <p className="text-xs md:text-sm text-gray-300 font-normal leading-relaxed">
                  Check for a live incident before you debug.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="mt-8 w-fit inline-flex items-center gap-2 bg-transparent hover:bg-white/10 text-white border border-white/20 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              System Status
            </button>
          </div>

          {/* Right Side: Still Stuck Section */}
          <div className="lg:col-span-4 p-8 md:p-10 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-white" />
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                  Still stuck?
                </h3>
                <p className="text-xs md:text-sm text-gray-300 font-normal leading-relaxed">
                  Send the team a request with the details that matter.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="mt-8 w-fit inline-flex items-center gap-2 bg-transparent hover:bg-white/10 text-white border border-white/20 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              Developer Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
