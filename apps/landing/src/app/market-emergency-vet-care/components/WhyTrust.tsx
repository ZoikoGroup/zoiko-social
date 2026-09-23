import { BadgeCheck, CalendarClock, PhoneCall, Search, type LucideIcon } from "lucide-react";
import { C } from "./theme";

const POINTS: readonly { icon: LucideIcon; title: string; body: string }[] = [
  { icon: BadgeCheck, title: "Verified professionals", body: "Identity and background verified. No unverified listings shown." },
  { icon: Search, title: "Manual search first", body: "Location permission never required. You control your search." },
  { icon: PhoneCall, title: "Clear contact info", body: "Real phone numbers and website links. No redirects or sign-in walls." },
  { icon: CalendarClock, title: "No false urgency", body: "Honest availability and hours. No fabricated “open now” claims." },
];

export default function WhyTrust() {
  return (
    <section className="px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20 xl:px-20" style={{ background: C.panel }}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 sm:gap-12 xl:px-6">
        <h2 className="text-xl font-bold leading-8 sm:text-2xl sm:leading-10" style={{ color: C.ink }}>
          Why trust Zoiko&apos;s listings?
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {POINTS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-2 rounded-[20px] bg-white px-3 py-5 text-center sm:px-6 sm:py-6"
              style={{ border: `1px solid ${C.line}` }}
            >
              <Icon size={32} strokeWidth={1.5} aria-hidden style={{ color: C.brand }} />
              <h3 className="pt-1 text-sm font-bold leading-6 sm:text-base" style={{ color: C.ink }}>
                {title}
              </h3>
              <p className="max-w-[230px] text-xs leading-5" style={{ color: C.muted }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
