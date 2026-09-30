import React from "react";

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  mobileIcon: React.ReactNode;
}

const FEATURES: FeatureCard[] = [
  {
    title: "Smart Detection",
    description:
      "AI flags potentially harmful content before it spreads, while humans verify every decision.",
    icon: (
      <svg
        className="size-6 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.35-4.35" />
        <path d="M11 8v1" />
        <path d="M11 13v.01" strokeWidth="2.5" />
      </svg>
    ),
    mobileIcon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="none">
        <circle cx="10" cy="10" r="6.5" stroke="#334155" strokeWidth="1.8" fill="#F8FAFC" />
        <path d="M7 8a4 4 0 0 1 4-4" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M15 15l5.5 5.5" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Easy Reporting",
    description:
      "Report harm in seconds. Track your reports. Get updates on how we responded.",
    icon: (
      <svg
        className="size-6 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
    mobileIcon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="16" height="18" rx="2" fill="#C49767" stroke="#A27845" strokeWidth="1" />
        <rect x="5.5" y="4.5" width="13" height="15" rx="1" fill="#FFFFFF" />
        <rect x="8.5" y="2" width="7" height="3" rx="1" fill="#CBD5E1" stroke="#64748B" strokeWidth="0.8" />
        <line x1="8" y1="8" x2="16" y2="8" stroke="#E2E8F0" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="8" y1="11" x2="16" y2="11" stroke="#E2E8F0" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="8" y1="14" x2="14" y2="14" stroke="#E2E8F0" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Verified Communities",
    description:
      "All communities are verified. Leaders are held accountable. Trust is earned.",
    icon: (
      <svg
        className="size-6 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    mobileIcon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#E11D48" strokeWidth="2.4" />
        <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" stroke="#E11D48" strokeWidth="2.4" />
      </svg>
    ),
  },
  {
    title: "Family-Friendly",
    description:
      "Profanity filtering, content moderation, and age-appropriate defaults everywhere.",
    icon: (
      <svg
        className="size-6 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <circle cx="12" cy="11" r="2.5" />
      </svg>
    ),
    mobileIcon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 11.5C4 7.36 7.58 4 12 4s8 3.36 8 7.5c0 4.14-3.58 7.5-8 7.5-1.35 0-2.62-.32-3.73-.89L4 19.5l1.12-3.85C4.43 14.43 4 12.3 4 11.5z"
          fill="#FFFFFF"
          stroke="#94A3B8"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <circle cx="8.5" cy="11.5" r="0.9" fill="#94A3B8" />
        <circle cx="12" cy="11.5" r="0.9" fill="#94A3B8" />
        <circle cx="15.5" cy="11.5" r="0.9" fill="#94A3B8" />
      </svg>
    ),
  },
  {
    title: "Fair Appeals",
    description:
      "Disagree with a decision? Appeal. Our team reviews and makes things right.",
    icon: (
      <svg
        className="size-6 stroke-[#006D77]"
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
    mobileIcon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="none">
        <line x1="12" y1="4" x2="12" y2="20" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4.5" y1="7" x2="19.5" y2="7" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="20" x2="16" y2="20" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4.5 7L2 13h5L4.5 7z" stroke="#64748B" strokeWidth="1.1" strokeLinejoin="round" fill="#F8FAFC" />
        <path d="M19.5 7L17 13h5L19.5 7z" stroke="#64748B" strokeWidth="1.1" strokeLinejoin="round" fill="#F8FAFC" />
      </svg>
    ),
  },
  {
    title: "Public Reporting",
    description:
      "Transparency matters. See our monthly reports on enforcement actions and trends.",
    icon: (
      <svg
        className="size-6 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
        <path d="M2 20h20" />
      </svg>
    ),
    mobileIcon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="2" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
        <line x1="4" y1="8" x2="20" y2="8" stroke="#F1F5F9" strokeWidth="1" />
        <line x1="4" y1="14" x2="20" y2="14" stroke="#F1F5F9" strokeWidth="1" />
        <rect x="4.5" y="9" width="3.5" height="11" rx="0.5" fill="#10B981" />
        <rect x="10" y="12" width="3.5" height="8" rx="0.5" fill="#DC2626" />
        <rect x="15.5" y="5" width="3.5" height="15" rx="0.5" fill="#2563EB" />
      </svg>
    ),
  },
];

export default function BuiltInSafetyFeatures() {
  return (
    <section className="w-full bg-[#F8FAFA] py-12 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <h2 className="text-left text-[26px] font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px]">
          Built–In Safety <br className="sm:hidden" />Features
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-3.5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 lg:gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md sm:border-gray-200/80 sm:p-7 sm:shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
            >
              <div>
                {/* Mobile icon directly on white background */}
                <div className="mb-3.5 flex sm:hidden">
                  {feature.mobileIcon}
                </div>

                {/* Desktop icon with pale cyan container */}
                <div className="mb-5 hidden size-12 items-center justify-center rounded-xl bg-[#E8F4F5] sm:flex">
                  {feature.icon}
                </div>

                <h3 className="text-sm font-bold text-[#0F2422] sm:text-base">
                  {feature.title}
                </h3>

                <p className="mt-1.5 text-xs leading-relaxed text-[#5A7371] sm:mt-2 sm:text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
