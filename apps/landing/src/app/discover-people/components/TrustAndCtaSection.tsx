"use client";

import React from "react";
import {
  ShieldCheck,
  Shield,
  Clock,
  XCircle,
  MinusCircle,
  UserCheck,
} from "lucide-react";

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const TRUST_FEATURES: FeatureItem[] = [
  {
    id: "1",
    title: "Verified professionals",
    description:
      "Verification badges only reflect what our Trust program actually checked — never a guarantee of outcome or quality.",
    icon: <ShieldCheck className="w-4 h-4 text-[#0B5C66]" />,
  },
  {
    id: "2",
    title: "Privacy by design",
    description:
      "Location stays broad and consented. Private community membership and contact details are never shown to people who aren't authorized to see them.",
    icon: <Shield className="w-4 h-4 text-[#0B5C66]" />,
  },
  {
    id: "3",
    title: "Explainable suggestions",
    description:
      "Every recommended profile shows a reason — a shared community, a matching interest, or verified expertise.",
    icon: <Clock className="w-4 h-4 text-[#0B5C66]" />,
  },
  {
    id: "4",
    title: "Block & report",
    description:
      "Blocking is immediate and permanent from discovery. Reporting stays low-friction and never gets blocked by a sign-in wall.",
    icon: <XCircle className="w-4 h-4 text-[#0B5C66]" />,
  },
  {
    id: "5",
    title: "No popularity ranking",
    description:
      "We never rank people by follower counts. Relevance and trust come first, with diversity so no one account dominates your feed.",
    icon: <MinusCircle className="w-4 h-4 text-[#0B5C66]" />,
  },
  {
    id: "6",
    title: "Child-safety protected",
    description:
      "Minors are never discoverable or contactable through this surface, beyond what our dedicated child-safety policy allows.",
    icon: <UserCheck className="w-4 h-4 text-[#0B5C66]" />,
  },
];

export default function TrustAndCtaSection() {
  return (
    <section className="flex flex-col items-center justify-center py-12 md:py-16 text-[#0F3838] bg-white">
      <div className="max-w-6xl w-full px-2 sm:px-4 flex flex-col gap-12 md:gap-16">
        {/* Top Half: Built on trust and safety */}
        <div className="w-full flex flex-col items-start text-left">
          {/* Header */}
          <div className="mb-8 px-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B2E2E] tracking-tight mb-1">
              Built on trust and safety
            </h2>
            <p className="text-xs sm:text-sm text-[#5B7171] leading-relaxed font-normal">
              Every part of people discovery is designed around consent, not
              exposure.
            </p>
          </div>

          {/* 3-Column Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-6 w-full">
            {TRUST_FEATURES.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                {/* Icon Container */}
                <div className="w-8 h-8 rounded-full bg-[#EBF5F5] flex items-center justify-center shrink-0 mt-0.5">
                  {item.icon}
                </div>

                {/* Text Content */}
                <div className="flex flex-col text-left">
                  <h3 className="text-sm font-bold text-[#0B2E2E] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5B7171] leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Half: Call to Action Card with Background Image */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-[#073B47EB] to-[#066879E0] text-white p-8 sm:p-12 md:p-16 text-center flex flex-col items-center justify-center min-h-[320px] shadow-sm">
          {/* Background Image Layer with Dark Teal Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/people/cta.jpg"
              alt="Community background"
              className="w-full h-full object-cover opacity-10 mix-blend-overlay"
            />
            {/* Gradient Overlay for Text Readability */}
          </div>

          {/* CTA Content Container */}
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
              Join a community that shows up for animals — and for you.
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl font-normal mb-8">
              Create a free account to follow the people, professionals, and
              communities that match your animal interests.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-6 py-2.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm"
              >
                Join Free
              </button>
              <button
                type="button"
                className="px-6 py-2.5 rounded-lg bg-transparent border border-white/40 hover:bg-white/10 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
