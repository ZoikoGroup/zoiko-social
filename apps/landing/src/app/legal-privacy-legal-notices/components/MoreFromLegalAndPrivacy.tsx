import React from "react";
import Link from "next/link";
import { APP_LINKS } from "@/lib/app-links";
import {
  FileText,
  ShieldCheck,
  Cookie,
  Accessibility,
  Scale,
  BookOpen,
  ChevronRight,
  Check,
} from "lucide-react";

interface LegalLinkCard {
  id: string;
  title: string;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

const legalLinks: LegalLinkCard[] = [
  {
    id: "terms",
    title: "Terms of Service",
    href: "/legal-privacy-terms-of-service",
    icon: <FileText className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    href: APP_LINKS.privacy,
    icon: <ShieldCheck className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "cookie",
    title: "Cookie Policy",
    href: APP_LINKS.privacy,
    icon: <Cookie className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "accessibility",
    title: "Accessibility Statement",
    href: "/support-developers-accessibility-support",
    icon: <Accessibility className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "data-protection",
    title: "Data Protection & Privacy Rights",
    href: "/legal-privacy-rights",
    icon: <Scale className="w-4 h-4 text-[#0A5C6F]" />,
  },
  {
    id: "legal-notices",
    title: "Legal Notices",
    href: "/legal-privacy-legal-notices",
    icon: <BookOpen className="w-4 h-4 text-[#0A5C6F]" />,
    isActive: true,
  },
];

export default function MoreFromLegalAndPrivacy() {
  return (
    <section className="w-full bg-[#FFFFFF] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            More from Legal & Privacy
          </h2>
        </div>

        {/* 3-Column Grid of Link Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {legalLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`rounded-3xl border p-5 flex items-center justify-between gap-4 transition-all cursor-pointer ${
                link.isActive
                  ? "bg-[#F0F9FA] border-[#E0F2F4] shadow-2xs"
                  : "bg-white border-gray-200 shadow-sm hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    link.isActive
                      ? "bg-white border-[#E0F2F4] text-[#0A5C6F]"
                      : "bg-[#F0F9FA] border-[#E0F2F4] text-[#0A5C6F]"
                  }`}
                >
                  {link.icon}
                </div>
                <span className="text-xs md:text-sm font-bold text-[#111827]">
                  {link.title}
                </span>
              </div>

              <div className="text-[#0A5C6F]">
                {link.isActive ? (
                  <Check className="w-4 h-4 text-[#0A5C6F]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
