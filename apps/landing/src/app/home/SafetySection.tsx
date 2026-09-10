import { Shield, Bell, Clock, Check, Eye, UserPlus, type LucideIcon } from "lucide-react";
import { appUrl, APP_LINKS } from "@/lib/app-links";
import { C } from "./theme";
import { ArrowLink, SectionHeading } from "./primitives";

const PILLARS: {
  icon: LucideIcon;
  title: string;
  body: string;
  cta: string;
  href: string;
}[] = [
  {
    icon: Shield,
    title: "Community Standards",
    body: "Clear, enforceable rules that prioritize animal welfare and respectful discourse.",
    cta: "Read Standards",
    href: APP_LINKS.safety,
  },
  {
    icon: Bell,
    title: "Animal Welfare Reporting",
    body: "Dedicated channels for reporting abuse, exploitation, and welfare concerns.",
    cta: "Report Concerns",
    href: APP_LINKS.safety,
  },
  {
    icon: Clock,
    title: "Profanity-Free Policy",
    body: "Automated and human moderation ensuring respectful, family-friendly interactions.",
    cta: "Learn More",
    href: APP_LINKS.safety,
  },
  {
    icon: Check,
    title: "Transparency Reports",
    body: "Quarterly public reporting on moderation actions, appeals, and enforcement.",
    cta: "View Reports",
    href: APP_LINKS.docs,
  },
  {
    icon: Eye,
    title: "Child Safety Features",
    body: "Age-appropriate content filters and family account management tools.",
    cta: "Family Settings",
    href: appUrl("/settings"),
  },
  {
    icon: UserPlus,
    title: "Appeals Process",
    body: "Fair, transparent system for contesting moderation decisions.",
    cta: "Submit Appeal",
    href: APP_LINKS.safety,
  },
];

const ENFORCEMENT = [
  { title: "Warning", body: "First violation receives educational guidance." },
  { title: "Restriction", body: "Temporary limits on posting or interaction." },
  { title: "Suspension", body: "Time-limited account suspension." },
  { title: "Permanent Ban", body: "Severe or repeated violations result in removal." },
];

/** "Safety Is the Product" — six safety pillars over the enforcement ladder. */
export default function SafetySection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6 sm:pb-20 lg:pb-24">
      <SectionHeading
        title="Safety Is the Product"
        subtitle="Our commitment to protecting animals, people, and communities through transparent, institutional-grade moderation."
      />

      <div className="mt-14 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map(({ icon: Icon, title, body, cta, href }) => (
          <div key={title} className="flex flex-col items-center text-center">
            <div
              className="flex size-12 items-center justify-center rounded-xl"
              style={{ background: C.chip }}
            >
              <Icon size={20} strokeWidth={1.8} style={{ color: C.ink }} />
            </div>
            <h3
              className="mt-4 text-base font-bold leading-6"
              style={{ color: C.ink }}
            >
              {title}
            </h3>
            <p
              className="mt-2 max-w-[320px] text-sm leading-5"
              style={{ color: C.muted }}
            >
              {body}
            </p>
            <div className="mt-3">
              <ArrowLink href={href}>{cta}</ArrowLink>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-12 rounded-3xl px-5 py-10 sm:mt-16 sm:px-8 sm:py-12"
        style={{ background: C.chip, border: `1px solid ${C.line}` }}
      >
        <h3
          className="text-center text-xl font-bold leading-8"
          style={{ color: C.ink }}
        >
          Our Enforcement Model
        </h3>

        <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ENFORCEMENT.map((step, i) => (
            <li key={step.title} className="flex flex-col items-center text-center">
              <span
                className="flex size-9 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: C.brand }}
              >
                {i + 1}
              </span>
              <h4
                className="mt-3 text-base font-bold leading-6"
                style={{ color: C.ink }}
              >
                {step.title}
              </h4>
              <p
                className="mt-2 max-w-[200px] text-sm leading-5"
                style={{ color: C.muted }}
              >
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
