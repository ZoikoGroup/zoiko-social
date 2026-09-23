const AVAILABLE = [
  "Higher resolution uploads",
  "Enhanced quality processing",
  "Approved format support",
  "Better playback quality",
  "Adaptive rendering",
  "Premium device support",
];

const NOT_INCLUDED = [
  "Guaranteed 4K/8K resolution",
  "Lossless or RAW support",
  "Unlimited file size",
  "Instant processing",
  "Network speed guarantee",
  "Editing/production tools",
];

/**
 * "What you get and don't get" — mobile-only. Two checklist cards (available
 * vs. not included) plus a warning callout about what Enhanced Media does
 * NOT do.
 *
 * Figma: mobile-only, node 732:5758 (Container 732:5761, warning box
 * 732:5806). Confirmed absent from the desktop frame's metadata entirely —
 * desktop's node tree has no equivalent section anywhere between "Media
 * quality tiers" and "What you can do" (or after it). All checkmarks (✓),
 * crosses (✕), and the warning icon (⚠️) are literal text-node glyphs
 * (confirmed via get_metadata node type), not vector assets.
 */
export default function WhatYouGetDontGet() {
  return (
    <section className="w-full bg-white py-12 lg:hidden">
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <h2 className="font-jakarta text-[28px] font-extrabold leading-[36.3px] text-[#102a32]">
          What you get and don&rsquo;t get
        </h2>

        <div className="mt-6 flex flex-col gap-8">
          <div className="flex w-full flex-col gap-6 rounded-[20px] border-2 border-[#dce5e8] bg-white p-8">
            <p className="border-b-2 border-[#066879] pb-[13.5px] font-jakarta text-[18px] font-bold leading-[28.8px] text-[#066879]">
              ✓ Available with Premium
            </p>
            <div className="flex flex-col">
              {AVAILABLE.map((item) => (
                <div key={item} className="flex items-start gap-3 py-[11.7px]">
                  <span className="font-jakarta text-[14px] font-extrabold leading-[22.4px] text-[#066879]">✓</span>
                  <span className="font-jakarta text-[14px] font-normal leading-[22.4px] text-[#102a32]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-6 rounded-[20px] border-2 border-[#dce5e8] bg-white p-8 opacity-85">
            <p className="border-b-2 border-[#066879] pb-[13.5px] font-jakarta text-[18px] font-bold leading-[28.8px] text-[#066879]">
              ✕ NOT included with Premium
            </p>
            <div className="flex flex-col">
              {NOT_INCLUDED.map((item) => (
                <div key={item} className="flex items-start gap-3 py-[11.7px]">
                  <span className="font-jakarta text-[14px] font-extrabold leading-[22.4px] text-[#5e7076]">✕</span>
                  <span className="font-jakarta text-[14px] font-normal leading-[22.4px] text-[#102a32]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex w-full flex-col gap-3 rounded-[20px] border border-[#dce5e8] px-8 pb-8 pt-12"
            style={{ backgroundImage: "linear-gradient(134deg, #fff5e8 0%, rgba(232,137,36,0.05) 100%)" }}
          >
            <p className="font-jakarta text-[15px] font-bold leading-6 text-[#c9701a]">
              ⚠️ Important: What Enhanced Media
              <br />
              does NOT do
            </p>
            <p className="font-jakarta text-[13px] font-normal leading-[22.1px] text-[#102a32]">
              Enhanced Media provides approved higher-quality photo and video uploads on Premium. It does NOT:
              guarantee 4K/8K or lossless quality, promise zero compression, include unlimited file size or duration,
              guarantee instant processing or specific processing times, overcome network limitations, include
              editing or recording tools, or exempt content from safety/moderation rules. Actual quality depends on
              device, network, and approved source capabilities. All media remains subject to platform policies,
              copyright enforcement, and safety controls regardless of Premium status.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
