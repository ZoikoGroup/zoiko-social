import React from "react";

interface ValueItem {
  title: string;
  mobileEmoji: string;
  icon: React.ReactNode;
}

const VALUES: ValueItem[] = [
  {
    title: "Respect For All",
    mobileEmoji: "✊",
    icon: (
      <svg
        className="size-8 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5" />
        <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
        <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
        <path d="M18 8a2 2 0 0 1 2 2v4a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-2" />
      </svg>
    ),
  },
  {
    title: "Context Matters",
    mobileEmoji: "🔍",
    icon: (
      <svg
        className="size-8 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="13" x2="13" y2="13" />
      </svg>
    ),
  },
  {
    title: "Education First",
    mobileEmoji: "📖",
    icon: (
      <svg
        className="size-8 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="m9 8 3-2 3 2-3 2z" />
        <path d="M10 11v2a2 2 0 0 0 4 0v-2" />
      </svg>
    ),
  },
  {
    title: "Fair & Transparent",
    mobileEmoji: "⚖️",
    icon: (
      <svg
        className="size-8 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
        <path d="M7 21h10" />
        <path d="M12 3v18" />
        <path d="M3 7h18" />
      </svg>
    ),
  },
  {
    title: "Grow Together",
    mobileEmoji: "🌱",
    icon: (
      <svg
        className="size-8 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
        <line x1="6" y1="20" x2="6" y2="16" />
        <line x1="11" y1="20" x2="11" y2="13" />
        <line x1="16" y1="20" x2="16" y2="10" />
        <line x1="21" y1="20" x2="21" y2="7" />
      </svg>
    ),
  },
];

export default function CoreValues() {
  return (
    <section className="w-full bg-[#F8FAFA] py-12 sm:py-20">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <h2 className="text-center text-[26px] font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px]">
          Our Core Values
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-3.5 sm:mt-12 sm:grid-cols-3 lg:grid-cols-5 sm:gap-5">
          {VALUES.map((val) => (
            <div
              key={val.title}
              className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md sm:p-6"
            >
              <div className="mb-3 flex items-center justify-center sm:mb-3.5">
                <span className="text-2xl sm:hidden">{val.mobileEmoji}</span>
                <div className="hidden sm:flex">{val.icon}</div>
              </div>
              <h3 className="text-xs font-bold text-[#0F2422] sm:text-[13px]">
                {val.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
