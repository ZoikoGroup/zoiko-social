/**
 * Plan comparison. Figma: desktop 768:2 ("Choose your Premium plan"),
 * mobile 732:1753 ("Premium plans").
 * Confirmed via get_metadata/get_design_context that desktop and mobile
 * have genuinely different heading text, plan ORDER, and feature-list
 * COPY (not just a layout change) — reproduced verbatim rather than
 * assumed symmetric:
 *  - Desktop order: Free, Premium (highlighted, teal border), Premium+.
 *    Desktop features reference this page's call-capacity context
 *    ("Larger Group Calls", "Up to 8 participants", etc).
 *  - Mobile order: Premium, Premium+ (highlighted, orange border+shadow),
 *    Free. Mobile features reference this page's org-verification context
 *    ("Ad-free feed", "Verified org badge", "Fundraising tools", etc).
 * "✓" and "—" are plain typographic symbols, not color emoji — kept as
 * live text. Background: white both. Gutter 105px desktop / 16px mobile.
 */
const desktopPlans = [
  {
    name: "Free",
    price: "$0",
    sub: "Always free",
    features: [
      { mark: "—", label: "Larger Group Calls", dim: true },
      { mark: "✓", label: "Up to 8 participants", dim: false },
      { mark: "✓", label: "Basic features", dim: false },
    ],
    cta: "Current",
    highlight: false,
  },
  {
    name: "Premium",
    price: "$4.99",
    sub: "per month",
    features: [
      { mark: "✓", label: "✓ Larger Group Calls (50+)", dim: false },
      { mark: "✓", label: "✓ Advanced host controls", dim: false },
      { mark: "✓", label: "✓ Premium support", dim: false },
    ],
    cta: "Compare",
    highlight: true,
  },
  {
    name: "Premium+",
    price: "$9.99",
    sub: "per month",
    features: [
      { mark: "✓", label: "✓ All Premium features", dim: false },
      { mark: "✓", label: "✓ Enhanced call capacity", dim: false },
      { mark: "✓", label: "✓ VIP support", dim: false },
    ],
    cta: "Compare",
    highlight: false,
  },
];

const mobilePlans = [
  {
    name: "Premium",
    price: "$4.99",
    sub: "per month",
    features: ["Ad-free feed", "Advanced privacy", "Enhanced media"],
    cta: "Compare",
    highlight: false,
  },
  {
    name: "Premium+",
    price: "$9.99",
    sub: "per month",
    features: ["All Premium features", "Verified org badge", "Fundraising tools"],
    cta: "Upgrade",
    highlight: true,
  },
  {
    name: "Free",
    price: "$0",
    sub: "Always free",
    features: ["Basic profile", "Community features", "Post content"],
    cta: "Current",
    highlight: false,
  },
];

export default function PlanComparison() {
  return (
    <section className="w-full bg-white px-4 pb-32 pt-[47px] lg:flex lg:flex-col lg:items-center lg:px-[105px] lg:py-[80px]">
      {/* Desktop */}
      <div className="mx-auto hidden w-full max-w-[1280px] flex-col items-start gap-12 lg:flex lg:w-[1182px]">
        <h2 className="font-jakarta text-[32px] font-extrabold leading-[44.8px] text-[#102a32]">
          Choose your Premium plan
        </h2>
        <div className="flex w-full items-start justify-center gap-6">
          {desktopPlans.map((plan) => (
            <div
              key={plan.name}
              className={`flex w-[372px] flex-col overflow-hidden rounded-2xl border bg-white ${
                plan.highlight ? "border-2 border-[#066879]" : "border-[#dce5e8]"
              }`}
            >
              <div className="flex flex-col items-start gap-0 border-b border-[#dce5e8] bg-[#f7f9fa] px-6 pb-6 pt-[23px]">
                <p className="font-jakarta text-[17px] font-bold leading-[27.2px] text-[#102a32]">{plan.name}</p>
                <p className="pt-[15px] font-jakarta text-[28px] font-extrabold leading-[44.8px] text-[#066879]">
                  {plan.price}
                </p>
                <p className="font-jakarta text-[12px] font-normal leading-[19.2px] text-[#5e7076]">{plan.sub}</p>
              </div>
              <div className="flex flex-col items-start gap-6 p-6">
                <div className="flex w-full flex-col items-start">
                  {plan.features.map((f) => (
                    <div key={f.label} className="flex w-full items-start gap-3 py-3">
                      <p className="font-jakarta text-[13px] font-extrabold leading-[20.8px] text-[#066879]">
                        {f.mark}
                      </p>
                      <p
                        className={`font-jakarta text-[13px] font-normal leading-[20.8px] ${
                          f.dim ? "text-[#5e7076]" : "text-[#102a32]"
                        }`}
                      >
                        {f.label}
                      </p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className={`flex min-h-[40px] w-full items-center justify-center rounded-xl px-5 text-center font-jakarta text-[14px] font-semibold ${
                    plan.highlight
                      ? "bg-[#066879] py-[11px] text-white"
                      : "border border-[#dce5e8] bg-white py-[10px] text-[#066879]"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="w-full text-center font-jakarta text-[12px] font-normal leading-[19.2px] text-[#5e7076]">
          Pricing is representative. Exact participant limits sourced from your approved Premium catalog.
        </p>
      </div>

      {/* Mobile */}
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-10 lg:hidden">
        <h2 className="font-jakarta text-[24px] font-extrabold leading-[28.8px] tracking-[-0.24px] text-[#102a32]">
          Premium plans
        </h2>
        <div className="flex w-full flex-col items-start gap-6">
          {mobilePlans.map((plan) => (
            <div
              key={plan.name}
              className={`flex w-full flex-col items-start gap-4 rounded-[28px] border bg-white p-8 ${
                plan.highlight
                  ? "border-2 border-[#e88924] shadow-[0px_20px_24px_rgba(7,59,71,0.16)]"
                  : "border-2 border-[#dce5e8]"
              }`}
            >
              <p className="w-full text-center font-jakarta text-[20px] font-bold leading-normal text-[#102a32]">
                {plan.name}
              </p>
              <p className="w-full text-center font-jakarta text-[32px] font-extrabold leading-normal text-[#066879]">
                {plan.price}
              </p>
              <p className="w-full text-center font-jakarta text-[13px] font-normal leading-[20.8px] text-[#5e7076]">
                {plan.sub}
              </p>
              <div className="flex w-full flex-col items-start gap-3 py-2">
                {plan.features.map((f) => (
                  <div key={f} className="relative flex w-full items-start pl-6">
                    <span className="absolute left-0 top-[3px] font-jakarta text-[14px] font-bold leading-normal text-[#e88924]">
                      ✓
                    </span>
                    <span className="font-jakarta text-[14px] font-normal leading-normal text-[#5e7076]">{f}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className={`flex min-h-[40px] w-full items-center justify-center rounded-xl px-5 py-3 text-center font-jakarta text-[14px] font-bold ${
                  plan.highlight ? "bg-[#e88924] text-white" : "border border-[#dce5e8] bg-white text-[#102a32]"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
