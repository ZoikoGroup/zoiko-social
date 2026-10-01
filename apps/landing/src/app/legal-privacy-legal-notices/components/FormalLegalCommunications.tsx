"use client"
import React, { useState } from "react";
import {
  Scale,
  FileText,
  ShieldCheck,
  Copyright,
  Mic,
  AlertTriangle,
  HelpCircle,
  Briefcase,
  ChevronRight,
  ChevronDown,
  Send,
} from "lucide-react";

interface CommCard {
  id: string;
  subtitle: string;
  title: string;
  actionText: string;
  icon: React.ReactNode;
}

const commCards: CommCard[] = [
  {
    id: "general",
    subtitle: "For",
    title: "A general legal question",
    actionText: "Contact Legal",
    icon: <Scale className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "contract",
    subtitle: "For",
    title: "A contract or Terms question",
    actionText: "Terms of Service",
    icon: <FileText className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "privacy",
    subtitle: "For",
    title: "A privacy request",
    actionText: "Privacy Rights",
    icon: <ShieldCheck className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "ip",
    subtitle: "For",
    title: "An IP notice",
    actionText: "IP notice",
    icon: <Copyright className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "press",
    subtitle: "For",
    title: "A press inquiry",
    actionText: "Press and Media",
    icon: <Mic className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "safety",
    subtitle: "For",
    title: "A safety concern",
    actionText: "Report a concern",
    icon: <AlertTriangle className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "account",
    subtitle: "For",
    title: "Account help",
    actionText: "Help Center",
    icon: <HelpCircle className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "partnership",
    subtitle: "For",
    title: "A partnership",
    actionText: "Partnerships",
    icon: <Briefcase className="w-4 h-4 text-[#0A5C6F]" />,
  },
];

export default function FormalLegalCommunications() {
  const [inquiryType, setInquiryType] = useState("");
  const [organization, setOrganization] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [matterReference, setMatterReference] = useState("");
  const [message, setMessage] = useState("");

  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Formal legal communications
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Pick your reason to reach the right team.
          </p>
        </div>

        {/* 4-Column Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {commCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between gap-6 transition-all hover:border-gray-300"
            >
              <div className="flex flex-col gap-5">
                <div className="w-9 h-9 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                  {card.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400 font-normal">
                    {card.subtitle}
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-[#111827]">
                    {card.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs md:text-sm font-semibold text-[#0A5C6F] cursor-pointer hover:underline">
                {card.actionText}
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Contact Legal Form Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-10 flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl md:text-2xl font-bold text-[#111827]">
              Contact Legal
            </h3>
            <p className="text-xs md:text-sm text-gray-500 font-normal">
              For formal legal matters only.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inquiry type */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-700">
                Inquiry type (required)
              </label>
              <div className="relative">
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-gray-500 focus:outline-none focus:border-[#0A5C6F] transition-colors appearance-none shadow-2xs cursor-pointer"
                >
                  <option value="" disabled>
                    Choose one
                  </option>
                  <option value="regulatory">Regulatory Correspondence</option>
                  <option value="compliance">Compliance Matter</option>
                  <option value="other">Other Legal Inquiry</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Organization */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-700">
                Organization or law firm (optional)
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-[#111827] focus:outline-none focus:border-[#0A5C6F] transition-colors"
              />
            </div>

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-700">
                Name (required)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-[#111827] focus:outline-none focus:border-[#0A5C6F] transition-colors"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-700">
                Email (required)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-[#111827] focus:outline-none focus:border-[#0A5C6F] transition-colors"
              />
            </div>
          </div>

          {/* Matter reference */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-700">
              Matter reference (optional)
            </label>
            <input
              type="text"
              value={matterReference}
              onChange={(e) => setMatterReference(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs md:text-sm text-[#111827] focus:outline-none focus:border-[#0A5C6F] transition-colors"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-700">
              Message (required)
            </label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-4 text-xs md:text-sm text-[#111827] focus:outline-none focus:border-[#0A5C6F] transition-colors resize-none"
            />
            <span className="text-xs text-gray-400 font-normal pt-1">
              Don&apos;t include passwords, payment details or sensitive
              evidence unless asked.
            </span>
          </div>

          {/* Footer Submit Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400 font-normal">
              Sending this form isn&apos;t formal service of legal process.
            </span>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 bg-[#0A5C6F] hover:bg-[#074653] text-white text-xs md:text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-2xs cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              Contact Legal
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
