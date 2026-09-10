import { Shield, Lock, Smile, Eye, FileText, type LucideIcon } from "lucide-react";
import { APP_LINKS, appUrl } from "@/lib/app-links";
import { Band, IconFeature, SectionHeading } from "./primitives";

const PILLARS: {
  icon: LucideIcon;
  title: string;
  body: string;
  link: { label: string; href: string };
}[] = [
  {
    icon: Shield,
    title: "Safety",
    body: "Dedicated reporting channels and clear community standards protect animal welfare and respectful discourse.",
    link: { label: "Safety Center", href: APP_LINKS.safety },
  },
  {
    icon: Lock,
    title: "Privacy",
    body: "You control what you share, and we protect it in line with our published policy.",
    link: { label: "Privacy Policy", href: APP_LINKS.privacy },
  },
  {
    icon: Smile,
    title: "Community Standards",
    body: "Enforceable rules keep Zoiko Social respectful and profanity-free.",
    link: { label: "Community Standards", href: APP_LINKS.safety },
  },
  {
    icon: Eye,
    title: "Accessibility",
    body: "We're committed to an experience that works for everyone, including assistive technology users.",
    link: { label: "Accessibility Statement", href: appUrl("/accessibility") },
  },
  {
    icon: FileText,
    title: "Legal & Corporate",
    body: "Terms, policies, and corporate information are available for review at any time.",
    link: { label: "Legal Notices", href: APP_LINKS.terms },
  },
];

/** "Trust & responsibility" — five pillars, each linking to its own policy. */
export default function TrustSection() {
  return (
    <Band>
      <SectionHeading
        title="Trust & responsibility"
        subtitle="Safety, privacy, and accountability aren't features — they're how Zoiko Social is run."
      />

      <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((pillar) => (
          <IconFeature key={pillar.title} {...pillar} />
        ))}
      </div>
    </Band>
  );
}
