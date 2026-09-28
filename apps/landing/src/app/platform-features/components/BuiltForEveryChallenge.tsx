import { C } from "./theme";

const CARDS = [
  {
    title: "Building Trust",
    body: "Establish credibility within your community. Share your expertise, build your reputation, and create a verified presence that matters.",
  },
  {
    title: "Finding Your People",
    body: "Connect with advocates, volunteers, and supporters who share your passion. Discover like-minded individuals and organizations doing meaningful work.",
  },
  {
    title: "Getting Things Done",
    body: "Organize rescues, coordinate events, launch campaigns, and rally your community around causes. Tools built for real advocacy work.",
  },
];

/** "Built for every challenge" — 3 problem/solution cards, teal top border. */
export default function BuiltForEveryChallenge() {
  return (
    <section className="w-full px-4 py-12 sm:px-8 sm:py-16 lg:px-[105px] lg:py-20" style={{ backgroundColor: C.panel }}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-8 lg:gap-12">
        <h2
          className="w-full text-center font-jakarta text-2xl font-extrabold tracking-[-0.36px] sm:text-3xl lg:text-4xl"
          style={{ color: C.ink }}
        >
          Built for every challenge
        </h2>
        <div className="flex w-full flex-col gap-6 sm:flex-row sm:gap-6">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-1 flex-col gap-4 rounded-[20px] border bg-white p-6"
              style={{ borderColor: C.line, borderLeftWidth: 4, borderLeftColor: C.brand }}
            >
              <h3
                className="border-b pb-4 font-jakarta text-xl font-bold"
                style={{ borderColor: "rgba(6,104,121,0.6)", color: C.brand }}
              >
                {card.title}
              </h3>
              <p className="text-sm leading-[23.1px]" style={{ color: C.muted }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
