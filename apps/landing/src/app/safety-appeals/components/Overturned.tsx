interface AppealCase {
  title: string;
  whatHappened: string;
  appeal: string;
  result: string;
}

const appealCases: AppealCase[] = [
  {
    title: "False hate speech flag",
    whatHappened:
      "AI flagged a comment using a reclaimed term. User explained it was used positively within their community.",
    appeal:
      '"This term is reclaimed by our community and I use it proudly. Your system didn\'t understand context."',
    result: "Decision overturned. Content restored. User unbanned.",
  },
  {
    title: "Sarcasm misread as threat",
    whatHappened:
      'Account suspended for "threatening violence." User\'s sarcastic post was interpreted literally.',
    appeal:
      '"Read it in context of the conversation. It\'s clearly sarcasm about a policy, not a real threat."',
    result: "Decision overturned. Account reinstated.",
  },
  {
    title: "Disability context missed",
    whatHappened:
      'Comment removed for "ableist language." But user had disclosed their disability in context.',
    appeal:
      '"I\'m autistic and this is how I describe my own experience. Removing it erases disability narratives."',
    result: "Decision overturned. Content restored with context note.",
  },
  {
    title: "Overly harsh penalty",
    whatHappened:
      'First violation resulted in immediate 30-day suspension. No warning first.',
    appeal:
      '"This is my first violation ever. I didn\'t know I was breaking a rule. A warning would have been fair."',
    result: "Suspension reduced to 7 days. Opportunity to improve.",
  },
];

export default function Overturned() {
  return (
    <section className="w-full bg-[#F7F9F9]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 py-12 sm:px-8 sm:py-16 md:px-12 lg:px-20 lg:py-20 xl:px-28">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-6">
          {/* Heading */}
          <div className="flex w-full flex-col items-start">
            <h2 className="w-full text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
              Real appeals that were overturned
            </h2>
          </div>

          {/* Description */}
          <div className="flex w-full flex-col items-start">
            <p className="w-full text-base font-normal leading-7 text-[#46636A]">
              These are actual cases from Q3 2026. Names changed for privacy.
              These show when appeals work.
            </p>
          </div>

          {/* 2 × 2 Grid */}
          <div className="grid w-full grid-cols-1 gap-6 pt-2 sm:pt-4 lg:grid-cols-2 lg:gap-6">
            {appealCases.map((item) => (
              <article
                key={item.title}
                className="flex w-full flex-col gap-4 rounded-[20px] border border-[#BFE7E9] border-l-4 border-l-[#4CAF50] bg-white px-6 py-7 sm:px-8 sm:py-8"
              >
                {/* Card Header */}
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="pt-1 text-base font-bold text-[#00AFC7]">
                    {item.title}
                  </h3>

                  <span className="w-fit shrink-0 rounded-xl bg-[#E8F7EC] px-3 py-1 text-xs font-bold text-[#3F9B50]">
                    ✓ Appeal Overturned
                  </span>
                </div>

                {/* Details */}
                <div className="flex w-full flex-col gap-2.5 text-sm leading-6 text-[#46636A]">
                  <p>
                    <strong className="font-bold">What happened:</strong>{" "}
                    {item.whatHappened}
                  </p>

                  <p>
                    <strong className="font-bold">Appeal:</strong>{" "}
                    {item.appeal}
                  </p>

                  <p>
                    <strong className="font-bold">Result:</strong>{" "}
                    {item.result}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}