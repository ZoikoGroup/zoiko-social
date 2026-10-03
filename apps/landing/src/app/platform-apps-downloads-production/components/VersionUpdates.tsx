// Figma color tokens
const INK_COLOR = "#073B47";          // Section Heading & Subtitle: Firefly
const MOSQUE_COLOR = "#066879";       // Row Labels: Mosque
const NEVADA_COLOR = "#646E73";       // Values: Nevada
const SECTION_BG = "#F7F8F9";         // Section bg: Athens Gray

const ROWS: {
  label: string;
  value: React.ReactNode;
}[] = [
  {
    label: "iOS App Version",
    value: "2.3.1 (Released Sep 25, 2026) — Download latest from App Store",
  },
  {
    label: "Android App Version",
    value: "2.3.0 (Released Sep 20, 2026) — Download latest from Play Store",
  },
  {
    label: "Web App Version",
    value: "Current (Live) — Always up-to-date, no download required",
  },
  {
    label: "Auto-Updates",
    value: (
      <span className="block whitespace-normal lg:whitespace-nowrap">
        iOS and Android apps update automatically via their respective app stores when new versions are released. You can also manually update anytime.
      </span>
    ),
  },
  {
    label: "Bug Fixes & Features",
    value: (
      <>
        Check the App Store / Play Store release notes for details on what&apos;s new in each update. We release updates regularly with new features, performance
        <br />
        improvements, and security patches.
      </>
    ),
  },
];

/**
 * "Current Version & Updates" — Release Information panel with balanced padding.
 */
export default function VersionUpdates() {
  return (
    <section
      className="w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-28 lg:py-24"
      style={{ backgroundColor: SECTION_BG }}
    >
      <div className="mx-auto flex w-full max-w-[1230px] flex-col gap-10">
        {/* Section Heading */}
        <h2
          className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: INK_COLOR }}
        >
          Current Version &amp; Updates
        </h2>

        {/* Release Information Panel with balanced top and bottom padding */}
        <div
          className="flex w-full max-w-[1230px] flex-col rounded-[24px] border border-[#DCEAEE] bg-white p-7 shadow-[0px_1px_3px_0px_rgba(7,59,71,0.06)] sm:p-8"
        >
          <h3
            className="text-lg font-bold sm:text-xl"
            style={{ color: INK_COLOR }}
          >
            Release Information
          </h3>

          {/* Rows */}
          <div className="flex flex-col gap-3 pt-4">
            {ROWS.map((row) => (
              <div
                key={row.label}
                className="flex flex-col sm:flex-row sm:items-start sm:gap-6"
              >
                <p
                  className="w-full shrink-0 text-xs font-semibold sm:w-44 lg:w-48"
                  style={{ color: MOSQUE_COLOR }}
                >
                  {row.label}
                </p>
                <p
                  className="text-xs leading-5"
                  style={{ color: NEVADA_COLOR }}
                >
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}