import React from 'react';

export default function FollowDigest() {
  return (
    <div className="w-full max-w-[1320px] mx-auto px-6 lg:px-[24px] mb-20 bg-[#F7F9FA] py-16 rounded-[32px]">
      <div className="bg-gradient-to-br from-[#073B47] to-[#066879] rounded-[32px] p-10 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <h2 className="text-[26px] md:text-[32px] font-extrabold mb-4 leading-tight">
            Follow Global Coverage, calmly.
          </h2>
          <p className="text-[13.5px] text-white/90 mb-0">
            Choose a digest cadence. You'll only hear about material updates — never every mention or reaction.
          </p>
        </div>
        <div className="flex gap-4 items-center bg-white/10 p-2 rounded-2xl w-full md:w-auto border border-white/20">
          <select className="bg-transparent text-white font-semibold outline-none px-4 py-3 appearance-none flex-grow min-w-[150px]">
            <option className="text-black" value="daily">Daily digest</option>
            <option className="text-black" value="weekly">Weekly digest</option>
            <option className="text-black" value="immediate">Immediate updates</option>
          </select>
          <button className="bg-[#E88924] hover:bg-[#c9701a] text-white px-6 py-3 rounded-xl font-bold transition whitespace-nowrap">
            Save Preference
          </button>
        </div>
      </div>
    </div>
  );
}
