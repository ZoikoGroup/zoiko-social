"use client";

export default function FrequentlyAskedQuestions() {
  const questions = [
    "How does Zoiko Social rate news sources?",
    "Does a high source rating mean every article is true?",
    "What do Tier 1 and Tier 2 Source Verified mean?",
    "Can a publisher pay for a better rating?",
    "How can a publisher request a review?",
    "What happens if a rating changes?",
  ];

  return (
    <section className="w-full bg-[#F5F8F8]">
      <div
        className="
          mx-auto
          w-full
          max-w-[1232px]
          px-4
          pb-20
          sm:px-6
          lg:px-0
        "
      >
        {/* Heading */}
        <h2
          className="
            pt-[56px]
            text-[24px]
            font-extrabold
            leading-9
            tracking-[-0.3px]
            text-[#073B47]
          "
        >
          Frequently asked questions
        </h2>

        {/* FAQ list */}
        <div className="mt-[20px] flex flex-col gap-[14px]">
          {questions.map((question) => (
            <button
              key={question}
              type="button"
              className="
                group
                flex
                min-h-[64px]
                w-full
                items-center
                justify-between
                rounded-2xl
                border
                border-[#DCEAEE]
                bg-white
                px-[20px]
                text-left
                transition-colors
                hover:bg-[#F8FBFB]
              "
            >
              <span
                className="
                  pr-6
                  text-[14px]
                  font-bold
                  leading-5
                  text-[#073B47]
                "
              >
                {question}
              </span>

              <span
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  text-[22px]
                  font-normal
                  leading-7
                  text-[#066879]
                "
                aria-hidden="true"
              >
                +
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}