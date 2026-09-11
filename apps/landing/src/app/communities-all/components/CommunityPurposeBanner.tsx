import React from "react";
import Link from "next/link"; // Standard Next.js routing

export default function CommunityPurposeBanner() {
  return (
    <div className="w-full max-w-[1232px] px-5 py-4 bg-gray-100 rounded-3xl inline-flex justify-start items-start gap-3.5">
      {/* Icon */}
      <div className="w-9 h-9 shrink-0 bg-white rounded-xl flex justify-center items-center">
        <div className="w-5 h-5 relative overflow-hidden">
          <div className="w-3.5 h-4 left-[3px] top-[2px] absolute outline outline-[1.5px] outline-offset-[-1px] outline-cyan-700 rounded-sm" />
          <div className="w-[5px] h-[3px] left-[7.5px] top-[8px] absolute outline outline-[1.5px] outline-offset-[-1px] outline-cyan-700" />
        </div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col justify-start items-start gap-1">
        <h3 className="text-cyan-900 text-base font-bold font-['Plus_Jakarta_Sans'] leading-6">
          Every community states its purpose.
        </h3>

        <p className="text-blue-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
          See moderation and accountability information before you join.
        </p>

        <Link
          href="/standards"
          className="mt-1 text-cyan-700 hover:text-cyan-800 text-sm font-semibold font-['Plus_Jakarta_Sans'] underline leading-5 transition-colors"
        >
          Learn about community standards
        </Link>
      </div>
    </div>
  );
}
