// Figma color tokens
const INK_COLOR = "#073B47";      // Heading, quotes, and names: Firefly
const NEVADA_COLOR = "#646E73";   // Role text: Nevada
const GEYSER_BORDER = "#DCEAEE";  // Card border: Geyser
const SECTION_BG = "#F7F8F9";     // Section bg: Athens Gray

const STORIES: {
  quote: React.ReactNode;
  name: string;
  role: string;
}[] = [
  {
    quote: (
      <>
        “Within a month of going Premium and
        <br />
        getting verified, my client base tripled. The
        <br />
        credibility boost was immediate.”
      </>
    ),
    name: "Dr. Patricia Wong",
    role: "Veterinarian • Verified Professional",
  },
  {
    quote: (
      <>
        “The fundraising toolkit transformed our
        <br />
        rescue. We went from $50K to $500K+ in
        <br />
        annual donations. Life-changing.”
      </>
    ),
    name: "James & Andrea Foster",
    role: "Rescue Directors • Verified Organization",
  },
  {
    quote: (
      <>
        “Ad-free Premium let me focus purely on
        <br />
        what I love — sharing rescue stories and
        <br />
        connecting adopters with their forever
        <br />
        homes.”
      </>
    ),
    name: "Keisha Thompson",
    role: "Community Leader • 12K Followers",
  },
];

/**
 * "💫 Premium Success Stories" — 3 testimonial cards matching Figma.
 */
export default function SuccessStories() {
  return (
    <section
      className="w-full px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
      style={{ backgroundColor: SECTION_BG }}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12">
        {/* Section Heading with native emoji */}
        <h2
          className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: INK_COLOR }}
        >
          💫 Premium Success Stories
        </h2>

        {/* 3 Cards: Identical height and width */}
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {STORIES.map((story) => (
            <div
              key={story.name}
              className="flex h-full flex-col justify-between rounded-[24px] bg-white p-8 shadow-[0px_1px_3px_0px_rgba(7,59,71,0.06)]"
              style={{
                backgroundColor: "#FFFFFF",
                border: `1px solid ${GEYSER_BORDER}`,
              }}
            >
              {/* Quote Text (Normal, not italic) */}
              <p
                className="text-base font-normal leading-6"
                style={{ color: INK_COLOR }}
              >
                {story.quote}
              </p>

              {/* Author Info pinned to bottom */}
              <div className="flex flex-col gap-1 pt-8">
                <p
                  className="text-sm font-bold"
                  style={{ color: INK_COLOR }}
                >
                  {story.name}
                </p>
                <p
                  className="text-xs font-normal"
                  style={{ color: NEVADA_COLOR }}
                >
                  {story.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}