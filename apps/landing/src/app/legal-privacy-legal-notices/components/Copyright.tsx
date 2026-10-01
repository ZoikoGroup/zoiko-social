import React from "react";
import {
  Type,
  Sparkles,
  Code2,
  Database,
  Image as ImageIcon,
  Users,
  Puzzle,
  Scale,
} from "lucide-react";

interface CoverBadge {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const coverBadges: CoverBadge[] = [
  {
    id: "site-text",
    label: "Site and app text",
    icon: <Type className="w-3.5 h-3.5 text-[#0A5C6F]" />,
  },
  {
    id: "design-graphics",
    label: "Design and graphics",
    icon: <Sparkles className="w-3.5 h-3.5 text-[#0A5C6F]" />,
  },
  {
    id: "software",
    label: "Software",
    icon: <Code2 className="w-3.5 h-3.5 text-[#0A5C6F]" />,
  },
  {
    id: "databases",
    label: "Databases",
    icon: <Database className="w-3.5 h-3.5 text-[#0A5C6F]" />,
  },
  {
    id: "original-media",
    label: "Original media",
    icon: <ImageIcon className="w-3.5 h-3.5 text-[#0A5C6F]" />,
  },
];

export default function Copyright() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Copyright
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            What Zoiko Social owns, and what it doesn&apos;t.
          </p>
        </div>

        {/* Covers Labels List */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
            Covers
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {coverBadges.map((badge) => (
              <div
                key={badge.id}
                className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-xs font-medium text-[#111827] shadow-2xs"
              >
                {badge.icon}
                {badge.label}
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Grid of Content Ownership Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Your content stays yours Card */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col justify-between gap-6 transition-all hover:border-gray-300">
            <div className="flex flex-col gap-6">
              <div className="w-9 h-9 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-[#0A5C6F]" />
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-base md:text-lg font-bold text-[#111827]">
                  Your content stays yours
                </h3>
                <p className="text-xs md:text-sm text-gray-500 font-normal leading-relaxed">
                  Posts and media you share are covered by the{" "}
                  <a
                    href="#terms"
                    className="text-[#0A5C6F] font-semibold hover:underline"
                  >
                    Terms of Service
                  </a>
                  , not this notice.
                </p>
              </div>
            </div>
          </div>

          {/* Third-party material Card */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col justify-between gap-6 transition-all hover:border-gray-300">
            <div className="flex flex-col gap-6">
              <div className="w-9 h-9 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0">
                <Puzzle className="w-4 h-4 text-[#0A5C6F]" />
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-base md:text-lg font-bold text-[#111827]">
                  Third-party material
                </h3>
                <p className="text-xs md:text-sm text-gray-500 font-normal leading-relaxed">
                  Owned by its creators. See{" "}
                  <a
                    href="#attributions"
                    className="text-[#0A5C6F] font-semibold hover:underline"
                  >
                    attributions
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Wording Footer Callout */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 flex items-start gap-4 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0 mt-0.5">
            <Scale className="w-4 h-4 text-[#0A5C6F]" />
          </div>
          <p className="text-xs md:text-sm text-gray-600 font-normal leading-relaxed">
            <strong className="font-semibold text-[#111827]">
              Sample wording:
            </strong>{" "}
            All rights reserved. Use of Zoiko Social materials is allowed only
            as described in the Terms of Service or with written permission.
          </p>
        </div>

        {/* Copyright Notice */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 font-normal">
            &copy; 2024&ndash;2026 Zoiko Media Corp.
          </p>
        </div>
      </div>
    </section>
  );
}
