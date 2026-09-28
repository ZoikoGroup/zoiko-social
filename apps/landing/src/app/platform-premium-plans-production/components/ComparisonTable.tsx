// Figma color tokens
const INK_COLOR = "#073B47";          // Headings & Capability names: Firefly
const MOSQUE_COLOR = "#066879";       // Premium column: Mosque
const NEVADA_COLOR = "#646E73";       // Free column text & dashes: Nevada
const HEADER_BG = "#F0F7F9";          // Header row bg: Black Squeeze
const BORDER_COLOR = "#DCEAEE";       // Row divider hairline: Geyser
const SECTION_BG = "#F7F8F9";         // Section bg: Athens Gray (same as previous section)

const ROWS = [
  {
    capability: "Ad-Free Feed",
    free: { text: "—", muted: true },
    premium: "✓",
  },
  {
    capability: "Advanced Privacy",
    free: { text: "Basic controls", muted: false },
    premium: "✓ Full controls",
  },
  {
    capability: "Group Calls",
    free: { text: "Up to 8 people", muted: false },
    premium: "✓ Unlimited",
  },
  {
    capability: "Enhanced Media",
    free: { text: "—", muted: true },
    premium: "✓ Full access",
  },
  {
    capability: "Verified Professional",
    free: { text: "—", muted: true },
    premium: "✓ Available",
  },
  {
    capability: "Verified Organization",
    free: { text: "—", muted: true },
    premium: "✓ Available",
  },
  {
    capability: "Fundraising Toolkit",
    free: { text: "—", muted: true },
    premium: "✓ Full toolkit",
  },
  {
    capability: "Advanced Moderation",
    free: { text: "—", muted: true },
    premium: "✓ Full access",
  },
];

/**
 * "Free vs Premium — Full Comparison" — 3-column table matching Figma.
 */
export default function ComparisonTable() {
  return (
    <section
      className="w-full px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
      style={{ backgroundColor: SECTION_BG }}
    >
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-10">
        {/* Section Heading */}
        <h2
          className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: INK_COLOR }}
        >
          Free vs Premium — Full Comparison
        </h2>

        {/* Comparison Table */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[640px]">
            {/* Header Row */}
            <div
              className="grid grid-cols-[1.2fr_1.5fr_1.5fr] items-center rounded-t-xl px-6 py-4"
              style={{ backgroundColor: HEADER_BG }}
            >
              <div>
                <p
                  className="text-sm font-bold sm:text-base"
                  style={{ color: INK_COLOR }}
                >
                  Capability
                </p>
              </div>
              <div>
                <p
                  className="text-sm font-bold sm:text-base"
                  style={{ color: INK_COLOR }}
                >
                  Free
                </p>
              </div>
              <div>
                <p
                  className="text-sm font-bold sm:text-base"
                  style={{ color: INK_COLOR }}
                >
                  Premium
                </p>
              </div>
            </div>

            {/* Data Rows */}
            {ROWS.map((row) => (
              <div
                key={row.capability}
                className="grid grid-cols-[1.2fr_1.5fr_1.5fr] items-center px-6 py-4"
                style={{ borderBottom: `1px solid ${BORDER_COLOR}` }}
              >
                {/* Capability column */}
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: INK_COLOR }}
                  >
                    {row.capability}
                  </p>
                </div>

                {/* Free column */}
                <div>
                  <p
                    className={`text-xs sm:text-sm ${
                      row.free.muted ? "text-base opacity-40 font-normal" : "font-normal"
                    }`}
                    style={{ color: NEVADA_COLOR }}
                  >
                    {row.free.text}
                  </p>
                </div>

                {/* Premium column */}
                <div>
                  <p
                    className="text-xs sm:text-sm font-bold"
                    style={{ color: MOSQUE_COLOR }}
                  >
                    {row.premium}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}