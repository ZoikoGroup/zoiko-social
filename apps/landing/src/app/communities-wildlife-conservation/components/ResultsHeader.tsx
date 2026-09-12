import React from "react";

export default function ResultsHeader() {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
      <div className="text-cyan-950 text-xl font-extrabold font-['Plus_Jakarta_Sans'] leading-8">
        Wildlife &amp; conservation communities
      </div>
      <div className="text-gray-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-5">
        12 communities
      </div>
    </div>
  );
}
