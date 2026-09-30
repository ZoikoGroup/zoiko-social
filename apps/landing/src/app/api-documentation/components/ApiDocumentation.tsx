import Image from "next/image";
import type { ComponentType } from "react";
import {
  AlertTriangle,
  Box,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Eye,
  Folder,
  GitBranch,
  Layers,
  RefreshCw,
  Rocket,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type IconType = ComponentType<{ className?: string; strokeWidth?: number }>;

type LifecycleKey = "current" | "preview" | "deprecated" | "sunset" | "retired";

type SidebarItem = {
  label: string;
  icon?: IconType;
  active?: boolean;
  nested?: boolean;
};

type LifecycleItem = {
  key: LifecycleKey;
  label: string;
  icon: IconType;
};

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

const SIDEBAR_ITEMS = [
  { label: "Getting started", icon: Rocket },
  { label: "Concepts", icon: Layers },
  { label: "Resource group", icon: Folder, active: true },
  { label: "Operation", nested: true },
  { label: "Operation", nested: true },
  { label: "Schemas", icon: Box },
  { label: "Changelog", icon: GitBranch },
] as const satisfies readonly SidebarItem[];

const TABS = ["Request", "Responses", "Errors"] as const;

const LIFECYCLE_ITEMS = [
  { key: "current", label: "Current", icon: CheckCircle2 },
  { key: "preview", label: "Preview", icon: Eye },
  { key: "deprecated", label: "Deprecated", icon: AlertTriangle },
  { key: "sunset", label: "Sunset", icon: Clock },
  { key: "retired", label: "Retired", icon: X },
] as const satisfies readonly LifecycleItem[];

const LIFECYCLE_STYLES = {
  current:
    "border-transparent bg-[#E3F2F1] text-[#0A3B45] [&>svg]:text-[#127A73]",
  preview:
    "border-dashed border-[#0B6474] bg-white text-[#0A3B45] [&>svg]:text-[#0B6474]",
  deprecated:
    "border-transparent bg-[#FDF0E1] text-[#0A3B45] [&>svg]:text-[#D9761C]",
  sunset: "border-[#E39B45] bg-[#FDF0E1] text-[#0A3B45] [&>svg]:text-[#D9761C]",
  retired: "border-[#D3DADF] bg-white text-[#3E4C55] [&>svg]:text-[#5B6770]",
} as const satisfies Record<LifecycleKey, string>;

const SKELETON_ROWS = [0, 1, 2] as const;

/* -------------------------------------------------------------------------- */
/*                                Sub-components                              */
/* -------------------------------------------------------------------------- */

function Skeleton({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block rounded-full bg-[#D6DFE2] ${className}`}
    />
  );
}

function SidebarLink({ item }: { item: SidebarItem }) {
  const Icon = item.icon;
  const base =
    "flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors hover:bg-[#EEF5F6]";
  const state = item.active
    ? "bg-[#E3F2F1] font-medium text-[#0A3B45]"
    : "font-normal text-[#3E4C55]";

  return (
    <a
      href="#"
      className={`${base} ${state} ${item.nested ? "pl-[45px]" : ""}`}
    >
      {Icon ? (
        <Icon className="h-4 w-4 shrink-0 text-[#4A5A63]" strokeWidth={1.75} />
      ) : null}
      <span>{item.label}</span>
    </a>
  );
}

function LifecyclePill({ item }: { item: LifecycleItem }) {
  const Icon = item.icon;
  return (
    <li
      className={`inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium leading-none ${LIFECYCLE_STYLES[item.key]}`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      {item.label}
    </li>
  );
}

function PreviewCard() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <div className="overflow-hidden rounded-t-[28px] border border-b-0 border-[#D5E3E6] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        {/* Card header */}
        <div className="flex h-[50px] items-center justify-between border-b border-[#DDE8EA] bg-[#FAFCFC] px-5 sm:px-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-[#4A5A63] sm:text-sm"
          >
            <BookOpen className="h-4 w-4" strokeWidth={1.75} />
            <a href="#" className="hover:underline">
              Reference
            </a>
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            <a href="#" className="hover:underline">
              Resource group
            </a>
          </nav>
          <span className="inline-flex h-[26px] items-center gap-1.5 rounded-full border border-[#CFE3E4] bg-[#E6F3F3] px-3 text-xs font-medium text-[#0A3B45]">
            <CheckCircle2
              className="h-3.5 w-3.5 text-[#127A73]"
              strokeWidth={2}
            />
            Current version
          </span>
        </div>

        {/* Card body */}
        <div className="flex h-[400px]">
          <aside className="hidden w-[205px] shrink-0 border-r border-[#DDE8EA] px-[14px] py-3 sm:block">
            <nav aria-label="Reference sections">
              <ul className="m-0 list-none space-y-px p-0">
                {SIDEBAR_ITEMS.map((item, index) => (
                  <li key={`${item.label}-${index}`}>
                    <SidebarLink item={item} />
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="min-w-0 flex-1 px-5 py-5 sm:px-[27px]">
            <span className="inline-flex h-6 items-center rounded-full bg-[#E3F2F1] px-3 text-xs font-medium text-[#0A3B45]">
              Current
            </span>

            <div className="mt-[18px] space-y-[13px]">
              <Skeleton className="h-4 w-[266px] max-w-full" />
              <Skeleton className="h-2 w-[386px] max-w-full" />
              <Skeleton className="h-2 w-[289px] max-w-full" />
            </div>

            <div
              role="tablist"
              aria-label="Documentation sections"
              className="mt-[25px] flex items-center gap-2"
            >
              {TABS.map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={index === 0}
                  className={
                    index === 0
                      ? "h-8 rounded-full bg-[#0B6474] px-4 text-xs font-medium text-white"
                      : "h-8 rounded-full border border-[#D3DADF] bg-white px-4 text-xs font-medium text-[#3E4C55] hover:bg-[#F4F8F9]"
                  }
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-4 max-w-[892px] overflow-hidden rounded-lg border border-[#D9E3E6]">
              {SKELETON_ROWS.map((row) => (
                <div
                  key={row}
                  className={`grid h-[31px] grid-cols-[minmax(0,154fr)_minmax(0,153fr)_minmax(0,307fr)] items-center gap-[11px] px-[14px] ${
                    row === SKELETON_ROWS.length - 1
                      ? ""
                      : "border-b border-[#D9E3E6]"
                  }`}
                >
                  <Skeleton className="h-[7px] w-full" />
                  <Skeleton className="h-[7px] w-full" />
                  <Skeleton className="h-[7px] w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

export default function ApiDocumentation() {
  return (
    <div className="bg-white font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,-apple-system,'Segoe_UI',sans-serif] antialiased">
      {/* Hero */}
      <section className="relative h-[590px] overflow-hidden">
        <Image
          src="/api/1.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#0B3A44]/75 via-[#0B3A44]/65 to-[#0B3A44]/75"
        />

        <div className="relative z-10 flex flex-col pt-[52px]">
          <header className="px-4 text-center">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/90">
              Support &amp; Developers
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-5xl">
              API Documentation
            </h1>
            <p className="mt-3 text-base text-white/90 sm:text-lg">
              The official reference for building with Zoiko Social.
            </p>
          </header>

          <div className="mt-[44px]">
            <PreviewCard />
          </div>
        </div>
      </section>

      {/* Bottom bar */}
      <div className="border-t border-[#DDE3E7] bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-6 gap-y-4 px-4 py-[19px]">
          <div className="flex items-center gap-4">
            <label
              htmlFor="version-select"
              className="text-[15px] font-semibold text-[#10262D]"
            >
              Version
            </label>
            <div className="relative">
              <select
                id="version-select"
                defaultValue="current"
                className="h-[38px] w-[219px] appearance-none rounded-lg border border-[#D3DADF] bg-white pl-[14px] pr-9 text-[15px] text-[#10262D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6474]"
              >
                <option value="current">Current version (sample)</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A5A63]"
                strokeWidth={1.75}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-sm text-[#5B6770]">Lifecycle</span>
            <ul className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
              {LIFECYCLE_ITEMS.map((item) => (
                <LifecyclePill key={item.key} item={item} />
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 lg:ml-auto">
            <RefreshCw className="h-4 w-4 text-[#5B6770]" strokeWidth={1.75} />
            <span className="text-sm text-[#5B6770]">Docs updated</span>
            <code className="rounded border border-[#BFDCDD] bg-[#E4F1F2] px-2 py-1 font-mono text-xs font-medium text-[#0A3B45]">
              {"{{updated_at}}"}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
