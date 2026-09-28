const principles = [
  {
    title: "Context matters",
    description:
      "We consider relationships, culture, sarcasm, and recent events. One phrase doesn't tell the full story.",
  },
  {
    title: "Humans lead",
    description:
      "AI assists but never decides alone. Every important decision involves human judgment and care.",
  },
  {
    title: "Consistency",
    description:
      "Similar violations get similar actions. We audit ourselves regularly for bias and fairness.",
  },
  {
    title: "Transparency",
    description:
      "Users know why we act. We publish quarterly reports and explain our decisions clearly.",
  },
  {
    title: "Appeals work",
    description:
      "2% of appeals overturn decisions. We take that feedback and improve our policies.",
  },
  {
    title: "We evolve",
    description:
      "Language, culture, and harm change. We continuously update policies and detection.",
  },
];

export default function Principles() {
  return (
    <section className="w-full bg-white px-6 py-12 sm:px-8 md:px-12 lg:px-20 xl:px-28 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-10 sm:gap-12">
        {/* Heading */}
        <div className="w-full">
          <h2 className="w-full font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
            Principles that guide us
          </h2>
        </div>

        {/* Principles */}
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {principles.map((principle) => (
            <article
              key={principle.title}
              className="flex w-full flex-col items-start gap-3 rounded-[20px] border border-[#D5E7EA] bg-white p-8"
            >
              <div className="flex w-full flex-col items-start">
                <h3 className="w-full font-['Plus_Jakarta_Sans'] text-lg font-bold leading-7 text-[#00AFC7]">
                  {principle.title}
                </h3>
              </div>

              <div className="flex w-full flex-col items-start">
                <p className="w-full font-['Plus_Jakarta_Sans'] text-sm font-normal leading-6 text-[#46636A]">
                  {principle.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}