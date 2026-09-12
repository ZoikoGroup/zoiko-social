import React from "react";

export default function LoadMoreButton() {
  return (
    <button className="h-10 px-8 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-200 cursor-pointer flex items-center justify-center hover:bg-gray-50 transition-colors">
      <span className="text-teal-950 text-sm font-semibold font-['Plus_Jakarta_Sans']">
        Load more communities
      </span>
    </button>
  );
}
