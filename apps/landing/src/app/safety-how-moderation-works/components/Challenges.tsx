const challenges = [
  {
    title: "⚡ Scale & speed",
    description:
      "With 2.3M reports monthly, we must be fast. But speed without accuracy causes harm to innocent users.",
  },
  {
    title: "🌍 Cultural diversity",
    description:
      "What's normal in one country offends in another. Context from local teams is essential and irreplaceable.",
  },
  {
    title: "🤖 AI limitations",
    description:
      "AI struggles with sarcasm, metaphor, and niche communities. Human judgment fills the gap, but doesn't scale.",
  },
  {
    title: "🎨 Gray areas",
    description:
      "Many cases don't fit neatly into yes or no. We make judgment calls that some users will disagree with.",
  },
];

export default function Challenges() {
  return (
    <section className="w-full bg-[#F7F9FA] px-6 py-12 sm:px-8 md:px-12 lg:px-20 xl:px-28 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-10 sm:gap-12">
        {/* Heading */}
        <div className="w-full">
          <h2 className="w-full font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
            Challenges we face
          </h2>
        </div>

        {/* Challenge Cards */}
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
          {challenges.map((challenge) => (
            <article
              key={challenge.title}
              className="flex w-full flex-col items-start gap-2.5 rounded-[20px] border border-[#D5E7EA] bg-white p-8"
            >
              <div className="flex w-full flex-col items-start pb-px">
                <h3 className="w-full font-['Plus_Jakarta_Sans'] text-lg font-bold leading-7 text-[#00AFC7]">
                  {challenge.title}
                </h3>
              </div>

              <div className="flex w-full flex-col items-start">
                <p className="w-full font-['Plus_Jakarta_Sans'] text-base font-normal leading-6 text-[#46636A]">
                  {challenge.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}