import { Plus_Jakarta_Sans } from "next/font/google";

// Optimize font loading in Next.js
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function ConversionBand() {
  return (
    <section
      className={`w-full max-w-[1232px] py-16 px-6 bg-gradient-to-br from-cyan-950 to-cyan-800 rounded-[32px] flex flex-col justify-center items-center text-center gap-5 ${plusJakartaSans.className}`}
    >
      {/* Heading */}
      <h2 className="w-full max-w-[520px] text-white text-2xl md:text-3xl font-extrabold leading-[40px]">
        Found a community you want to be part of?
      </h2>

      {/* Subheading */}
      <p className="w-full max-w-[460px] text-white/90 text-sm font-normal leading-5">
        Create your Zoiko Social account when you are ready to participate,
        <br className="hidden sm:block" />
        follow, or join according to the community&apos;s access rules.
      </p>

      {/* Call to Action Buttons */}
      <div className="pt-3 flex flex-wrap justify-center items-center gap-3">
        <button className="w-36 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 transition-colors rounded-xl flex justify-center items-center cursor-pointer">
          <span className="text-white text-sm font-semibold">Join Free</span>
        </button>

        <button className="px-4 py-2.5 rounded-xl border border-white/50 hover:bg-white/10 transition-colors flex justify-center items-center cursor-pointer">
          <span className="text-white text-sm font-semibold">
            Browse All Communities
          </span>
        </button>
      </div>
    </section>
  );
}
