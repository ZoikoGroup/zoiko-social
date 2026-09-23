/**
 * "Eligibility requirements" — 3 text-only cards.
 * Figma: desktop 732:1475, mobile 732:1733. Same content/layout pattern on
 * both, only the grid arrangement changes (3-across desktop, stacked
 * mobile). Background: #f7f9fa both. Gutter 105px desktop / 16px mobile.
 */
const requirements = [
  {
    title: "Legal entity",
    body: "Registered nonprofit, government agency, or licensed business with verified credentials.",
  },
  {
    title: "Active presence",
    body: "Zoiko organization profile in good standing for at least 3 months.",
  },
  {
    title: "Community focus",
    body: "Demonstrated engagement with animal-related communities.",
  },
];

export default function EligibilityRequirements() {
  return (
    <section className="w-full bg-[#f7f9fa] px-4 pb-32 pt-[47px] lg:px-[105px] lg:py-[80px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-10 lg:gap-12">
        <h2 className="font-jakarta text-[24px] font-extrabold leading-[28.8px] tracking-[-0.24px] text-[#102a32] lg:text-[32px] lg:leading-[38.4px] lg:tracking-[-0.32px]">
          Eligibility requirements
        </h2>

        <div className="flex w-full flex-col items-start gap-6 lg:flex-row lg:justify-center">
          {requirements.map((req) => (
            <div
              key={req.title}
              className="flex w-full flex-col items-start gap-[15px] rounded-2xl border border-[#dce5e8] bg-white px-6 pb-10 pt-6 shadow-[0px_1px_1px_rgba(7,59,71,0.06)] lg:flex-1"
            >
              <h3 className="font-jakarta text-[17px] font-bold leading-normal text-[#066879]">{req.title}</h3>
              <p className="font-jakarta text-[16px] font-normal leading-[25.6px] text-[#5e7076]">{req.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
