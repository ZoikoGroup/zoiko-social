import Image from "next/image";
import { C } from "./theme";

const RELATED_LINKS = [
  { icon: "icon-book-outline", label: "Help Center" },
  { icon: "icon-chat", label: "Contact Us" },
  { icon: "icon-pulse", label: "System Status" },
];

/**
 * Section - 02 · HERO.
 *
 * Centered "Accessibility Support" heading and intro copy, two link cards
 * (Find accessibility help / Report a barrier), a row of related-support
 * pill links, and a bottom strip of photo tiles. The photo-strip images
 * differ between breakpoints (desktop shows 4 tiles, mobile shows 2 —
 * confirmed by distinct Figma asset hashes and file sizes, not just a
 * cropped version of the same photos), so this ships fully separate
 * desktop/mobile strips gated `hidden lg:flex` / `lg:hidden`.
 */
export default function Hero() {
  return (
    <section className="w-full bg-white pt-8 lg:pt-[72px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-6 px-5 lg:gap-[48px] lg:px-[105px]">
        <div className="flex w-full flex-col items-center gap-3 lg:gap-[12px]">
          <p className="text-xs font-bold uppercase tracking-[1.44px]" style={{ color: C.brand }}>
            Support &amp; Developers
          </p>
          <h1
            className="text-center text-[30px] font-extrabold leading-[32.4px] tracking-[-0.6px] lg:text-[48px] lg:leading-[51.84px] lg:tracking-[-0.96px]"
            style={{ color: C.brandDeep }}
          >
            Accessibility Support
          </h1>
          <p
            className="max-w-[556px] text-center text-[16.5px] leading-[26.4px] lg:max-w-[640px] lg:text-[19px] lg:leading-[30.4px]"
            style={{ color: C.muted }}
          >
            Get help using Zoiko Social in the way that works for you, or tell us about something that&apos;s in your way.
          </p>

          <div className="flex w-full max-w-[560px] flex-col gap-3 pt-3 lg:max-w-[880px] lg:flex-row lg:gap-5 lg:pt-6">
            <div
              className="flex w-full items-center gap-[18px] rounded-[28px] border p-[18px] lg:min-h-[112px] lg:flex-1 lg:p-[26px]"
              style={{ backgroundColor: C.brand, borderColor: C.brand }}
            >
              <span className="flex size-[46px] shrink-0 items-center justify-center rounded-2xl bg-white/15 lg:size-[56px]">
                <Image src="/support&developers-accessibility-support/icon-book-fill.webp" alt="" width={26} height={26} />
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-[17px] font-bold leading-[22.1px] text-white lg:text-[19px] lg:leading-[24.7px]">
                  Find accessibility help
                </p>
                <p className="text-[15px] leading-6" style={{ color: C.onBrandMuted }}>
                  Guides, known issues and workarounds
                </p>
              </div>
              <Image
                src="/support&developers-accessibility-support/icon-chevron-teal.webp"
                alt=""
                width={20}
                height={20}
                className="ml-auto shrink-0"
              />
            </div>

            <div
              className="flex w-full items-center gap-[18px] rounded-[28px] border bg-white p-[18px] lg:min-h-[112px] lg:flex-1 lg:p-[26px]"
              style={{ borderColor: C.line }}
            >
              <span className="flex size-[46px] shrink-0 items-center justify-center rounded-2xl lg:size-[56px]" style={{ backgroundColor: C.chip }}>
                <Image src="/support&developers-accessibility-support/icon-flag.webp" alt="" width={26} height={26} />
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-[17px] font-bold leading-[22.1px] lg:text-[19px] lg:leading-[24.7px]" style={{ color: C.brandDeep }}>
                  Report a barrier
                </p>
                <p className="text-[15px] leading-6" style={{ color: C.muted }}>
                  Tell us what&apos;s getting in your way
                </p>
              </div>
              <Image
                src="/support&developers-accessibility-support/icon-chevron-right.webp"
                alt=""
                width={20}
                height={20}
                className="ml-auto shrink-0"
              />
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-2.5 pt-2.5 lg:flex-row lg:flex-wrap lg:justify-center lg:gap-2 lg:pt-[10px]">
            {RELATED_LINKS.map((link) => (
              <a
                key={link.label}
                href="#"
                className="flex min-h-10 w-full max-w-[280px] items-center gap-2 rounded-full border bg-white pl-1.5 pr-3.5 lg:w-auto"
                style={{ borderColor: C.line }}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-[14px]" style={{ backgroundColor: C.chip }}>
                  <Image src={`/support&developers-accessibility-support/${link.icon}.webp`} alt="" width={15} height={15} />
                </span>
                <span className="text-sm font-semibold" style={{ color: C.ink }}>
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="hidden h-[240px] w-full items-end justify-center gap-4 lg:flex">
          <div className="relative h-[91px] flex-1 overflow-hidden rounded-t-[28px] lg:h-[168px]">
            <Image src="/support&developers-accessibility-support/hero-strip-1.webp" alt="Kittens sitting together outdoors" fill sizes="25vw" className="object-cover" />
          </div>
          <div className="relative h-full flex-1 overflow-hidden rounded-t-[28px]">
            <Image src="/support&developers-accessibility-support/hero-strip-2.webp" alt="Dog standing on a path outdoors" fill sizes="25vw" className="object-cover" />
          </div>
          <div className="relative h-[148.8px] flex-1 overflow-hidden rounded-t-[28px] lg:h-[196.8px]">
            <Image src="/support&developers-accessibility-support/hero-strip-3.webp" alt="Rabbit and dog together outdoors" fill sizes="25vw" className="object-cover" />
          </div>
          <div className="relative h-[91px] flex-1 overflow-hidden rounded-t-[28px] lg:h-[148.8px]">
            <Image src="/support&developers-accessibility-support/hero-strip-4.webp" alt="Cat and dog together outdoors" fill sizes="25vw" className="object-cover" />
          </div>
        </div>

        <div className="flex h-[130px] w-full items-end justify-center gap-4 lg:hidden">
          <div className="relative h-[91px] flex-1 overflow-hidden rounded-t-[28px]">
            <Image src="/support&developers-accessibility-support/hero-strip-1-mobile.webp" alt="Cat looking at the camera" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="relative h-full flex-1 overflow-hidden rounded-t-[28px]">
            <Image src="/support&developers-accessibility-support/hero-strip-2-mobile.webp" alt="Two dogs running outdoors together" fill sizes="50vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
