interface GuidelineItem {
  number: number;
  title: string;
  description: string;
}

const GUIDELINES: GuidelineItem[] = [
  {
    number: 1,
    title: "No Harmful Content",
    description:
      "Images, videos, or descriptions of animal abuse or neglect are not tolerated. Ever.",
  },
  {
    number: 2,
    title: "Verified Professionals Only",
    description:
      "Veterinary advice and medical claims can only come from verified professionals.",
  },
  {
    number: 3,
    title: "Respectful Discourse",
    description:
      "Debate is healthy; harassment and cruelty are not. Personal attacks have no place here.",
  },
  {
    number: 4,
    title: "Proper Attribution",
    description:
      "Source all news, research, and statistics. No misinformation. No fake claims.",
  },
  {
    number: 5,
    title: "Safety First",
    description:
      "Content that harms animals or puts people at risk is removed immediately.",
  },
];

export default function AnimalWelfareGuidelines() {
  return (
    <section className="w-full bg-white pb-20 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-left text-2xl font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px]">
          Our Animal Welfare Guidelines
        </h2>

        <div className="mt-10 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] sm:p-10">
          <div className="space-y-6 sm:space-y-7">
            {GUIDELINES.map((item) => (
              <div key={item.number} className="flex items-start gap-4 sm:gap-5">
                {/* Number Circle Badge */}
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E8F4F5] text-sm font-bold text-[#006D77]">
                  {item.number}
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-base font-bold text-[#0F2422] sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#5A7371] sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
