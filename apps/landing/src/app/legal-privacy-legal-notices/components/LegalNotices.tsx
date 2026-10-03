import type { ComponentType } from "react";
import {
  Box,
  Building2,
  Calendar,
  ChevronRight,
  Copyright,
  FileText,
  GitBranch,
  HelpCircle,
  Landmark,
  Mail,
  Printer,
  Puzzle,
  RefreshCw,
  Scale,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type IconProps = { className?: string; strokeWidth?: number };

type IconType = ComponentType<IconProps>;

type TopicCard = {
  id: string;
  label: string;
  icon: IconType;
};

type QuickLink = {
  id: string;
  label: string;
  icon: IconType;
};

type MetaItem = {
  id: string;
  label: string;
  value: string;
  icon: IconType;
};

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

function TrademarkIcon({ className }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center text-[12px] font-bold leading-none tracking-tight ${className ?? ""}`}
    >
      TM
    </span>
  );
}

const TOPIC_CARDS = [
  { id: "legal-entity", label: "Legal entity", icon: Building2 },
  { id: "copyright", label: "Copyright", icon: Copyright },
  { id: "trademarks", label: "Trademarks", icon: TrademarkIcon },
  { id: "third-party", label: "Third-party", icon: Puzzle },
  { id: "ip-complaints", label: "IP complaints", icon: Copyright },
  { id: "software", label: "Software", icon: Box },
  { id: "regional-notices", label: "Regional notices", icon: Scale },
  { id: "legal-contact", label: "Legal contact", icon: Mail },
] as const satisfies readonly TopicCard[];

const META_ITEMS = [
  { id: "version", label: "Version", value: "v1.2", icon: GitBranch },
  { id: "effective", label: "Effective", value: "September 1, 2026", icon: Calendar },
  { id: "updated", label: "Updated", value: "September 24, 2026", icon: RefreshCw },
] as const satisfies readonly MetaItem[];

const QUICK_LINKS = [
  { id: "software", label: "Software", icon: Box },
  { id: "regional-notices", label: "Regional notices", icon: Scale },
  { id: "legal-contact", label: "Legal contact", icon: Mail },
  { id: "service-of-process", label: "Service of process", icon: FileText },
  { id: "government-requests", label: "Government requests", icon: Landmark },
  { id: "corporate-changes", label: "Corporate changes", icon: GitBranch },
  { id: "versions", label: "Versions", icon: RefreshCw },
  { id: "faq", label: "FAQ", icon: HelpCircle },
] as const satisfies readonly QuickLink[];

const OUTLINE_BUTTON =
  "inline-flex h-[37px] items-center gap-2 rounded-lg border border-[#D9DFE3] bg-white px-4 text-[13px] font-medium text-[#10262D] transition-colors hover:bg-[#F4F8F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6474]";

/* -------------------------------------------------------------------------- */
/*                                Sub-components                              */
/* -------------------------------------------------------------------------- */

function TopicTile({ card, index }: { card: TopicCard; index: number }) {
  const Icon = card.icon;
  return (
    <a
      href="#"
      className="flex min-h-[113px] flex-col justify-between rounded-[19px] border border-[#DCE3E7] bg-white p-4 transition-shadow hover:shadow-[0_6px_18px_rgba(11,58,68,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6474]"
    >
      <span className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6F4F4] text-[#0B5E6B]">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <span className="text-[10px] leading-none text-[#8A979C]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </span>
      <span className="mt-4 text-[13px] font-semibold leading-[1.25] text-[#0B3A44]">
        {card.label}
      </span>
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

export default function LegalNotices() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E9F6F7] via-white to-white bg-[length:100%_420px] bg-no-repeat font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,-apple-system,'Segoe_UI',sans-serif] antialiased">
      <div className="mx-auto w-full max-w-6xl px-4 pt-9">
        {/* Hero */}
        <header className="flex flex-col items-center text-center">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#0B5E6B]">
            Legal notices
          </p>
          <h1 className="mt-[17px] max-w-[680px] text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-[#0A4048] sm:text-[44px]">
            Legal information about Zoiko Social<span className="ml-1">.</span>
          </h1>
          <p className="mt-4 max-w-[780px] text-base leading-[26px] text-[#6B7780] sm:text-[17px]">
            Who’s responsible for Zoiko Social, copyright and trademark notices, software
            attributions, regional disclosures, and the right channels for formal legal matters.
          </p>

          <div className="mt-[23px] flex flex-wrap items-center justify-center gap-[11px]">
            <a
              href="#"
              className="inline-flex h-10 items-center gap-2 rounded-[11px] bg-[#0B6474] px-5 text-sm font-medium text-white transition-colors hover:bg-[#0A5764] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6474] focus-visible:ring-offset-2"
            >
              <Building2 className="h-4 w-4" strokeWidth={1.75} />
              View legal information
            </a>
            <a
              href="/support-developers-contact-us"
              className="inline-flex h-10 items-center gap-2 rounded-[11px] border border-[#D9DFE3] bg-white px-5 text-sm font-medium text-[#10262D] transition-colors hover:bg-[#F4F8F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6474]"
            >
              <Mail className="h-4 w-4" strokeWidth={1.75} />
              Contact Legal
            </a>
            <a
              href="/legal-privacy-terms-of-service"
              className="inline-flex h-10 items-center gap-1.5 px-2 text-sm font-medium text-[#0B6474] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6474]"
            >
              Terms of Service
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </div>

          <p className="mt-[17px] flex items-center gap-2.5 text-[13px] text-[#6B7780]">
            <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#E6F4F4] text-[#0B5E6B]">
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} />
            </span>
            Maintained from approved corporate and compliance records.
          </p>
        </header>

        {/* Topic cards */}
        <ul className="m-0 mt-[47px] grid list-none grid-cols-2 gap-[11px] p-0 sm:grid-cols-4 lg:grid-cols-8">
          {TOPIC_CARDS.map((card, index) => (
            <li key={card.id} className="contents">
              <TopicTile card={card} index={index} />
            </li>
          ))}
        </ul>

        {/* Meta row */}
        <div className="mt-[69px] flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <dl className="m-0 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
            {META_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-center gap-2">
                  <dt className="flex items-center gap-1.5 text-[#6B7780]">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {item.label}
                  </dt>
                  <dd className="m-0 font-semibold text-[#10262D]">{item.value}</dd>
                </div>
              );
            })}
          </dl>

          <div className="flex items-center gap-[11px]">
            <a href="#" className={OUTLINE_BUTTON}>
              <GitBranch className="h-4 w-4" strokeWidth={1.75} />
              What changed
            </a>
            <button type="button" className={OUTLINE_BUTTON}>
              <Printer className="h-4 w-4" strokeWidth={1.75} />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Quick links strip */}
      <nav
        aria-label="Legal information sections"
        className="mt-4 border-y border-[#E2E7EB] bg-white"
      >
        <ul className="m-0 mx-auto flex min-h-[57px] w-full max-w-6xl list-none flex-wrap items-center justify-center gap-x-[34px] gap-y-2 px-4 py-2 sm:py-0">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.id}>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-[13px] text-[#5B6B72] transition-colors hover:text-[#0B3A44] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6474]"
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="h-[50px]" />
    </main>
  );
}
