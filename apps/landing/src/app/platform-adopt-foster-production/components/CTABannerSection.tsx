import Image from "next/image";
import { IMAGES } from "./images";
import { C } from "./theme";

export default function CTABannerSection() {
  return (
    <section className="w-full bg-[#F7F9FA] pb-16 lg:pb-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-[24px] shadow-lg">
          {/* Background Image */}
          <Image
            src={IMAGES.ctaBanner}
            alt="Ready to open your home?"
            fill
            className="object-cover object-center"
          />

          {/* Teal Gradient Overlay (Figma spec) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(118deg, rgba(7, 59, 71, 0.92) 35%, rgba(7, 59, 71, 0.65) 86%)",
            }}
          />

          {/* Banner Content */}
          <div className="relative z-10 flex flex-col items-center px-6 py-14 text-center sm:px-12 sm:py-16 lg:py-20">
            <h2 className="text-2xl font-extrabold tracking-[-0.01em] text-white sm:text-3xl lg:text-[36px] lg:leading-[43.2px]">
              Ready to Open Your Home?
            </h2>

            <p className="mt-4 max-w-[680px] text-base font-normal leading-relaxed text-white/95 sm:text-[17px] sm:leading-[28px]">
              Whether you want to adopt your forever friend or foster an animal in need, the perfect match is waiting for you.
            </p>

            {/* 3 Buttons */}
            <div className="mt-8 flex w-full flex-col sm:w-auto sm:flex-row sm:flex-wrap items-center justify-center gap-3 sm:gap-4">
              <a
                href="#adoptable-animals"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold shadow-sm transition hover:bg-white/90 active:scale-95"
                style={{ color: C.mosque }}
              >
                Browse Adoptable Animals
              </a>

              <a
                href="#shelter-spotlight"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold shadow-sm transition hover:bg-white/90 active:scale-95"
                style={{ color: C.mosque }}
              >
                Become a Foster
              </a>

              <a
                href="#how-adoption-works"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold shadow-sm transition hover:bg-white/90 active:scale-95"
                style={{ color: C.mosque }}
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
