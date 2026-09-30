import Image from "next/image";
import { C } from "./theme";

/**
 * Section - 10 · BUSINESS / PRESS (render-gated) — "Partnerships or press?".
 * Figma labels this "Shown only if an approved route exists"; this route has
 * no real approval/permission state to gate on, so — same judgment call as
 * "Follow the topics you love" on the community-forums page — it renders
 * unconditionally.
 */
export default function BusinessPress() {
  return (
    <section className="w-full bg-white px-5 py-8 lg:px-[105px] lg:py-12">
      <div
        className="mx-auto flex w-full max-w-[1280px] flex-col overflow-hidden rounded-[32px] border lg:flex-row"
        style={{ borderColor: C.line }}
      >
        <div className="relative h-[300px] w-full lg:h-auto lg:min-h-[300px] lg:flex-1">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `linear-gradient(135deg, ${C.brand} 0%, ${C.orange} 100%)` }}
          />
          <Image
            src="/support&developers-contact-us/business-press-photo-mobile.webp"
            alt="Cat and dog snuggling together outdoors in the grass"
            fill
            sizes="100vw"
            className="object-cover lg:hidden"
          />
          <Image
            src="/support&developers-contact-us/business-press-photo.webp"
            alt="Person taking a photo of a dog outdoors"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="hidden object-cover lg:block"
          />
        </div>
        <div className="flex w-full flex-col justify-center gap-4 px-6 py-8 lg:w-[614px] lg:px-10 lg:py-3.5">
          <span
            className="inline-flex w-fit items-center rounded-full border border-dashed px-2.5 py-[3px] text-xs font-semibold"
            style={{ borderColor: C.orange, backgroundColor: C.orangeFill, color: C.orangeTextDark }}
          >
            Shown only if an approved route exists
          </span>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-[26px] font-extrabold tracking-[-0.26px] lg:text-4xl lg:tracking-[-0.36px]" style={{ color: C.brandDeep }}>
                Partnerships or press?
              </h2>
              <p className="max-w-[498px] text-base leading-[25.6px] lg:text-[17px] lg:leading-[27.2px]" style={{ color: C.muted }}>
                Business questions go to a separate team, not support.
              </p>
            </div>
            <button
              type="button"
              className="flex min-h-11 w-fit items-center gap-2 rounded-xl border px-5 text-[15px] font-semibold"
              style={{ borderColor: C.line, color: C.ink }}
            >
              <Image src="/support&developers-contact-us/icon-briefcase.webp" alt="" width={20} height={20} />
              Business inquiries
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
