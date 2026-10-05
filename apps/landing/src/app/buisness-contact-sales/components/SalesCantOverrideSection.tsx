import React from "react";
import Link from "next/link";
import {
  Award,
  Flag,
  Megaphone,
  ShieldCheck,
  FileText,
  BarChart2,
  Lock,
  Scale,
} from "lucide-react";
import { C } from "./theme";

interface OverrideItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const OVERRIDE_ITEMS: OverrideItem[] = [
  {
    title: "Verification",
    description: "Can't approve, speed up or change verification.",
    icon: Award,
  },
  {
    title: "Campaign review",
    description: "Can't approve a campaign rejected under Advertising Standards.",
    icon: Flag,
  },
  {
    title: "Advertising policy",
    description: "Can't waive welfare, privacy, child-safety or disclosure rules.",
    icon: Megaphone,
  },
  {
    title: "Moderation and safety",
    description: "Can't suppress reports or enforcement decisions.",
    icon: ShieldCheck,
  },
  {
    title: "Verified news",
    description: "Can't buy news placement or influence editorial decisions.",
    icon: FileText,
  },
  {
    title: "Organic ranking",
    description: "Can't promise higher Directory, adoption, community or news ranking.",
    icon: BarChart2,
  },
  {
    title: "Member data",
    description: "Can't share private member data, messages or locations.",
    icon: Lock,
  },
  {
    title: "Legal and compliance",
    description: "Can't make commitments outside the law or approved terms.",
    icon: Scale,
  },
];

const POLICY_LINKS = [
  {
    label: "Advertising Standards",
    href: "/advertising-standards",
    icon: Megaphone,
  },
  {
    label: "How verification works",
    href: "/buisness-verification",
    icon: Award,
  },
  {
    label: "Safety Center",
    href: "/trust-safety-center",
    icon: ShieldCheck,
  },
];

export default function SalesCantOverrideSection() {
  return (
    <section id="sales-cant-override" className="w-full bg-white py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Heading on White Background */}
        <div className="max-w-[760px] mb-6 sm:mb-10">
          <h2
            className="font-jakarta font-extrabold text-[26px] sm:text-[34px] lg:text-[36px] leading-[1.15] tracking-[-0.01em]"
            style={{ color: C.tarawera }}
          >
            What Sales can&apos;t override
          </h2>
          <p
            className="font-jakarta font-normal text-[14px] sm:text-[16px] leading-[1.6] mt-2"
            style={{ color: C.nevada }}
          >
            These protect members, animals and every business on Zoiko Social.
          </p>
        </div>

        {/* Large Rounded Container */}
        <div
          className="rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 lg:p-10 text-white relative overflow-hidden"
          style={{ backgroundColor: C.tarawera }}
        >
          {/* Top Banner: The commercial firewall */}
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/[0.12] flex items-center justify-center shrink-0 text-white">
              <Lock className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-jakarta font-extrabold text-[19px] sm:text-[24px] lg:text-[26px] leading-tight text-white tracking-[-0.01em]">
                The commercial firewall
              </h3>
              <p
                className="font-jakarta text-[13px] sm:text-[15px] leading-normal mt-1"
                style={{ color: C.botticelli }}
              >
                No contract, budget or partnership changes these decisions.
              </p>
            </div>
          </div>

          {/* 8-Card Grid (4 cols on lg, 2 on sm, 1 on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 sm:mb-8">
            {OVERRIDE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex flex-col justify-between p-4 sm:p-[18px] rounded-[18px] sm:rounded-[20px] bg-white/[0.06] border border-white/[0.14] transition-colors hover:bg-white/[0.09]"
                >
                  {/* Top row: Category icon on left, Amber lock on right */}
                  <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-white/[0.12] flex items-center justify-center text-white">
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    <Lock className="w-3.5 h-3.5" style={{ color: C.zest }} />
                  </div>

                  {/* Content */}
                  <div>
                    <h4 className="font-jakarta font-bold text-[14.5px] sm:text-[15px] leading-snug sm:leading-6 text-white mb-1">
                      {item.title}
                    </h4>
                    <p
                      className="font-jakarta text-[12.5px] sm:text-[13px] leading-[17px] sm:leading-[18px]"
                      style={{ color: C.jaggedIce }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Policy Links */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 pt-2">
            {POLICY_LINKS.map((link) => {
              const LinkIcon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="inline-flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 rounded-xl border border-white/[0.45] bg-transparent hover:bg-white/10 text-white font-jakarta text-[13.5px] sm:text-[14px] font-semibold transition-all cursor-pointer text-center"
                >
                  <LinkIcon className="w-4 h-4 text-white shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
