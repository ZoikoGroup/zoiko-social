import { Plus_Jakarta_Sans } from "next/font/google";

// Optimize font loading in Next.js
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function LoadMore() {
  return (
    <div
      className={`w-full max-w-[1232px] pt-7 pb-2 flex flex-col justify-start items-center ${plusJakartaSans.className}`}
    >
      {/* Load More Button */}
      <button className="px-4 py-2.5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-cyan-200 hover:bg-slate-50 transition-colors flex justify-center items-center cursor-pointer">
        <span className="text-center text-cyan-900 text-sm font-semibold">
          Load more communities
        </span>
      </button>
    </div>
  );
}
