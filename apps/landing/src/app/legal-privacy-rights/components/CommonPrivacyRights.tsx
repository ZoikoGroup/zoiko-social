"use client"
import React, { useState } from "react";
import {
  Eye,
  Trash2,
  Edit3,
  Download,
  Ban,
  Clock,
  RotateCcw,
  XCircle,
  Scale,
  GitBranch,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface RightItem {
  id: string;
  title: string;
  description: string;
  details: string;
  icon: React.ReactNode;
}

const rights: RightItem[] = [
  {
    id: "access",
    title: "Access",
    description: "Learn what we have about you",
    details:
      "Request a comprehensive report and copy of the personal data we store regarding your account and activity history.",
    icon: <Eye className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "deletion",
    title: "Deletion",
    description: "Ask us to delete qualifying data",
    details:
      "Request permanent removal of qualifying personal information and account records from our production databases.",
    icon: <Trash2 className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "correction",
    title: "Correction",
    description: "Fix inaccurate data",
    details:
      "Update or amend inaccurate, incomplete, or outdated personal information associated with your profile.",
    icon: <Edit3 className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "portability",
    title: "Portability",
    description: "Get data in a portable format",
    details:
      "Export your information in a structured, commonly used, and machine-readable format for transfer to another service.",
    icon: <Download className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "objection",
    title: "Objection",
    description: "Object to a type of processing",
    details:
      "Object to specific data processing activities carried out under legitimate interests or direct marketing purposes.",
    icon: <Ban className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "restriction",
    title: "Restriction",
    description: "Limit how data is used",
    details:
      "Temporarily freeze or restrict the processing of your personal data under specific contested circumstances.",
    icon: <Clock className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "consent-withdrawal",
    title: "Consent withdrawal",
    description: "Take back a consent you gave",
    details:
      "Revoke previously granted consent for optional data processing at any time without affecting prior lawful processing.",
    icon: <RotateCcw className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "opt-out",
    title: "Opt-out",
    description: "Opt out of a defined data use",
    details:
      "Opt out of specific targeted advertising networks, cross-context behavioral sharing, or profiling workflows.",
    icon: <XCircle className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "equal-service",
    title: "Equal service",
    description: "No unlawful penalty for using your rights",
    details:
      "Exercise your privacy rights without facing discriminatory pricing, degraded service quality, or penalties.",
    icon: <Scale className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "review",
    title: "Review",
    description: "Ask for a decision to be reviewed",
    details:
      "Request human re-evaluation or an formal appeal if a prior privacy request was restricted or denied.",
    icon: <GitBranch className="w-4 h-4 text-[#0A5C6F]" />,
  },
];

export default function CommonPrivacyRights() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Common privacy rights
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            What each request does. Only rights that apply to you are offered in
            the form.
          </p>
        </div>

        {/* Two-Column Grid of Accordion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rights.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className="w-full bg-white rounded-2xl border border-gray-200 transition-all overflow-hidden shadow-2xs hover:border-gray-300"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-left cursor-pointer bg-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-sm font-bold text-[#111827]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="w-7 h-7 flex items-center justify-center shrink-0 text-gray-500">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-gray-600 font-normal leading-relaxed border-t border-gray-100 mt-1">
                    <p className="pt-3">{item.details}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
