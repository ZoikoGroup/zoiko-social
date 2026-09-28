// Figma color tokens
const INK_COLOR = "#073B47";          // Headings & titles: Firefly
const MOSQUE_COLOR = "#066879";       // Number text: Mosque
const NEVADA_COLOR = "#646E73";       // Descriptions: Nevada
const GEYSER_BORDER = "#DCEAEE";      // Card border: Geyser
const SECTION_BG = "#F7F8F9";         // Section bg: Athens Gray
const BADGE_BG = "#F0F7F9";           // Number circle bg: Black Squeeze

const STEPS: {
  number: string;
  title: string;
  description: React.ReactNode;
}[] = [
  {
    number: "1",
    title: "Choose Plan",
    description: (
      <>
        Pick monthly or annual billing. 7-day free trial
        <br />
        included.
      </>
    ),
  },
  {
    number: "2",
    title: "Complete Payment",
    description: (
      <>
        Secure checkout in seconds. Multiple payment
        <br />
        options.
      </>
    ),
  },
  {
    number: "3",
    title: "Enjoy Premium",
    description: (
      <>
        Instant access to all 8 capabilities. Start exploring
        <br />
        today.
      </>
    ),
  },
];

/**
 * "Get Started in 3 Simple Steps" — 3 numbered cards matching Figma.
 */
export default function GetStarted() {
  return (
    <section
      className="w-full px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
      style={{ backgroundColor: SECTION_BG }}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12">
        {/* Section Heading */}
        <h2
          className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: INK_COLOR }}
        >
          Get Started in 3 Simple Steps
        </h2>

        {/* 3 Equal-width Cards */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center rounded-[24px] bg-white p-8 shadow-[0px_1px_3px_0px_rgba(7,59,71,0.06)] transition-shadow hover:shadow-md"
              style={{ border: `1px solid ${GEYSER_BORDER}` }}
            >
              {/* Number Circle Badge */}
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: BADGE_BG }}
              >
                <span
                  className="text-2xl font-extrabold"
                  style={{ color: MOSQUE_COLOR }}
                >
                  {step.number}
                </span>
              </div>

              {/* Title */}
              <p
                className="pt-5 text-center text-base font-bold"
                style={{ color: INK_COLOR }}
              >
                {step.title}
              </p>

              {/* Description with exact line break */}
              <p
                className="pt-2 text-center text-xs leading-5"
                style={{ color: NEVADA_COLOR }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}