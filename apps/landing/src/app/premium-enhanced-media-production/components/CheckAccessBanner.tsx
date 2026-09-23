/**
 * "Check your media access" CTA banner. Same copy and colors on both
 * breakpoints (confirmed via get_design_context on desktop 732:5388 and
 * mobile 732:5811/732:5812) — only the corner radius (28px desktop, 20px
 * mobile per Figma) and button layout (row on desktop, stacked full-width
 * on mobile) differ.
 */
export default function CheckAccessBanner() {
  return (
    <section className="w-full bg-[#f7f9fa] py-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[105px]">
        <div className="flex w-full flex-col items-start gap-4 rounded-[20px] border border-[#dce5e8] bg-[#eef8f9] px-8 py-8 lg:rounded-[28px] lg:px-8 lg:py-[31px]">
          <h2 className="font-jakarta text-[18px] font-bold leading-[28.8px] text-[#066879]">
            Check your media access
          </h2>
          <p className="font-jakarta text-[16px] font-normal leading-[25.6px] text-[#102a32]">
            Sign in to see which Enhanced Media capabilities are available for your account and plan.
          </p>
          <div className="flex w-full flex-col items-start gap-4 pt-2 lg:w-auto lg:flex-row lg:flex-wrap">
            <button
              type="button"
              className="flex min-h-[40px] w-full items-center justify-center rounded-xl bg-[#066879] px-5 py-[11px] text-center font-jakarta text-[14px] font-semibold text-white lg:w-auto"
            >
              Sign In
            </button>
            <button
              type="button"
              className="flex min-h-[40px] w-full items-center justify-center rounded-xl border border-[#dce5e8] bg-white px-5 py-[10px] text-center font-jakarta text-[14px] font-semibold text-[#066879] lg:w-auto"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
