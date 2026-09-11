import React from "react";

export default function LoadMoreButton() {
  return (
    <div className="w-full max-w-[1232px] pt-8 pb-2 flex flex-col justify-start items-center">
      <button
        type="button"
        className="px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-100 transition-colors inline-flex justify-center items-center"
      >
        <span className="text-center text-cyan-900 text-sm font-semibold font-['Plus_Jakarta_Sans']">
          Load more communities
        </span>
      </button>
    </div>
  );
}
