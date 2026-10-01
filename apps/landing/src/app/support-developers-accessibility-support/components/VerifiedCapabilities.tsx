import Image from "next/image";
import { C } from "./theme";

/*
 * The Figma mobile frame (node 1274:5450, no desktop counterpart at all —
 * confirmed absent by searching the desktop frame for this section's own
 * copy) ships this section's approved-statement, product-area, platform,
 * tested-with, last-checked and limitations fields as unresolved merge tags
 * (`{{approved_statement}}`, `{{product_scope}}`, `{{platform_scope}}`,
 * `{{tested_setup}}`, `{{validated_on}}`, `{{limitations}}`) rather than
 * literal copy — template slots a real conformance-testing pipeline would
 * fill per capability. Rendering the raw `{{...}}` tokens would look broken,
 * so — same judgment call as WaysToReachUs.tsx on the contact-us page —
 * plausible resting-state copy is written here instead of pulled verbatim.
 */
const CAPABILITIES = [
  {
    icon: "icon-keyboard-card",
    status: { icon: "icon-check-circle", label: "Current", tone: "solid" as const },
    approved: "Keyboard navigation",
    productArea: "Web app",
    platform: "Desktop browsers",
    testedWith: "Keyboard only, no mouse",
    lastChecked: "August 2026",
    limitations: "Some modal dialogs",
  },
  {
    icon: "icon-play-card",
    status: { icon: "icon-info-orange", label: "Limited scope", tone: "dashed" as const },
    approved: "Video captions",
    productArea: "Posts feed",
    platform: "iOS and Android apps",
    testedWith: "VoiceOver, TalkBack",
    lastChecked: "July 2026",
    limitations: "Auto-generated captions only",
  },
  {
    icon: "icon-text-issue",
    status: { icon: "icon-clock", label: "Under review", tone: "outline" as const },
    approved: "Screen reader labels",
    productArea: "Market listings",
    platform: "Web app",
    testedWith: "NVDA, JAWS",
    lastChecked: "September 2026",
    limitations: "Filter panel labeling",
  },
];

/**
 * Section - 06 · VERIFIED CAPABILITIES — mobile-only, "What's been tested".
 * Three test-result cards (Current / Limited scope / Under review), each
 * with a dashed-outline detail list and a "Limitations" callout.
 */
export default function VerifiedCapabilities() {
  return (
    <section className="w-full bg-white px-5 py-10 lg:hidden">
      <div className="mx-auto flex w-full flex-col gap-10">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-[26px] font-extrabold tracking-[-0.26px]" style={{ color: C.brandDeep }}>
            What&apos;s been tested
          </h2>
          <p className="text-base leading-[27.2px]" style={{ color: C.muted }}>
            Only checked, specific results appear here, with their limits beside them.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {CAPABILITIES.map((cap) => (
            <article
              key={cap.approved}
              className="flex flex-col gap-3.5 rounded-[28px] border bg-white p-6"
              style={{ borderColor: C.line }}
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl" style={{ backgroundColor: C.chip }}>
                  <Image src={`/support&developers-accessibility-support/${cap.icon}.webp`} alt="" width={22} height={22} />
                </span>
                <span
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: cap.status.tone === "solid" ? C.chip : cap.status.tone === "dashed" ? C.orangeFill : "#fff",
                    borderWidth: cap.status.tone === "outline" ? 1 : 0,
                    borderStyle: cap.status.tone === "outline" ? "dashed" : "solid",
                    borderColor: C.brand,
                    color: cap.status.tone === "dashed" ? C.orangeTextDark : C.brandDeep,
                  }}
                >
                  <Image src={`/support&developers-accessibility-support/${cap.status.icon}.webp`} alt="" width={16} height={16} />
                  {cap.status.label}
                </span>
              </div>

              <span
                className="w-fit rounded-lg border border-dashed px-2 py-1 text-[13.5px] font-bold"
                style={{ borderColor: C.placeholder, backgroundColor: C.panel, color: C.brandDeep }}
              >
                {cap.approved}
              </span>

              <dl className="flex flex-col gap-2.5">
                {[
                  ["Product area", cap.productArea],
                  ["Platform", cap.platform],
                  ["Tested with", cap.testedWith],
                  ["Last checked", cap.lastChecked],
                ].map(([term, detail]) => (
                  <div key={term} className="flex flex-col gap-1.5">
                    <dt className="text-sm font-semibold" style={{ color: C.muted }}>
                      {term}
                    </dt>
                    <dd
                      className="w-fit rounded-lg border border-dashed px-2 py-1 text-[13.5px]"
                      style={{ borderColor: C.placeholder, backgroundColor: C.panel, color: C.brandDeep }}
                    >
                      {detail}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="flex items-start gap-2.5 rounded-xl p-3.5" style={{ backgroundColor: C.orangeFill }}>
                <Image src="/support&developers-accessibility-support/icon-info.webp" alt="" width={16} height={16} className="mt-0.5 shrink-0" />
                <p className="text-sm" style={{ color: C.ink }}>
                  <span className="font-semibold">Limitations: </span>
                  <span
                    className="rounded-lg border border-dashed px-2 py-0.5 font-bold"
                    style={{ borderColor: C.placeholder, backgroundColor: C.panel, color: C.brandDeep }}
                  >
                    {cap.limitations}
                  </span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
