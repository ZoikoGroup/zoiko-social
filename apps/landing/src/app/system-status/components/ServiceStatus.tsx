"use client";

import { useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  AlertTriangle,
  Bell,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronUp,
  Code2,
  HelpCircle,
  Home,
  Link as LinkIcon,
  MessageCircle,
  MessageSquareText,
  Newspaper,
  PawPrint,
  Send,
  User,
  Users,
  Wrench,
  XCircle,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type StatusKey =
  | "operational"
  | "degraded"
  | "partial"
  | "major"
  | "maintenance"
  | "unknown";

type IconType = ComponentType<{ className?: string; strokeWidth?: number }>;

type Tone = "teal" | "orange" | "gray";

type ServiceRow = {
  name: string;
  icon: IconType;
  tone: Tone;
  status: StatusKey;
  lastChange?: string;
  related?: string;
};

type ServiceGroup = {
  title: string;
  icon: IconType;
  status: StatusKey;
  services: readonly ServiceRow[];
};

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

const STATUS_LABELS = {
  operational: "Operational",
  degraded: "Degraded performance",
  partial: "Partial outage",
  major: "Major outage",
  maintenance: "Under maintenance",
  unknown: "Unknown",
} as const satisfies Record<StatusKey, string>;

const STATUS_STYLES = {
  operational: "bg-[#E3F2F0] text-[#0A3B45] border border-transparent",
  degraded: "bg-[#FDF0E1] text-[#0A3B45] border border-transparent",
  partial: "bg-[#FDF0E1] text-[#0A3B45] border border-[#E39B45]",
  major: "bg-[#0A3B45] text-white border border-[#0A3B45]",
  maintenance: "bg-white text-[#0A3B45] border border-[#D3DADF]",
  unknown: "bg-transparent text-[#5B6770] border border-dashed border-[#AEB7BE]",
} as const satisfies Record<StatusKey, string>;

const TONE_STYLES = {
  teal: "bg-[#E4F2F1] text-[#0F6D6D] border border-transparent",
  orange: "bg-[#FDF0E1] text-[#D9761C] border border-transparent",
  gray: "bg-white text-[#6B767F] border border-[#D9DFE4]",
} as const satisfies Record<Tone, string>;

const STATUS_KEY_ORDER = [
  "operational",
  "degraded",
  "partial",
  "major",
  "maintenance",
  "unknown",
] as const satisfies readonly StatusKey[];

const GROUPS = [
  {
    title: "Accounts and feed",
    icon: Home,
    status: "partial",
    services: [
      { name: "Sign-in and accounts", icon: User, tone: "teal", status: "operational" },
      { name: "Home feed", icon: Home, tone: "teal", status: "operational" },
      { name: "Posts and comments", icon: MessageSquareText, tone: "teal", status: "operational" },
      {
        name: "Photo and video uploads",
        icon: Camera,
        tone: "orange",
        status: "partial",
        lastChange: "Sep 30, 2026, 13:22 UTC",
        related: "Incident INC-2026-0931",
      },
    ],
  },
  {
    title: "Communities and content",
    icon: Users,
    status: "maintenance",
    services: [
      { name: "Communities", icon: Users, tone: "teal", status: "operational" },
      { name: "World Animal News", icon: Newspaper, tone: "teal", status: "operational" },
      { name: "Events", icon: Calendar, tone: "teal", status: "operational" },
      {
        name: "Adoption listings",
        icon: PawPrint,
        tone: "orange",
        status: "maintenance",
        lastChange: "Sep 30, 2026, 14:00 UTC",
        related: "Maintenance MNT-118",
      },
    ],
  },
  {
    title: "Messaging and notifications",
    icon: MessageCircle,
    status: "degraded",
    services: [
      { name: "Direct messages", icon: Send, tone: "teal", status: "operational" },
      {
        name: "Notifications",
        icon: Bell,
        tone: "orange",
        status: "degraded",
        lastChange: "Sep 30, 2026, 11:48 UTC",
        related: "Incident INC-2026-0932",
      },
    ],
  },
  {
    title: "Developer platform",
    icon: Code2,
    status: "unknown",
    services: [
      { name: "Developer API", icon: Code2, tone: "teal", status: "operational" },
      {
        name: "Webhooks",
        icon: LinkIcon,
        tone: "gray",
        status: "unknown",
        lastChange: "No state reported",
      },
    ],
  },
] as const satisfies readonly ServiceGroup[];

/* -------------------------------------------------------------------------- */
/*                                   Icons                                    */
/* -------------------------------------------------------------------------- */

function PartialOutageIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="2" />
      <path d="M12 4.5a7.5 7.5 0 0 1 0 15V4.5Z" fill="currentColor" />
    </svg>
  );
}

function StatusIcon({ status }: { status: StatusKey }) {
  switch (status) {
    case "operational":
      return <CheckCircle2 className="h-[18px] w-[18px] text-[#127A73]" strokeWidth={2} />;
    case "degraded":
      return <AlertTriangle className="h-[18px] w-[18px] text-[#D9761C]" strokeWidth={2} />;
    case "partial":
      return <PartialOutageIcon className="h-[18px] w-[18px] text-[#D9761C]" />;
    case "major":
      return <XCircle className="h-[18px] w-[18px] text-[#F0902F]" strokeWidth={2} />;
    case "maintenance":
      return <Wrench className="h-[18px] w-[18px] text-[#127A73]" strokeWidth={2} />;
    case "unknown":
      return <HelpCircle className="h-[18px] w-[18px] text-[#5B6770]" strokeWidth={2} />;
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/*                                Sub-components                              */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: StatusKey }) {
  return (
    <span
      className={`inline-flex h-[33px] items-center gap-2 whitespace-nowrap rounded-full px-[13px] text-[17px] font-medium leading-none ${STATUS_STYLES[status]}`}
    >
      <StatusIcon status={status} />
      {STATUS_LABELS[status]}
    </span>
  );
}

function ServiceIcon({
  icon: Icon,
  tone,
  size = "sm",
}: {
  icon: IconType;
  tone: Tone;
  size?: "sm" | "lg";
}) {
  const box = size === "lg" ? "h-[52px] w-[52px] rounded-[14px]" : "h-[42px] w-[42px] rounded-[11px]";
  const glyph = size === "lg" ? "h-[24px] w-[24px]" : "h-[20px] w-[20px]";
  return (
    <span className={`flex shrink-0 items-center justify-center ${box} ${TONE_STYLES[tone]}`}>
      <Icon className={glyph} strokeWidth={1.75} />
    </span>
  );
}

const ROW_GRID =
  "grid grid-cols-[minmax(0,496fr)_minmax(0,321fr)_minmax(0,350fr)_minmax(0,265fr)] items-center px-[30px]";

function Cell({ children }: { children?: ReactNode }) {
  return <div className="min-w-0">{children}</div>;
}

function GroupCard({ group }: { group: ServiceGroup }) {
  const [open, setOpen] = useState<boolean>(true);
  const issues = group.services.filter((s) => s.status !== "operational").length;
  const total = group.services.length;
  const panelId = `panel-${group.title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <section className="overflow-hidden rounded-[30px] border border-[#DCE2E7] bg-white">
      {/* Group header */}
      <div className="flex min-h-[120px] flex-wrap items-center gap-y-3 px-[30px] py-4">
        <ServiceIcon icon={group.icon} tone="orange" size="lg" />
        <h2 className="ml-[14px] text-[22px] font-semibold leading-tight tracking-[-0.01em] text-[#0A3B45]">
          {group.title}
        </h2>
        <p className="ml-[19px] text-[16px] leading-none text-[#66727B]">
          {total} services · {issues} with issues
        </p>
        <div className="ml-auto flex items-center gap-[28px]">
          <StatusBadge status={group.status} />
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? `Collapse ${group.title}` : `Expand ${group.title}`}
            onClick={() => setOpen((v) => !v)}
            className="flex h-6 w-6 items-center justify-center rounded text-[#2E4A54] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3B45]"
          >
            <ChevronUp
              className={`h-[22px] w-[22px] transition-transform duration-200 ${open ? "" : "rotate-180"}`}
              strokeWidth={1.75}
            />
          </button>
        </div>
      </div>

      {/* Table */}
      {open && (
        <div id={panelId} className="overflow-x-auto border-t border-[#DCE2E7]">
          <div className="min-w-[760px]">
            <div className={`${ROW_GRID} h-[48px] bg-[#F4F6F8] text-[17px] font-medium text-[#66727B]`}>
              <Cell>Service</Cell>
              <Cell>Status</Cell>
              <Cell>Last change</Cell>
              <Cell>Related</Cell>
            </div>

            <ul className="m-0 list-none p-0">
              {group.services.map((service, index) => {
                const isFirst = index === 0;
                const isLast = index === group.services.length - 1;
                return (
                  <li
                    key={service.name}
                    className={`${ROW_GRID} min-h-[82px] ${isFirst ? "pt-[9px]" : ""} ${
                      isLast ? "pb-[10px]" : "border-b border-[#E2E7EB]"
                    }`}
                  >
                    <Cell>
                      <div className="flex items-center gap-[15px]">
                        <ServiceIcon icon={service.icon} tone={service.tone} />
                        <span className="text-[20px] font-medium leading-tight text-[#10262D]">
                          {service.name}
                        </span>
                      </div>
                    </Cell>
                    <Cell>
                      <StatusBadge status={service.status} />
                    </Cell>
                    <Cell>
                      {"lastChange" in service && service.lastChange ? (
                        <span className="text-[18px] text-[#6B767F]">{service.lastChange}</span>
                      ) : null}
                    </Cell>
                    <Cell>
                      {"related" in service && service.related ? (
                        <a
                          href="#"
                          className="text-[20px] font-medium text-[#0B6474] hover:underline"
                        >
                          {service.related}
                        </a>
                      ) : null}
                    </Cell>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

export default function ServiceStatusPage() {
  return (
    <main className="bg-[#F7F9FA] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,-apple-system,'Segoe_UI',sans-serif] antialiased">
      <div className="mx-auto w-full max-w-[1600px] px-4 pb-[94px] pt-12 sm:px-8 lg:px-[125px] lg:pt-[92px]">
        {/* Heading */}
        <header>
          <h1 className="text-[36px] font-bold leading-[1.1] tracking-[-0.02em] text-[#0A3B45] sm:text-[44px]">
            Service status
          </h1>
          <p className="mt-[14px] text-[18px] font-light leading-snug text-[#66727B] sm:text-[22px]">
            Live state of every service. No reported state means Unknown, never Operational.
          </p>
        </header>

        {/* Status key */}
        <div className="mt-[45px] flex flex-wrap items-center gap-x-3 gap-y-3">
          <span className="mr-[8px] text-[17px] text-[#66727B]">Status key</span>
          {STATUS_KEY_ORDER.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </div>

        {/* Groups */}
        <div className="mt-[28px] flex flex-col gap-5">
          {GROUPS.map((group) => (
            <GroupCard key={group.title} group={group} />
          ))}
        </div>
      </div>
    </main>
  );
}
