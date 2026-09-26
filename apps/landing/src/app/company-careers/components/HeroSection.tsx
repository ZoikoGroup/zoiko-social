import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "./images";
import { C } from "./theme";

export default function HeroSection() {
  return (
    <section className="bg-white py-10 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col items-center gap-8 sm:gap-12 lg:flex-row lg:items-center lg:justify-between">
          {/* Left Column: Heading and CTAs */}
          <div className="w-full flex-1 max-w-[620px]">
            <span
              className="inline-block text-xs font-bold uppercase tracking-[0.0417em]"
              style={{ color: C.zest }}
            >
              Careers at Zoiko Social
            </span>

            <h1
              className="mt-3 text-2xl sm:text-4xl lg:text-[48px] font-extrabold leading-[1.2] tracking-[-0.02em] sm:leading-[1.2] lg:leading-[57.6px]"
              style={{ color: C.mosque }}
            >
              Build technology for the communities that care for animal life
            </h1>

            <p
              className="mt-3 sm:mt-4 text-base sm:text-lg lg:text-[20px] font-medium leading-relaxed sm:leading-[32px]"
              style={{ color: C.nevada }}
            >
              Work on products, systems, safety, content, and operations that help animal
              lovers, professionals, rescues, shelters, and organizations connect and
              coordinate responsibly.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="#open-roles"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 text-center"
                style={{ background: C.mosque }}
              >
                Search Open Roles
              </a>
              <Link
                href="/about-us"
                className="inline-flex items-center justify-center rounded-xl border px-5 py-3.5 text-sm font-semibold transition hover:bg-slate-50 text-center"
                style={{
                  background: C.white,
                  borderColor: C.geyser,
                  color: C.firefly,
                }}
              >
                About Zoiko Social
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className="w-full flex-1 max-w-[580px]">
            <div
              className="overflow-hidden rounded-[24px] sm:rounded-[36px] shadow-[0_20px_48px_0_rgba(7,59,71,0.16)]"
              style={{ background: C.white }}
            >
              <Image
                src={IMAGES.hero}
                alt="Care for animal life at Zoiko Social"
                width={800}
                height={500}
                priority
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
