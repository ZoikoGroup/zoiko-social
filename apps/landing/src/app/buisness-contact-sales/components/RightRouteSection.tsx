import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Megaphone,
  ShieldCheck,
  Building2,
  Handshake,
  FileCheck2,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";
import { C } from "./theme";

interface RouteCard {
  title: string;
  description: string;
  actionText: string;
  href: string;
  isPrimary?: boolean;
  icon: React.ReactNode;
}

const ROUTE_CARDS: RouteCard[] = [
  {
    title: "Commercial or scale needs",
    description: "Organization, professional or institutional requirements that need a conversation.",
    actionText: "Contact Sales",
    href: "#contact-sales",
    isPrimary: true,
    icon: <Building2 className="w-5 h-5 text-white" />,
  },
  {
    title: "Advertising",
    description: "Run or plan campaigns on Zoiko Social.",
    actionText: "Advertise",
    href: "/business-advertise",
    icon: <Megaphone className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Verification",
    description: "Verify a professional or organization.",
    actionText: "Start verification",
    href: "/buisness-verification",
    icon: <ShieldCheck className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Directory listing",
    description: "Find or manage a verified professional presence.",
    actionText: "Professional Directory",
    href: "/professional-directory",
    icon: <Building2 className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Partnership",
    description: "Propose a mission-aligned collaboration.",
    actionText: "Partnerships",
    href: "/company-partnerships",
    icon: <Handshake className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Campaign decision",
    description: "Understand or resolve a campaign review.",
    actionText: "Campaign Review",
    href: "/campaign-review",
    icon: <FileCheck2 className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Account or product help",
    description: "Get help with your account.",
    actionText: "Help Center",
    href: "/support-developers-help-center",
    icon: <HelpCircle className="w-5 h-5 text-[#066879]" />,
  },
  {
    title: "Safety, welfare or press",
    description: "Report a concern, or contact the media team.",
    actionText: "Safety Center",
    href: "/trust-safety-center",
    icon: <ShieldAlert className="w-5 h-5 text-[#066879]" />,
  },
];

export default function RightRouteSection() {
  return (
    <section id="right-route" className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Heading */}
        <div className="max-w-[720px] mb-10 sm:mb-12">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[36px] leading-[1.15] tracking-[-0.01em]"
            style={{ color: C.tarawera }}
          >
            Is Sales the right route?
          </h2>
          <p
            className="font-jakarta font-normal text-[15px] sm:text-[17px] leading-[1.6] mt-2.5"
            style={{ color: C.nevada }}
          >
            Many requests are faster somewhere else. If so, we&apos;ll route you there directly.
          </p>
        </div>

        {/* 8-Card Grid (4 columns on lg, 2 on sm, 1 on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ROUTE_CARDS.map((card) => {
            if (card.isPrimary) {
              return (
                <div
                  key={card.title}
                  className="flex flex-col justify-between p-6 rounded-[20px] text-white transition-all duration-200 shadow-md hover:shadow-lg relative overflow-hidden group min-h-[244px]"
                  style={{ backgroundColor: C.tarawera }}
                >
                  {/* Subtle decorative gradient overlay */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#066879]/30 rounded-full blur-2xl pointer-events-none" />

                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                      {card.icon}
                    </div>
                    <h3 className="font-jakarta font-bold text-[17px] leading-snug mb-2 text-white">
                      {card.title}
                    </h3>
                    <p
                      className="font-jakarta text-[13.5px] leading-[1.5]"
                      style={{ color: C.botticelli }}
                    >
                      {card.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/15">
                    <Link
                      href={card.href}
                      className="inline-flex items-center justify-between w-full font-jakarta font-bold text-[14px] text-white hover:text-[#D8EEF1] transition-colors"
                    >
                      <span>{card.actionText}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={card.title}
                className="flex flex-col justify-between p-6 rounded-[20px] bg-white border transition-all duration-200 hover:shadow-md hover:border-gray-300 min-h-[244px] group"
                style={{ borderColor: C.geyser }}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#EEF8F9] flex items-center justify-center mb-4">
                    {card.icon}
                  </div>
                  <h3
                    className="font-jakarta font-bold text-[17px] leading-snug mb-2"
                    style={{ color: C.tarawera }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="font-jakarta text-[13.5px] leading-[1.5]"
                    style={{ color: C.nevada }}
                  >
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100">
                  <Link
                    href={card.href}
                    className="inline-flex items-center justify-between w-full font-jakarta font-bold text-[14px] transition-colors group-hover:opacity-80"
                    style={{ color: C.mosque }}
                  >
                    <span>{card.actionText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
