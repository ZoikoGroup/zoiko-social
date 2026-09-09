"use client";

import Link from "next/link";
import { APP_LINKS } from "@/lib/app-links";

// The professional and organization cards have no hrefs: verification,
// practice listings, fundraising and partnership have no route in the app
// yet, so those actions stay inert rather than pointing at a 404.
type Card = {
  title: string;
  description: string;
  primary: string;
  primaryHref?: string;
  secondary: string;
  secondaryHref?: string;
  tertiary: string;
  tertiaryHref?: string;
  primaryText: string;
};

const cards: Card[] = [
  {
    title: "For Individuals",
    description:
      "Connect, share, and care for animals in your life.",
    primary: "Join Free",
    primaryHref: APP_LINKS.signUp,
    secondary: "Explore Communities",
    secondaryHref: APP_LINKS.communities,
    tertiary: "Watch Animal News",
    tertiaryHref: APP_LINKS.news,
    primaryText: "text-sky-500",
  },
  {
    title: "For Professionals",
    description:
      "Reach clients and build your practice.",
    primary: "Get Verified",
    secondary: "List Your Practice",
    tertiary: "Start Professional Trial",
    primaryText: "text-sky-500",
  },
  {
    title: "For Organizations",
    description:
      "Amplify your mission and coordinate rescue work.",
    primary: "Verify Your Organization",
    secondary: "Fundraise Safely",
    tertiary: "Partner With ZoikoSocial",
    primaryText: "text-cyan-500",
  },
];

/** A link into the app, or a plain button when there is nowhere to go yet. */
function Action({
  href,
  className,
  children,
}: {
  href?: string;
  className: string;
  children: React.ReactNode;
}) {
  if (!href) {
    return <button className={className}>{children}</button>;
  }
  return (
    <Link href={href} className={`block text-center ${className}`}>
      {children}
    </Link>
  );
}

export default function CTASection() {
  return (
    <section className="bg-gradient-to-br from-[#0066FF] to-[#00B8A9] py-20">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="mb-14 text-center font-montserrat text-4xl font-extrabold text-white">
          A Social Network Built Around Life — Not Noise
        </h2>

        <div className="grid gap-8 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-white/20 bg-white/10 p-10 backdrop-blur-md"
            >
              <h3 className="text-center font-inter text-3xl font-bold text-white">
                {card.title}
              </h3>

              <p className="mt-5 text-center font-inter text-base leading-7 text-white/90">
                {card.description}
              </p>

              <Action
                href={card.primaryHref}
                className={`mt-10 w-full rounded-xl bg-white py-4 font-inter text-base font-bold ${card.primaryText} transition hover:scale-[1.02]`}
              >
                {card.primary}
              </Action>

              <Action
                href={card.secondaryHref}
                className="mt-5 w-full rounded-xl border border-white/30 py-4 font-inter text-base font-bold text-white transition hover:bg-white/10"
              >
                {card.secondary}
              </Action>

              <Action
                href={card.tertiaryHref}
                className="mt-5 w-full rounded-xl border border-white/30 py-4 font-inter text-base font-bold text-white transition hover:bg-white/10"
              >
                {card.tertiary}
              </Action>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}