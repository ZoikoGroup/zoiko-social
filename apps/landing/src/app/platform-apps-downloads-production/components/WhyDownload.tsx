import Image from "next/image";

// Figma color tokens
const INK_COLOR = "#073B47";          // Headings & card titles: Firefly
const NEVADA_COLOR = "#646E73";       // Descriptions: Nevada

const CARDS = [
  {
    title: "Sync Across Devices",
    description: (
      <>
        Start on your phone, continue on your desktop. Your
        <br />
        account, preferences, and community memberships
        <br />
        sync instantly.
      </>
    ),
    icon: (
      <Image
        src="/platform-apps-downloads-production/image 144.png"
        alt="Sync Across Devices"
        width={36}
        height={36}
        className="size-9 object-contain"
      />
    ),
  },
  {
    title: "Push Notifications",
    description: (
      <>
        Stay informed with real-time alerts for new
        <br />
        communities, animal rescues, events, and messages
        <br />
        from your network.
      </>
    ),
    icon: (
      <Image
        src="/platform-apps-downloads-production/image 143.png"
        alt="Push Notifications"
        width={36}
        height={36}
        className="size-9 object-contain"
      />
    ),
  },
  {
    title: "Offline Access",
    description: (
      <>
        Read saved content, browse your communities, and
        <br />
        prepare messages offline. Sync automatically when
        <br />
        you&apos;re back online.
      </>
    ),
    icon: (
      <Image
        src="/platform-apps-downloads-production/image 142.png"
        alt="Offline Access"
        width={36}
        height={36}
        className="size-9 object-contain"
      />
    ),
  },
] as const;

/**
 * "Why Download Zoiko Social?" — 3 feature cards matching Figma.
 */
export default function WhyDownload() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-28 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10">
        {/* Section Heading */}
        <h2
          className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: INK_COLOR }}
        >
          Why Download Zoiko Social?
        </h2>

        {/* 3 Equal-width Cards */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-center rounded-[24px] border border-[#DCEAEE] bg-white p-8 shadow-[0px_1px_3px_0px_rgba(7,59,71,0.06)] transition hover:shadow-md"
            >
              {/* Icon Image */}
              <div className="flex size-9 items-center justify-center">
                {card.icon}
              </div>

              {/* Title */}
              <p
                className="pt-4 text-center text-base font-bold"
                style={{ color: INK_COLOR }}
              >
                {card.title}
              </p>

              {/* 3-line Description */}
              <p
                className="pt-2 text-center text-xs leading-5"
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