import { Plus_Jakarta_Sans } from "next/font/google";

// Optimize font loading in Next.js
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function Toolbar() {
  return (
    <div
      className={`w-full max-w-[1232px] py-4 flex justify-between items-center border-b border-cyan-200 ${plusJakartaSans.className}`}
    >
      {/* Left Side: Search and Filters */}
      <div className="flex items-center gap-3 flex-1">
        {/* Search Input */}
        <div className="w-full max-w-96 min-w-64 px-3.5 py-2 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-cyan-200 flex justify-start items-center gap-2 focus-within:outline-cyan-400 transition-colors">
          <div className="w-3.5 h-4 relative overflow-hidden shrink-0">
            <div className="w-2 h-2 left-[2.48px] top-[3.04px] absolute outline outline-[1.24px] outline-offset-[-0.62px] outline-cyan-900 rounded-full" />
            <div className="w-[2.70px] h-[2.70px] left-[10.32px] top-[10.89px] absolute outline outline-[1.24px] outline-offset-[-0.62px] outline-cyan-900" />
          </div>
          <input
            type="text"
            placeholder="Search popular communities"
            className="flex-1 bg-transparent text-slate-600 text-sm font-normal outline-none placeholder:text-slate-500"
          />
        </div>

        {/* Filters Button */}
        <button className="px-3.5 py-2 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-cyan-200 hover:bg-slate-50 transition-colors flex justify-center items-center gap-2 cursor-pointer">
          <div className="w-3.5 h-3.5 relative overflow-hidden shrink-0">
            <div className="w-2.5 h-0 left-[2.50px] top-[3.75px] absolute outline outline-[1.25px] outline-offset-[-0.63px] outline-cyan-900" />
            <div className="w-[2.50px] h-[2.50px] left-[4.38px] top-[2.50px] absolute outline outline-[1.25px] outline-offset-[-0.63px] outline-cyan-900 rounded-full" />
            <div className="w-2.5 h-0 left-[2.50px] top-[7.50px] absolute outline outline-[1.25px] outline-offset-[-0.63px] outline-cyan-900" />
            <div className="w-[2.50px] h-[2.50px] left-[8.75px] top-[6.25px] absolute outline outline-[1.25px] outline-offset-[-0.63px] outline-cyan-900 rounded-full" />
            <div className="w-2.5 h-0 left-[2.50px] top-[11.25px] absolute outline outline-[1.25px] outline-offset-[-0.63px] outline-cyan-900" />
            <div className="w-[2.50px] h-[2.50px] left-[5px] top-[10px] absolute outline outline-[1.25px] outline-offset-[-0.63px] outline-cyan-900 rounded-full" />
          </div>
          <span className="text-cyan-900 text-sm font-semibold">Filters</span>
        </button>
      </div>

      {/* Right Side: Sort Dropdown */}
      <button className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer pl-4">
        <div className="w-3.5 h-3.5 relative overflow-hidden shrink-0">
          <div className="w-2.5 h-1.5 left-[2.33px] top-[3.50px] absolute outline outline-1 outline-offset-[-0.58px] outline-blue-600" />
        </div>
        <span className="text-blue-600 text-xs font-semibold leading-5">
          Sort: Popular ranking
        </span>
      </button>
    </div>
  );
}
