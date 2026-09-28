import Image from "next/image";

// Figma color tokens
const INK_COLOR = "#073B47";          // Headings & card titles: Firefly
const MOSQUE_COLOR = "#066879";       // Brand icons: Mosque
const NEVADA_COLOR = "#646E73";       // Descriptions: Nevada
const GEYSER_BORDER = "#DCEAEE";      // Card border: Geyser

/** Ringing Bell Icon matching Figma */
function BellIcon() {
  return (
    <svg
      className="size-9"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6C14.134 6 11 9.13401 11 13V18.5858L9.29289 20.2929C8.90237 20.6834 9.17887 21.35 9.73137 21.35H26.2686C26.8211 21.35 27.0976 20.6834 26.7071 20.2929L25 18.5858V13C25 9.13401 21.866 6 18 6Z"
        stroke={MOSQUE_COLOR}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 24C15.8 25.2 16.8 26 18 26C19.2 26 20.2 25.2 20.5 24"
        stroke={MOSQUE_COLOR}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Side vibration waves matching Figma */}
      <path
        d="M7 10C5.5 12 5.5 15 7 17"
        stroke={MOSQUE_COLOR}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M29 10C30.5 12 30.5 15 29 17"
        stroke={MOSQUE_COLOR}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
    icon: <BellIcon />,
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
              {/* Icon */}
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