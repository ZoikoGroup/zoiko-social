import Image from "next/image";
import { C } from "./theme";

const OTHER_OPTIONS = [
  { icon: "icon-book", label: "Search Help Center" },
  { icon: "icon-pulse", label: "Check System Status" },
  { icon: "icon-users", label: "Specialist teams" },
];

/**
 * Section - 02 · HERO.
 *
 * Full-bleed photo (a dog close-up) with a dark gradient wash and a centered
 * white card: eyebrow, "Contact Us" heading, intro copy, the "Start contact
 * request" primary button and a row of secondary links. Two small floating
 * "Pick a reason" / "Send only what's needed" badges sit over the photo on
 * desktop only (Figma doesn't place them on the narrower mobile frame).
 * Desktop node 1274:2477, mobile node 1274:3337 — same source photo at both
 * breakpoints, just cropped differently, so a single <Image> is reused.
 */
export default function Hero() {
  return (
    <section className="w-full bg-white">
      <div className="relative flex w-full flex-col items-center overflow-hidden lg:h-[520px] lg:justify-center">
        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(140deg, ${C.brand} 0%, ${C.orange} 100%)` }}>
          <Image
            src="/support&developers-contact-us/hero-contact-photo.webp"
            alt="Dog looking directly at the camera outdoors"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 lg:hidden"
            style={{ backgroundImage: `linear-gradient(to bottom, rgba(7,59,71,0.15) 0%, rgba(7,59,71,0.45) 100%)` }}
          />
          <div
            className="absolute inset-0 hidden lg:block"
            style={{ backgroundImage: `linear-gradient(to bottom, rgba(7,27,32,0.88) 0%, rgba(7,42,50,0.55) 90%, rgba(7,59,71,0.3) 214%)` }}
          />
        </div>

        <div className="relative flex w-full flex-col items-center gap-2.5 rounded-t-[28px] bg-white px-5 pb-5 pt-[104px] lg:mt-0 lg:w-[866px] lg:rounded-[28px] lg:px-12 lg:py-9 lg:shadow-[0px_20px_24px_rgba(7,59,71,0.16)]">
          <p className="text-center text-xs font-bold uppercase tracking-[1.44px]" style={{ color: C.brand }}>
            Support &amp; Developers
          </p>
          <div className="flex flex-col items-center gap-2 pb-2">
            <h1
              className="text-center text-[30px] font-extrabold leading-[32.4px] tracking-[-0.6px] lg:text-[48px] lg:leading-[51.84px] lg:tracking-[-0.96px]"
              style={{ color: C.brandDeep }}
            >
              Contact Us
            </h1>
            <p className="max-w-[512px] text-center text-base leading-[24.8px] lg:text-[17.5px] lg:leading-[27.13px]" style={{ color: C.muted }}>
              Tell us what you need and we&apos;ll point you to the right team.
            </p>
          </div>

          <button
            type="button"
            className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl px-7 text-base font-semibold text-white lg:w-auto"
            style={{ backgroundColor: C.brand }}
          >
            <Image src="/support&developers-contact-us/icon-chat.webp" alt="" width={20} height={20} />
            Start contact request
          </button>

          <div
            className="flex w-full items-start justify-center gap-1 border-t pt-[22px] lg:w-auto lg:gap-2.5 lg:pt-2"
            style={{ borderColor: C.line }}
          >
            {OTHER_OPTIONS.map((opt) => (
              <div key={opt.label} className="flex flex-1 flex-col items-center gap-2 rounded-xl px-0.5 py-2 lg:w-[174px] lg:flex-none lg:gap-[7.5px]">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px]" style={{ backgroundColor: C.chip }}>
                  <Image src={`/support&developers-contact-us/${opt.icon}.webp`} alt="" width={18} height={18} />
                </span>
                <span className="text-center text-[12.5px] font-semibold leading-5 lg:text-sm lg:leading-[22.4px]" style={{ color: C.ink }}>
                  {opt.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 right-8 z-10 hidden flex-col items-end gap-3 lg:flex">
          <div className="flex items-center gap-2.5 rounded-2xl bg-white py-2.5 pl-2.5 pr-4 shadow-[0px_8px_12px_rgba(7,59,71,0.1)]">
            <span className="flex size-8 items-center justify-center rounded-[10px]" style={{ backgroundColor: C.chip }}>
              <Image src="/support&developers-contact-us/icon-layers.webp" alt="" width={16} height={16} />
            </span>
            <span className="whitespace-nowrap text-sm font-bold leading-[22.4px]" style={{ color: C.brandDeep }}>
              Pick a reason
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl bg-white py-2.5 pl-2.5 pr-4 shadow-[0px_8px_12px_rgba(7,59,71,0.1)]">
            <span className="flex size-8 items-center justify-center rounded-[10px]" style={{ backgroundColor: C.chip }}>
              <Image src="/support&developers-contact-us/icon-send.webp" alt="" width={16} height={16} />
            </span>
            <span className="whitespace-nowrap text-sm font-bold leading-[22.4px]" style={{ color: C.brandDeep }}>
              Send only what&apos;s needed
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
