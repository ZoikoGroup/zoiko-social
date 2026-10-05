"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Headphones,
  ShieldCheck,
  FileCheck,
  BookOpen,
} from "lucide-react";
import { C } from "./theme";

const PATHWAYS = [
  {
    id: "self-serve",
    title: "Self-serve",
    description: "Standard campaigns in supported regions.",
    cta: "Start advertising",
    href: "#start-advertising",
    isPrimary: true,
    icon: Sparkles,
  },
  {
    id: "assisted",
    title: "Assisted",
    description: "Multi-market, integrations or sensitive categories.",
    cta: "Contact Sales",
    href: "#contact-sales",
    isPrimary: false,
    icon: Headphones,
  },
  {
    id: "verify-first",
    title: "Verify first",
    description: "Not verified yet.",
    cta: "Get verified",
    href: "/buisness-verification",
    isPrimary: false,
    icon: ShieldCheck,
  },
  {
    id: "review-questions",
    title: "Review questions",
    description: "A decision on an existing campaign.",
    cta: "Campaign Review",
    href: "/advertising-standards",
    isPrimary: false,
    icon: FileCheck,
  },
  {
    id: "directory-listing",
    title: "Just a listing",
    description: "You only need a Directory profile.",
    cta: "Professional Directory",
    href: "/professional-directory",
    isPrimary: false,
    icon: BookOpen,
  },
];

export default function ChooseHowToStartSection() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[105px] border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}
        <div className="mb-10 sm:mb-12 max-w-[800px]">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[32px] lg:text-[36px] leading-[1.15] tracking-[-0.01em] mb-2.5"
            style={{ color: C.tarawera }}
          >
            Choose how to get started
          </h2>
          <p
            className="font-jakarta text-[16px] sm:text-[17px] leading-[1.6]"
            style={{ color: C.nevada }}
          >
            Self-serve for most. Help when you need it.
          </p>
        </div>

        {/* 5 Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {PATHWAYS.map((path) => {
            const Icon = path.icon;
            const isPrimary = path.isPrimary;
            return (
              <div
                key={path.id}
                className={`rounded-[20px] p-5 flex flex-col justify-between transition-all hover:translate-y-[-2px] ${
                  isPrimary
                    ? "bg-[#066879] text-white shadow-md border border-[#066879]"
                    : "bg-white text-[#102A32] border border-[#DCE5E8] shadow-2xs hover:border-[#066879]/50"
                }`}
              >
                <div>
                  <div
                    className={`w-10 h-10 rounded-[12px] flex items-center justify-center mb-4 ${
                      isPrimary
                        ? "bg-white/15 text-white"
                        : "bg-[#EEF8F9] text-[#066879]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3
                    className={`font-jakarta font-bold text-[17px] mb-1.5 ${
                      isPrimary ? "text-white" : "text-[#073B47]"
                    }`}
                  >
                    {path.title}
                  </h3>
                  <p
                    className={`font-jakarta text-[13px] leading-relaxed mb-6 ${
                      isPrimary ? "text-[#D8EEF1]" : "text-[#5E7076]"
                    }`}
                  >
                    {path.description}
                  </p>
                </div>

                <Link
                  href={path.href}
                  className={`inline-flex items-center gap-1.5 font-jakarta font-bold text-[13.5px] group ${
                    isPrimary
                      ? "text-white hover:underline"
                      : "text-[#066879] hover:underline"
                  }`}
                >
                  <span>{path.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
