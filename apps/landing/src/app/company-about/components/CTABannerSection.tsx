import Link from "next/link";
import { IMAGES } from "./images";
import { C } from "./theme";

export default function CTABannerSection() {
  return (
    <section className="py-10 sm:py-14 lg:py-16" style={{ background: C.white }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        <div
          className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] bg-cover bg-center bg-no-repeat px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-18"
          style={{
            backgroundImage: `linear-gradient(118deg, rgba(7, 59, 71, 0.9) 35%, rgba(7, 59, 71, 0.45) 86%), url(${IMAGES.ctaBannerBg})`,
          }}
        >
          <div className="flex flex-col gap-4 sm:gap-6 max-w-[620px]">
            {/* Heading */}
            <h2 className="text-2xl font-extrabold leading-[1.2] tracking-[-0.01em] text-white sm:text-3xl lg:text-[36px] lg:leading-[43.2px]">
              Ready to join the community?
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-base lg:text-[17px] font-normal leading-relaxed text-white/95 sm:leading-[28px]">
              Become part of a global platform built around animal life, welfare, and
              trust. Connect with communities, discover resources, and support
              causes that matter.
            </p>

            {/* Action Buttons */}
            <div className="mt-2 flex w-full flex-col sm:w-auto sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                href="/signup"
                className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold shadow-sm transition hover:bg-white/90 text-center active:scale-[0.98]"
                style={{
                  color: C.mosque,
                  border: `1px solid ${C.geyser}`,
                }}
              >
                Join Zoiko Social
              </Link>

              <Link
                href="/communities-all"
                className="inline-flex min-h-[46px] items-center justify-center rounded-xl border px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10 text-center active:scale-[0.98]"
                style={{ borderColor: C.geyser }}
              >
                Explore Communities
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
