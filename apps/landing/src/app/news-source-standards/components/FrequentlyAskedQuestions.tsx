"use client";

export default function FrequentlyAskedQuestions() {
  const faqs = [
    {
      question: "How does Zoiko Social rate news sources?",
      answer:
        "Each publisher is reviewed against our published source standards — including accuracy record, transparency about ownership and funding, how clearly it separates news from opinion, and how it handles corrections. The result is a rating label shown on every story from that source.",
    },
    {
      question: "Does a high source rating mean every article is true?",
      answer:
        "No. A rating describes the publisher's overall standards and track record, not every claim in every story. Even well-rated sources can make mistakes, so read critically and report anything that looks wrong.",
    },
    {
      question: "What do Tier 1 and Tier 2 Source Verified mean?",
      answer:
        "Tier 1 sources meet our highest standards for accuracy, transparency, and corrections. Tier 2 sources meet our core standards but have a shorter track record or less complete transparency. Both are verified; Tier 1 simply meets more of the criteria.",
    },
    {
      question: "Can a publisher pay for a better rating?",
      answer:
        "No. Ratings cannot be bought, and advertising or partnership arrangements have no effect on a publisher's rating. Sponsored content is always labelled separately.",
    },
    {
      question: "How can a publisher request a review?",
      answer:
        "Publishers can request a review by contacting our editorial team with evidence of changes to their standards, such as a new corrections policy or ownership disclosure. Reviews are assessed against the same published criteria as every other source.",
    },
    {
      question: "What happens if a rating changes?",
      answer:
        "The new rating applies to that publisher's stories from the date of the change, and the change is recorded with a reason. Stories already published keep a note of the rating they had at the time.",
    },
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
          {faqs.map(({ question, answer }) => (
            <details
              key={question}
              className="
                group
                w-full
                rounded-2xl
                border
                border-[#DCEAEE]
                bg-white
                transition-colors
                hover:bg-[#F8FBFB]
              "
            >
              <summary
                className="
                  flex
                  min-h-[64px]
                  w-full
                  cursor-pointer
                  list-none
                  items-center
                  justify-between
                  px-[20px]
                  text-left
                  [&::-webkit-details-marker]:hidden
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

                {/* Plus icon — turns into a cross when open */}
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
                    transition-transform
                    group-open:rotate-45
                  "
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>

              <p className="px-[20px] pb-5 text-sm font-normal leading-6 text-[#6B8790]">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
