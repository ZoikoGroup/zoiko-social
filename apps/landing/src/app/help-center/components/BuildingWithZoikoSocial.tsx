import React from "react";
import Image from "next/image";
import { Code2, Terminal, ChevronRight } from "lucide-react";

const developerLinks = [
  {
    icon: Code2,
    title: "API Documentation",
    description: "Technical reference for developers.",
  },
  {
    icon: Terminal,
    title: "Developer Support",
    description: "Help with an issue in your integration.",
  },
] as const;

export default function BuildingWithZoikoSocial() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Image Card */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-lg h-[360px] rounded-3xl overflow-hidden shadow-md">
            <Image
              src="/help/13.png"
              alt="Building with Zoiko Social Corgi"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] tracking-tight mb-2">
            Building with Zoiko Social?
          </h2>
          <p className="text-sm md:text-base text-gray-500 font-normal mb-8">
            Technical answers live with the developer teams.
          </p>

          {/* Links List */}
          <div className="w-full flex flex-col gap-4">
            {developerLinks.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={index}
                  href="#"
                  className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#F0F9FA] flex items-center justify-center text-[#0A5C6F] shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#111827] group-hover:text-[#0A5C6F] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 font-normal mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-[#0A5C6F] group-hover:translate-x-0.5 transition-all shrink-0 ml-2">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
