import Link from "next/link";
import React from "react";

interface NextStepCard {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  isPrimary?: boolean;
  mobileEmoji: string;
  icon: React.ReactNode;
}

const CARDS: NextStepCard[] = [
  {
    title: "Read the Full Policy",
    description:
      "Understand every rule and guideline with complete transparency.",
    buttonText: "View Policy",
    buttonHref: "#full-policy",
    mobileEmoji: "📋",
    icon: (
      <svg
        className="size-8 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
  {
    title: "Report a Problem",
    description:
      "See something that violates our policy? Report it safely and securely.",
    buttonText: "Report",
    buttonHref: "/safety-report-concern",
    mobileEmoji: "🚨",
    icon: (
      <svg
        className="size-8 stroke-[#006D77]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M12 18v-4" />
        <path d="M12 11h.01" />
      </svg>
    ),
  },
  {
    title: "Join the Community",
    description:
      "Become part of a respectful, welcoming community of 2.1M+ members.",
    buttonText: "Sign Up Free",
    buttonHref: "/communities-all",
    isPrimary: true,
    mobileEmoji: "💬",
    icon: (
      <svg
        className="size-8 stroke-[#006D77]"
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
  },
];

export default function NextSteps() {
  return (
    <section className="w-full bg-[#F8FAFA] pb-16 pt-6 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <h2 className="text-center text-[26px] font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px]">
          Next Steps
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md sm:p-8"
            >
              <div>
                <div className="mb-3.5 flex items-center justify-center">
                  <span className="text-2xl sm:hidden">{card.mobileEmoji}</span>
                  <div className="hidden sm:flex">{card.icon}</div>
                </div>

                <h3 className="text-sm font-bold text-[#0F2422] sm:text-base">
                  {card.title}
                </h3>

                <p className="mt-1.5 text-xs leading-relaxed text-[#5A7371] sm:text-sm">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 sm:mt-8">
                {card.isPrimary ? (
                  <Link
                    href={card.buttonHref}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#EA8A1A] py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#D47B12] sm:bg-[#006D77] sm:text-sm sm:hover:bg-[#005B63]"
                  >
                    {card.buttonText}
                  </Link>
                ) : (
                  <Link
                    href={card.buttonHref}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-[#006D77] bg-white py-3 text-xs font-semibold text-[#006D77] shadow-sm transition hover:bg-gray-50 sm:text-sm"
                  >
                    {card.buttonText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
