import Image from "next/image";

// Figma color tokens
const INK_COLOR = "#073B47";          // Headings & titles: Firefly
const NEVADA_COLOR = "#646E73";       // Subtitle & Descriptions: Nevada
const SECTION_BG = "#F7F8F9";         // Section bg: Athens Gray

const SUPPORT_CARDS: {
  icon: string;
  title: string;
  description: React.ReactNode;
}[] = [
  {
    icon: "/platform-premium-plans-production/image 149.png",
    title: "Priority Support",
    description: (
      <>
        Get responses to questions within 24 hours from our
        <br />
        dedicated support team.
      </>
    ),
  },
  {
    icon: "/platform-premium-plans-production/image 150.png",
    title: "Exclusive Guides",
    description: (
      <>
        Access premium guides on verification, fundraising,
        <br />
        and community growth.
      </>
    ),
  },
  {
    icon: "/platform-premium-plans-production/image 151.png",
    title: "Early Access",
    description: (
      <>
        Be first to test new features and provide feedback on
        <br />
        product roadmap.
      </>
    ),
  },
];

/**
 * "Premium Member Support" — 3 benefit cards with Geyser border (#DCEAEE).
 */
export default function MemberSupport() {
  return (
    <section
      className="w-full px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
      style={{ backgroundColor: SECTION_BG }}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-10">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h2
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ color: INK_COLOR }}
          >
            Premium Member Support
          </h2>
          <p
            className="max-w-2xl text-base leading-7"
            style={{ color: NEVADA_COLOR }}
          >
            We&apos;re here to help you succeed. Premium members get priority support and exclusive
            <br className="hidden sm:inline" />
            resources.
          </p>
        </div>

        {/* 3 Equal-width Cards with Geyser border */}
        <div className="grid w-full grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {SUPPORT_CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-start rounded-[24px] border border-[#DCEAEE] bg-white p-8 shadow-[0px_1px_3px_0px_rgba(7,59,71,0.06)] transition-shadow hover:shadow-md"
            >
              {/* Icon */}
              <div className="flex h-10 w-10 items-center justify-start">
                <Image
                  src={card.icon}
                  alt={card.title}
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <p
                className="pt-5 text-base font-bold"
                style={{ color: INK_COLOR }}
              >
                {card.title}
              </p>

              {/* Description */}
              <p
                className="pt-2 text-xs leading-5"
                style={{ color: NEVADA_COLOR }}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}