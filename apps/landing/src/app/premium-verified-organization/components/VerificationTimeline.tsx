/**
 * "Verification timeline" — 4 numbered steps.
 * Figma: desktop 732:1425, mobile 732:1684.
 * Desktop: 4 columns in a row, connected by a horizontal divider line
 * running behind the numbered circles (absolute-positioned, left-31/right-271
 * in Figma — reproduced with a full-width divider clipped by the row's own
 * horizontal padding via the circles sitting above it).
 * Mobile: stacked single column, no divider (confirmed — no divider node in
 * mobile's tree), centered text.
 * Background: #f7f9fa both. Gutter 105px desktop / 16px mobile.
 */
const steps = [
  { n: 1, title: "Submit docs", body: "Upload organization credentials and proof of operation." },
  { n: 2, title: "Team review", body: "Our verification team reviews your application." },
  { n: 3, title: "Confirm details", body: "We may contact you to verify information." },
  { n: 4, title: "Approved", body: "Your organization badge is live on your profile." },
];

export default function VerificationTimeline() {
  return (
    <section className="w-full bg-[#f7f9fa] px-4 pb-32 pt-[47px] lg:px-[105px] lg:py-[80px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-10 lg:gap-12">
        <h2 className="font-jakarta text-[24px] font-extrabold leading-[28.8px] tracking-[-0.24px] text-[#102a32] lg:text-[32px] lg:leading-[38.4px] lg:tracking-[-0.32px]">
          Verification timeline
        </h2>

        {/* Desktop: 4-column row with connecting divider */}
        <div className="relative hidden w-full items-start justify-center gap-6 lg:flex">
          {steps.map((step, i) => (
            <div key={step.n} className="relative flex min-w-0 flex-1 flex-col items-start gap-4 pb-4">
              {i < steps.length - 1 && (
                <div className="absolute left-[20px] top-5 h-[2px] w-[calc(100%+24px)] bg-[#dce5e8]" />
              )}
              <div className="relative z-10 flex w-10 shrink-0 items-start justify-center rounded-[20px] bg-[#e88924]">
                <p className="font-jakarta text-[16px] font-extrabold leading-[40px] text-white">{step.n}</p>
              </div>
              <h3 className="font-jakarta text-[17px] font-bold leading-normal text-[#066879]">{step.title}</h3>
              <p className="w-[212px] font-jakarta text-[16px] font-normal leading-[25.6px] text-[#5e7076]">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile: stacked, centered */}
        <div className="flex w-full flex-col items-center gap-6 lg:hidden">
          {steps.map((step) => (
            <div key={step.n} className="flex w-full flex-col items-center gap-4 pb-4">
              <div className="flex w-10 shrink-0 items-start justify-center rounded-[20px] bg-[#e88924]">
                <p className="font-jakarta text-[16px] font-extrabold leading-[40px] text-white">{step.n}</p>
              </div>
              <h3 className="font-jakarta text-[17px] font-bold leading-normal text-[#066879]">{step.title}</h3>
              <p className="text-center font-jakarta text-[16px] font-normal leading-[25.6px] text-[#5e7076]">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
