// Figma color tokens
const INK_COLOR = "#073B47";          // Headings & titles: Firefly
const MOSQUE_COLOR = "#066879";       // Primary CTA & Tag text: Mosque
const NEVADA_COLOR = "#646E73";       // Descriptions & Publishers: Nevada
const GEYSER_BORDER = "#DCEAEE";      // Card border: Geyser
const TAG_BG = "#F0F7F9";             // Tag chips & secondary buttons: Black Squeeze

const APPS: {
  title: string;
  description: React.ReactNode;
  tags: string[];
  publisher: string;
  primary: string;
  secondary: string;
  disabled?: boolean;
}[] = [
  {
    title: "Zoiko Social for iOS",
    description: (
      <>
        Download for iPhone and iPad. Optimized for iOS 13 and above.
        <br />
        Access full features including communities, news, adoption
        <br />
        matching, and more.
      </>
    ),
    tags: ["Requires iOS 13+", "20 MB"],
    publisher: "Published by Zoiko Social, Inc. — Official Apple App Store",
    primary: "Get on App Store",
    secondary: "Requirements",
  },
  {
    title: "Zoiko Social for Android",
    description: (
      <>
        Download for Android phones and tablets. Optimized for
        <br />
        Android 8.0 and above. Full feature parity with iOS app including
        <br />
        offline reading, notifications, and community tools.
      </>
    ),
    tags: ["Requires Android 8.0+", "18 MB"],
    publisher: "Published by Zoiko Social, Inc. — Official Google Play Store",
    primary: "Get on Play Store",
    secondary: "Requirements",
  },
  {
    title: "Zoiko Social Web",
    description: (
      <>
        Access Zoiko Social directly from any web browser on desktop
        <br />
        or mobile. No download required. Full experience available
        <br />
        instantly. Works offline with progressive web app support.
      </>
    ),
    tags: ["Modern Browser", "No Installation"],
    publisher: "Official Zoiko Social website — Supported on all modern browsers",
    primary: "Open Web App",
    secondary: "Install PWA",
  },
  {
    title: "Zoiko Social for Desktop",
    description: (
      <>
        Desktop applications for macOS and Windows are coming
        <br />
        soon. For now, use the web app for a full desktop experience, or
        <br />
        install the iOS or Android apps on your mobile device.
      </>
    ),
    tags: ["Planned", "macOS & Windows"],
    publisher: "Status: In Development",
    primary: "Coming Soon",
    secondary: "Notify Me",
    disabled: true,
  },
];

/**
 * "Official Zoiko Social Apps" — 2x2 grid matching Figma card proportions.
 */
export default function OfficialApps() {
  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1020px] flex-col items-center gap-10">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h2
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ color: INK_COLOR }}
          >
            Official Zoiko Social Apps
          </h2>
          <p
            className="max-w-2xl text-sm leading-6 sm:text-base sm:leading-7"
            style={{ color: NEVADA_COLOR }}
          >
            Download from official sources only. All apps below are published and maintained by
            <br className="hidden sm:inline" />
            Zoiko Social. Always verify the publisher before downloading.
          </p>
        </div>

        {/* 2x2 Grid with exact 490px cards */}
        <div className="grid w-full grid-cols-1 justify-items-center gap-6 md:grid-cols-2">
          {APPS.map((app) => (
            <div
              key={app.title}
              className="flex w-full max-w-[490px] flex-col rounded-[24px] border border-[#DCEAEE] bg-white p-7 shadow-[0px_1px_3px_0px_rgba(7,59,71,0.06)] transition hover:shadow-md"
            >
              {/* Title & Description */}
              <div className="flex flex-col gap-1.5">
                <h3
                  className="text-lg font-bold"
                  style={{ color: INK_COLOR }}
                >
                  {app.title}
                </h3>
                <p
                  className="text-xs leading-5"
                  style={{ color: NEVADA_COLOR }}
                >
                  {app.description}
                </p>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-3">
                {app.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-xl px-3.5 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: TAG_BG,
                      color: MOSQUE_COLOR,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Publisher line */}
              <p
                className="pt-4 text-xs font-normal"
                style={{ color: NEVADA_COLOR }}
              >
                {app.publisher}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-5">
                {app.disabled ? (
                  <span
                    className="inline-flex items-center justify-center rounded-xl border border-[#DCEAEE] bg-[#F7F8F9] px-6 py-2.5 text-center text-xs font-bold"
                    style={{ color: NEVADA_COLOR }}
                  >
                    {app.primary}
                  </span>
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-center text-xs font-bold text-white shadow-sm transition hover:opacity-90"
                    style={{ backgroundColor: MOSQUE_COLOR }}
                  >
                    {app.primary}
                  </button>
                )}

                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-center text-xs font-bold transition hover:bg-neutral-100"
                  style={{
                    backgroundColor: TAG_BG,
                    color: INK_COLOR,
                  }}
                >
                  {app.secondary}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}