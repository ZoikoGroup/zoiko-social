import React from "react";

export default function CommunitiesHeader() {
  return (
    <div className="w-full max-w-[1232px] pt-7 pb-12 border-b border-cyan-100 inline-flex flex-col justify-start items-start gap-5">
      {/* Header Section */}
      <div className="self-stretch inline-flex justify-start items-end gap-10 flex-wrap content-end">
        <div className="inline-flex flex-col justify-start items-start gap-1.5">
          {/* Badge */}
          <div className="px-3 py-[5px] bg-gray-100 rounded-full inline-flex justify-start items-start">
            <span className="justify-center text-cyan-700 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-4 tracking-wide">
              Communities
            </span>
          </div>

          {/* Title */}
          <div className="self-stretch pt-2 flex flex-col justify-start items-start">
            <h1 className="justify-center text-cyan-900 text-4xl font-extrabold font-['Plus_Jakarta_Sans'] leading-[51px]">
              All Communities
            </h1>
          </div>

          {/* Subtitles */}
          <div className="w-full max-w-[600px] pt-0.5 flex flex-col justify-start items-start">
            <p className="justify-center text-cyan-950 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">
              Explore every community on Zoiko Social in one directory.
            </p>
          </div>
          <div className="w-full max-w-[600px] flex flex-col justify-start items-start">
            <p className="justify-center text-blue-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
              Browse by purpose, species, or professional focus, then review
              each community&apos;s purpose
              <br />
              before you join.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="w-full max-w-[720px] pb-5 flex flex-col justify-start items-start gap-1.5">
        <div className="self-stretch flex flex-col justify-start items-start">
          <label
            htmlFor="community-search"
            className="self-stretch justify-center text-cyan-900 text-xs font-bold font-['Plus_Jakarta_Sans'] leading-5"
          >
            Search communities
          </label>
        </div>

        <div className="self-stretch px-4 py-3 bg-white rounded-2xl shadow-sm outline outline-2 outline-offset-[-2px] outline-cyan-700 focus-within:outline-cyan-600 inline-flex justify-start items-center gap-2.5">
          {/* Search Icon (Magnifying Glass) */}
          <div className="w-4 h-4 relative overflow-hidden">
            <div className="w-2.5 h-2.5 left-[3px] top-[3px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-cyan-700 rounded-full" />
            <div className="w-[3.26px] h-[3.26px] left-[12.49px] top-[12.49px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-cyan-700 origin-top-left rotate-45" />
          </div>

          {/* Search Input */}
          <div className="flex-1 px-0.5 py-px bg-white inline-flex flex-col justify-start items-start overflow-hidden">
            <div className="self-stretch flex flex-col justify-start items-start overflow-hidden">
              <input
                id="community-search"
                type="text"
                placeholder="Search by community name, purpose, or species"
                className="w-full bg-transparent border-none outline-none text-gray-700 text-base font-normal font-['Plus_Jakarta_Sans'] placeholder-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
