import { Flag, ShieldAlert, Clock } from "lucide-react";

export default function WhatWouldYouLikeToDo() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16">
      <h2 className="text-[#102A32] text-2xl font-bold mb-2">What would you like to do?</h2>
      <p className="text-[#102A32] mb-8">Choosing the right path gets your concern to the right team faster.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Option 1 */}
        <div className="bg-[#EEF8F9] border border-[#066879] rounded-[28px] p-8 flex flex-col cursor-pointer hover:shadow-md transition-shadow">
          <div className="w-11 h-11 bg-[#066879] rounded-xl flex items-center justify-center mb-6 text-white">
            <Flag size={20} />
          </div>
          <h3 className="text-[#102A32] font-bold text-lg mb-3">Report a factual inaccuracy</h3>
          <p className="text-[#5E7076] text-sm leading-relaxed mb-8 flex-1">
            A headline, quote, number, source, date, photo, or
            translation appears wrong in a specific News story.
          </p>
          <div className="flex items-center text-[#073B47] font-bold text-sm gap-2">
            Start editorial report &rarr;
          </div>
        </div>

        {/* Option 2 */}
        <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-8 flex flex-col cursor-pointer hover:shadow-md transition-shadow">
          <div className="w-11 h-11 bg-white border border-[#E5E7EB] shadow-sm rounded-xl flex items-center justify-center mb-6 text-[#5E7076]">
            <ShieldAlert size={20} />
          </div>
          <h3 className="text-[#102A32] font-bold text-lg mb-3">Safety or welfare concern</h3>
          <p className="text-[#5E7076] text-sm leading-relaxed mb-8 flex-1">
            The concern involves animal abuse, exploitation, or
            an urgent welfare or safety risk described in a story.
          </p>
          <div className="flex items-center text-[#073B47] font-bold text-sm gap-2">
            Go to safety reporting &rarr;
          </div>
        </div>

        {/* Option 3 */}
        <div className="bg-white border border-[#E5E7EB] rounded-[28px] p-8 flex flex-col cursor-pointer hover:shadow-md transition-shadow">
          <div className="w-11 h-11 bg-white border border-[#E5E7EB] shadow-sm rounded-xl flex items-center justify-center mb-6 text-[#5E7076]">
            <Clock size={20} />
          </div>
          <h3 className="text-[#102A32] font-bold text-lg mb-3">Something else</h3>
          <p className="text-[#5E7076] text-sm leading-relaxed mb-8 flex-1">
            This is about a community post, account,
            comment, or a legal, privacy, or copyright notice —
            not a News story.
          </p>
          <div className="flex items-center text-[#073B47] font-bold text-sm gap-2">
            See other options &rarr;
          </div>
        </div>
      </div>
    </section>
  );
}
