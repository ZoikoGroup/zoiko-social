import { Plus_Jakarta_Sans } from "next/font/google";

// Optimize font loading in Next.js
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function PopularCommunities() {
  return (
    <div
      className={`w-full max-w-[1232px] pt-7 pb-10 flex flex-col justify-start items-start gap-1.5 ${plusJakartaSans.className}`}
    >
      {/* Header */}
      <div className="self-stretch pt-2 flex flex-col justify-start items-start">
        <h2 className="self-stretch justify-center text-cyan-950 text-4xl font-extrabold leading-[51px]">
          Popular
        </h2>
      </div>

      {/* Sub-header */}
      <div className="w-full max-w-[600px] pt-0.5 flex flex-col justify-start items-start">
        <p className="justify-center text-cyan-900 text-base font-normal leading-6">
          See communities with strong current activity on Zoiko Social.
        </p>
      </div>

      {/* Description */}
      <div className="w-full max-w-[600px] flex flex-col justify-start items-start">
        <p className="justify-center text-blue-600 text-sm font-normal leading-5">
          Explore what is active now, then review each community&apos;s purpose
          and available
          <br />
          moderation information before you join.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="self-stretch pt-3 inline-flex justify-start items-start gap-2.5 flex-wrap content-start">
        <button className="px-4 py-2.5 bg-cyan-700 hover:bg-cyan-800 transition-colors rounded-xl flex justify-start items-center cursor-pointer">
          <span className="justify-center text-white text-sm font-semibold underline leading-5">
            Explore Popular
          </span>
        </button>

        <button className="px-4 py-2.5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-cyan-200 hover:bg-gray-50 transition-colors flex justify-start items-center cursor-pointer">
          <span className="justify-center text-cyan-900 text-sm font-semibold underline leading-5">
            Browse All Communities
          </span>
        </button>
      </div>
    </div>
  );
}
