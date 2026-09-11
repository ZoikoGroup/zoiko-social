import React from "react";

export default function Toolbar() {
  return (
    <div className="w-[1232px] h-20 relative border-b border-zinc-200">
      {/* Search Input Container */}
      <div className="w-96 h-10 left-0 top-[24px] absolute bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-200">
        <div className="w-3.5 h-4 left-[15px] top-[12px] absolute overflow-hidden">
          <div className="size-2 left-[2.49px] top-[3.02px] absolute outline outline-[1.25px] outline-offset-[-0.62px] outline-teal-950" />
          <div className="size-[2.71px] left-[10.36px] top-[10.90px] absolute outline outline-[1.25px] outline-offset-[-0.62px] outline-teal-950" />
        </div>
        <div className="w-80 h-5 left-[37.94px] top-[10px] absolute bg-white overflow-hidden">
          <div className="w-80 h-4 left-[2px] top-[1px] absolute overflow-hidden">
            <div className="w-56 h-4 left-0 top-0 absolute justify-center text-neutral-500 text-sm font-normal font-['Plus_Jakarta_Sans']">
              Search professional communities
            </div>
          </div>
        </div>
      </div>

      {/* Filters Button */}
      <div className="w-24 h-9 left-[392px] top-[25.50px] absolute bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-200 cursor-pointer">
        <div className="size-3.5 left-[16px] top-[11px] absolute overflow-hidden">
          <div className="w-2.5 h-0 left-[2.50px] top-[3.75px] absolute outline outline-[1.25px] outline-offset-[-0.63px] outline-teal-950" />
          <div className="size-[2.50px] left-[4.38px] top-[2.50px] absolute outline outline-[1.25px] outline-offset-[-0.63px] outline-teal-950" />
          <div className="w-2.5 h-0 left-[2.50px] top-[7.50px] absolute outline outline-[1.25px] outline-offset-[-0.63px] outline-teal-950" />
          <div className="size-[2.50px] left-[8.75px] top-[6.25px] absolute outline outline-[1.25px] outline-offset-[-0.63px] outline-teal-950" />
          <div className="w-2.5 h-0 left-[2.50px] top-[11.25px] absolute outline outline-[1.25px] outline-offset-[-0.63px] outline-teal-950" />
          <div className="size-[2.50px] left-[5px] top-[10px] absolute outline outline-[1.25px] outline-offset-[-0.63px] outline-teal-950" />
        </div>
        <div className="w-10 h-4 left-[39px] top-[10px] absolute text-center justify-center text-teal-950 text-sm font-semibold font-['Plus_Jakarta_Sans']">
          Filters
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="cursor-pointer">
        <div className="size-3.5 left-[1113.23px] top-[37px] absolute overflow-hidden">
          <div className="w-2.5 h-1.5 left-[2.33px] top-[3.50px] absolute outline outline-1 outline-offset-[-0.58px] outline-gray-500" />
        </div>
        <div className="w-24 h-5 left-[1133.23px] top-[34.25px] absolute justify-center text-gray-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-5">
          Sort: Relevance
        </div>
      </div>
    </div>
  );
}
