"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import {
  AlertTriangle,
  Calendar,
  Camera,
  GitBranch,
  Pencil,
  Plus,
  User,
  Users,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type IconType = ComponentType<{ className?: string; strokeWidth?: number }>;

type ChangeType = "addition" | "change" | "deprecation";

type FilterKey = "all" | ChangeType;

type ChangelogEntry = {
  id: string;
  date: string;
  type: ChangeType;
  areaLabel: string;
  areaIcon: IconType;
  title: string;
  description: string;
};

type FilterTab = {
  key: FilterKey;
  label: string;
  icon?: IconType;
};

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

const FILTER_TABS = [
  { key: "all", label: "All changes" },
  { key: "addition", label: "Additions", icon: Plus },
  { key: "change", label: "Changes", icon: Pencil },
  { key: "deprecation", label: "Deprecations", icon: AlertTriangle },
] as const satisfies readonly FilterTab[];

const TYPE_META = {
  addition: {
    label: "Addition",
    icon: Plus,
    chip: "bg-[#E3F2F1] text-[#0A3B45]",
    box: "bg-[#E6F4F4] text-[#0F6D6D]",
  },
  change: {
    label: "Change",
    icon: Pencil,
    chip: "bg-transparent text-[#0A3B45]",
    box: "bg-[#E6F4F4] text-[#0F6D6D]",
  },
  deprecation: {
    label: "Deprecation",
    icon: AlertTriangle,
    chip: "bg-[#FDF0E1] text-[#B4530C]",
    box: "bg-[#FDF0E1] text-[#D9761C]",
  },
} as const satisfies Record<
  ChangeType,
  { label: string; icon: IconType; chip: string; box: string }
>;

const ENTRIES = [
  {
    id: "sep-2026-addition",
    date: "Sep 2026",
    type: "addition",
    areaLabel: "Posts and media",
    areaIcon: Camera,
    title: "Optional field added to a sample resource",
    description: "Existing requests keep working without changes.",
  },
  {
    id: "sep-2026-change",
    date: "Sep 2026",
    type: "change",
    areaLabel: "Profiles and accounts",
    areaIcon: User,
    title: "Clearer recovery steps for a sample error",
    description: "Documentation update only. No behavior change.",
  },
  {
    id: "aug-2026-deprecation",
    date: "Aug 2026",
    type: "deprecation",
    areaLabel: "Communities",
    areaIcon: Users,
    title: "Sample operation deprecated",
    description: "A replacement is available. Migration steps are linked.",
  },
  {
    id: "aug-2026-addition",
    date: "Aug 2026",
    type: "addition",
    areaLabel: "Events",
    areaIcon: Calendar,
    title: "Events area opened as a preview",
    description: "Preview docs may change before release.",
  },
] as const satisfies readonly ChangelogEntry[];

const ROW_GRID =
  "grid grid-cols-[84px_41px_minmax(0,1fr)] sm:grid-cols-[138px_41px_minmax(0,1fr)]";

/* -------------------------------------------------------------------------- */
/*                                Sub-components                              */
/* -------------------------------------------------------------------------- */

function TimelineRow({
  entry,
  isLast,
}: {
  entry: ChangelogEntry;
  isLast: boolean;
}) {
  const meta = TYPE_META[entry.type];
  const TypeIcon = meta.icon;
  const AreaIcon = entry.areaIcon;

  return (
    <li className={ROW_GRID}>
      <span className="pt-[9px] text-[15px] font-semibold leading-5 text-[#10262D]">
        {entry.date}
      </span>

      <div className="relative flex justify-center">
        <span
          className={`relative z-10 flex h-[41px] w-[41px] items-center justify-center rounded-xl ${meta.box}`}
        >
          <TypeIcon className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </span>
        {isLast ? null : (
          <span
            aria-hidden="true"
            className="absolute -bottom-[26px] left-1/2 top-[41px] w-px -translate-x-1/2 bg-[#D5DBDF]"
          />
        )}
      </div>

      <article className="ml-4 min-h-[114px] rounded-[18px] border border-[#DDE3E7] bg-white px-[18px] py-[17px] shadow-[0_1px_2px_rgba(16,38,45,0.04)]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span
            className={`inline-flex h-[22px] items-center rounded-full px-3 text-xs font-medium leading-none ${meta.chip}`}
          >
            {meta.label}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium leading-none text-[#10262D]">
            <AreaIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
            {entry.areaLabel}
          </span>
        </div>
        <h3 className="mt-[10px] text-base font-semibold leading-[22px] text-[#0B3A44]">
          {entry.title}
        </h3>
        <p className="mt-1.5 text-sm leading-5 text-[#6B7680]">
          {entry.description}
        </p>
      </article>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

export default function Changelog() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const visibleEntries: readonly ChangelogEntry[] =
    filter === "all"
      ? ENTRIES
      : ENTRIES.filter((entry) => entry.type === filter);

  return (
    <main id="changelog" className="min-h-screen bg-white font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,-apple-system,'Segoe_UI',sans-serif] antialiased">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:pt-[43px] lg:px-0">
        {/* Heading */}
        <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div>
            <h1 className="text-4xl font-bold leading-10 tracking-[-0.02em] text-[#0B4A55]">
              Changelog
            </h1>
            <p className="mt-2 text-lg leading-[26px] text-[#6B7680]">
              What changed, and what&rsquo;s being retired.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex h-[37px] items-center gap-2 rounded-lg border border-[#D9DFE3] bg-white px-4 text-sm font-medium text-[#10262D] transition-colors hover:bg-[#F4F8F9]"
          >
            <GitBranch className="h-4 w-4" strokeWidth={1.75} />
            Full changelog
          </a>
        </header>

        {/* Filters */}
        <div
          role="group"
          aria-label="Filter changes"
          className="mt-[19px] flex flex-wrap items-center"
        >
          {FILTER_TABS.map((tab) => {
            const Icon = "icon" in tab ? tab.icon : undefined;
            const isActive = filter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(tab.key)}
                className={`inline-flex h-[38px] items-center gap-2 rounded-full border px-4 text-sm font-medium leading-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6474] ${
                  isActive
                    ? "border-[#0B6474] bg-[#0B6474] text-white"
                    : "border-[#D9DFE3] bg-white text-[#10262D] hover:bg-[#F4F8F9]"
                }`}
              >
                {Icon ? <Icon className="h-4 w-4" strokeWidth={1.75} /> : null}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Timeline */}
        <ol className="m-0 mt-[25px] flex list-none flex-col gap-[26px] p-0">
          {visibleEntries.map((entry, index) => (
            <TimelineRow
              key={entry.id}
              entry={entry}
              isLast={index === visibleEntries.length - 1}
            />
          ))}
        </ol>
      </div>
    </main>
  );
}
