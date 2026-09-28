import Link from "next/link";
import { C } from "./theme";

export default function CommitmentBannerSection() {
  return (
    <section className="py-10 sm:py-14 lg:py-16" style={{ background: C.athensGray }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        <div
          className="flex flex-col items-center rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] px-5 py-9 text-center sm:px-10 sm:py-12 lg:p-14"
          style={{
            background:
              "linear-gradient(166deg, rgba(6, 104, 121, 1) 0%, rgba(4, 83, 99, 1) 100%)",
          }}
        >
          {/* Heading */}
          <h2 className="text-2xl font-extrabold leading-[1.2] tracking-[-0.01em] text-white sm:text-3xl lg:text-[36px] lg:leading-[43.2px]">
            Our commitment
          </h2>

          {/* Body */}
          <p className="mt-3.5 sm:mt-4 max-w-[960px] text-xs sm:text-base lg:text-[17px] font-normal leading-relaxed text-white/95 sm:leading-[28px]">
            Technology that serves life — not attention for its own sake. Zoiko Social
            was built on a belief that social infrastructure can be safe without
            sterile, global without generic, and powerful without harmful. Through
            this platform, animal communities can grow, protect each other, and
            support the life we all care about.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 sm:mt-8 flex w-full flex-col sm:w-auto sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/signup"
              className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold shadow-sm transition hover:bg-white/90 text-center active:scale-[0.98]"
              style={{ color: C.mosque }}
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
    </section>
  );
}
