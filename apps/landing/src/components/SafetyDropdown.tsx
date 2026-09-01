"use client";

import Image from "next/image";
import Link from "next/link";
import { Sora } from "next/font/google";
import { appUrl } from "@/lib/app-links";

/* The design sets the two headings in Sora, which the site does not otherwise
   load. Declaring it here rather than in the root layout keeps the extra font
   scoped to this menu. */
const sora = Sora({ subsets: ["latin"], weight: ["700"], display: "swap" });

/* Exported design assets, served straight from /public. `unoptimized` because
   Next's image optimizer refuses SVG unless `dangerouslyAllowSVG` is set. */
const ICON = "/dropdowns/";

/* This is the one menu whose highlight is an alert rather than a promotion, and
   the exported class names (rose-100, red-700, orange-700) land a long way from
   the warm reds the palette actually specifies — rose-100 is pink where FBEDE9
   is peach. The hexes are used directly so the card reads as designed. */
const ALERT_BG = "#FBEDE9";
const ALERT_LABEL = "#C0392B";
const ALERT_BUTTON = "#B5372A";

type Item = {
  label: string;
  description: string;
  icon: string;
  href: string;
};

/**
 * Menu destinations.
 *
 * Everything here is documentation, and /docs/safety-and-trust is the page that
 * covers it — the same page the Safety nav item itself points at. Support
 * Resources goes to the docs index instead, since it is about finding help
 * generally rather than the safety policy.
 */
const SAFETY_DOCS = appUrl("/docs/safety-and-trust");

const GET_HELP: readonly Item[] = [
  {
    label: "Report a Concern",
    description: "Flag content or behavior that worries you.",
    icon: `${ICON}alert-triangle.svg`,
    href: SAFETY_DOCS,
  },
  {
    label: "Animal Welfare Concerns",
    description: "Report suspected mistreatment or neglect.",
    icon: `${ICON}heart.svg`,
    href: SAFETY_DOCS,
  },
  {
    label: "Emergency Guidance",
    description: "Region-aware next steps in urgent situations.",
    icon: `${ICON}globe.svg`,
    href: SAFETY_DOCS,
  },
  {
    label: "Support Resources",
    description: "Help articles and contact options.",
    icon: `${ICON}users.svg`,
    href: appUrl("/docs"),
  },
];

const ACCOUNTABILITY: readonly Item[] = [
  {
    label: "Community Standards",
    description: "The rules everyone agrees to follow.",
    icon: `${ICON}file-text.svg`,
    href: SAFETY_DOCS,
  },
  {
    label: "Transparency Reports",
    description: "Our published moderation data.",
    icon: `${ICON}badge-check.svg`,
    href: SAFETY_DOCS,
  },
  {
    label: "Appeals",
    description: "Contest a moderation decision.",
    icon: `${ICON}shield-check.svg`,
    href: SAFETY_DOCS,
  },
  {
    label: "How Moderation Works",
    description: "Our enforcement process, explained.",
    icon: `${ICON}settings.svg`,
    href: SAFETY_DOCS,
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

export default function SafetyDropdown() {
  return (
    <div className="w-full overflow-hidden bg-white xl:w-[780px] xl:rounded-b-2xl xl:shadow-[0px_2px_8px_0px_rgba(17,27,39,0.06),0px_16px_40px_-12px_rgba(17,27,39,0.18)] xl:outline xl:outline-1 xl:outline-offset-[-1px] xl:outline-gray-200">
      {/* Title strip */}
      <div className="flex items-start gap-3.5 border-b border-gray-100 px-7 py-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
          <Image
            src={`${ICON}shield-40.svg`}
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
            Safety
          </div>
          <p className="text-xs font-normal leading-5 text-gray-600">
            Standards, controls, and reporting — always free.
          </p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-start">
        {/* Get Help */}
        <div className="flex-1 pb-11 pl-7 pr-7 xl:pr-3 pt-5">
          <SectionLabel>Get Help</SectionLabel>
          <div className="mt-1.5 w-full xl:w-56">
            {GET_HELP.map((item) => (
              <MenuItem key={item.label} {...item} />
            ))}
          </div>
        </div>

        {/* Accountability */}
        <div className="flex-1 pb-16 pl-7 pr-7 xl:pl-5 xl:pr-3 pt-5">
          <SectionLabel>Accountability</SectionLabel>
          <div className="mt-1.5 w-full xl:w-60">
            {ACCOUNTABILITY.map((item) => (
              <MenuItem key={item.label} {...item} />
            ))}
          </div>
        </div>

        {/* Highlight — the alert variant */}
        <div className="w-full px-7 pb-6 xl:w-64 xl:px-0 xl:py-4 xl:pr-4">
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: ALERT_BG }}
          >
            <div
              className="text-xs font-bold uppercase leading-5 tracking-wide"
              style={{ color: ALERT_LABEL }}
            >
              Need help now?
            </div>
            <p
              className={`${sora.className} mt-2.5 text-base font-bold leading-5 text-gray-900`}
            >
              Report a concern in minutes.
            </p>
            <p className="mt-2 text-xs font-normal leading-5 text-gray-600">
              Reporting is free and available without an account. Moderator
              review is not a substitute for emergency services.
            </p>
            <div className="mt-4 h-24 overflow-hidden rounded-xl">
              <Image
                src={`${ICON}safety-highlight.png`}
                alt=""
                aria-hidden
                width={204}
                height={104}
                className="h-24 w-full object-cover"
              />
            </div>
            <Link
              href={SAFETY_DOCS}
              className="mt-4 flex min-h-9 items-center justify-center rounded-full px-3.5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: ALERT_BUTTON }}
            >
              Visit Safety Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
