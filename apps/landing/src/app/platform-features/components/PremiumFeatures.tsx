import { C } from "./theme";

const CARDS = [
  {
    title: "Advanced Analytics",
    body: "Deep insights into community engagement, event attendance, and campaign reach. Measure your impact.",
  },
  {
    title: "Featured Placement",
    body: "Get discovered by more supporters. Premium communities and events receive prominent visibility.",
  },
  {
    title: "Moderation Tools",
    body: "Enhanced moderation suite with automation, approval workflows, and detailed audit logs for your community.",
  },
];

/** "Premium Features for More Impact" — orange-outlined cream panel, 3 feature cards + CTA. */
export default function PremiumFeatures() {
  return (
    <section className="w-full px-4 py-8 sm:px-8 lg:px-[105px] lg:py-20" style={{ backgroundColor: C.panel }}>
      <div
        className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 rounded-[28px] border-2 bg-gradient-to-br from-[#fff5e8] to-white p-6 sm:p-8 lg:p-12"
        style={{ borderColor: C.orange }}
      >
        <div className="flex flex-col gap-2">
          <h2 className="font-jakarta text-2xl font-extrabold tracking-[-0.36px] sm:text-3xl lg:text-4xl" style={{ color: C.ink }}>
            Premium Features for More Impact
          </h2>
          <p className="text-base leading-7 sm:text-[17px]" style={{ color: C.muted }}>
            Unlock advanced tools designed for serious advocates and growing organizations.
          </p>
        </div>
        <div className="flex flex-col gap-6 pt-3 sm:flex-row sm:gap-6">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-1 flex-col gap-2 rounded-[20px] border-l-[3px] bg-white p-6"
              style={{ borderColor: C.orange }}
            >
              <h4 className="text-base font-bold" style={{ color: C.orange }}>
                {card.title}
              </h4>
              <p className="text-sm leading-[23.1px]" style={{ color: C.muted }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-center pt-3">
          <button
            type="button"
            className="rounded-xl px-5 py-3 text-sm font-bold text-white"
            style={{ backgroundColor: C.orange }}
          >
            Explore Premium Plans
          </button>
        </div>
      </div>
    </section>
  );
}
