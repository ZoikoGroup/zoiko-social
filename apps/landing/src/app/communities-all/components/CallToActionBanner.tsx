import React from "react";

export default function CallToActionBanner() {
  return (
    <section className="w-full max-w-[1232px] mx-auto min-h-[320px] p-8 md:p-12 bg-gradient-to-br from-cyan-900 to-cyan-700 rounded-[32px] flex flex-col justify-center items-center text-center gap-6">
      {/* Heading */}
      <h2 className="max-w-[520px] text-white text-2xl md:text-3xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight md:leading-10">
        Find your community. Join when you are ready.
      </h2>

      {/* Subheading */}
      <p className="max-w-[460px] text-white/90 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
        Explore communities by purpose, species, or interest. Review the
        community&apos;s purpose and available moderation information before you
        participate.
      </p>

      {/* Button Group */}
      <div className="pt-2 flex flex-wrap justify-center items-center gap-3">
        {/* Primary Action */}
        <button
          type="button"
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] transition-colors focus:ring-2 focus:ring-orange-300 focus:outline-none"
        >
          Join Free
        </button>

        {/* Secondary Action */}
        <button
          type="button"
          className="px-6 py-2.5 rounded-xl border border-white/50 hover:bg-white/10 text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] transition-colors focus:ring-2 focus:ring-white/50 focus:outline-none"
        >
          Continue browsing
        </button>
      </div>
    </section>
  );
}
