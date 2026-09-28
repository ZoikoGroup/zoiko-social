import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "./images";
import { C } from "./theme";

export default function CTABannerSection() {
  return (
    <section className="bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        <div
          className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] px-6 py-10 sm:px-12 sm:py-16 lg:py-20 shadow-xl"
          style={{
            background: "#073B47",
          }}
        >
          {/* Background Photography */}
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src={IMAGES.ctaBannerBg}
              alt="Build technology for animal communities"
              fill
              className="object-cover opacity-60 mix-blend-overlay"
            />
            {/* Gradient Overlay from Figma */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(118deg, rgba(7, 59, 71, 0.94) 25%, rgba(7, 59, 71, 0.65) 86%)",
              }}
            />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 max-w-[620px]">
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-white leading-[1.2] tracking-[-0.01em]">
              Ready to build something meaningful?
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px] text-white/95">
              Browse our open roles and join the team building responsible
              technology for animal communities.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#open-roles"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold shadow-md transition hover:bg-slate-100 text-center"
                style={{
                  background: C.white,
                  color: C.mosque,
                  border: `1px solid ${C.geyser}`,
                }}
              >
                Search Open Roles
              </a>
              <Link
                href="/about-us"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10 text-center"
                style={{
                  borderColor: C.geyser,
                }}
              >
                Learn About Zoiko Social
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
