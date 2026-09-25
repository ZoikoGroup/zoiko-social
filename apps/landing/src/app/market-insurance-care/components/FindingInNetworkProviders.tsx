import React from "react";
import Image from "next/image";

interface Provider {
  name: string;
  title: string;
  image: string;
  tags: string[];
  specialties: string;
  location: string;
  insurance: string;
  copay: string;
}

const providers: Provider[] = [
  {
    name: "Dr. Sarah Johnson",
    title: "Licensed Clinical Therapist",
    image: "/market/3.png",
    tags: ["Telehealth Available", "New Patients"],
    specialties: "Anxiety, Depression, PTSD",
    location: "Downtown Office",
    insurance: "Accepts most plans",
    copay: "$30",
  },
  {
    name: "Dr. Michael Chen",
    title: "Psychiatrist (Medication Management)",
    image: "/market/4.png",
    tags: ["Accepting Patients", "15+ Years"],
    specialties: "Depression, Bipolar, ADHD",
    location: "Medical Complex",
    insurance: "Blue Cross, Aetna",
    copay: "$40",
  },
];

export default function FindingInNetworkProviders() {
  return (
    <div className="w-full min-h-screen bg-white py-12 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Finding in-network providers
          </h1>
          <p className="text-[#5a6e75] text-sm md:text-base">
            In-network providers cost less and are covered by your insurance.
            Use these tools to find therapists and psychiatrists.
          </p>
        </div>

        {/* Main Content Box */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#DCE5E8] space-y-8">
          {/* Search Inputs Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-3">
              <input
                type="text"
                placeholder="Location (city, zip code)"
                className="w-full px-4 py-3 rounded-xl border border-[#DCE5E8] bg-[#F7F9FA] text-sm text-[#1a2d37] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#066879]"
              />
            </div>
            <div className="lg:col-span-4">
              <input
                type="text"
                placeholder="Therapist type (therapist, psychiatrist, counselc"
                className="w-full px-4 py-3 rounded-xl border border-[#DCE5E8] bg-[#F7F9FA] text-sm text-[#1a2d37] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#066879]"
              />
            </div>
            <div className="lg:col-span-3">
              <input
                type="text"
                placeholder="Insurance plan name"
                className="w-full px-4 py-3 rounded-xl border border-[#DCE5E8] bg-[#F7F9FA] text-sm text-[#1a2d37] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#066879]"
              />
            </div>
            <div className="lg:col-span-2 flex">
              <a
                href="#"
                className="w-full py-3 rounded-xl bg-[#066879] hover:bg-[#055563] text-white font-medium text-sm transition-colors text-center inline-block"
              >
                Search
              </a>
            </div>
          </div>

          {/* Subheading */}
          <div className="text-sm font-bold text-[#1a2d37]">
            Recommended providers in your area
          </div>

          {/* Providers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {providers.map((provider, index) => (
              <div
                key={index}
                className="bg-[#F7F9FA] rounded-2xl p-6 md:p-8 border border-[#DCE5E8] flex flex-col justify-between space-y-6"
              >
                <div className="space-y-6">
                  {/* Provider Header Info */}
                  <div className="flex items-start space-x-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border border-[#DCE5E8]">
                      <Image
                        src={provider.image}
                        alt={provider.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-base font-bold text-[#1a2d37]">
                        {provider.name}
                      </h2>
                      <p className="text-xs text-[#5a6e75]">{provider.title}</p>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {provider.tags.map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="bg-[#EEF8F9] text-[#066879] text-[11px] font-medium px-2.5 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-[1px] bg-[#DCE5E8]" />

                  {/* Provider Details List */}
                  <div className="space-y-2 text-xs md:text-sm text-[#5a6e75]">
                    <div>
                      <span className="font-semibold text-[#1a2d37]">
                        Specialties:
                      </span>{" "}
                      {provider.specialties}
                    </div>
                    <div>
                      <span className="font-semibold text-[#1a2d37]">
                        Location:
                      </span>{" "}
                      {provider.location}
                    </div>
                    <div>
                      <span className="font-semibold text-[#1a2d37]">
                        Insurance:
                      </span>{" "}
                      {provider.insurance}
                    </div>
                    <div>
                      <span className="font-semibold text-[#1a2d37]">
                        Copay:
                      </span>{" "}
                      {provider.copay}
                    </div>
                  </div>
                </div>

                {/* Schedule Button */}
                <div className="pt-2">
                  <a
                    href="#"
                    className="w-full py-3 rounded-xl bg-[#066879] hover:bg-[#055563] text-white font-medium text-sm transition-colors text-center block"
                  >
                    Schedule Appointment
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
