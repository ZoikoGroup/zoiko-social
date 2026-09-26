import Image from "next/image";

const moderationTeams = [
  {
    icon: "/how-moderation-works/1.png",
    title: "Regional",
    description: "On-ground in major regions. Understanding local context.",
  },
  {
    icon: "/how-moderation-works/2.png",
    title: "Trust & Safety",
    description:
      "Addresses critical safety. Coordinates with law enforcement.",
  },
  {
    icon: "/how-moderation-works/3.png",
    title: "Appeals",
    description:
      "Provides fresh, unbiased review of enforcement decisions.",
  },
  {
    icon: "/how-moderation-works/4.png",
    title: "Analytics",
    description: "Tracks trends and effectiveness. Identifies gaps.",
  },
  {
    icon: "/how-moderation-works/5.png",
    title: "Policy",
    description:
      "Develops and interprets standards. Ensures global consistency.",
  },
  {
    icon: "/how-moderation-works/6.png",
    title: "AI/ML",
    description: "Builds detection systems. Identifies patterns at scale.",
  },
  {
    icon: "/how-moderation-works/7.png",
    title: "Moderators",
    description: "600+ trained specialists reviewing nuanced cases with care.",
  },
];

export default function ModerationTeams() {
  return (
    <section className="w-full bg-white px-6 py-12 sm:px-8 md:px-12 lg:px-20 xl:px-28 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-10 sm:gap-12">
        {/* Heading */}
        <h2 className="w-full font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
          Our moderation teams
        </h2>

        {/* Team Cards */}
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {moderationTeams.map((team) => (
            <article
              key={team.title}
              className="flex w-full flex-col items-center gap-2.5 rounded-[20px] border border-[#D5E7EA] bg-white p-6"
            >
              {/* Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#F3F5F6]">
                <Image
                  src={team.icon}
                  alt={`${team.title} icon`}
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="w-full pt-1 text-center font-['Plus_Jakarta_Sans'] text-base font-bold text-[#00AFC7]">
                {team.title}
              </h3>

              {/* Description */}
              <p className="w-full text-center font-['Plus_Jakarta_Sans'] text-sm font-normal leading-6 text-[#46636A]">
                {team.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}