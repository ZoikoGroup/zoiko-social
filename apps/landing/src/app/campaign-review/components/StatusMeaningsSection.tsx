"use client";

import React from "react";
import {
  FileEdit,
  Send,
  Clock,
  HelpCircle,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Ban,
  RotateCcw,
  Archive,
  ArrowRight,
} from "lucide-react";

interface StatusCard {
  label: string;
  badgeClass: string;
  badgeIcon: React.ElementType;
  description: string;
  actionText: string;
}

const BEFORE_REVIEW: StatusCard[] = [
  {
    label: "Draft",
    badgeClass: "bg-[#F7F9FA] text-[#5E7076] border border-[#DCE5E8]",
    badgeIcon: FileEdit,
    description: "Not submitted yet.",
    actionText: "Continue editing",
  },
  {
    label: "Ready to submit",
    badgeClass: "bg-[#F7F9FA] text-[#073B47] border border-[#DCE5E8]",
    badgeIcon: Send,
    description: "Everything required is filled in.",
    actionText: "Submit for review",
  },
  {
    label: "In review",
    badgeClass: "bg-[#EEF8F9] text-[#073B47] border border-[#BCE1E7]",
    badgeIcon: Clock,
    description: "Being checked against the Standards.",
    actionText: "View details",
  },
];

const DECISIONS: StatusCard[] = [
  {
    label: "More information needed",
    badgeClass: "bg-[#FFF5E8] text-[#7A430B] border border-[#E88924]",
    badgeIcon: HelpCircle,
    description: "We need evidence or context to decide.",
    actionText: "Provide information",
  },
  {
    label: "Changes required",
    badgeClass: "bg-[#FFF5E8] text-[#7A430B] border border-[#E88924]",
    badgeIcon: AlertTriangle,
    description: "Can be approved after the listed changes.",
    actionText: "Fix and resubmit",
  },
  {
    label: "Restricted",
    badgeClass: "bg-white text-[#073B47] border border-[#066879]",
    badgeIcon: ShieldCheck,
    description: "Can run only under stated conditions.",
    actionText: "Review restrictions",
  },
  {
    label: "Approved",
    badgeClass: "bg-[#066879] text-white border border-[#066879]",
    badgeIcon: CheckCircle2,
    description:
      "Passed review. Launch still needs schedule, billing and account standing.",
    actionText: "Launch campaign",
  },
  {
    label: "Not approved",
    badgeClass: "bg-[#073B47] text-white border border-[#073B47]",
    badgeIcon: XCircle,
    description: "Can't run in its current form.",
    actionText: "Review decision",
  },
];

const AFTER_LAUNCH: StatusCard[] = [
  {
    label: "Paused after approval",
    badgeClass: "bg-[#FFF5E8] text-[#7A430B] border border-[#E88924]",
    badgeIcon: PauseCircle,
    description: "Stopped while an issue is resolved.",
    actionText: "Resolve issue",
  },
  {
    label: "Removed",
    badgeClass: "bg-[#073B47] text-white border border-[#073B47]",
    badgeIcon: Ban,
    description: "No longer eligible to run.",
    actionText: "View details",
  },
  {
    label: "Reconsideration submitted",
    badgeClass: "bg-white text-[#073B47] border border-dashed border-[#066879]",
    badgeIcon: RotateCcw,
    description: "A second review is under way.",
    actionText: "View request",
  },
  {
    label: "Closed",
    badgeClass: "bg-[#F7F9FA] text-[#5E7076] border border-[#DCE5E8]",
    badgeIcon: Archive,
    description: "No further action available.",
    actionText: "View history",
  },
];

export default function StatusMeaningsSection() {
  const renderCard = (card: StatusCard, index: number) => {
    const Icon = card.badgeIcon;
    return (
      <div
        key={index}
        className="rounded-[20px] bg-white border border-[#DCE5E8] p-4.5 sm:p-5 flex flex-col justify-between hover:border-[#066879] hover:shadow-2xs transition-all"
      >
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-jakarta font-bold mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${card.badgeClass}`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{card.label}</span>
            </span>
          </div>

          {/* Description */}
          <p className="font-jakarta text-[13px] leading-relaxed text-[#102A32] mb-4">
            {card.description}
          </p>
        </div>

        {/* Action Link */}
        <div className="pt-2 border-t border-[#F0F4F6] flex items-center justify-between">
          <span className="font-jakarta font-bold text-[12.5px] text-[#066879] hover:underline cursor-pointer inline-flex items-center gap-1">
            <span>{card.actionText}</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full bg-[#F7F9FA] py-14 sm:py-16 lg:py-20 border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="max-w-[720px] mb-10 sm:mb-12">
          <h2 className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] text-[#073B47] tracking-[-0.02em] mb-2.5">
            What each status means
          </h2>
          <p className="font-jakarta text-[15px] sm:text-[16.5px] leading-relaxed text-[#5E7076]">
            The same twelve statuses appear everywhere you see your campaign.
          </p>
        </div>

        {/* Group 1: Before review */}
        <div className="mb-8">
          <h3 className="font-jakarta font-bold text-[14px] uppercase tracking-wider text-[#5E7076] mb-3.5">
            Before review
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {BEFORE_REVIEW.map(renderCard)}
          </div>
        </div>

        {/* Group 2: Decisions */}
        <div className="mb-8">
          <h3 className="font-jakarta font-bold text-[14px] uppercase tracking-wider text-[#5E7076] mb-3.5">
            Decisions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {DECISIONS.map(renderCard)}
          </div>
        </div>

        {/* Group 3: After launch */}
        <div>
          <h3 className="font-jakarta font-bold text-[14px] uppercase tracking-wider text-[#5E7076] mb-3.5">
            After launch
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {AFTER_LAUNCH.map(renderCard)}
          </div>
        </div>
      </div>
    </section>
  );
}
