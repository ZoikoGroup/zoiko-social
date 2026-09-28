import Image from "next/image";

// Figma color tokens
const INK_COLOR = "#073B47";          // Section Heading: Firefly
const MOSQUE_COLOR = "#066879";       // Subheading & Checkmarks: Mosque
const NEVADA_COLOR = "#646E73";       // Descriptions & Checklist: Nevada
const GEYSER_BORDER = "#DCEAEE";      // Card border: Geyser
const SECTION_BG = "#F7F8F9";         // Section bg: Athens Gray

const CHECKLIST = [
  "Cleaner, uninterrupted feed — zero ads from day one",
  "Instant access to all 8 Premium capabilities",
  "Professional verification process starts immediately",
  "Full media upload and expanded storage access",
  "Unlimited group calls and team collaboration",
  "Advanced community moderation tools active",
  "Priority customer support for all questions",
];

/**
 * "See Premium in Action" — checklist + photo inside one large card matching Figma.
 */
export default function SeeInAction() {
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
          See Premium in Action
        </h2>

        {/* Large Feature Card */}
        <div
          className="flex flex-col items-center justify-between gap-10 rounded-[24px] bg-white p-8 shadow-[0px_1px_3px_0px_rgba(7,59,71,0.06)] lg:flex-row lg:p-12"
          style={{ border: `1px solid ${GEYSER_BORDER}` }}
        >
          {/* Left Column: Copy & Checklist */}
          <div className="flex flex-1 flex-col gap-3">
            <h3
              className="text-xl font-bold"
              style={{ color: MOSQUE_COLOR }}
            >
              Experience the Difference
            </h3>
            
            {/* Description with exact Figma break */}
            <p
              className="text-sm leading-6"
              style={{ color: NEVADA_COLOR }}
            >
              Premium members enjoy a completely transformed Zoiko Social experience.
              <br className="hidden sm:inline" />
              Here&apos;s what changes:
            </p>

            {/* Checklist */}
            <div className="flex flex-col gap-3 pt-3">
              {CHECKLIST.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span
                    className="shrink-0 text-sm font-bold"
                    style={{ color: MOSQUE_COLOR }}
                  >
                    ✓
                  </span>
                  <span
                    className="text-xs sm:text-sm font-normal"
                    style={{ color: NEVADA_COLOR }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Photo */}
          <div className="relative h-[280px] w-full shrink-0 overflow-hidden rounded-[20px] sm:h-[320px] lg:h-[340px] lg:w-[500px] xl:w-[542px]">
            <Image
              src="/platform-premium-plans-production/Background (12).png"
              alt="Experience the Difference"
              fill
              sizes="(min-width: 1024px) 542px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}