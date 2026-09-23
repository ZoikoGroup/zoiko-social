import Image from "next/image";

const CAPABILITIES = [
  {
    iconDesktop: "/premium-larger-group-calls-production/icon-call-management.webp",
    emojiMobile: "/premium-larger-group-calls-production/emoji-control-knobs.webp",
    emojiAlt: "🎛️",
    title: "Call Management",
    body: "Control who joins, manage participants, and ensure smooth group calls with source-approved host tools.",
  },
  {
    iconDesktop: "/premium-larger-group-calls-production/icon-participant-controls.webp",
    emojiMobile: "/premium-larger-group-calls-production/emoji-participants.webp",
    emojiAlt: "👥",
    title: "Participant Controls",
    body: "Mute/unmute, remove disruptive participants, and manage permissions as approved by the platform.",
  },
  {
    iconDesktop: "/premium-larger-group-calls-production/icon-call-analytics.webp",
    emojiMobile: "/premium-larger-group-calls-production/emoji-analytics.webp",
    emojiAlt: "📊",
    title: "Call Analytics",
    body: "View participant count, call duration, and approved metrics to understand your community engagement.",
  },
  {
    iconDesktop: "/premium-larger-group-calls-production/icon-security-settings.webp",
    emojiMobile: "/premium-larger-group-calls-production/emoji-security.webp",
    emojiAlt: "🔐",
    title: "Security Settings",
    body: "Set call access levels, manage approvals, and maintain community safety with approved controls.",
  },
  {
    iconDesktop: "/premium-larger-group-calls-production/icon-audio-control.webp",
    emojiMobile: "/premium-larger-group-calls-production/emoji-audio.webp",
    emojiAlt: "🎵",
    title: "Audio Control",
    body: "Manage audio quality, detect speakers, and balance sound across approved devices and connections.",
  },
  {
    iconDesktop: "/premium-larger-group-calls-production/icon-customization.webp",
    emojiMobile: "/premium-larger-group-calls-production/emoji-customization.webp",
    emojiAlt: "⚙️",
    title: "Customization",
    body: "Customize your call experience with approved settings and configurations for your community.",
  },
];

/**
 * "Premium host controls" — 6 capability cards. Figma: desktop 732:4490,
 * mobile 732:4846. Same copy/order on both, but the heading glyph is a
 * genuinely different asset type per breakpoint, confirmed via
 * get_metadata:
 *  - Desktop: real vector/image nodes ("image 10", "image 8", etc, type
 *    rounded-rectangle), downloaded directly from the Figma asset server.
 *  - Mobile: literal Unicode emoji text nodes (🎛️ 👥 📊 🔐 🎵 ⚙️). Per the
 *    emoji-image rule, each was downloaded as Apple-style artwork (pixel
 *    checked against get_screenshot) rather than left as live text, since
 *    Figma's own canvas rendering doesn't match a Windows browser's emoji
 *    font.
 * Section background is #f7f9fa on both breakpoints; horizontal padding is
 * 105px desktop / 24px mobile (confirmed via get_design_context on both
 * section roots); cards stack to a single column on mobile vs. a 3-column
 * grid on desktop.
 */
export default function HostCapabilities() {
  return (
    <section className="w-full bg-[#f7f9fa] py-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[105px]">
        <h2 className="font-jakarta text-[28px] font-extrabold leading-[44.8px] text-[#102a32] lg:text-[32px]">
          Premium host controls
        </h2>
        <p className="mt-3 max-w-[800px] font-jakarta text-[15px] font-normal leading-6 text-[#5e7076] lg:mt-3">
          When you host a larger group call on Premium, you get approved management capabilities for your community.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-6 lg:grid-cols-3">
          {CAPABILITIES.map((item) => (
            <div
              key={item.title}
              className="flex w-full flex-col gap-3 rounded-[20px] border border-[#dce5e8] bg-white px-6 pb-6 pt-[23px]"
            >
              <Image
                src={item.iconDesktop}
                alt=""
                width={48}
                height={48}
                className="hidden h-12 w-12 lg:block"
              />
              <Image
                src={item.emojiMobile}
                alt={item.emojiAlt}
                width={32}
                height={32}
                className="h-8 w-8 lg:hidden"
              />
              <p className="font-jakarta text-[16px] font-bold leading-[25.6px] text-[#102a32]">{item.title}</p>
              <p className="font-jakarta text-[13px] font-normal leading-[20.8px] text-[#5e7076]">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
