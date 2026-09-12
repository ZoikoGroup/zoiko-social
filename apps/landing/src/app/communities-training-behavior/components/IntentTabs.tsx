import React from "react";

const TABS = ["All", "Training", "Behavior"];

export default function IntentTabs() {
  return (
    <div className="w-full sm:w-fit h-[45px] px-1 bg-gray-50 rounded-full outline outline-1 outline-offset-[-1px] outline-zinc-200 flex items-center gap-1">
      {TABS.map((tab, idx) => (
        <div
          key={tab}
          className={`flex-1 sm:flex-none h-[35px] px-4 rounded-full flex items-center justify-center cursor-pointer whitespace-nowrap ${
            idx === 0 ? "bg-cyan-800" : "hover:bg-zinc-100"
          }`}
        >
          <span
            className={`text-[13.5px] font-bold font-['Plus_Jakarta_Sans'] ${
              idx === 0 ? "text-white" : "text-gray-500"
            }`}
          >
            {tab}
          </span>
        </div>
      ))}
    </div>
  );
}
