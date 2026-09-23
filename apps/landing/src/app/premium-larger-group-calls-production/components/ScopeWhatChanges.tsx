import Image from "next/image";

const AVAILABLE = [
  "Larger participant capacity (50+ approved)",
  "Advanced host controls",
  "Participant management",
  "Longer call duration",
  "Enhanced audio/video settings",
  "Call analytics and metrics",
];

const NOT_INCLUDED = [
  "Guaranteed HD or 4K quality",
  "Recording or transcription",
  "Live streaming capabilities",
  "Phone/dial-in access",
  "Screen sharing (not approved)",
  "Safety enforcement bypass",
];

/**
 * "What you can and cannot do" — mobile-only. Figma: mobile-only node
 * 732:4895. Confirmed absent from the desktop frame's metadata entirely —
 * desktop's node tree has no section between "Premium host controls" and
 * "How group calls scale" (or anywhere else) with this heading or these
 * checklist items; desktop goes straight from host capabilities to the
 * progression section. Two checklist cards (available vs. not included)
 * plus a warning callout about what Larger Group Calls does NOT do.
 *
 * The ✓ / ✕ / — glyphs are plain typographic symbols (rendered in the body
 * font, not a color emoji font) and are kept as literal text, matching the
 * convention used on every sibling page. The ⚠️ warning-sign glyph IS a
 * genuine pictographic emoji (confirmed via get_metadata as a text node,
 * but Apple- vs. Windows-rendered warning-sign artwork differs), so per
 * this round's emoji-image rule it was downloaded as Apple-style artwork
 * (codepoint 26a0-fe0f) and pixel-checked against get_screenshot rather
 * than left as live Unicode text.
 */
export default function ScopeWhatChanges() {
  return (
    <section className="w-full bg-white py-12 lg:hidden">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[105px]">
        <h2 className="font-jakarta text-[28px] font-extrabold leading-[44.8px] text-[#102a32]">
          What you can and cannot do
        </h2>

        <div className="mt-8 flex flex-col gap-8">
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
            <p className="flex items-start gap-2 font-jakarta text-[15px] font-bold leading-6 text-[#c9701a]">
              <Image
                src="/premium-larger-group-calls-production/emoji-warning.webp"
                alt="⚠️"
                width={18}
                height={18}
                className="mt-[3px] h-[18px] w-[18px] shrink-0"
              />
              <span>Important: What Larger Group Calls does NOT do</span>
            </p>
            <p className="font-jakarta text-[13px] font-normal leading-[22.1px] text-[#102a32]">
              Larger Group Calls lets you host approved participant capacity on Premium. It does NOT: guarantee
              unlimited participants, promise HD or specific quality levels, include recording/livestream/screen
              sharing (unless separately approved), bypass safety policies, guarantee call stability/latency, or
              exempt you from community standards. Exact participant limits are source-controlled and may vary by
              region/platform. All participants remain subject to Zoiko&rsquo;s safety, moderation, and blocking
              controls regardless of Premium status.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
