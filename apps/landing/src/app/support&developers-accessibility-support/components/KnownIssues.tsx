import Image from "next/image";
import { C } from "./theme";

const FILTERS = [
  { label: "All", active: true, icon: null },
  { label: "Investigating", active: false, icon: "icon-search-filter" },
  { label: "Fix in progress", active: false, icon: "icon-tool" },
  { label: "Resolved", active: false, icon: "icon-check" },
];

const ISSUES = [
  {
    icon: "icon-keyboard-issue",
    iconBg: C.orangeFill,
    title: "Event date picker is hard to use without a mouse",
    meta: "Events · Web · Updated Sep 24, 2026",
    status: { icon: "icon-search-filter", label: "Investigating", bg: C.panel, color: C.ink },
  },
  {
    icon: "icon-play-issue",
    iconBg: C.orangeFill,
    title: "Some video captions start late",
    meta: "Posts · iOS app · Updated Sep 19, 2026",
    status: { icon: "icon-tool", label: "Fix in progress", bg: "#fff", color: C.brandDeep },
  },
  {
    icon: "icon-bell-issue",
    iconBg: C.orangeFill,
    title: "Notification badge isn't announced",
    meta: "Notifications · Android app · Updated Sep 12, 2026",
    status: { icon: "icon-search-filter", label: "Investigating", bg: C.panel, color: C.ink },
  },
  {
    icon: "icon-text-issue",
    iconBg: C.chip,
    title: "Low contrast on a Market filter label",
    meta: "Market · Web · Updated Sep 2, 2026",
    status: { icon: "icon-check", label: "Resolved", bg: C.chip, color: C.brandDeep },
  },
];

/** Section - 07 · KNOWN ISSUES — status filter pills + a 4-item issue list. */
export default function KnownIssues() {
  return (
    <section className="w-full px-5 py-10 lg:px-[105px] lg:py-14" style={{ backgroundColor: C.panel }}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5">
        <div className="flex flex-col gap-2.5 lg:gap-[11px] lg:max-w-[544px]">
          <h2 className="text-[26px] font-extrabold tracking-[-0.26px] lg:text-4xl lg:tracking-[-0.36px]" style={{ color: C.brandDeep }}>
            Known issues and workarounds
          </h2>
          <p className="text-base leading-[25.6px] lg:text-[17px] lg:leading-[27.2px]" style={{ color: C.muted }}>
            Problems we know about, and what to try meanwhile.
          </p>
        </div>

        <div className="flex flex-wrap items-start gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.label}
              type="button"
              className="flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold"
              style={
                filter.active
                  ? { backgroundColor: C.brand, borderColor: C.brand, color: "#fff" }
                  : { backgroundColor: "#fff", borderColor: C.line, color: C.ink }
              }
            >
              {filter.icon && <Image src={`/support&developers-accessibility-support/${filter.icon}.webp`} alt="" width={16} height={16} />}
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3.5">
          {ISSUES.map((issue) => (
            <div key={issue.title} className="rounded-[20px] border bg-white px-5 py-[18px]" style={{ borderColor: C.line }}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: issue.iconBg }}
                >
                  <Image src={`/support&developers-accessibility-support/${issue.icon}.webp`} alt="" width={22} height={22} />
                </span>
                <div className="flex flex-1 flex-col gap-0.5">
                  <p className="text-[16.5px] font-bold leading-[26.4px]" style={{ color: C.brandDeep }}>
                    {issue.title}
                  </p>
                  <p className="text-[13.5px] leading-[21.6px]" style={{ color: C.muted }}>
                    {issue.meta}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <span
                    className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-semibold"
                    style={{ backgroundColor: issue.status.bg, borderColor: C.line, color: issue.status.color }}
                  >
                    <Image src={`/support&developers-accessibility-support/${issue.status.icon}.webp`} alt="" width={16} height={16} />
                    {issue.status.label}
                  </span>
                  <Image src="/support&developers-accessibility-support/icon-chevron-down.webp" alt="" width={20} height={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
