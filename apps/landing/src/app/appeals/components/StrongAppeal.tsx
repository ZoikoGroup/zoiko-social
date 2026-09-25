const goodPoints = [
  "Be specific about why you disagree",
  "Provide new context we might have missed",
  "Explain any misunderstandings",
  "Show you understand the policy",
  "Be respectful and honest",
  "Keep it concise but complete",
];

const avoidPoints = [
  'Just say "I didn\'t do it" with no explanation',
  "Insult the moderators or platform",
  "Ask for special treatment or exceptions",
  "Threaten legal action or social media exposure",
  "Submit the same appeal multiple times",
  "Leave it blank or write nonsense",
];

export default function StrongAppeal() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 py-12 sm:px-8 sm:py-16 md:px-12 lg:px-20 lg:py-20 xl:px-28">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-6">
          {/* Heading */}
          <h2 className="w-full text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
            How to write a strong appeal
          </h2>

          {/* Visual */}
          <div className="relative w-full overflow-hidden rounded-3xl">
            {/* Background Image */}
            <img
              src="/appeals/bg.png"
              alt="How to write a strong appeal"
              className="block h-auto min-h-[411px] w-full object-cover"
            />

            {/* Left - Good Appeals */}
            <div className="absolute left-4 top-1/2 flex w-[min(288px,24%)] -translate-y-1/2 flex-col gap-2 sm:left-5 lg:left-6">
              {goodPoints.map((point) => (
                <div
                  key={point}
                  className="flex min-h-[44px] w-full items-center rounded-lg bg-white px-4 py-2 shadow-sm"
                >
                  <div className="flex w-full items-center gap-3">
                    <span className="shrink-0 text-sm font-bold text-[#3F9B50]">
                      ✓
                    </span>

                    <span className="text-xs font-normal leading-4 text-[#073B47] sm:text-sm sm:leading-5">
                      {point}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right - Things to Avoid */}
            <div className="absolute right-4 top-1/2 flex w-[min(384px,29%)] -translate-y-1/2 flex-col gap-2 sm:right-5 lg:right-6">
              {avoidPoints.map((point) => (
                <div
                  key={point}
                  className="flex min-h-[44px] w-full items-center rounded-lg bg-white px-4 py-2 shadow-sm"
                >
                  <div className="flex w-full items-center gap-3">
                    <span className="shrink-0 text-sm font-bold text-[#E5483F]">
                      ✕
                    </span>

                    <span className="text-xs font-normal leading-4 text-[#073B47] sm:text-sm sm:leading-5">
                      {point}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Example Card */}
          <div className="flex w-full flex-col items-start gap-3.5 rounded-[20px] border border-[#BFE7E9] bg-[#F7F9F9] p-6 sm:p-8">
            <div className="flex w-full flex-col items-start pb-px">
              <h3 className="text-base font-bold text-[#00AFC7] sm:text-lg">
                📝 Example of a strong appeal
              </h3>
            </div>

            <div className="flex w-full flex-col items-start">
              <p className="text-sm font-bold leading-6 text-[#46636A]">
                &quot;My account was suspended for hate speech, but my comment
                used a reclaimed term. I&apos;m a member of the LGBTQ+
                community and use this term proudly about myself. Looking back
                at my comment thread, you can see I was sharing my personal
                experience positively. I understand why an algorithm might
                flag it, but context matters. I request review by a human
                moderator who understands community language.&quot;
              </p>
            </div>

            <div className="flex w-full flex-col items-start">
              <p className="text-xs font-normal leading-5 text-[#46636A]">
                ✓ Specific issue · ✓ New context · ✓ Shows understanding · ✓
                Respectful tone
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}