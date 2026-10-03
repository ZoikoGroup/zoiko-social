"use client"
import React, { useState } from "react";
import {
  Copyright,
  Stamp,
  ShieldAlert,
  ShieldCheck,
  MessageSquareWarning,
  AlertOctagon,
  UserX,
  Sparkles,
  ChevronRight,
  Check,
  Plus,
  Send,
} from "lucide-react";

interface ComplaintCard {
  id: string;
  title: string;
  actionText: string;
  icon: React.ReactNode;
}

const complaintCards: ComplaintCard[] = [
  {
    id: "copyright",
    title: "Copyright infringement",
    actionText: "Submit an IP notice",
    icon: <Copyright className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "trademark",
    title: "Trademark misuse",
    actionText: "Submit an IP notice",
    icon: <Stamp className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "counterfeit",
    title: "Counterfeit or impersonation",
    actionText: "IP notice and safety",
    icon: <ShieldAlert className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "privacy",
    title: "A privacy complaint",
    actionText: "Privacy Rights",
    icon: <ShieldCheck className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "defamation",
    title: "Defamation or content dispute",
    actionText: "Contact Legal",
    icon: <MessageSquareWarning className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "animal-welfare",
    title: "Animal welfare or abuse",
    actionText: "Report a concern",
    icon: <AlertOctagon className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "impersonation",
    title: "Account impersonation",
    actionText: "Safety reporting",
    icon: <UserX className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "brand-logo",
    title: "Brand or logo misuse",
    actionText: "Submit an IP notice",
    icon: <Sparkles className="w-4 h-4 text-[#0A5C6F]" />,
  },
];

export default function IntellectualPropertyComplaints() {
  const [complaintType, setComplaintType] = useState<
    "Copyright" | "Trademark" | "Other IP"
  >("Copyright");
  const [rightsHolder, setRightsHolder] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isActingAgent, setIsActingAgent] = useState(false);
  const [protectedWork, setProtectedWork] = useState("");
  const [reportedLink, setReportedLink] = useState("");
  const [infringementReason, setInfringementReason] = useState("");
  const [goodFaithChecked, setGoodFaithChecked] = useState(false);

  return (
    <section className="w-full bg-[#FFFFFF] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Intellectual property complaints
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Report copyright or trademark misuse. Other concerns go elsewhere.
          </p>
        </div>

        {/* 4-Column Grid of Complaint Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {complaintCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between gap-6 transition-all hover:border-gray-300"
            >
              <div className="flex flex-col gap-5">
                <div className="w-9 h-9 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                  {card.icon}
                </div>
                <h3 className="text-sm md:text-base font-bold text-[#111827]">
                  {card.title}
                </h3>
              </div>

              <div className="flex items-center gap-1 text-xs md:text-sm font-semibold text-[#0A5C6F] cursor-pointer hover:underline">
                {card.actionText}
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Form and Sidebar Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Form (Left 8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-10 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold text-[#111827]">
                Complaint type
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {(["Copyright", "Trademark", "Other IP"] as const).map(
                  (type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setComplaintType(type)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border text-xs md:text-sm font-medium transition-colors cursor-pointer ${
                        complaintType === type
                          ? "bg-[#F0F9FA] border-[#0A5C6F] text-[#0A5C6F]"
                          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          complaintType === type
                            ? "border-[#0A5C6F]"
                            : "border-gray-300"
                        }`}
                      >
                        {complaintType === type && (
                          <span className="w-2 h-2 rounded-full bg-[#0A5C6F]" />
                        )}
                      </span>
                      {type}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Inputs Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-gray-700">
                  Rights holder (required)
                </label>
                <input
                  type="text"
                  value={rightsHolder}
                  onChange={(e) => setRightsHolder(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-[#111827] focus:outline-none focus:border-[#0A5C6F] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-gray-700">
                  Contact email (required)
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-[#111827] focus:outline-none focus:border-[#0A5C6F] transition-colors"
                />
              </div>
            </div>

            {/* Checkbox: Acting on behalf */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="acting-agent"
                checked={isActingAgent}
                onChange={(e) => setIsActingAgent(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#0A5C6F] focus:ring-[#0A5C6F] cursor-pointer"
              />
              <label
                htmlFor="acting-agent"
                className="text-xs md:text-sm text-gray-600 font-normal cursor-pointer select-none"
              >
                I&apos;m acting on behalf of the rights holder
              </label>
            </div>

            {/* Protected work or mark */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-700">
                The protected work or mark (required)
              </label>
              <input
                type="text"
                value={protectedWork}
                onChange={(e) => setProtectedWork(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-[#111827] focus:outline-none focus:border-[#0A5C6F] transition-colors"
              />
            </div>

            {/* Reported material */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-700">
                  Reported material (required)
                </label>
                <span className="text-xs text-gray-400 font-normal">
                  Link to reported material
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-xs text-gray-400 font-normal">
                  https://
                </span>
                <input
                  type="text"
                  value={reportedLink}
                  onChange={(e) => setReportedLink(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-20 pr-4 py-3 text-xs md:text-sm text-[#111827] focus:outline-none focus:border-[#0A5C6F] transition-colors"
                />
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A5C6F] hover:underline w-fit cursor-pointer pt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add another link
              </button>
            </div>

            {/* Why it infringes */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-700">
                Why it infringes (optional)
              </label>
              <textarea
                rows={4}
                value={infringementReason}
                onChange={(e) => setInfringementReason(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-xs md:text-sm text-[#111827] focus:outline-none focus:border-[#0A5C6F] transition-colors resize-none"
              />
            </div>

            {/* Good faith checkbox */}
            <div className="flex items-start gap-3 bg-[#F7F9FA] border border-gray-200 rounded-2xl p-4">
              <input
                type="checkbox"
                id="good-faith"
                checked={goodFaithChecked}
                onChange={(e) => setGoodFaithChecked(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#0A5C6F] focus:ring-[#0A5C6F] cursor-pointer shrink-0"
              />
              <label
                htmlFor="good-faith"
                className="text-xs md:text-sm text-gray-600 font-normal leading-relaxed cursor-pointer select-none"
              >
                I believe in good faith that the use described isn&apos;t
                authorized by the rights holder, its agent or the law. The
                information in this notice is accurate, and I am the rights
                holder or authorized to act for them.
              </label>
            </div>

            {/* Footer submit row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-400 font-normal">
                We use these details only to handle this notice.
              </span>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 bg-[#0A5C6F] hover:bg-[#074653] text-white text-xs md:text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-2xs cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
                Submit IP notice
              </button>
            </div>
          </div>

          {/* Sidebar / Helpful to include (Right 4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-[#111827]">
              <div className="w-7 h-7 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center text-[#0A5C6F] shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              Helpful to include
            </div>

            <ul className="flex flex-col gap-3 text-xs md:text-sm text-gray-600">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#0A5C6F] shrink-0 mt-0.5" />
                <span>The exact page or post links</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#0A5C6F] shrink-0 mt-0.5" />
                <span>Where your original appears</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#0A5C6F] shrink-0 mt-0.5" />
                <span>Registration details, if relevant</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
