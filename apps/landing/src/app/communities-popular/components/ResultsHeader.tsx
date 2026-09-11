import { Plus_Jakarta_Sans } from "next/font/google";

// Optimize font loading in Next.js
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function ResultsHeader() {
  return (
    <div
      className={`w-full max-w-[1232px] pt-5 pb-1 flex justify-between items-center flex-wrap gap-4 ${plusJakartaSans.className}`}
    >
      {/* Title */}
      <h2 className="text-cyan-950 text-xl font-extrabold leading-8">
        Popular communities
      </h2>

      {/* Metadata */}
      <div className="flex justify-start items-center gap-3.5 flex-wrap">
        <span className="text-slate-600 text-xs font-normal leading-5">
          15 communities
        </span>
        <span className="text-slate-600 text-xs font-normal leading-5">
          Updated 12 minutes ago
        </span>
      </div>
    </div>
  );
}
