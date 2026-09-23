/**
 * "Check your call access" — mobile-only CTA banner. Figma: mobile-only
 * node 732:4970. Confirmed absent from the desktop frame's metadata
 * entirely — desktop's node tree has no equivalent section anywhere
 * between "How group calls scale" and "Choose your Premium plan" (or after
 * it). Background is #eef8f9 (Black Squeeze) with a #dce5e8 border and
 * 28px corner radius, matching the sibling "Check your media access"
 * banner pattern but restricted to mobile per this frame's actual content.
 */
export default function AccountAccessBanner() {
  return (
    <section className="w-full bg-white px-6 py-12 lg:hidden">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="flex w-full flex-col items-start gap-4 rounded-[28px] border border-[#dce5e8] bg-[#eef8f9] px-8 py-8">
          <h2 className="font-jakarta text-[18px] font-bold leading-[28.8px] text-[#066879]">
            Check your call access
          </h2>
          <p className="font-jakarta text-[16px] font-normal leading-[25.6px] text-[#102a32]">
            Sign in to see your current group call capacity and available Premium host controls.
          </p>
          <div className="flex w-full flex-col items-start gap-4 pt-2">
            <button
              type="button"
              className="flex min-h-[40px] w-full items-center justify-center rounded-xl bg-[#066879] px-5 py-[11px] text-center font-jakarta text-[14px] font-semibold text-white"
            >
              Sign In
            </button>
            <button
              type="button"
              className="flex min-h-[40px] w-full items-center justify-center rounded-xl border border-[#dce5e8] bg-white px-5 py-[10px] text-center font-jakarta text-[14px] font-semibold text-[#066879]"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
