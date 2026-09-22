import { BadgeCheck, Heart, Lock, MessageSquareText, Shield, TriangleAlert } from "lucide-react";
import { APP_LINKS, appUrl } from "@/lib/app-links";
import { C } from "./theme";

const TRUST = [
  {
    icon: BadgeCheck,
    title: "What instructor verification means",
    body: "It confirms approved identity and scope information — never a guarantee of teaching quality or outcome.",
  },
  {
    icon: MessageSquareText,
    title: "Attendance isn’t a credential",
    body: "Attendance or completion does not by itself grant a license, certification or professional competency.",
  },
  {
    icon: TriangleAlert,
    title: "Hands-on participation is limited",
    body: "Limited by event safety, animal-welfare, age and professional-scope rules — never assumed from a workshop’s title.",
    highlight: true,
  },
  {
    icon: Heart,
    title: "Animal welfare comes first",
    body: "Any animal participation follows welfare-first handling, environment, and safety conditions set by the organizer.",
  },
  {
    icon: Lock,
    title: "Not medical advice",
    body: "Health and first-aid sessions cover general awareness and prevention — never diagnosis, prescribing, or a substitute for veterinary care.",
  },
  {
    icon: Shield,
    title: "Report an event or professional concern",
    body: "Available on every workshop — content, animal-welfare, and professional-scope concerns route to the right team.",
    link: { label: "Report a concern >", href: APP_LINKS.safety },
  },
] as const;

export function TrustPanel() {
  return (
    <section className="mt-16 rounded-3xl p-5 sm:p-8" style={{ background: C.chip, border: `1px solid ${C.line}` }}>
      <h2 className="flex items-center gap-2.5 text-lg font-extrabold sm:text-xl" style={{ color: C.ink }}>
        <Shield size={18} strokeWidth={2} />
        Trust &amp; safety
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TRUST.map((t) => {
          const Icon = t.icon;
          const warm = "highlight" in t;
          return (
            <div
              key={t.title}
              className="rounded-[20px] p-5"
              style={
                warm
                  ? { background: C.chipWarm, border: `1px solid ${C.warmBright}` }
                  : { background: "#fff", border: `1px solid ${C.line}` }
              }
            >
              <span
                className="flex size-9 items-center justify-center rounded-lg"
                style={warm ? { background: "#fff", color: C.warm } : { background: C.chip, color: C.inkDeep }}
              >
                <Icon size={15} strokeWidth={2} />
              </span>
              <h3 className="mt-4 text-sm font-bold" style={{ color: C.ink }}>
                {t.title}
              </h3>
              <p className="mt-1.5 text-xs leading-5" style={{ color: C.muted }}>
                {t.body}
              </p>
              {"link" in t && (
                <a
                  href={t.link.href}
                  className="mt-3 inline-block text-xs font-bold hover:underline"
                  style={{ color: C.brand }}
                >
                  {t.link.label}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

const STEPS = [
  { title: "Find a workshop", body: "Filter by topic, level, mode, and animal participation." },
  {
    title: "Review the details",
    body: "Learning outcomes, prerequisites, instructor context, and safety rules — before you register.",
  },
  { title: "Register", body: "Confirm your spot, or join the waitlist if a session is full." },
  { title: "Attend & learn", body: "Follow the organizer’s on-site or online guidance and safety rules." },
] as const;

export function HowItWorks() {
  return (
    <section className="pt-16">
      <h2 className="text-center text-2xl font-extrabold sm:text-3xl" style={{ color: C.ink }}>
        How it works
      </h2>
      <ol className="grid gap-8 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {STEPS.map((s, i) => (
          <li key={s.title} className="text-center">
            <span
              className="mx-auto flex size-10 items-center justify-center rounded-full text-sm font-extrabold"
              style={{ background: C.chip, color: C.inkDeep }}
            >
              {i + 1}
            </span>
            <h3 className="mt-4 text-sm font-bold" style={{ color: C.ink }}>
              {s.title}
            </h3>
            <p className="mx-auto mt-1.5 max-w-[300px] text-xs leading-5" style={{ color: C.muted }}>
              {s.body}
            </p>
          </li>
        ))}
      </ol>

      <div
        className="mt-12 flex flex-col gap-4 rounded-[20px] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
        style={{ border: `1px dashed ${C.line}` }}
      >
        <div className="flex items-start gap-4">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{ background: C.chip, color: C.inkDeep }}
          >
            <MessageSquareText size={18} strokeWidth={2} />
          </span>
          <div>
            <p className="text-sm font-bold" style={{ color: C.ink }}>
              A professional or organization?
            </p>
            <p className="mt-1 text-xs leading-5" style={{ color: C.muted }}>
              Host a workshop with clear learning outcomes and welfare-first
              participation rules. Professional verification is reviewed
              separately from event publishing.
            </p>
          </div>
        </div>
        <a
          href={appUrl("/events")}
          className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold transition hover:bg-neutral-50"
          style={{ color: C.ink, border: `1px solid ${C.line}` }}
        >
          Host a Workshop
        </a>
      </div>
    </section>
  );
}
