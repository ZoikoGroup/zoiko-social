const allowedExamples = [
  {
    title: "Reclaimed identity language",
    example:
      '"As a member of the LGBTQ+ community, I\'m proud to use this term about myself.”',
    reason:
      "Reason: Community in-group reclamation with positive intent is allowed.",
  },
  {
    title: "Satire on serious issues",
    example:
      '"Petition to rename it the \'Climate action department\' because the current name is too honest about our priorities."',
    reason:
      "Reason: Clear sarcasm/satire meant to critique, not misinform. Intent is transparent.",
  },
  {
    title: "Strong disagreement",
    example: '"I think your policy is wrong because... [specific reasons]"',
    reason:
      "Reason: Critiquing ideas, not attacking people. This is healthy discourse.",
  },
];

const notAllowedExamples = [
  {
    title: "The same term used as slur",
    example: '"Those [slur] don\'t belong here."',
    reason:
      "Reason: Same word, but used as attack and exclusion. Removed.",
  },
  {
    title: "False climate claim",
    example:
      '"Climate scientists have proved climate change is a hoax." [with false sources]',
    reason:
      "Reason: Deliberately false, formatted to mislead. Violates health/science policy.",
  },
  {
    title: "Personal harassment",
    example:
      '"You\'re an idiot, everyone should [dox/hate/harm] you."',
    reason:
      "Reason: Attacks person, not idea. Calls for harassment. Removed + action taken.",
  },
];

function ExampleCard({
  title,
  example,
  reason,
  allowed,
}: {
  title: string;
  example: string;
  reason: string;
  allowed: boolean;
}) {
  return (
    <article
      className={`w-full rounded-[20px] border border-[#D5E7EA] border-l-4 bg-white p-6 sm:p-8 ${
        allowed ? "border-l-[#4CAF50]" : "border-l-[#EF4444]"
      }`}
    >
      <div className="flex w-full flex-col items-start gap-2.5">
        <h3 className="w-full pt-1 font-['Plus_Jakarta_Sans'] text-base font-bold leading-6 text-[#073B47]">
          {title}
        </h3>

        <p className="w-full font-['Plus_Jakarta_Sans'] text-sm font-normal leading-6 text-[#46636A]">
          {example}
        </p>

        <p
          className={`w-full font-['Plus_Jakarta_Sans'] text-xs font-normal leading-5 ${
            allowed ? "text-[#4CAF50]" : "text-[#D94F4F]"
          }`}
        >
          {reason}
        </p>
      </div>
    </article>
  );
}

export default function AllowedNotAllowed() {
  return (
    <section className="w-full bg-[#F7F9FA] px-6 py-12 sm:px-8 md:px-12 lg:px-20 xl:px-28 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-6">
        {/* Heading */}
        <h2 className="w-full font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
          What&apos;s allowed &amp; what&apos;s not
        </h2>

        {/* Comparison */}
        <div className="grid w-full grid-cols-1 gap-6 pt-2 lg:grid-cols-2 lg:gap-8">
          {/* Allowed */}
          <div className="flex w-full flex-col items-start gap-6 rounded-[20px] border border-[#D5E7EA] border-l-4 border-l-[#4CAF50] bg-[#F1FFF4] p-6 sm:gap-8 sm:p-8">
            <div className="flex w-full items-center gap-4">
              <span className="font-['Plus_Jakarta_Sans'] text-2xl">
                ✅
              </span>

              <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#46636A]">
                ALLOWED
              </h3>
            </div>

            <div className="flex w-full flex-col gap-5">
              {allowedExamples.map((item) => (
                <ExampleCard
                  key={item.title}
                  title={item.title}
                  example={item.example}
                  reason={item.reason}
                  allowed
                />
              ))}
            </div>
          </div>

          {/* Not Allowed */}
          <div className="flex w-full flex-col items-start gap-6 rounded-[20px] border border-[#D5E7EA] border-l-4 border-l-[#EF4444] bg-[#FFF5F5] p-6 sm:gap-8 sm:p-8">
            <div className="flex w-full items-center gap-4">
              <span className="font-['Plus_Jakarta_Sans'] text-2xl">
                ❌
              </span>

              <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#46636A]">
                NOT ALLOWED
              </h3>
            </div>

            <div className="flex w-full flex-col gap-5">
              {notAllowedExamples.map((item) => (
                <ExampleCard
                  key={item.title}
                  title={item.title}
                  example={item.example}
                  reason={item.reason}
                  allowed={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}