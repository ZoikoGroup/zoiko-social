"use client";

const cards = [
  {
    title: "For Individuals",
    description:
      "Connect, share, and care for animals in your life.",
    primary: "Join Free",
    secondary: "Explore Communities",
    tertiary: "Watch Animal News",
    primaryText: "text-sky-500",
  },
  {
    title: "For Professionals",
    description:
      "Reach clients and build your practice.",
    primary: "Get Verified",
    secondary: "List Your Practice",
    tertiary: "Start Professional Trial",
    primaryText: "text-sky-500",
  },
  {
    title: "For Organizations",
    description:
      "Amplify your mission and coordinate rescue work.",
    primary: "Verify Your Organization",
    secondary: "Fundraise Safely",
    tertiary: "Partner With ZoikoSocial",
    primaryText: "text-cyan-500",
  },
];

export default function CTASection() {
  return (
    <section className="bg-gradient-to-br from-[#0066FF] to-[#00B8A9] py-20">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="mb-14 text-center font-montserrat text-4xl font-extrabold text-white">
          A Social Network Built Around Life — Not Noise
        </h2>

        <div className="grid gap-8 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-white/20 bg-white/10 p-10 backdrop-blur-md"
            >
              <h3 className="text-center font-inter text-3xl font-bold text-white">
                {card.title}
              </h3>

              <p className="mt-5 text-center font-inter text-base leading-7 text-white/90">
                {card.description}
              </p>

              <button
                className={`mt-10 w-full rounded-xl bg-white py-4 font-inter text-base font-bold ${card.primaryText} transition hover:scale-[1.02]`}
              >
                {card.primary}
              </button>

              <button className="mt-5 w-full rounded-xl border border-white/30 py-4 font-inter text-base font-bold text-white transition hover:bg-white/10">
                {card.secondary}
              </button>

              <button className="mt-5 w-full rounded-xl border border-white/30 py-4 font-inter text-base font-bold text-white transition hover:bg-white/10">
                {card.tertiary}
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}