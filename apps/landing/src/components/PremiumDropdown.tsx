"use client";

import Image from "next/image";
import Link from "next/link";
import { Sora } from "next/font/google";

/* The design sets the two headings in Sora, which the site does not otherwise
   load. Declaring it here rather than in the root layout keeps the extra font
   scoped to this menu. */
const sora = Sora({ subsets: ["latin"], weight: ["700"], display: "swap" });

/* Exported design assets, served straight from /public. `unoptimized` because
   Next's image optimizer refuses SVG unless `dangerouslyAllowSVG` is set. */
const ICON = "/dropdowns/";

type Item = {
  label: string;
  description: string;
  icon: string;
  href: string;
};

/**
 * Menu destinations.
 *
 * The app has no premium, pricing or billing route — `app-links.ts` already
 * points the Premium nav item at "#" for exactly this reason. Every row here
 * does the same rather than inventing a path that would 404. Replace `PLANS`
 * once the page exists.
 */
const PLANS = "#";

const FOR_YOU: readonly Item[] = [
  {
    label: "Ad-Free Feed",
    description: "Browse without interruptions.",
    icon: `${ICON}layout.svg`,
    href: PLANS,
  },
  {
    label: "Advanced Privacy",
    description: "More control over who sees what.",
    icon: `${ICON}lock.svg`,
    href: PLANS,
  },
  {
    label: "Larger Group Calls",
    description: "Host bigger community calls.",
    icon: `${ICON}users.svg`,
    href: PLANS,
  },
  {
    label: "Enhanced Media",
    description: "Higher-quality photo and video.",
    icon: `${ICON}sparkles.svg`,
    href: PLANS,
  },
];

const FOR_PROS_AND_ORGS: readonly Item[] = [
  {
    label: "Verified Professional Profile",
    description: "Stand out with a verified badge.",
    icon: `${ICON}badge-check.svg`,
    href: PLANS,
  },
  {
    label: "Verified Organization Profile",
    description: "Build trust with your community.",
    icon: `${ICON}shield-check.svg`,
    href: PLANS,
  },
  {
    label: "Fundraising Toolkit",
    description: "Tools to run and track campaigns.",
    icon: `${ICON}banknote.svg`,
    href: PLANS,
  },
  {
    label: "Advanced Moderation",
    description: "Deeper tools for community teams.",
    icon: `${ICON}gauge.svg`,
    href: PLANS,
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-bold uppercase tracking-wide text-teal-900">
      {children}
    </div>
  );
}

function MenuItem({ label, description, icon, href }: Item) {
  return (
    <Link
      href={href}
      className="flex w-full items-start gap-2 rounded-xl py-2.5 pl-1.5 pr-2.5 transition-colors hover:bg-neutral-100"
    >
      <Image
        src={icon}
        alt=""
        aria-hidden
        width={20}
        height={20}
        unoptimized
        className="mt-0.5 size-5 shrink-0"
      />
      <span className="flex flex-col gap-px pl-[3px]">
        <span className="text-sm font-semibold text-gray-900">{label}</span>
        <span className="text-xs font-normal leading-4 text-slate-500">
          {description}
        </span>
      </span>
    </Link>
  );
}

export default function PremiumDropdown() {
  return (
    <div className="w-full overflow-hidden bg-white xl:w-[780px] xl:rounded-b-2xl xl:shadow-[0px_2px_8px_0px_rgba(17,27,39,0.06),0px_16px_40px_-12px_rgba(17,27,39,0.18)] xl:outline xl:outline-1 xl:outline-offset-[-1px] xl:outline-gray-200">
      {/* Title strip */}
      <div className="flex items-start gap-3.5 border-b border-gray-100 px-7 py-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
          <Image
            src={`${ICON}star-40.svg`}
            alt=""
            aria-hidden
            width={40}
            height={40}
            unoptimized
            className="size-10"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <div
            className={`${sora.className} text-base font-bold text-gray-900`}
          >
            Premium
          </div>
          <p className="text-xs font-normal leading-5 text-gray-600">
            Plans for members, professionals, and organizations.
          </p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-start">
        {/* For You */}
        <div className="flex-1 pb-14 pl-7 pr-7 xl:pr-3 pt-5">
          <SectionLabel>For You</SectionLabel>
          <div className="mt-1.5 w-full xl:w-56">
            {FOR_YOU.map((item) => (
              <MenuItem key={item.label} {...item} />
            ))}
          </div>
        </div>

        {/* For Pros & Orgs */}
        <div className="flex-1 py-5 pl-7 pr-7 xl:pl-5 xl:pr-3">
          <SectionLabel>For Pros &amp; Orgs</SectionLabel>
          <div className="mt-1.5 w-full xl:w-60">
            {FOR_PROS_AND_ORGS.map((item) => (
              <MenuItem key={item.label} {...item} />
            ))}
          </div>
        </div>

        {/* Highlight */}
        <div className="w-full px-7 pb-6 xl:w-64 xl:px-0 xl:py-4 xl:pr-4">
          <div className="rounded-2xl bg-neutral-100 p-5">
            <div className="text-xs font-bold uppercase leading-5 tracking-wide text-gray-600">
              Premium Highlight
            </div>
            <p
              className={`${sora.className} mt-2.5 text-base font-bold leading-5 text-gray-900`}
            >
              Safety is never behind a paywall.
            </p>
            <p className="mt-2 text-xs font-normal leading-5 text-gray-600">
              Reporting, standards, and welfare tools stay free for everyone.
            </p>
            <div className="mt-4 h-24 overflow-hidden rounded-xl">
              <Image
                src={`${ICON}premium-highlight.png`}
                alt=""
                aria-hidden
                width={204}
                height={104}
                className="h-24 w-full object-cover"
              />
            </div>
            <Link
              href={PLANS}
              className="mt-4 flex min-h-9 items-center justify-center rounded-full bg-teal-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
            >
              Compare Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
