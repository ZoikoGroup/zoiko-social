import { C } from "./theme";

const TABS = ["Community & Profiles", "Events & Coordination", "Content & News", "Safety & Moderation"];

const CARDS = [
  {
    title: "Create & Manage Communities",
    body: "Start communities around any animal cause, region, or mission. Set guidelines, manage members, and build your community culture.",
  },
  {
    title: "Public & Private Profiles",
    body: "Build your professional advocate profile with credentials, experience, and portfolio work. Control your privacy settings completely.",
  },
  {
    title: "Community Verification",
    body: "Earn verified status by completing community standards. Build trust with your audience through transparent verification.",
  },
  {
    title: "Member Engagement Tools",
    body: "Foster meaningful discussions, celebrate milestones, recognize contributions, and keep your community active and invested.",
  },
];

/**
 * "Explore Platform Capabilities" — category tabs over a 2x2 capability
 * grid. The Figma frame only ships the expanded state for the first tab
 * ("Community & Profiles"); the other three categories have no content
 * defined in the design, so the tabs render as the static, non-interactive
 * pills shown in the frame rather than fabricating copy for them.
 */
export default function ExplorePlatformCapabilities() {
  return (
    <section className="w-full bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-[105px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-8">
        <div className="flex flex-col gap-3">
          <h2
            className="font-jakarta text-2xl font-extrabold tracking-[-0.36px] sm:text-3xl lg:text-4xl"
            style={{ color: C.ink }}
          >
            Explore Platform Capabilities
          </h2>
          <p className="text-base leading-7 sm:text-[17px]" style={{ color: C.muted }}>
            Click to expand each category and discover what Zoiko Social offers
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 pt-2">
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {TABS.map((tab, i) => (
              <div
                key={tab}
                className={`rounded-2xl px-5 py-4 text-center font-bold text-[13.3px] sm:px-8 ${
                  i === 0 ? "text-white" : "border"
                }`}
                style={i === 0 ? { backgroundColor: C.brand } : { borderColor: C.line, color: C.ink }}
              >
                {tab}
              </div>
            ))}
          </div>

          <div
            className="rounded-[20px] border p-4 sm:p-6"
            style={{ backgroundColor: C.chip, borderColor: C.brand }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {CARDS.map((card) => (
                <div
                  key={card.title}
                  className="flex flex-col gap-2 rounded-[20px] border bg-white p-6"
                  style={{ borderColor: C.line }}
                >
                  <h4 className="text-base font-bold" style={{ color: C.ink }}>
                    {card.title}
                  </h4>
                  <p className="text-sm leading-[23.1px]" style={{ color: C.muted }}>
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
