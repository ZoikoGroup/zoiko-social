import {
  Heart,
  BadgeCheck,
  MessageSquare,
  Lock,
  MessageCircle,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { IconFeature, SectionHeading } from "./primitives";

const PRINCIPLES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Heart,
    title: "Animal Welfare First",
    body: "Every decision starts with what's best for animal welfare and the people who care for them.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Information",
    body: "News and sources are checked before they reach the community — accuracy over speed.",
  },
  {
    icon: MessageSquare,
    title: "Profanity-Free Spaces",
    body: "Automated and human moderation keep conversations respectful and family-friendly.",
  },
  {
    icon: Lock,
    title: "Privacy by Default",
    body: "People control what they share, and we protect it accordingly.",
  },
  {
    icon: MessageCircle,
    title: "Transparent Enforcement",
    body: "Moderation decisions follow a clear, published process — and can be appealed.",
  },
  {
    icon: Globe,
    title: "Global, Local Communities",
    body: "Spaces built around species, location, and purpose, wherever you are.",
  },
];

/** "What guides us" — the six principles. Anchored for the hero's second CTA. */
export default function PrinciplesSection() {
  return (
    <section
      id="principles"
      className="mx-auto max-w-[1280px] scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16 lg:py-20"
    >
      <SectionHeading
        title="What guides us"
        subtitle="The principles behind every product decision we make."
      />

      <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {PRINCIPLES.map((principle) => (
          <IconFeature key={principle.title} {...principle} />
        ))}
      </div>
    </section>
  );
}
