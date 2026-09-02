"use client";

import Image from "next/image";
import Link from "next/link";

/* Exported design assets, served straight from /public. `unoptimized` because
   Next's image optimizer refuses SVG unless `dangerouslyAllowSVG` is set. */
const ASSET = "/footer/";

/*
  Only two destinations are wired: the logo goes to the landing home, and
  "About Zoiko Social" goes to /about-us. Every other row is a deliberate "#"
  placeholder until the page it names exists.

  They are collected in one constant so switching a row on later is a single
  edit rather than a hunt through the markup.
*/
const HOME = "/";
const ABOUT = "/about-us";
const PLACEHOLDER = "#";

type FooterLink = { label: string; href: string };

const footerSections: { title: string; links: FooterLink[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About Zoiko Social", href: ABOUT },
      { label: "Careers", href: PLACEHOLDER },
      { label: "Press & Media", href: PLACEHOLDER },
      { label: "Partnerships", href: PLACEHOLDER },
      { label: "Brand Assets", href: PLACEHOLDER },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Features", href: PLACEHOLDER },
      { label: "Communities", href: PLACEHOLDER },
      { label: "World Animal News", href: PLACEHOLDER },
      { label: "Events", href: PLACEHOLDER },
      { label: "Adopt & Foster", href: PLACEHOLDER },
      { label: "Zoiko Market", href: PLACEHOLDER },
      { label: "Premium Plans", href: PLACEHOLDER },
      { label: "Apps & Downloads", href: PLACEHOLDER },
    ],
  },
  {
    title: "Trust & Safety",
    links: [
      { label: "Safety Center", href: PLACEHOLDER },
      { label: "Community Standards", href: PLACEHOLDER },
      { label: "Animal Welfare Policy", href: PLACEHOLDER },
      { label: "Profanity-Free Policy", href: PLACEHOLDER },
      { label: "Protecting Under-18s", href: PLACEHOLDER },
      { label: "Transparency Reports", href: PLACEHOLDER },
      { label: "Appeals", href: PLACEHOLDER },
      { label: "Report a Concern", href: PLACEHOLDER },
    ],
  },
  {
    title: "Support & Developers",
    links: [
      { label: "Help Center", href: PLACEHOLDER },
      { label: "Contact Us", href: PLACEHOLDER },
      { label: "System Status", href: PLACEHOLDER },
      { label: "Accessibility Support", href: PLACEHOLDER },
      { label: "API Documentation", href: PLACEHOLDER },
      { label: "Developer Support", href: PLACEHOLDER },
      { label: "Community Forums", href: PLACEHOLDER },
    ],
  },
  {
    title: "Legal & Privacy",
    links: [
      { label: "Terms of Service", href: PLACEHOLDER },
      { label: "Privacy Policy", href: PLACEHOLDER },
      { label: "Cookie Policy", href: PLACEHOLDER },
      { label: "Accessibility Statement", href: PLACEHOLDER },
      { label: "Data Protection & Privacy Rights", href: PLACEHOLDER },
      { label: "Legal Notices", href: PLACEHOLDER },
    ],
  },
  {
    title: "For Business",
    links: [
      { label: "Advertise on Zoiko Social", href: PLACEHOLDER },
      { label: "Advertising Standards", href: PLACEHOLDER },
      { label: "Campaign Review", href: PLACEHOLDER },
      { label: "Professional & Organization Verification", href: PLACEHOLDER },
      { label: "Professional Directory", href: PLACEHOLDER },
      { label: "Contact Sales", href: PLACEHOLDER },
    ],
  },
];

const socialLinks: { label: string; icon: string; href: string }[] = [
  { label: "X", icon: `${ASSET}x.svg`, href: PLACEHOLDER },
  { label: "Facebook", icon: `${ASSET}facebook.svg`, href: PLACEHOLDER },
  { label: "Instagram", icon: `${ASSET}instagram.svg`, href: PLACEHOLDER },
  { label: "LinkedIn", icon: `${ASSET}linkedin.svg`, href: PLACEHOLDER },
];

const OFFICES = [
  {
    title: "Headquarters",
    address: "1401 21st Street, Suite R, Sacramento, CA 95811, USA",
  },
  {
    title: "European Headquarters",
    address:
      "167–169 Great Portland Street, 5th Floor, London W1W 5PF, United Kingdom",
  },
];

const SECTION_LABEL =
  "text-xs font-bold uppercase tracking-wide text-gray-200";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 font-inter">
      <div className="mx-auto max-w-[1440px]">
        {/* Brand, language, social */}
        <div className="flex flex-col gap-8 border-b border-white/10 px-6 pb-7 pt-9 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex max-w-96 flex-col items-start gap-3">
            <Link href={HOME} className="flex shrink-0 items-center">
              <Image
                src={`${ASSET}logo.svg`}
                alt="Zoiko Social"
                width={207}
                height={60}
                unoptimized
                className="h-[60px] w-auto"
              />
            </Link>
            <p className="text-sm font-normal leading-5 text-gray-400">
              Global social infrastructure for animal communities, welfare, and
              verified news.
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-11">
            <div className="flex flex-col items-start gap-2">
              <div className={SECTION_LABEL}>Language &amp; Region</div>
              {/* A real select rather than a styled div: English is currently
                  the only locale the site ships, so the control shows the one
                  option instead of pretending to offer more. */}
              <div className="relative">
                <select
                  aria-label="Language and region"
                  className="min-h-11 w-full min-w-44 appearance-none rounded-lg bg-white/5 py-3 pl-3 pr-9 text-sm font-normal text-white outline outline-1 outline-offset-[-1px] outline-white/10"
                  defaultValue="en-US"
                >
                  <option value="en-US">English (United States)</option>
                </select>
                {/* Inlined rather than using footer/chevron-down.svg: that
                    export is filled black, which is invisible on this
                    background. Same shape, visible colour. */}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2"
                >
                  <path
                    d="M3.75 5.625L7.5 9.375L11.25 5.625"
                    stroke="#C7D1D9"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2">
              <div className={SECTION_LABEL}>Follow Zoiko Social</div>
              <div className="flex items-start gap-2">
                {socialLinks.map(({ label, icon, href }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-3xl bg-white/5 transition-colors hover:bg-white/10"
                  >
                    <Image
                      src={icon}
                      alt=""
                      aria-hidden
                      width={16}
                      height={16}
                      unoptimized
                      className="size-4"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-6 px-6 py-7 sm:grid-cols-3 lg:px-10 xl:grid-cols-6">
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col items-start">
              <h3 className={`pb-3 ${SECTION_LABEL}`}>{section.title}</h3>

              <ul className="flex flex-col items-start gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-normal leading-5 text-slate-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Offices */}
        <div className="flex flex-col gap-6 border-t border-white/10 px-6 py-6 sm:flex-row lg:px-10">
          {OFFICES.map(({ title, address }) => (
            <div
              key={title}
              className="flex flex-1 flex-col items-start gap-1.5"
            >
              <div className={SECTION_LABEL}>{title}</div>
              <div className="flex items-start gap-2 sm:items-center">
                <Image
                  src={`${ASSET}map-pin.svg`}
                  alt=""
                  aria-hidden
                  width={15}
                  height={15}
                  unoptimized
                  className="mt-0.5 size-3.5 shrink-0 sm:mt-0"
                />
                <address className="text-xs font-normal not-italic leading-5 text-slate-300">
                  {address}
                </address>
              </div>
            </div>
          ))}
        </div>

        {/* Legal */}
        <div className="flex flex-col items-start gap-2 border-t border-white/10 px-6 pb-7 pt-5 lg:px-10">
          <p className="text-xs font-normal leading-5 text-slate-400">
            Zoiko Social is a trading name and division of Zoiko Media Corp.
            Zoiko Media Corp. is a Zoiko Group company.
          </p>
          <p className="text-xs font-normal leading-5 text-slate-400">
            Headquarters: 1401 21st Street, Suite R, Sacramento, CA 95811, USA.
            &nbsp;|&nbsp; European Headquarters: 167–169 Great Portland Street,
            5th Floor, London W1W 5PF, United Kingdom.
          </p>
          <p className="text-xs font-normal leading-5 text-gray-400">
            © 2026 Zoiko Media Corp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
