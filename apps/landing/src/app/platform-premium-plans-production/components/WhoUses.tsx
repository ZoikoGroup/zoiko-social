import Image from "next/image";

// Figma color tokens
const INK_COLOR = "#073B47";      // Headings & titles: Firefly
const NEVADA_COLOR = "#646E73";   // Descriptions: Nevada

const AUDIENCES: {
  icon: string;
  title: string;
  description: React.ReactNode;
}[] = [
  {
    icon: "/platform-premium-plans-production/image 145.png",
    title: "Veterinarians",
    description: (
      <>
        Build client trust with verified
        <br />
        professional badge and unlimited
        <br />
        consultations
      </>
    ),
  },
  {
    icon: "/platform-premium-plans-production/image 146.png",
    title: "Rescue Organizations",
    description: (
      <>
        Use fundraising toolkit + org
        <br />
        verification to amplify impact and
        <br />
        donations
      </>
    ),
  },
  {
    icon: "/platform-premium-plans-production/image 148.png",
    title: "Trainers & Groomers",
    description: (
      <>
        Enhanced media for portfolios +
        <br />
        advanced privacy for client
        <br />
        information
      </>
    ),
  },
  {
    icon: "/platform-premium-plans-production/image 149.png",
    title: "Community Leaders",
    description: (
      <>
        Ad-free experience + moderation
        <br />
        tools for growing engaged
        <br />
        communities
      </>
    ),
  },
];

/**
 * "Who Uses Premium?" — 4 audience cards matching Figma text wrapping and spacing.
 */
export default function WhoUses() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12">
        {/* Section Heading */}
        <h2
          className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: INK_COLOR }}
        >
          Who Uses Premium?
        </h2>

        {/* 4 Equal-width Cards with Geyser border (#DCEAEE) */}
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map((audience) => (
            <div
              key={audience.title}
              className="flex flex-col items-center rounded-[24px] border border-[#DCEAEE] bg-white p-8 shadow-[0px_1px_3px_0px_rgba(7,59,71,0.06)] transition-shadow hover:shadow-md"
            >
              {/* Icon Container with fixed height */}
              <div className="flex h-14 w-14 items-center justify-center">
                <Image
                  src={audience.icon}
                  alt={audience.title}
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <p
                className="pt-5 text-center text-base font-bold"
                style={{ color: INK_COLOR }}
              >
                {audience.title}
              </p>

              {/* Multi-line Description */}
              <p
                className="pt-2 text-center text-xs leading-5"
                style={{ color: NEVADA_COLOR }}
              >
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}