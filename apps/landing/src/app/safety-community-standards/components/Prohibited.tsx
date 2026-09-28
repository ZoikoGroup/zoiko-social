const prohibitedContent = [
  {
    title: "Violent threats & abuse",
    level: "🚨 Critical Violation",
    levelType: "critical",
    description:
      "Threats of harm, harassment, doxxing, or coordinated attacks. This includes death threats, physical violence, and organized campaigns.",
    items: [
      "Death or physical threats against individuals or groups",
      "Organized harassment campaigns or coordinated attacks",
      "Publishing private information (doxxing)",
      "Threats of sexual violence or assault",
    ],
  },
  {
    title: "Illegal content",
    level: "🚨 Critical Violation",
    levelType: "critical",
    description:
      "Content that violates laws or promotes illegal activities. We report serious cases to law enforcement.",
    items: [
      "Child exploitation material (any form)",
      "Illegal drug sales, trafficking, or promotion",
      "Weapons trafficking or illegal weapons sales",
      "Human trafficking or modern slavery",
    ],
  },
  {
    title: "Hate speech & discrimination",
    level: "⚠️ Major Violation",
    levelType: "major",
    description:
      "Attacks based on protected identity characteristics. Includes slurs, dehumanizing language, and conspiracy theories targeting groups.",
    items: [
      "Slurs based on race, ethnicity, religion, gender, sexuality",
      "Dehumanizing or inflammatory language about groups",
      "Conspiracy theories targeting specific communities",
      "Calls for violence or discrimination against groups",
    ],
  },
  {
    title: "Misinformation & spam",
    level: "⚠️ Major Violation",
    levelType: "major",
    description:
      "Deliberately false information that causes harm, and disruptive behavior designed to manipulate or deceive.",
    items: [
      "False health claims that could cause harm",
      "Election interference or voting misinformation",
      "Spam, artificial engagement manipulation",
      "Impersonation or identity deception",
    ],
  },
];

export default function Prohibited() {
  return (
    <section className="w-full bg-[#F7F9FA] px-6 py-12 sm:px-8 md:px-12 lg:px-20 xl:px-28 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-8">
        {/* Heading */}
        <div className="flex w-full flex-col items-start gap-5 sm:gap-6">
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
            Prohibited content
          </h2>

          <p className="w-full font-['Plus_Jakarta_Sans'] text-base font-normal leading-7 text-[#46636A]">
            These are the behaviors we don&apos;t allow. We remove content and
            take action against accounts that violate these standards.
          </p>
        </div>

        {/* Cards */}
        <div className="flex w-full flex-col gap-5">
          {prohibitedContent.map((content) => {
            const isCritical = content.levelType === "critical";

            return (
              <article
                key={content.title}
                className="w-full rounded-[20px] border border-[#D5E7EA] border-l-[5px] bg-white p-6 sm:p-8"
              >
                {/* Title + Badge */}
                <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#073B47]">
                    {content.title}
                  </h3>

                  <span
                    className={`w-fit shrink-0 rounded-xl px-4 py-2 font-['Plus_Jakarta_Sans'] text-xs font-bold ${
                      isCritical
                        ? "bg-[#FDEAEA] text-[#D94F4F]"
                        : "bg-[#FFF3E4] text-[#E28B24]"
                    }`}
                  >
                    {content.level}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 font-['Plus_Jakarta_Sans'] text-base font-normal leading-7 text-[#46636A]">
                  {content.description}
                </p>

                {/* Prohibited Items */}
                <ul className="mt-4 flex flex-col">
                  {content.items.map((item) => (
                    <li
                      key={item}
                      className="relative py-2 pl-6 font-['Plus_Jakarta_Sans'] text-sm font-normal leading-6 text-[#46636A]"
                    >
                      <span className="absolute left-0 top-2 text-sm">
                        ⚠️
                      </span>

                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}