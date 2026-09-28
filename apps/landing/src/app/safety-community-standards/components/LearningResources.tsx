const learningResources = [
  {
    title: "Policy Guide",
    description: "Deep dive into each policy with examples and gray areas",
  },
  {
    title: "Video Tutorial",
    description: "5-minute video explaining how moderation works",
  },
  {
    title: "Community Forum",
    description: "Discuss policies and share feedback with moderators",
  },
  {
    title: "Report Guide",
    description: "Step-by-step guide to reporting violations effectively",
  },
];

export default function LearningResources() {
  return (
    <section className="w-full bg-white px-6 py-12 sm:px-8 md:px-12 lg:px-20 xl:px-28 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-6">
        {/* Heading */}
        <h2 className="w-full font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
          Learning resources
        </h2>

        {/* Description */}
        <p className="w-full font-['Plus_Jakarta_Sans'] text-base font-normal leading-7 text-[#46636A]">
          Want to understand our standards better? We have guides, videos, and
          community discussions.
        </p>

        {/* Resource Cards */}
        <div className="grid w-full grid-cols-1 gap-5 pt-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {learningResources.map((resource) => (
            <article
              key={resource.title}
              className="flex w-full flex-col items-center gap-6 rounded-[20px] border border-[#D5E7EA] bg-white p-6"
            >
              {/* Icon Placeholder */}
              <div className="h-16 w-16 rounded-2xl bg-slate-100" />

              {/* Content */}
              <div className="flex w-full flex-col items-center gap-2.5">
                <h3 className="w-full text-center font-['Plus_Jakarta_Sans'] text-base font-bold text-[#00AFC7]">
                  {resource.title}
                </h3>

                <p className="w-full text-center font-['Plus_Jakarta_Sans'] text-xs font-normal leading-5 text-[#46636A]">
                  {resource.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}