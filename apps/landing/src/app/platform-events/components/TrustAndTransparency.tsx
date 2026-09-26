import { TRUST_CARDS } from "./content";
import { C } from "./theme";

// Exact Figma color tokens
const ATHENS_GRAY_BG = "#F7F8F9";   // Section bg: Athens Gray
const BLACK_SQUEEZE_BG = "#F0F7F9"; // Card bg: Black Squeeze
const MOSQUE_COLOR = "#066879";     // Card border & title: Mosque
const NEVADA_COLOR = "#646E73";     // Body text: Nevada

// Card icons matching Figma
const CARD_ICONS: Record<string, React.ReactNode> = {
  "Source-backed": <span className="text-base leading-none">🛡️</span>,
  "Verified organizers": <span className="text-base font-extrabold leading-none">✓</span>,
  "Community standards": <span className="text-base leading-none">📋</span>,
};

// 2-line descriptions with <br /> tags matching Figma
const CARD_BODIES: Record<string, React.ReactNode> = {
  "Source-backed": (
    <>
      Every event comes from verified organizers. No
      <br />
      invented events, dates, or descriptions.
    </>
  ),
  "Verified organizers": (
    <>
      Event hosts are identified and verified. We clearly
      <br />
      show organizer name and status.
    </>
  ),
  "Community standards": (
    <>
      Events must follow our community standards. Safety
      <br />
      and welfare are non-negotiable.
    </>
  ),
};

/** Three pale-teal cards on the soft grey panel. */
export default function TrustAndTransparency() {
  return (
    <section
      className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
      style={{ backgroundColor: ATHENS_GRAY_BG }}
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col gap-2.5">
          <h2
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ color: C.ink }}
          >
            Trust and transparency
          </h2>
          <p className="text-base leading-7" style={{ color: NEVADA_COLOR }}>
            We&rsquo;re committed to accurate, source-backed event information and
            responsible community participation.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TRUST_CARDS.map((t) => (
            <div
              key={t.title}
              className="flex flex-col justify-start rounded-[20px] p-6 sm:p-7"
              style={{
                backgroundColor: BLACK_SQUEEZE_BG,
                border: `1px solid ${MOSQUE_COLOR}`,
              }}
            >
              <h3
                className="flex items-center gap-2 text-base font-bold"
                style={{ color: MOSQUE_COLOR }}
              >
                {CARD_ICONS[t.title] || null}
                <span>{t.title}</span>
              </h3>
              <p
                className="pt-2 text-xs sm:text-sm leading-6"
                style={{ color: NEVADA_COLOR }}
              >
                {CARD_BODIES[t.title] || t.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}