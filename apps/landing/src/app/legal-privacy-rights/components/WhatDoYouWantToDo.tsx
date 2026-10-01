import React from "react";
import {
  Eye,
  Trash2,
  Edit3,
  Sliders,
  Ban,
  XCircle,
  Download,
  RotateCcw,
  Users,
  HelpCircle,
} from "lucide-react";

interface GoalOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const goalOptions: GoalOption[] = [
  {
    id: "access",
    title: "Access my information",
    description: "Get a copy of your data",
    icon: <Eye className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "delete",
    title: "Delete my information",
    description: "Account or specific data",
    icon: <Trash2 className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "correct",
    title: "Correct my information",
    description: "Fix something inaccurate",
    icon: <Edit3 className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "privacy-choices",
    title: "Change privacy choices",
    description: "Cookies, ads, visibility",
    icon: <Sliders className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "object-restrict",
    title: "Object or restrict",
    description: "Stop or limit a use",
    icon: <Ban className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "opt-out",
    title: "Opt out of a data use",
    description: "Where it applies",
    icon: <XCircle className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "move",
    title: "Move my data",
    description: "A portable copy",
    icon: <Download className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "review-decision",
    title: "Review a decision",
    description: "On an existing request",
    icon: <RotateCcw className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "act-on-behalf",
    title: "Act for someone else",
    description: "Agent, guardian or organization",
    icon: <Users className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "something-else",
    title: "Something else",
    description: "Ask the privacy team",
    icon: <HelpCircle className="w-4 h-4 text-[#0A5C6F]" />,
  },
];

export default function WhatDoYouWantToDo() {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            What do you want to do?
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Pick a goal. We&apos;ll show the fastest way to get it done.
          </p>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {goalOptions.map((goal) => {
            return (
              <button
                key={goal.id}
                type="button"
                className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between gap-6 cursor-pointer border-[#DCE5E8] bg-white hover:border-gray-300 shadow-2xs
                  `}
              >
                <div className="w-9 h-9 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                  {goal.icon}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs md:text-sm font-bold text-[#111827]">
                    {goal.title}
                  </span>
                  <span className="text-[11px] text-gray-500 font-normal leading-relaxed">
                    {goal.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
