import Image from "next/image";
import { C } from "./theme";

/*
 * The mobile frame (node 1274:5898) ships this list's report title, product
 * scope and evaluation date as unresolved merge tags (`{{artifact_title}}`,
 * `{{product_scope}}`, `{{evaluated_on}}`) rather than literal copy, while
 * the desktop frame (node 1274:4850) spells out the same two reports in
 * full. Both breakpoints render the desktop frame's literal copy here —
 * same judgment call as VerifiedCapabilities.tsx and WaysToReachUs.tsx.
 */
const REPORTS = [
  {
    icon: "icon-file",
    iconBg: C.chip,
    title: "Accessibility Conformance Report (VPAT® 2.5, WCAG 2.2 AA)",
    badge: { icon: "icon-check-circle", label: "Current" },
    covers: "Web app, iOS and Android apps",
    date: "12 August 2026",
    actions: [
      { icon: "icon-eye-outline", label: "Read online" },
      { icon: "icon-download", label: "Download" },
    ],
  },
  {
    icon: "icon-file-replaced",
    iconBg: C.panel,
    title: "Accessibility Conformance Report (VPAT® 2.4, WCAG 2.2 AA)",
    badge: { icon: "icon-x-badge", label: "Replaced" },
    note: "See the current version above",
    actions: [{ icon: "icon-eye-outline", label: "Read archived version" }],
  },
];

/** Section - 10 · ACCESSIBILITY REPORTS — "Accessibility reports", a formal-document list. */
export default function AccessibilityReports() {
  return (
    <section className="w-full bg-white px-5 py-10 lg:px-[105px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 lg:gap-10">
        <div className="flex flex-col items-start gap-2.5 lg:gap-[11px]">
          <span
            className="rounded-full border border-dashed px-2.5 py-[3px] text-xs font-semibold"
            style={{ borderColor: C.orange, backgroundColor: C.orangeFill, color: C.orangeTextDark }}
          >
            Published only when approved
          </span>
          <h2 className="text-[26px] font-extrabold tracking-[-0.26px] lg:text-4xl lg:tracking-[-0.36px]" style={{ color: C.brandDeep }}>
            Accessibility reports
          </h2>
          <p className="text-base leading-[25.6px] lg:text-[17px] lg:leading-[27.2px]" style={{ color: C.muted }}>
            Formal documents, with exactly what each one covers.
          </p>
        </div>

        <div className="flex flex-col gap-3.5">
          {REPORTS.map((report) => (
            <div key={report.title} className="rounded-[20px] border bg-white p-5 lg:px-[22px] lg:py-5" style={{ borderColor: C.line }}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-[18px]">
                <span
                  className="flex size-14 shrink-0 items-center justify-center rounded-2xl border"
                  style={{ backgroundColor: report.iconBg, borderColor: report.iconBg === C.panel ? C.line : "transparent" }}
                >
                  <Image src={`/support&developers-accessibility-support/${report.icon}.webp`} alt="" width={18} height={18} />
                </span>

                <div className="flex flex-1 flex-col gap-2">
                  <p
                    className="w-fit rounded-lg border border-dashed px-2 py-1 text-[13.5px] font-bold"
                    style={{ borderColor: C.placeholder, backgroundColor: C.panel, color: C.brandDeep }}
                  >
                    {report.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{ backgroundColor: report.badge.icon === "icon-check-circle" ? C.chip : C.panel, color: report.badge.icon === "icon-check-circle" ? C.brandDeep : C.muted }}
                    >
                      <Image src={`/support&developers-accessibility-support/${report.badge.icon}.webp`} alt="" width={16} height={16} />
                      {report.badge.label}
                    </span>
                    {report.covers && (
                      <span
                        className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[13px] font-semibold"
                        style={{ borderColor: C.line, backgroundColor: C.panel, color: C.ink }}
                      >
                        Covers
                        <span
                          className="rounded-lg border border-dashed px-2 py-0.5 text-[13.5px] font-bold"
                          style={{ borderColor: C.placeholder, backgroundColor: C.panel, color: C.brandDeep }}
                        >
                          {report.covers}
                        </span>
                      </span>
                    )}
                    {report.date && (
                      <span
                        className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[13px] font-semibold"
                        style={{ borderColor: C.line, backgroundColor: C.panel, color: C.ink }}
                      >
                        <Image src="/support&developers-accessibility-support/icon-calendar.webp" alt="" width={14} height={14} />
                        <span
                          className="rounded-lg border border-dashed px-2 py-0.5 text-[13.5px] font-bold"
                          style={{ borderColor: C.placeholder, backgroundColor: C.panel, color: C.brandDeep }}
                        >
                          {report.date}
                        </span>
                      </span>
                    )}
                    {report.note && (
                      <span
                        className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[13px] font-semibold"
                        style={{ borderColor: C.line, backgroundColor: C.panel, color: C.ink }}
                      >
                        {report.note}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {report.actions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      className="flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold"
                      style={{ borderColor: C.line, color: C.ink }}
                    >
                      <Image src={`/support&developers-accessibility-support/${action.icon}.webp`} alt="" width={20} height={20} />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
