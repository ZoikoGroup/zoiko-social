import Image from "next/image";
import Link from "next/link";

/**
 * Hero — "Download Zoiko Social Today".
 *
 * Full-bleed photo background (/platform-apps-downloads-production/
 * Background (13).png, the 1440x399 hero export) under a cyan gradient
 * overlay, per the Figma frame's gradient stack over the photo.
 */
export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      <Image
        src="/platform-apps-downloads-production/Background (13).png"
        alt=""
        width={1440}
        height={399}
        priority
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#066879]/88 via-[#066879]/55 to-[#3b8894]/30" />

      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center gap-3 px-6 py-20 lg:px-28">
        <p className="text-center font-jakarta text-xs font-bold uppercase tracking-wide text-[#e88924]">
          Zoiko Social Apps
        </p>
        <h1 className="text-center font-jakarta text-4xl font-extrabold leading-[57.6px] text-white lg:text-5xl">
          Download Zoiko Social Today
        </h1>
        <p className="max-w-[740px] pt-[3px] text-center font-jakarta text-base font-normal leading-7 text-white/90">
          Get the Zoiko Social experience on your mobile device, desktop, and web. Stay connected to
          <br />
          the communities and animals you care about.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
          <Link
            href="#getting-started"
            className="flex items-center rounded-xl bg-white px-8 py-4 text-center font-jakarta text-base font-bold text-[#0f5a68] shadow-sm transition hover:bg-white/90"
          >
            Get Started
          </Link>
          <Link
            href="#choose-platform"
            className="flex items-center rounded-xl bg-white px-8 py-4 text-center font-jakarta text-base font-bold text-[#0f5a68] shadow-sm transition hover:bg-white/90"
          >
            View All Options
          </Link>
        </div>
      </div>
    </section>
  );
}