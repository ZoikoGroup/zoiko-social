import React from "react";

interface ProtectCard {
  title: string;
  description: string;
  bullets: string[];
  desktopIcon: React.ReactNode;
  mobileIcon: React.ReactNode;
}

const PROTECT_CARDS: ProtectCard[] = [
  {
    title: "Clear Boundaries",
    description:
      "We maintain specific rules about what's not allowed to keep everyone safe.",
    bullets: [
      "No harassment or bullying",
      "No adult exploitation",
      "No hate speech",
      "Safe content only",
    ],
    desktopIcon: (
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
        <path d="M9 15a3 3 0 0 0 6 0c0-2-3-3.5-3-3.5S9 13 9 15z" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    ),
    mobileIcon: (
      <svg viewBox="0 0 24 24" className="size-8">
        <path
          d="M12 2L4 5v6.5C4 17 7.5 21.5 12 23c4.5-1.5 8-6 8-11.5V5l-8-3z"
          fill="#EF4444"
          stroke="#DC2626"
          strokeWidth="1.2"
        />
        <path
          d="M12 2v21c4.5-1.5 8-6 8-11.5V5l-8-3z"
          fill="#FEE2E2"
        />
      </svg>
    ),
  },
  {
    title: "Human Moderation",
    description:
      "AI helps us find issues, but humans make the final decisions about enforcement.",
    bullets: [
      "Trained moderation team",
      "Context-aware decisions",
      "24h response target",
      "Fair enforcement",
    ],
    desktopIcon: (
      <svg
        className="size-6 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <circle cx="12" cy="9" r="2.5" />
        <path d="M8 14c0-1.8 1.8-3 4-3s4 1.2 4 3" />
        <path d="M8 20h8" />
        <path d="M12 16v4" />
      </svg>
    ),
    mobileIcon: (
      <div className="text-2xl leading-none">
        👥
      </div>
    ),
  },
  {
    title: "Easy Reporting",
    description:
      "You can quickly flag content or behavior that makes you uncomfortable.",
    bullets: [
      "One-click reporting",
      "Anonymous options",
      "Follow-up support",
      "No retaliation",
    ],
    desktopIcon: (
      <svg
        className="size-6 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="2" width="14" height="20" rx="3" />
        <path d="M12 18h.01" strokeWidth="2.5" />
        <path d="M12 7v5" />
        <circle cx="12" cy="14" r="0.8" fill="#006D77" />
      </svg>
    ),
    mobileIcon: (
      <div className="text-2xl leading-none">
        🔍
      </div>
    ),
  },
  {
    title: "Transparency",
    description:
      "We publish how often we enforce rules and hold ourselves accountable.",
    bullets: [
      "Monthly reports",
      "Public data",
      "Appeal access",
      "No secret decisions",
    ],
    desktopIcon: (
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
        <circle cx="12" cy="14" r="3" />
        <path d="m14.5 16.5 2 2" />
      </svg>
    ),
    mobileIcon: (
      <div className="text-2xl leading-none">
        📢
      </div>
    ),
  },
];

export default function HowWeProtect() {
  return (
    <section className="w-full bg-[#F8FAFA] py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px]">
          How We Protect Young People
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {PROTECT_CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md sm:p-7"
            >
              {/* Desktop Badge Icon */}
              <div className="hidden size-12 items-center justify-center rounded-xl bg-[#E8F4F5] sm:flex">
                {card.desktopIcon}
              </div>

              {/* Mobile Icon */}
              <div className="mb-3 flex size-8 items-center sm:hidden">
                {card.mobileIcon}
              </div>

              {/* Title & Description */}
              <h3 className="mt-1 text-base font-bold text-[#0F2422] sm:mt-5 sm:text-lg">
                {card.title}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-[#5A7371] sm:mt-2.5 sm:text-sm">
                {card.description}
              </p>

              {/* Bullet list */}
              <ul className="mt-5 space-y-2.5 border-t border-gray-100 pt-4 text-xs sm:mt-6 sm:pt-5 sm:text-sm">
                {card.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-center gap-2.5 text-[#5A7371]"
                  >
                    <span
                      className="size-1.5 shrink-0 rounded-full bg-[#E08A00]"
                      aria-hidden="true"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
