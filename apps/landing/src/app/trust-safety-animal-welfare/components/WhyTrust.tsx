import React from "react";

interface TrustCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  mobileIcon: React.ReactNode;
}

const TRUST_CARDS: TrustCard[] = [
  {
    title: "Verified Safety",
    description:
      "Every community is verified. Every member is moderated. Every report is taken seriously.",
    icon: (
      <svg
        className="size-7 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    mobileIcon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="none">
        {/* Right half (silver/white) */}
        <path
          d="M12 2.5L19.5 5.5v5.5c0 5 3.3 9.7 7.5 11V2.5z"
          fill="#F8FAFC"
          stroke="#94A3B8"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Left half (coral red) */}
        <path
          d="M12 2.5L4.5 5.5v5.5c0 5 3.3 9.7 7.5 11V2.5z"
          fill="#EF4444"
          stroke="#94A3B8"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Complete Transparency",
    description:
      "Our safety reports are public. Our enforcement decisions are clear. Our methodology is open.",
    icon: (
      <svg
        className="size-7 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <circle cx="11.5" cy="14.5" r="2.5" />
        <path d="m13.5 16.5 2 2" />
      </svg>
    ),
    mobileIcon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="none">
        <path
          d="M2.5 12C4.8 7.2 8.5 4.8 12 4.8C15.5 4.8 19.2 7.2 21.5 12C19.2 16.8 15.5 19.2 12 19.2C8.5 19.2 4.8 16.8 2.5 12Z"
          fill="#FFFFFF"
          stroke="#64748B"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="4.6" fill="#8D5B28" />
        <circle cx="12" cy="12" r="3.4" fill="#B47836" />
        <circle cx="12" cy="12" r="2.1" fill="#18181B" />
        <circle cx="10.8" cy="10.6" r="1" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    title: "Community-First",
    description:
      "Built with animal lovers, for animal lovers. Your voice shapes how we protect animals online.",
    icon: (
      <svg
        className="size-7 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="5" r="2" />
        <path d="M17 14c-1.5-2-4.5-2-6 0" />
        <circle cx="6" cy="11" r="1.5" />
        <circle cx="18" cy="11" r="1.5" />
        <path d="M4 18c0-2 2-3 4-3" />
        <path d="M20 18c0-2-2-3-4-3" />
        <circle cx="9" cy="9" r="1.5" />
        <circle cx="15" cy="9" r="1.5" />
      </svg>
    ),
    mobileIcon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="none">
        <path
          d="M18.8 8.8l-2.4-2.4a2 2 0 0 0-2.8 0L12 8l-1.6-1.6a2 2 0 0 0-2.8 0L5.2 8.8a2 2 0 0 0 0 2.8l1.6 1.6-2 2a1.5 1.5 0 0 0 0 2.1l2.1 2.1a1.5 1.5 0 0 0 2.1 0l2-2 1 1a2 2 0 0 0 2.8 0l4-4a2 2 0 0 0 0-2.8z"
          fill="#F59E0B"
        />
        <path
          d="M8.5 11.5l3.5 3.5m-1.5-5l3.5 3.5m-1-5.5l3.5 3.5"
          stroke="#D97706"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M4.5 13l2.5-2.5 4 4-2.5 2.5a1.5 1.5 0 0 1-2.1 0L4.5 15.1a1.5 1.5 0 0 1 0-2.1z"
          fill="#FBBF24"
        />
      </svg>
    ),
  },
];

export default function WhyTrust() {
  return (
    <section className="w-full bg-white py-12 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-[260px] text-center text-[26px] font-bold tracking-tight text-[#0F2422] sm:max-w-none sm:text-3xl lg:text-[34px]">
          Why Trust Zoiko Social
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {TRUST_CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-md sm:border-gray-200/80 sm:p-10 sm:shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
            >
              {/* Soft Pale Cyan Icon Badge */}
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#E8F4F5] sm:mb-6 sm:size-14">
                <div className="sm:hidden">{card.mobileIcon}</div>
                <div className="hidden sm:flex">{card.icon}</div>
              </div>

              <h3 className="text-base font-bold text-[#0F2422] sm:text-lg">
                {card.title}
              </h3>

              <p className="mt-2.5 text-xs leading-relaxed text-[#5A7371] sm:mt-3 sm:text-sm">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
