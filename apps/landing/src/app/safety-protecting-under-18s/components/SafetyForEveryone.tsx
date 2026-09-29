import React from "react";

interface PersonaCard {
  title: string;
  description: string;
  desktopIcon: React.ReactNode;
  mobileIcon: React.ReactNode;
}

const CARDS: PersonaCard[] = [
  {
    title: "Young People",
    description:
      "Understand the rules, know where to get help, and experience a community that respects you.",
    desktopIcon: (
      <svg
        className="size-11 stroke-[#006D77]"
        viewBox="0 0 48 48"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="24" cy="14" r="3.5" />
        <circle cx="16" cy="18" r="3" />
        <circle cx="32" cy="18" r="3" />
        <path d="M20 28c0-3 2-5 4-5s4 2 4 5" />
        <path d="M12 30c0-2.5 1.8-4 3.5-4s2.5 1 3 2.5" />
        <path d="M36 30c0-2.5-1.8-4-3.5-4s-2.5 1-3 2.5" />
        <path d="M10 38c3 4 8 5 14 5s11-1 14-5" />
        <path d="M8 29c0 5 4 10 10 12" />
        <path d="M40 29c0 5-4 10-10 12" />
      </svg>
    ),
    mobileIcon: (
      <svg
        className="size-12 fill-[#3B7BA4]"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="7" r="4" />
        <path d="M4 19v-1c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6v1H4z" />
      </svg>
    ),
  },
  {
    title: "Parents & Guardians",
    description:
      "Explore our safety features, understand protections, and learn how to support your teen's digital life.",
    desktopIcon: (
      <svg
        className="size-11 stroke-[#006D77]"
        viewBox="0 0 48 48"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="19" cy="14" r="4" />
        <path d="M11 36v-6a7 7 0 0 1 14 0v6" />
        <circle cx="31" cy="18" r="3.5" />
        <path d="M25 36v-4.5a5.5 5.5 0 0 1 11 0V36" />
        <path d="M19 28h12" strokeDasharray="2 2" />
      </svg>
    ),
    mobileIcon: (
      <div className="flex size-12 items-center justify-center text-3xl">
        👨‍👩‍👧
      </div>
    ),
  },
  {
    title: "Educators",
    description:
      "Get resources and transparent policies for teaching digital citizenship in your classroom.",
    desktopIcon: (
      <svg
        className="size-11 stroke-[#006D77]"
        viewBox="0 0 48 48"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M24 10 8 18l16 8 16-8-16-8z" />
        <path d="M14 21v8c0 4 4.5 7 10 7s10-3 10-7v-8" />
        <path d="M38 19v10" />
        <circle cx="38" cy="30" r="1.5" fill="#006D77" />
      </svg>
    ),
    mobileIcon: (
      <div className="flex size-12 items-center justify-center text-3xl">
        🎓
      </div>
    ),
  },
];

export default function SafetyForEveryone() {
  return (
    <section className="w-full bg-white py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px]">
          Safety for Everyone
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-center rounded-2xl border border-gray-200/80 bg-white p-7 text-center shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md sm:p-10"
            >
              {/* Desktop Icon */}
              <div className="mb-6 hidden size-14 items-center justify-center sm:flex">
                {card.desktopIcon}
              </div>

              {/* Mobile Icon */}
              <div className="mb-5 flex size-14 items-center justify-center sm:hidden">
                {card.mobileIcon}
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
