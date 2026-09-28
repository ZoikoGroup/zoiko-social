// Figma color tokens
const INK_COLOR = "#073B47";          // Section Heading & Bold Labels: Firefly
const MOSQUE_COLOR = "#066879";       // Subtitle, Border & Checkmarks: Mosque
const NEVADA_COLOR = "#646E73";       // Intro & text body: Nevada
const PANEL_BG = "#F0F7F9";           // Panel background: Black Squeeze

const CHECKS = [
  {
    label: "Check the Publisher:",
    text: ' Verify the app is published by "Zoiko Social, Inc." Not a developer name or unknown company.',
  },
  {
    label: "Use Official Links:",
    text: " Download only from links on this official Zoiko Social website or from our social media verified accounts.",
  },
  {
    label: "Apple App Store:",
    text: ' Search for "Zoiko Social" and confirm the developer is Zoiko Social, Inc. Look for the official checkmark badge.',
  },
  {
    label: "Google Play Store:",
    text: ' Search "Zoiko Social" and verify the package ID is com.zoiko.social and developer is Zoiko Social, Inc.',
  },
  {
    label: "Avoid Third-Party Sites:",
    text: " Never download APK files from unofficial sites or sideloading sources.",
  },
  {
    label: "Trusted Delivery:",
    text: " If you're unsure, visit zoiko.social directly to get the official download link.",
  },
] as const;

/**
 * "Official Source & Security" — 1230px x 312px container matching Figma.
 */
export default function OfficialSource() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-28 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1230px] flex-col items-center gap-10">
        {/* Section Heading */}
        <h2
          className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: INK_COLOR }}
        >
          Official Source &amp; Security
        </h2>

        {/* 1230px x 312px Container */}
        <div
          className="flex w-full max-w-[1230px] flex-col justify-between rounded-[24px] px-8 py-7 shadow-[0px_1px_3px_0px_rgba(7,59,71,0.06)] lg:min-h-[312px]"
          style={{
            backgroundColor: PANEL_BG,
            border: `2px solid ${MOSQUE_COLOR}`,
          }}
        >
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h3
              className="text-lg font-bold sm:text-xl"
              style={{ color: MOSQUE_COLOR }}
            >
              How to Verify You&apos;re Installing the Official App
            </h3>
            <p
              className="text-xs leading-5 sm:text-sm sm:leading-6"
              style={{ color: NEVADA_COLOR }}
            >
              To protect yourself from unofficial or fraudulent copies, follow these guidelines:
            </p>
          </div>

          {/* Checklist rows */}
          <div className="flex flex-col gap-2 pt-2">
            {CHECKS.map((check) => (
              <div key={check.label} className="flex items-start gap-2.5">
                <span
                  className="shrink-0 text-xs font-bold leading-5 sm:text-sm"
                  style={{ color: MOSQUE_COLOR }}
                >
                  ✓
                </span>
                <p
                  className="text-xs leading-5 sm:text-sm"
                  style={{ color: NEVADA_COLOR }}
                >
                  <strong style={{ color: INK_COLOR }}>{check.label}</strong>
                  {check.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}