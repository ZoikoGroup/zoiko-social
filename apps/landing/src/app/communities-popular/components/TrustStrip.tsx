import { Plus_Jakarta_Sans } from "next/font/google";

// Optimize font loading in Next.js
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function TrustStrip() {
  return (
    <div
      className={`w-full max-w-[1232px] px-5 py-4 bg-slate-50 rounded-3xl flex justify-start items-start gap-3.5 ${plusJakartaSans.className}`}
    >
      {/* Icon Container */}
      <div className="w-9 h-9 shrink-0 bg-white rounded-xl flex justify-center items-center">
        <div className="w-5 h-5 relative overflow-hidden">
          <div className="w-3.5 h-3.5 left-[2.50px] top-[2.50px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-cyan-700" />
          <div className="w-[2.50px] h-1.5 left-[10px] top-[6.67px] absolute outline outline-[1.67px] outline-offset-[-0.83px] outline-cyan-700" />
        </div>
      </div>

      {/* Text Content */}
      <div className="flex-1 flex flex-col justify-start items-start gap-1">
        <h3 className="text-cyan-950 text-base font-bold leading-6">
          Active now, ranked for discovery.
        </h3>

        <p className="text-slate-600 text-sm font-normal leading-5">
          Ordering may change as community activity changes. Zoiko Social
          defines ranking and eligibility rules at the platform level; exact
          signals are not exposed on this page.
        </p>

        <p className="text-cyan-950 text-sm font-semibold leading-5 mt-1">
          Popular reflects activity-based discovery signals. It does not mean a
          community is endorsed, verified, or right for everyone.
        </p>
      </div>
    </div>
  );
}
