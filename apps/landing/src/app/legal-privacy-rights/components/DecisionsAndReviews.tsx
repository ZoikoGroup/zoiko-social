import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  X,
  HelpCircle,
  RefreshCw,
} from "lucide-react";

interface OutcomeCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

const outcomeCards: OutcomeCard[] = [
  {
    id: "completed",
    title: "Completed",
    description: "What was done, and when.",
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />,
    badgeBg: "bg-[#F0FDF4]",
    badgeBorder: "border-[#DCFCE7]",
    badgeText: "text-[#15803D]",
  },
  {
    id: "partially-completed",
    title: "Partially completed",
    description: "What was done, what wasn't, and why.",
    icon: <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />,
    badgeBg: "bg-[#FEF6EE]",
    badgeBorder: "border-[#FBEAD4]",
    badgeText: "text-[#B45309]",
  },
  {
    id: "not-fulfilled",
    title: "Not fulfilled",
    description: "A clear reason tied to the rule that applies.",
    icon: <X className="w-3.5 h-3.5 text-gray-500" />,
    badgeBg: "bg-white",
    badgeBorder: "border-gray-200",
    badgeText: "text-gray-700",
  },
  {
    id: "unable-to-verify",
    title: "Unable to verify",
    description: "What's still needed, and other ways to confirm.",
    icon: <HelpCircle className="w-3.5 h-3.5 text-gray-400" />,
    badgeBg: "bg-white",
    badgeBorder: "border-gray-200 border-dashed",
    badgeText: "text-gray-700",
  },
];

export default function DecisionsAndReviews() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Decisions and reviews
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Every outcome is explained in plain language.
          </p>
        </div>

        {/* 4-Column Grid of Outcome Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {outcomeCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between gap-6 transition-all hover:border-gray-300"
            >
              <div className="flex flex-col gap-4">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium w-fit shadow-2xs ${card.badgeBg} ${card.badgeBorder} ${card.badgeText}`}
                >
                  {card.icon}
                  {card.title}
                </div>
                <p className="text-xs md:text-sm text-gray-500 font-normal leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dark Bottom Callout Banner */}
        <div className="bg-[#073B47] rounded-3xl px-6 md:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base md:text-lg font-bold text-white">
                Disagree with a decision?
              </h3>
              <p className="text-xs md:text-sm text-white/80 font-normal">
                Where a review is available for your region, you can ask for one
                from your request.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 hover:bg-[#074653] border border-white/20 text-white text-xs md:text-sm font-semibold px-5 py-3 rounded-xl transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            Request a review
          </button>
        </div>
      </div>
    </section>
  );
}
