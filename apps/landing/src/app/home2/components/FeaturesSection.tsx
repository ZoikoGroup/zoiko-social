import Image from "next/image";
import {
  Image as ImageIcon,
  Send,
  Users,
  MessageSquare,
  Heart,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { appUrl, APP_LINKS } from "@/lib/app-links";
import { IMAGES } from "./images";
import { C } from "./theme";
import { ArrowLink, Chip, SectionHeading } from "./primitives";

type Feature = {
  icon: LucideIcon;
  image: string;
  alt: string;
  title: string;
  body: string;
  chip: string;
  chipTone: "neutral" | "warm";
  cta: string;
  href: string;
};

const FEATURES: Feature[] = [
  {
    icon: ImageIcon,
    image: IMAGES.friendsWithDog,
    alt: "Laughing friends outdoors with their dog",
    title: "Post and Share",
    body: "Share photos, videos, stories, reels, and go live with your animal community.",
    chip: "Real-time moderation",
    chipTone: "neutral",
    cta: "Start Sharing",
    href: APP_LINKS.signUp,
  },
  {
    icon: Send,
    image: IMAGES.frenchieSweater,
    alt: "A French bulldog in a yellow sweater",
    title: "Message and Call",
    body: "Connect through DMs, group chats, and video calls with safe coordination tools.",
    chip: "Privacy controls",
    chipTone: "neutral",
    cta: "Open Messages",
    href: appUrl("/messages"),
  },
  {
    icon: Users,
    image: IMAGES.pug,
    alt: "A pug looking into the camera",
    title: "Build Communities",
    body: "Create and moderate communities by species, location, rescue work, or specialty.",
    chip: "Moderation dashboard",
    chipTone: "neutral",
    cta: "Create Community",
    href: APP_LINKS.communities,
  },
  {
    icon: MessageSquare,
    image: IMAGES.bigCatCollage,
    alt: "A row of big cats: jaguar, lion, leopard and cheetah",
    title: "Follow Verified News",
    body: "Stay informed with verified animal welfare conversation and rescue news.",
    chip: "Source verification",
    chipTone: "warm",
    cta: "Browse News",
    href: APP_LINKS.news,
  },
  {
    icon: Heart,
    image: IMAGES.familyAutumnDog,
    alt: "A family outdoors in autumn with their golden retriever",
    title: "Adopt and Foster",
    body: "Find adoptable animals through verified rescues and shelters with safety protections.",
    chip: "Anti-trafficking detection",
    chipTone: "neutral",
    cta: "View Animals",
    href: appUrl("/adoption"),
  },
  {
    icon: UserRound,
    image: IMAGES.vetWithRabbit,
    alt: "A veterinarian holding a rabbit in a clinic",
    title: "Find Professionals",
    body: "Connect with verified vets, trainers, groomers, and care specialists.",
    chip: "Professional verification",
    chipTone: "neutral",
    cta: "Browse Directory",
    href: appUrl("/professionals"),
  },
];

/** "What You Can Do Here" — the six-card capability grid. */
export default function FeaturesSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <SectionHeading title="What You Can Do Here" />

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className="flex flex-col overflow-hidden rounded-[20px] bg-white"
              style={{ border: `1px solid ${C.line}` }}
            >
              <div className="relative h-32">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                  className="object-cover"
                />
              </div>

              {/* The icon badge straddles the image's lower edge. */}
              <div className="relative px-6 pb-6">
                <div
                  className="absolute -top-5 flex size-11 items-center justify-center rounded-xl bg-white shadow-[0_1px_2px_rgba(7,59,71,0.06)]"
                  style={{ border: `1px solid ${C.line}` }}
                >
                  <Icon size={20} strokeWidth={1.7} style={{ color: C.brand }} />
                </div>

                <h3
                  className="mt-10 text-base font-bold leading-6"
                  style={{ color: C.inkDeep }}
                >
                  {feature.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-5"
                  style={{ color: C.muted }}
                >
                  {feature.body}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Chip tone={feature.chipTone}>{feature.chip}</Chip>
                  <ArrowLink href={feature.href}>{feature.cta}</ArrowLink>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
