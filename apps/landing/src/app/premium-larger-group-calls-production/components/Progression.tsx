const STEPS = [
  {
    title: "1. Start a Call",
    body: "Initiate a group call with your community. Free members can invite up to 8 participants. Premium members unlock larger capacity.",
  },
  {
    title: "2. Manage Participants",
    body: "Use Premium host controls to manage who joins, mute/unmute, remove disruptive members, and maintain call quality.",
  },
  {
    title: "3. Engage Your Community",
    body: "Host larger approved group calls with approved analytics and controls. Scale conversations as your community grows.",
  },
];

/**
 * "How group calls scale" — 3-step progression card. Figma: desktop
 * 732:4594, mobile 732:4948. Identical copy on both breakpoints (confirmed
 * via get_design_context) — only layout changes: a 3-column row on desktop
 * vs. a single stacked column on mobile. Section background #f7f9fa,
 * horizontal padding 105px desktop / 24px mobile on both.
 */
export default function Progression() {
  return (
    <section className="w-full bg-[#f7f9fa] py-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[105px]">
        <h2 className="font-jakarta text-[28px] font-extrabold leading-[44.8px] text-[#102a32] lg:text-[32px]">
          How group calls scale
        </h2>
        <div className="mt-6 flex flex-col gap-8 rounded-[28px] border border-[#dce5e8] bg-white p-8 lg:mt-6 lg:flex-row lg:justify-center lg:gap-8 lg:p-12">
          {STEPS.map((step) => (
            <div key={step.title} className="flex flex-col gap-4 lg:flex-1">
              <p className="font-jakarta text-[16px] font-bold leading-[25.6px] text-[#102a32]">{step.title}</p>
              <p className="font-jakarta text-[13px] font-normal leading-[20.8px] text-[#5e7076]">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
