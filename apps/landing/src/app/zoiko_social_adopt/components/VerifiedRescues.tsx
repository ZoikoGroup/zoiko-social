import React from "react";
import Image from "next/image";

export default function VerifiedRescues() {
  const rescues = [
    {
      name: "Sacramento Animal Rescue",
      serviceArea: "Sacramento, CA",
      type: "Rescue",
      activeListings: "12",
      cover: "/zoiko_social_adopt/org1.png"
    },
    {
      name: "Golden State Rescue Alliance",
      serviceArea: "California State",
      type: "Alliance",
      activeListings: "45",
      cover: "/zoiko_social_adopt/org2.png"
    },
    {
      name: "Second Chance Animal Shelter",
      serviceArea: "London area",
      type: "Shelter",
      activeListings: "8",
      cover: "/zoiko_social_adopt/org3.png"
    }
  ];

  return (
    <div className="w-full flex flex-col gap-6 pt-10">
      <div className="flex flex-col gap-2 max-w-[720px] mx-auto text-center">
        <div className="text-cyan-950 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-[33px]">
          Start with organizations Zoiko Social has verified.
        </div>
        <div className="text-teal-950 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">
          Every adoption listing shown through this experience makes its rescue or shelter source visible, with a clear route to understand verification.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rescues.map((rescue, idx) => (
          <div key={idx} className="p-6 bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-200 flex flex-col gap-5">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-zinc-100 rounded-full relative overflow-hidden shrink-0">
                <Image src={rescue.cover} alt={rescue.name} fill className="object-cover" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-cyan-950 text-lg font-bold font-['Plus_Jakarta_Sans'] leading-snug">
                  {rescue.name}
                </div>
                <div className="text-cyan-800 text-[13px] font-semibold font-['Plus_Jakarta_Sans']">
                  Verified Organization
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-['Plus_Jakarta_Sans']">
              <div className="flex items-center gap-2">
                <span className="text-cyan-950 font-bold">Service area:</span>
                <span className="text-teal-950">{rescue.serviceArea}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-950 font-bold">Type:</span>
                <span className="text-teal-950">{rescue.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-950 font-bold">Active listings:</span>
                <span className="text-teal-950">{rescue.activeListings}</span>
              </div>
            </div>

            <div className="mt-auto pt-2 flex items-center gap-1 cursor-pointer">
              <span className="text-cyan-800 text-[13.5px] font-semibold font-['Plus_Jakarta_Sans'] hover:underline">
                View Organization
              </span>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.41667 9.75L9.20833 5.95833L5.41667 2.16667" stroke="#00808B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
        <span className="text-cyan-800 text-[15px] font-semibold font-['Plus_Jakarta_Sans'] cursor-pointer hover:underline">
          Browse Verified Rescues &amp; Shelters
        </span>
        <span className="text-cyan-800 text-[15px] font-semibold font-['Plus_Jakarta_Sans'] cursor-pointer hover:underline">
          How We Verify
        </span>
        <span className="text-cyan-800 text-[15px] font-semibold font-['Plus_Jakarta_Sans'] cursor-pointer hover:underline">
          Represent a rescue or shelter? Start verification.
        </span>
      </div>
    </div>
  );
}
