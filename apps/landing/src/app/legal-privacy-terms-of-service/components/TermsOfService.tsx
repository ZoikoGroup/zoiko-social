"use client";

import { useCallback, useEffect, useState } from "react";
import type { ComponentType, MouseEvent } from "react";
import {
  BadgeCheck,
  Calendar,
  ChevronDown,
  ChevronUp,
  Code2,
  Globe,
  List,
  Megaphone,
  Newspaper,
  PawPrint,
  Sparkles,
  Store,
} from "lucide-react";
import { APP_LINKS, appUrl } from "@/lib/app-links";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type IconType = ComponentType<{ className?: string; strokeWidth?: number }>;

type Segment = string | { readonly link: string; readonly href: string };

type Clause = {
  number: string;
  title: string;
  body: readonly Segment[];
};

type Callout = {
  variant: "short" | "note";
  label?: string;
  text: string;
};

type SectionKind = "clauses" | "services" | "regions";

type TermsSection = {
  id: string;
  number: string;
  title: string;
  kind: SectionKind;
  clauses: readonly Clause[];
  callout?: Callout;
};

type ServiceTerm = {
  id: string;
  title: string;
  description: string;
  linkLabel: string;
  href: string;
  icon: IconType;
};

type RegionAddendum = {
  id: string;
  title: string;
  notes: readonly { readonly heading: string; readonly text: string }[];
};

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

const SECTIONS = [
  {
    id: "agreement-and-eligibility",
    number: "1.",
    title: "Agreement and eligibility",
    kind: "clauses",
    clauses: [
      {
        number: "1.1",
        title: "Accepting these Terms",
        body: [
          "By creating an account, or by accessing or using Zoiko Social, you agree to these Terms of Service (version 2.4, effective September 1, 2026). If you don’t agree, don’t use the services.",
        ],
      },
      {
        number: "1.2",
        title: "Who can use Zoiko Social",
        body: [
          "You must be at least 13 years old, or the minimum age required in your country if it’s higher. If you’re under 18, you confirm a parent or guardian has reviewed these Terms with you. See ",
          { link: "Protecting Under-18s", href: "/safety-protecting-under-18s" },
          ".",
        ],
      },
      {
        number: "1.3",
        title: "Using Zoiko Social on behalf of an organization",
        body: [
          "If you use Zoiko Social on behalf of a rescue, clinic, business or other organization, you confirm you have authority to accept these Terms for it, and “you” includes that organization.",
        ],
      },
      {
        number: "1.4",
        title: "Other terms that apply",
        body: [
          "Some services have their own terms, listed in Section 6. If service-specific terms conflict with these Terms, the service-specific terms apply to that service. A signed written agreement with Zoiko Media Corp. takes priority over both.",
        ],
      },
    ],
  },
  {
    id: "your-account-and-security",
    number: "2.",
    title: "Your account and security",
    kind: "clauses",
    clauses: [
      {
        number: "2.1",
        title: "Accurate information",
        body: [
          "Keep your account details accurate and up to date. You can change most details in ",
          { link: "Account settings", href: appUrl("/settings") },
          ".",
        ],
      },
      {
        number: "2.2",
        title: "Keeping your account secure",
        body: [
          "You’re responsible for activity on your account and for keeping your sign-in details private. Tell us right away through ",
          { link: "Help Center", href: "/support-developers-help-center" },
          " if you think someone else has accessed your account.",
        ],
      },
      {
        number: "2.3",
        title: "One person, one account",
        body: [
          "Personal accounts are for one person. Don’t share, sell or transfer your account. Organizations can add team members through organization roles.",
        ],
      },
      {
        number: "2.4",
        title: "No impersonation",
        body: [
          "Don’t pretend to be another person, rescue, professional or organization. Verified badges are covered by the ",
          { link: "Verification Policy", href: "/premium-verified-organization" },
          ".",
        ],
      },
    ],
  },
  {
    id: "the-zoiko-social-services",
    number: "3.",
    title: "The Zoiko Social services",
    kind: "clauses",
    clauses: [
      {
        number: "3.1",
        title: "What we provide",
        body: [
          "Zoiko Social lets people share animal-related content, join communities, follow verified news, find adoption and foster opportunities, attend events, and use Market, Premium and professional tools.",
        ],
      },
      {
        number: "3.2",
        title: "Changes to the services",
        body: [
          "We’re always improving Zoiko Social, so features may change, be added or be retired. When a change significantly affects paid features you use, we’ll tell you in advance where reasonably possible.",
        ],
      },
      {
        number: "3.3",
        title: "Availability",
        body: [
          "We work to keep Zoiko Social available, but we don’t promise it will always be uninterrupted or error-free. Current service health is on ",
          { link: "System Status", href: "/support-developers-system-status" },
          ".",
        ],
      },
    ],
  },
  {
    id: "your-content-and-intellectual-property",
    number: "4.",
    title: "Your content and intellectual property",
    kind: "clauses",
    clauses: [
      {
        number: "4.1",
        title: "You own your content",
        body: [
          "You keep ownership of the posts, photos, videos and other content you share on Zoiko Social.",
        ],
      },
      {
        number: "4.2",
        title: "The license you give us",
        body: [
          "So we can run the services, you give Zoiko Media Corp. a worldwide, non-exclusive, royalty-free license to host, store, display, reproduce, adapt and distribute your content, only to operate, provide and improve Zoiko Social. This license ends when your content is deleted, except where others have reshared it or we must keep it for legal reasons.",
        ],
      },
      {
        number: "4.3",
        title: "Rights to what you share",
        body: [
          "Only share content you have the rights to, including permission from people who appear in it. Report copyright or trademark issues through ",
          { link: "Legal Notices", href: "/legal-privacy-legal-notices" },
          ".",
        ],
      },
      {
        number: "4.4",
        title: "Zoiko Social’s intellectual property",
        body: [
          "Zoiko Social names, logos, software and design belong to Zoiko Media Corp. You may not use them except as allowed in the Brand Assets guidelines.",
        ],
      },
    ],
    callout: {
      variant: "short",
      label: "In short:",
      text: "your content stays yours. We use it only to run Zoiko Social, and you can delete it anytime.",
    },
  },
  {
    id: "acceptable-use-and-animal-welfare",
    number: "5.",
    title: "Acceptable use and animal welfare",
    kind: "clauses",
    clauses: [
      {
        number: "5.1",
        title: "Community Standards",
        body: [
          "You must follow the ",
          { link: "Community Standards", href: "/safety-community-standards" },
          ", which are part of these Terms.",
        ],
      },
      {
        number: "5.2",
        title: "Animal welfare",
        body: [
          "Content or activity that promotes animal cruelty, illegal wildlife trade, animal fighting or unlicensed breeding is not allowed. Report concerns through ",
          { link: "Report a concern", href: "/safety-report-concern" },
          ".",
        ],
      },
      {
        number: "5.3",
        title: "What you must not do",
        body: [
          "Don’t break the law, harass others, spread spam or malware, scrape the services without permission, or interfere with how Zoiko Social works.",
        ],
      },
    ],
  },
  {
    id: "service-specific-terms",
    number: "6.",
    title: "Service-specific terms",
    kind: "services",
    clauses: [
      {
        number: "6.1",
        title: "How service terms work",
        body: [
          "The services below have extra terms that apply when you use them. They’re added to these Terms and take priority for that service only.",
        ],
      },
    ],
  },
  {
    id: "privacy-cookies-and-your-data",
    number: "7.",
    title: "Privacy, cookies and your data",
    kind: "clauses",
    clauses: [
      {
        number: "7.1",
        title: "How we handle your data",
        body: [
          "Our ",
          { link: "Privacy Policy", href: APP_LINKS.privacy },
          " explains how we collect and use personal data. The ",
          { link: "Cookie Policy", href: APP_LINKS.privacy },
          " covers cookies and similar technologies.",
        ],
      },
      {
        number: "7.2",
        title: "Your privacy rights",
        body: [
          "You can access, correct or delete your data, and use other rights that apply where you live, through ",
          { link: "Data Protection & Privacy Rights", href: "/legal-privacy-rights" },
          ".",
        ],
      },
    ],
  },
  {
    id: "moderation-enforcement-and-appeals",
    number: "8.",
    title: "Moderation, enforcement and appeals",
    kind: "clauses",
    clauses: [
      {
        number: "8.1",
        title: "How we enforce these Terms",
        body: [
          "We may remove content, limit features, or suspend accounts that break these Terms or the Community Standards. We use a mix of automated systems and trained reviewers.",
        ],
      },
      {
        number: "8.2",
        title: "Appeals",
        body: [
          "If we act on your content or account, we’ll tell you why where we can, and you can appeal through the ",
          { link: "Appeals", href: "/safety-appeals" },
          " page within 30 days.",
        ],
      },
    ],
  },
  {
    id: "suspension-termination-and-closing-your-account",
    number: "9.",
    title: "Suspension, termination and closing your account",
    kind: "clauses",
    clauses: [
      {
        number: "9.1",
        title: "Closing your account",
        body: [
          "You can delete your account anytime in ",
          { link: "Account settings", href: appUrl("/settings") },
          ". Some information may be kept as described in the Privacy Policy.",
        ],
      },
      {
        number: "9.2",
        title: "When we may suspend or end access",
        body: [
          "We may suspend or end your access if you seriously or repeatedly break these Terms, if the law requires it, or to protect people or animals. Where appropriate, we’ll give you notice and a chance to respond.",
        ],
      },
      {
        number: "9.3",
        title: "What continues after",
        body: ["Sections 4.2, 10, 11 and 14 continue to apply after your account ends."],
      },
    ],
  },
  {
    id: "disclaimers-liability-and-indemnity",
    number: "10.",
    title: "Disclaimers, liability and indemnity",
    kind: "clauses",
    clauses: [
      {
        number: "10.1",
        title: "Services provided “as is”",
        body: [
          "To the extent the law allows, Zoiko Social is provided “as is” and “as available”, without warranties of any kind.",
        ],
      },
      {
        number: "10.2",
        title: "Limits on liability",
        body: [
          "To the extent the law allows, Zoiko Media Corp. isn’t liable for indirect, incidental or consequential losses. Our total liability for any claim is limited to the greater of US$100 or the amount you paid us in the 12 months before the claim.",
        ],
      },
      {
        number: "10.3",
        title: "Your responsibility",
        body: [
          "You agree to cover losses and claims that arise from your content or your breach of these Terms, to the extent the law allows.",
        ],
      },
    ],
    callout: {
      variant: "note",
      text: "Nothing in these Terms limits rights you have under consumer laws that can’t be waived where you live.",
    },
  },
  {
    id: "disputes-and-governing-law",
    number: "11.",
    title: "Disputes and governing law",
    kind: "clauses",
    clauses: [
      {
        number: "11.1",
        title: "Talk to us first",
        body: [
          "If you have a dispute with us, contact ",
          { link: "Legal", href: "/support-developers-contact-us" },
          " first. Most concerns can be resolved informally within 60 days.",
        ],
      },
      {
        number: "11.2",
        title: "Governing law",
        body: [
          "These Terms are governed by the laws of the State of Delaware, USA, except where the law of your country requires otherwise.",
        ],
      },
      {
        number: "11.3",
        title: "Where disputes are heard",
        body: [
          "Disputes are heard in the state or federal courts in Wilmington, Delaware, unless your local law gives you the right to bring a claim where you live.",
        ],
      },
    ],
  },
  {
    id: "changes-to-these-terms",
    number: "12.",
    title: "Changes to these Terms",
    kind: "clauses",
    clauses: [
      {
        number: "12.1",
        title: "How we change these Terms",
        body: [
          "We may update these Terms as Zoiko Social changes. The version number and effective date at the top will show the current version.",
        ],
      },
      {
        number: "12.2",
        title: "Notice of material changes",
        body: [
          "For important changes, we’ll tell you at least 15 days before they take effect, by email or in the app. Continuing to use Zoiko Social after that date means you accept the new Terms.",
        ],
      },
    ],
  },
  {
    id: "region-specific-terms",
    number: "13.",
    title: "Region-specific terms",
    kind: "regions",
    clauses: [
      {
        number: "13.1",
        title: "Terms that apply where you live",
        body: ["Choose your region to see any extra terms that apply to you."],
      },
    ],
  },
  {
    id: "contact-and-legal-notices",
    number: "14.",
    title: "Contact and legal notices",
    kind: "clauses",
    clauses: [
      {
        number: "14.1",
        title: "Who you’re agreeing with",
        body: [
          "These Terms are between you and Zoiko Media Corp., 450 Harbor View Avenue, Floor 12, San Francisco, CA 94111, USA. Zoiko Social is a trading name and division of Zoiko Media Corp.",
        ],
      },
      {
        number: "14.2",
        title: "Sending us legal notices",
        body: [
          "Send formal notices to legal@zoikosocial.example or by mail to the address above. See ",
          { link: "Legal Notices", href: "/legal-privacy-legal-notices" },
          " for service of process.",
        ],
      },
    ],
  },
] as const satisfies readonly TermsSection[];

const SERVICE_TERMS = [
  {
    id: "premium",
    title: "Premium",
    description: "Billing, renewal and cancellation",
    linkLabel: "Read Premium terms",
    href: "/platform-premium-plans-production",
    icon: Sparkles,
  },
  {
    id: "market",
    title: "Zoiko Market",
    description: "Buying, selling and prohibited items",
    linkLabel: "Read Zoiko Market terms",
    href: "/platform-market-production",
    icon: Store,
  },
  {
    id: "adopt-and-foster",
    title: "Adopt and Foster",
    description: "Safety and off-platform meetings",
    linkLabel: "Read Adopt and Foster terms",
    href: "/platform-adopt-foster-production",
    icon: PawPrint,
  },
  {
    id: "professionals",
    title: "Professionals and Organizations",
    description: "Verification and directory listings",
    linkLabel: "Read Professionals and Organizations terms",
    href: "/premium-verified-organization",
    icon: BadgeCheck,
  },
  {
    id: "advertising",
    title: "Advertising",
    description: "Advertising Standards and review",
    linkLabel: "Read Advertising terms",
    href: "#",
    icon: Megaphone,
  },
  {
    id: "events",
    title: "Events and fundraising",
    description: "Organizer duties and payments",
    linkLabel: "Read Events and fundraising terms",
    href: "/platform-events",
    icon: Calendar,
  },
  {
    id: "news",
    title: "News",
    description: "Editorial and source rules",
    linkLabel: "Read News terms",
    href: "/news-source-standards",
    icon: Newspaper,
  },
  {
    id: "developers",
    title: "Developers and API",
    description: "Developer terms",
    linkLabel: "Read Developers and API terms",
    href: "/support-developers-api-documentation",
    icon: Code2,
  },
] as const satisfies readonly ServiceTerm[];

const REGION_ADDENDA = [
  {
    id: "us",
    title: "United States addendum",
    notes: [
      {
        heading: "Arbitration",
        text: "US members agree to resolve most disputes by individual arbitration under Section 11. You may opt out within 30 days of accepting (sample).",
      },
      {
        heading: "State consumer rights",
        text: "California and New York residents keep any rights their state law gives them.",
      },
    ],
  },
  {
    id: "uk-eea",
    title: "United Kingdom and EEA addendum",
    notes: [
      {
        heading: "Consumer rights",
        text: "Nothing limits your statutory rights under UK or EU consumer law.",
      },
      {
        heading: "Where disputes are heard",
        text: "You can bring a claim in the courts of the country where you live.",
      },
      {
        heading: "Online dispute resolution",
        text: "You can also use your local consumer dispute body (sample).",
      },
    ],
  },
  {
    id: "australia",
    title: "Australia addendum",
    notes: [
      {
        heading: "Australian Consumer Law",
        text: "Our services come with guarantees that can’t be excluded under the Australian Consumer Law.",
      },
    ],
  },
  {
    id: "other",
    title: "Other regions addendum",
    notes: [
      {
        heading: "General terms",
        text: "The main Terms apply. Local law may give you extra rights.",
      },
    ],
  },
] as const satisfies readonly RegionAddendum[];

const REGION_OPTIONS = [
  "United States",
  "United Kingdom and EEA",
  "Australia",
  "Other regions",
] as const;

const EFFECTIVE_NOTE =
  "Effective September 1, 2026. Overrides the matching parts of Sections 10 and 11.";

const SCROLL_OFFSET = 140;

/* -------------------------------------------------------------------------- */
/*                                Sub-components                              */
/* -------------------------------------------------------------------------- */

const LINK_CLASS =
  "font-medium text-[#0B6474] underline decoration-[#0B6474]/50 underline-offset-2 hover:decoration-[#0B6474]";

function RichText({ segments }: { segments: readonly Segment[] }) {
  return (
    <>
      {segments.map((segment, index) =>
        typeof segment === "string" ? (
          <span key={`text-${index}`}>{segment}</span>
        ) : (
          <a key={`link-${index}`} href={segment.href} className={LINK_CLASS}>
            {segment.link}
          </a>
        ),
      )}
    </>
  );
}

function ClauseBlock({ clause }: { clause: Clause }) {
  return (
    <div className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-1 sm:grid-cols-[46px_minmax(0,1fr)]">
      <span className="pt-0.5 text-[15px] font-medium leading-6 text-[#8A979C]">{clause.number}</span>
      <div>
        <h3 className="text-base font-semibold leading-6 text-[#0B3A44]">{clause.title}</h3>
        <p className="mt-[7px] text-[15px] leading-6 text-[#5A6A71]">
          <RichText segments={clause.body} />
        </p>
      </div>
    </div>
  );
}

function CalloutBox({ callout }: { callout: Callout }) {
  if (callout.variant === "short") {
    return (
      <p className="rounded-r-lg border-l-2 border-[#0B6474] bg-[#F1F6F7] px-5 py-[14px] text-[13px] leading-5 text-[#3F5058]">
        <strong className="font-semibold text-[#0B3A44]">{callout.label} </strong>
        {callout.text}
      </p>
    );
  }
  return (
    <p className="w-fit max-w-full rounded-lg border border-[#DDE3E7] bg-[#FAFBFC] px-4 py-[14px] text-[13px] leading-5 text-[#5A6A71]">
      {callout.text}
    </p>
  );
}

function ServiceCard({ item }: { item: ServiceTerm }) {
  const Icon = item.icon;
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-[#DDE6E8] bg-gradient-to-r from-[#F1F6F7] to-white p-5 shadow-[0_2px_6px_rgba(16,58,68,0.05)]">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#E6EEF0] text-[#6F98A0]">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </span>
      <div className="min-w-0">
        <h4 className="text-[15px] font-semibold leading-5 text-[#0B3A44]">{item.title}</h4>
        <p className="mt-1 text-[12.5px] leading-4 text-[#7A8A90]">{item.description}</p>
        <a href={item.href} className="mt-2 inline-block text-[12.5px] font-semibold leading-4 text-[#0B6474] hover:underline">
          {item.linkLabel}
        </a>
      </div>
    </article>
  );
}

function ServiceTermsGrid() {
  return (
    <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-[17px] p-0 md:grid-cols-2">
      {SERVICE_TERMS.map((item) => (
        <li key={item.id}>
          <ServiceCard item={item} />
        </li>
      ))}
    </ul>
  );
}

function RegionTerms() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-7 md:grid-cols-[357px_minmax(0,1fr)]">
      <div className="self-start rounded-2xl border border-[#DDE3E7] bg-white p-5 shadow-[0_2px_6px_rgba(16,58,68,0.05)]">
        <label htmlFor="region-select" className="text-[12.5px] text-[#6B7A80]">
          Your region
        </label>
        <div className="relative mt-2">
          <select
            id="region-select"
            defaultValue=""
            className="h-10 w-full appearance-none rounded-lg border border-[#D3DADF] bg-white pl-3 pr-9 text-[13px] text-[#3F5058] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6474]"
          >
            <option value="" disabled>
              Choose a region
            </option>
            {REGION_OPTIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6B72]"
            strokeWidth={1.75}
          />
        </div>
        <p className="mt-3 text-xs leading-[18px] text-[#8A979C]">
          All regional addenda are shown below for design export.
        </p>
      </div>

      <div className="rounded-2xl border border-[#DDE3E7] bg-white p-6 shadow-[0_2px_6px_rgba(16,58,68,0.05)]">
        <ul className="m-0 flex list-none flex-col gap-8 p-0">
          {REGION_ADDENDA.map((addendum) => (
            <li key={addendum.id}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E6F4F4] text-[#0B6474]">
                  <Globe className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <h4 className="text-base font-semibold text-[#0B3A44]">{addendum.title}</h4>
                <span className="rounded-full border border-[#F0CFA3] bg-[#FDF0E1] px-2.5 py-0.5 text-[11px] font-medium text-[#B4530C]">
                  Dummy data
                </span>
              </div>
              <div className="mt-4 space-y-4">
                {addendum.notes.map((note) => (
                  <div key={note.heading}>
                    <h5 className="text-[15px] font-semibold text-[#0B3A44]">{note.heading}</h5>
                    <p className="mt-1.5 text-[15px] leading-6 text-[#3F5058]">{note.text}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-[18px] text-[#8A979C]">{EFFECTIVE_NOTE}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SectionBlock({ section }: { section: TermsSection }) {
  const headingId = `${section.id}-heading`;
  return (
    <section id={section.id} aria-labelledby={headingId} className="scroll-mt-[96px]">
      <div className="grid grid-cols-[40px_minmax(0,1fr)] items-baseline gap-x-1 sm:grid-cols-[46px_minmax(0,1fr)]">
        <span className="text-2xl font-bold leading-8 text-[#C9772B]">{section.number}</span>
        <h2 id={headingId} className="text-2xl font-bold leading-8 tracking-[-0.01em] text-[#0B3A44]">
          {section.title}
        </h2>
      </div>

      <div className="mt-[14px] flex flex-col gap-7">
        {section.clauses.map((clause) => (
          <ClauseBlock key={clause.number} clause={clause} />
        ))}
      </div>

      {section.kind === "services" ? <ServiceTermsGrid /> : null}
      {section.kind === "regions" ? <RegionTerms /> : null}

      {"callout" in section && section.callout ? (
        <div className="mt-7 pl-[40px] sm:pl-[46px]">
          <CalloutBox callout={section.callout} />
        </div>
      ) : null}
    </section>
  );
}

function TocSidebar({
  activeId,
  onNavigate,
}: {
  activeId: string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  return (
    <aside className="hidden lg:block">
      <nav
        aria-label="On this page"
        className="sticky top-[84px] max-h-[calc(100vh-108px)] overflow-y-auto pr-2"
      >
        <p className="mb-3 flex items-center gap-2 text-[13px] text-[#5B6B72]">
          <List className="h-3.5 w-3.5" strokeWidth={1.75} />
          On this page
        </p>
        <ul className="m-0 list-none space-y-0 p-0">
          {SECTIONS.map((section) => {
            const isActive = section.id === activeId;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(event) => onNavigate(event, section.id)}
                  className={`block px-3 py-[7px] text-[13px] leading-[1.35] transition-colors duration-200 ${
                    isActive
                      ? "bg-[#EEF8F9] border-l-2 border-l-[#E88924] font-semibold text-[#0B5E6B]"
                      : "text-[#5B6B72] hover:bg-[#F1F6F7] hover:text-[#0B3A44]"
                  }`}
                >
                  {section.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

export default function TermsOfService() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const update = () => {
      let current: string = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top - SCROLL_OFFSET <= 0) {
          current = section.id;
        }
      }
      const reachedBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (reachedBottom) {
        current = SECTIONS[SECTIONS.length - 1].id;
      }
      setActiveId(current);
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleNavigate = useCallback((event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  }, []);

  const handleBackToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main
      id="top"
      className="min-h-screen bg-[#F7F9FA] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,-apple-system,'Segoe_UI',sans-serif] antialiased"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-x-[67px] px-4 pb-[70px] pt-12 lg:grid-cols-[250px_minmax(0,1fr)] lg:pt-[84px]">
        <TocSidebar activeId={activeId} onNavigate={handleNavigate} />

        <div className="min-w-0">
          <div className="flex flex-col gap-[96px]">
            {SECTIONS.map((section) => (
              <SectionBlock key={section.id} section={section} />
            ))}
          </div>

          <button
            type="button"
            onClick={handleBackToTop}
            className="mt-[56px] inline-flex h-9 items-center gap-2 rounded-full border border-[#D3DADF] bg-white px-4 text-[13px] font-medium text-[#3F5058] transition-colors hover:bg-[#F4F8F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6474]"
          >
            <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} />
            Back to top
          </button>
        </div>
      </div>
    </main>
  );
}
