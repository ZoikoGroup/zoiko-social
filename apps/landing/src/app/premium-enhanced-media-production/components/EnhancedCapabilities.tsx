import Image from "next/image";

const GROUPS = [
  {
    emojiSrc: "/premium-enhanced-media-production/emoji-photo-upload.webp",
    emojiAlt: "📸",
    title: "Photo Upload",
    items: ["Higher resolution uploads", "Better image processing", "Source quality preservation", "Approved format support"],
  },
  {
    emojiSrc: "/premium-enhanced-media-production/emoji-video-upload.webp",
    emojiAlt: "🎥",
    title: "Video Upload",
    items: ["Enhanced video quality", "Higher bitrate options", "Approved codec support", "Extended duration options"],
  },
  {
    emojiSrc: "/premium-enhanced-media-production/emoji-processing.webp",
    emojiAlt: "⚙️",
    title: "Processing",
    items: ["Advanced optimization", "Quality preservation", "Faster processing", "Multi-format support"],
  },
  {
    emojiSrc: "/premium-enhanced-media-production/emoji-playback.webp",
    emojiAlt: "📺",
    title: "Playback",
    items: ["Adaptive quality rendering", "Multi-device support", "Network optimization", "Smooth playback options"],
  },
];

/**
 * "Enhanced capabilities" — mobile-only, four cards each with an emoji
 * heading and an arrow-bulleted list.
 *
 * Figma: mobile-only, node 732:5681 (Container 732:5685). Confirmed absent
 * from the desktop frame's metadata — desktop has no node at any id with
 * this heading or these four card titles anywhere in its tree (verified by
 * reading the full desktop get_metadata dump end to end). The "→" bullet
 * markers are literal Figma text glyphs, reproduced as plain text.
 *
 * The heading emoji (📸 🎥 ⚙️ 📺) ARE literal Unicode text in the Figma
 * text nodes, but Figma's own canvas renders them with Apple's emoji
 * artwork, which looks nothing like the emoji font Chrome/Windows renders
 * for the same codepoints — confirmed by comparing get_screenshot output
 * for each glyph node against the live page. Since Figma exposes no
 * downloadable image asset for a text-node emoji, the matching Apple-style
 * PNGs were sourced from the `emoji-datasource-apple` set (by Unicode
 * codepoint: 1f4f8, 1f3a5, 2699-fe0f, 1f4fa), downloaded, and pixel-checked
 * against each get_screenshot before use, so the rendered result matches
 * Figma exactly rather than depending on the visitor's OS emoji font.
 */
export default function EnhancedCapabilities() {
  return (
    <section className="w-full bg-white py-12 lg:hidden">
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <h2 className="font-jakarta text-[28px] font-extrabold leading-[38.4px] text-[#102a32]">
          Enhanced capabilities
        </h2>
        <div className="mt-6 flex flex-col gap-8">
          {GROUPS.map((group) => (
            <div key={group.title} className="flex w-full flex-col gap-4 rounded-[20px] border border-[#dce5e8] bg-white p-6">
              <div className="flex items-center gap-3">
                <Image src={group.emojiSrc} alt={group.emojiAlt} width={24} height={24} className="h-6 w-6" />
                <p className="font-jakarta text-[16px] font-bold leading-[25.6px] text-[#102a32]">{group.title}</p>
              </div>
              <div className="flex flex-col text-[13px]">
                {group.items.map((item) => (
                  <div key={item} className="flex items-start gap-3 py-2">
                    <span className="font-jakarta font-bold leading-[20.8px] text-[#066879]">→</span>
                    <span className="font-jakarta font-normal leading-[20.8px] text-[#5e7076]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
