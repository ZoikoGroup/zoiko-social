import Image from "next/image";

// Figma color tokens
const INK_COLOR = "#073B47";          // Headings & Quote text
const MOSQUE_COLOR = "#066879";       // Button & Author: Mosque
const NEVADA_COLOR = "#646E73";       // Subtitle & Descriptions: Nevada
const QUOTE_BG_COLOR = "#F0F7F9";     // Black Squeeze pale cyan wash
const BORDER_COLOR = "#DCEAEE";       // Card border: Geyser

const CARDS: {
  title: string;
  description: React.ReactNode;
  quote: React.ReactNode;
  author: string;
  image: string;
  emoji: string | null;
}[] = [
  // ─── ROW 1 ───
  {
    title: "Ad-Free Feed",
    description: (
      <>
        Enjoy a clean, uninterrupted feed. No
        <br />
        ads, just content that matters to you.
      </>
    ),
    quote: (
      <>
        “Finally I can focus on the animals
        <br />
        and communities I care about.”
      </>
    ),
    author: "— Jamie C.",
    image: "/platform-premium-plans-production/Background (1).png",
    emoji: null,
  },
  {
    title: "Advanced Privacy",
    description: (
      <>
        Granular controls over who sees your
        <br />
        content and how you&apos;re discovered.
      </>
    ),
    quote: (
      <>
        “Complete control over my digital
        <br />
        presence — exactly what I needed.”
      </>
    ),
    author: "— Alex R.",
    image: "/platform-premium-plans-production/Background (2).png",
    emoji: null,
  },
  {
    title: "Larger Group Calls",
    description: (
      <>
        Host unlimited group video and audio
        <br />
        calls with your entire community.
      </>
    ),
    quote: (
      <>
        “Our rescue team now has amazing
        <br />
        virtual meetings with no limits.”
      </>
    ),
    author: "— Sarah M.",
    image: "/platform-premium-plans-production/Background (3).png",
    emoji: null,
  },
  {
    title: "Enhanced Media",
    description: (
      <>
        Upload larger files, higher quality
        <br />
        videos, and more storage.
      </>
    ),
    quote: (
      <>
        “Better video quality means better
        <br />
        storytelling for my animals.”
      </>
    ),
    author: "— Marcus J.",
    image: "/platform-premium-plans-production/Background (4).png",
    emoji: null,
  },

  // ─── ROW 2 ───
  {
    title: "Advanced Moderation",
    description: (
      <>
        Powerful controls to manage
        <br />
        communities.
      </>
    ),
    quote: (
      <>
        “Finally have the tools to moderate
        <br />
        my community effectively.”
      </>
    ),
    author: "— Lisa T.",
    image: "/platform-premium-plans-production/Background (5).png",
    emoji: null,
  },
  {
    title: "Verified Professional",
    description: (
      <>
        Get a verified badge and stand out as a
        <br />
        trusted professional in your field.
      </>
    ),
    quote: (
      <>
        “The verified badge built immediate
        <br />
        trust with my new clients.”
      </>
    ),
    author: "— Dr. Elena L.",
    image: "/platform-premium-plans-production/Background (6).png",
    emoji: null,
  },
  {
    title: "Verified Organization",
    description: (
      <>
        Official verification for shelters,
        <br />
        rescues, nonprofits, and organizations.
      </>
    ),
    quote: (
      <>
        “Official status helps donors find us
        <br />
        and trust our mission.”
      </>
    ),
    author: "— Hope Rescue Team",
    image: "/platform-premium-plans-production/Background (7).png",
    emoji: null,
  },
  {
    title: "Fundraising Toolkit",
    description: (
      <>
        Tools to support fundraising
        <br />
        campaigns for your organization.
      </>
    ),
    quote: (
      <>
        “Our fundraising capacity increased
        <br />
        10x with these tools.”
      </>
    ),
    author: "— David P.",
    image: "/platform-premium-plans-production/Background (8).png",
    emoji: null,
  },
];

export default function WhyPremium() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h2
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ color: INK_COLOR }}
          >
            Why Go Premium?
          </h2>
          <p
            className="max-w-2xl text-base leading-7"
            style={{ color: NEVADA_COLOR }}
          >
            Premium membership transforms your Zoiko Social experience with 8 powerful
            <br className="hidden sm:inline" />
            capabilities designed for professionals, organizations, and serious community
            <br className="hidden sm:inline" />
            members.
          </p>
        </div>

        {/* 4x2 Grid of Feature Cards */}
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col justify-between overflow-hidden rounded-[24px] bg-white shadow-[0px_1px_3px_0px_rgba(7,59,71,0.06)] transition hover:shadow-md"
              style={{ border: `1px solid ${BORDER_COLOR}` }}
            >
              <div className="flex flex-col">
                {/* Thumbnail Image */}
                {card.emoji ? (
                  <div className="flex h-44 items-center justify-center bg-neutral-50">
                    <span className="text-6xl">{card.emoji}</span>
                  </div>
                ) : (
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Title & Description */}
                <div className="flex flex-col gap-1.5 p-5 pb-3">
                  <h3
                    className="text-base font-bold leading-snug"
                    style={{ color: INK_COLOR }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-xs leading-5"
                    style={{ color: NEVADA_COLOR }}
                  >
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Quote Chip & Action Button */}
              <div className="flex flex-col gap-3 px-5 pb-5">
                <div
                  className="rounded-[14px] p-3.5"
                  style={{ backgroundColor: QUOTE_BG_COLOR }}
                >
                  <p
                    className="text-[11px] leading-[1.4] italic"
                    style={{ color: INK_COLOR }}
                  >
                    {card.quote}
                  </p>
                  <p
                    className="pt-1.5 text-[11px] font-bold"
                    style={{ color: MOSQUE_COLOR }}
                  >
                    {card.author}
                  </p>
                </div>

                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-xl py-3 text-center text-xs font-bold text-white shadow-sm transition hover:opacity-90"
                  style={{ backgroundColor: MOSQUE_COLOR }}
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}