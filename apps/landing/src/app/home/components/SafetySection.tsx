import Image from "next/image";
import Link from "next/link";

const safetyCards = [
  {
    title: "Community Standards",
    description: (
      <>
        Clear, enforceable rules that prioritize animal<br />
        welfare and respectful discourse
      </>
    ),
    link: "Read Standards",
    href: "#",
    image: "/images/shield-icon.png",
  },
  {
    title: "Animal Welfare Reporting",
    description: (
      <>
        Dedicated channels for reporting abuse,<br />
        exploitation, and welfare concerns
      </>
    ),
    link: "Report Concerns",
    href: "#",
    image: "/images/bell-icon.png",
  },
  {
    title: "Profanity-Free Policy",
    description: (
      <>
        Automated and human moderation ensuring<br />
        respectful, family-friendly interactions
      </>
    ),
    link: "Learn More",
    href: "#",
    image: "/images/clock-icon.png",
  },
  {
    title: "Transparency Reports",
    description: (
      <>
        Quarterly public reporting on moderation<br />
        actions, appeals, and enforcement
      </>
    ),
    link: "View Reports",
    href: "#",
    image: "/images/check-circle-icon.png",
  },
  {
    title: "Child Safety Features",
    description: (
      <>
        Age-appropriate content filters and family<br />
        account management tools
      </>
    ),
    link: "Family Settings",
    href: "#",
    image: "/images/eye-icon.png",
  },
  {
    title: "Appeals Process",
    description: (
      <>
        Fair, transparent system for contesting<br />
        moderation decisions
      </>
    ),
    link: "Submit Appeal",
    href: "#",
    image: "/images/user-plus-icon.png",
  },
];

const enforcementSteps = [
  {
    number: "1",
    title: "Warning",
    description: (
      <>
        First violation receives<br />
        educational guidance
      </>
    ),
  },
  {
    number: "2",
    title: "Restriction",
    description: (
      <>
        Temporary limits on posting<br />
        or interaction
      </>
    ),
  },
  {
    number: "3",
    title: "Suspension",
    description: (
      <>
        Time-limited account<br />
        suspension
      </>
    ),
  },
  {
    number: "4",
    title: "Permanent Ban",
    description: (
      <>
        Severe or repeated violations<br />
        result in removal
      </>
    ),
  },
];

export default function SafetySection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-montserrat text-3xl font-extrabold text-[#111827] md:text-4xl leading-[1.2]">
            Safety Is the Product
          </h2>

          <p className="mt-6 font-inter text-xl font-normal leading-8 text-[#4B5563]">
            Our commitment to protecting animals, people, and communities through<br className="hidden md:block" />
            transparent, institutional-grade moderation
          </p>
        </div>

        {/* Safety Cards */}
        <div className="mt-20 grid gap-y-16 gap-x-12 md:grid-cols-2 xl:grid-cols-3">
          {safetyCards.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center"
            >
              <Image src={item.image} alt={item.title} width={80} height={80} className="object-contain" />

              <h3 className="mt-8 font-inter text-xl font-bold text-[#111827]">
                {item.title}
              </h3>

              <p className="mt-4 font-inter text-base font-normal leading-6 text-[#4B5563]">
                {item.description}
              </p>

              <Link
                href={item.href}
                className="mt-6 inline-flex items-center gap-2 font-inter text-base font-semibold text-[#066879] transition hover:gap-3"
              >
                {item.link}
                <span>→</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Enforcement Model */}
        <div className="mt-24 rounded-2xl bg-[#F9FAFB] px-8 py-14 lg:px-16">
          <div className="text-center">
            <h3 className="font-inter text-3xl font-bold text-[#111827]">
              Our Enforcement Model
            </h3>
          </div>

          <div className="mt-14">
            {/* Desktop */}
            <div className="hidden lg:flex items-start justify-center gap-4">
              {enforcementSteps.map((step, index) => (
                <div
                  key={step.number}
                  className="relative flex flex-1 items-start"
                >
                  <div className="flex w-full flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#066879] font-inter text-xl font-bold text-white">
                      {step.number}
                    </div>

                    <h4 className="mt-6 font-inter text-base font-bold text-[#111827]">
                      {step.title}
                    </h4>

                    <p className="mt-3 font-inter text-sm font-normal leading-6 text-[#4B5563]">
                      {step.description}
                    </p>
                  </div>

                  {index !== enforcementSteps.length - 1 && (
                    <div className="absolute right-0 top-6 -translate-y-1/2 translate-x-1/2 text-2xl font-bold text-[#9CA3AF]">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile & Tablet */}
            <div className="flex flex-col gap-8 lg:hidden">
              {enforcementSteps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#066879] font-inter text-xl font-bold text-white">
                    {step.number}
                  </div>

                  <h4 className="mt-5 font-inter text-lg font-bold text-[#111827]">
                    {step.title}
                  </h4>

                  <p className="mt-2 font-inter text-sm font-normal leading-6 text-[#4B5563]">
                    {step.description}
                  </p>

                  {index !== enforcementSteps.length - 1 && (
                    <div className="mt-5 text-3xl text-[#9CA3AF]">
                      ↓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}