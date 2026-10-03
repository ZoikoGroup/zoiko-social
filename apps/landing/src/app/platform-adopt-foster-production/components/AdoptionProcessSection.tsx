interface ProcessStep {
  step: number;
  title: string;
  description: string;
  isHighlight?: boolean;
}

const STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "Browse & Find",
    description:
      "Search and find your perfect match from thousands of available animals.",
    isHighlight: true,
  },
  {
    step: 2,
    title: "Connect",
    description:
      "Contact the shelter or rescue and learn more about your chosen animal.",
  },
  {
    step: 3,
    title: "Meet & Greet",
    description:
      "Visit in person and spend time with the animal to ensure compatibility.",
  },
  {
    step: 4,
    title: "Welcome Home",
    description:
      "Complete the adoption process and bring your new family member home!",
  },
];

export default function AdoptionProcessSection() {
  return (
    <section
      id="how-adoption-works"
      className="w-full bg-[#F7F9FA] pb-16 lg:pb-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Heading */}
        <h2 className="text-center text-2xl font-extrabold tracking-[-0.01em] text-[#102A32] sm:text-3xl lg:text-[36px] lg:leading-[43.2px]">
          How Adoption Works
        </h2>

        {/* 4 Connected Cards Grid */}
        <div className="relative mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className={`relative z-10 flex flex-col items-center rounded-[20px] border border-[#DCE5E8] p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                item.isHighlight ? "bg-[#EEF8F9]" : "bg-white"
              }`}
            >
              {/* Number Badge */}
              <div
                className={`flex h-[60px] w-[60px] items-center justify-center rounded-full text-xl font-extrabold shadow-sm ${
                  item.isHighlight
                    ? "bg-[#066879] text-white"
                    : "border border-[#DCE5E8] bg-[#F7F9FA] text-[#102A32]"
                }`}
              >
                {item.step}
              </div>

              {/* Title */}
              <h3 className="mt-5 text-base font-bold text-[#102A32]">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-2.5 text-sm font-normal leading-relaxed text-[#5E7076]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}