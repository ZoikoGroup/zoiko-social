import Image from "next/image";
import { C } from "./theme";

/*
 * The Figma mobile frame ships this card's "Hours" / "Languages" / "Needs"
 * rows and the approved-channel label as unresolved merge tags
 * (`{{channel_hours}}`, `{{channel_languages}}`, `{{requirements}}`,
 * `{{approved_channel}}`) rather than literal copy — they're template slots
 * a real integration would fill per channel. Rendering the raw `{{...}}`
 * tokens would look broken, so — same judgment call as ForumFaq.tsx on the
 * community-forums page — they're written here as plausible resting-state
 * copy instead of pulled verbatim.
 */
const CHANNELS = [
  {
    icon: "icon-form",
    title: "Web request",
    status: { icon: "icon-check", label: "Available", tone: "solid" as const },
    hours: "Mon–Fri, 9am–6pm ET",
    languages: "English, Spanish",
    needs: "None",
    cta: null,
    footnote: null,
  },
  {
    icon: "icon-lock",
    title: "Live chat",
    status: { icon: "icon-lock", label: "Sign-in required", tone: "outline" as const },
    hours: "Mon–Fri, 9am–6pm ET",
    languages: "English",
    needs: "Signed-in account",
    cta: "Sign in to use",
    footnote: null,
  },
  {
    icon: "icon-inbox",
    title: "Phone support",
    status: { icon: "icon-clock", label: "Unavailable right now", tone: "dashed" as const },
    hours: "Mon–Fri, 9am–6pm ET",
    languages: "English",
    needs: "Account details",
    cta: null,
    footnote: "Use the web request instead.",
  },
];

/**
 * Section - 06 · WAYS TO REACH US — mobile-only (node 1274:3618, no desktop
 * counterpart at this frame position). Three channel cards — Web request
 * (available), Live chat (sign-in required) and Phone support (unavailable)
 * — each with hours/languages/needs. Rendered lg:hidden between "Start a
 * contact request" and "Someone in danger?" to match the mobile frame's
 * vertical order.
 */
export default function WaysToReachUs() {
  return (
    <section className="w-full px-5 pb-14 pt-7 lg:hidden" style={{ backgroundColor: C.panel }}>
      <div className="mx-auto flex w-full flex-col gap-10">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-[26px] font-extrabold tracking-[-0.26px]" style={{ color: C.brandDeep }}>
            Ways to reach us
          </h2>
          <p className="text-base leading-[27.2px]" style={{ color: C.muted }}>
            Only approved, currently available options appear, each with what it needs.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {CHANNELS.map((channel) => (
            <article
              key={channel.title}
              className="flex flex-col gap-3.5 rounded-[28px] border p-6"
              style={{
                borderColor: C.line,
                backgroundColor: channel.status.tone === "dashed" ? C.panel : "#fff",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="flex size-11 items-center justify-center rounded-xl border"
                  style={{
                    backgroundColor: channel.status.tone === "dashed" ? C.panel : C.chip,
                    borderColor: channel.status.tone === "dashed" ? C.line : "transparent",
                  }}
                >
                  <Image src={`/support&developers-contact-us/${channel.icon}.webp`} alt="" width={22} height={22} />
                </span>
                <span
                  className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[13px] font-semibold"
                  style={{
                    borderColor: channel.status.tone === "outline" ? C.line : "transparent",
                    borderStyle: channel.status.tone === "dashed" ? "dashed" : "solid",
                    backgroundColor: channel.status.tone === "solid" ? C.chip : channel.status.tone === "dashed" ? C.panel : "#fff",
                    color: channel.status.tone === "dashed" ? C.muted : C.brandDeep,
                  }}
                >
                  <Image src={`/support&developers-contact-us/${channel.status.icon}.webp`} alt="" width={16} height={16} />
                  {channel.status.label}
                </span>
              </div>

              <p className="text-[17px] font-bold leading-[27.2px]" style={{ color: C.brandDeep }}>
                {channel.title}
              </p>

              <dl className="flex flex-col gap-2">
                {[
                  ["Hours", channel.hours],
                  ["Languages", channel.languages],
                  ["Needs", channel.needs],
                ].map(([term, detail]) => (
                  <div key={term} className="flex items-start gap-2">
                    <dt className="w-[100px] shrink-0 text-sm font-semibold" style={{ color: C.muted }}>
                      {term}
                    </dt>
                    <dd
                      className="rounded-lg border border-dashed px-2 py-1 text-[13.5px]"
                      style={{ borderColor: C.placeholder, backgroundColor: C.panel, color: C.brandDeep }}
                    >
                      {detail}
                    </dd>
                  </div>
                ))}
              </dl>

              {channel.cta && (
                <button
                  type="button"
                  className="flex min-h-10 items-center justify-center gap-2 self-start rounded-xl border px-4 text-sm font-semibold"
                  style={{ borderColor: C.line, color: C.ink }}
                >
                  <Image src="/support&developers-contact-us/icon-user.webp" alt="" width={20} height={20} />
                  {channel.cta}
                </button>
              )}
              {channel.footnote && (
                <p className="text-[13px] font-medium" style={{ color: C.muted }}>
                  {channel.footnote}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
