import Link from "next/link";
import { APP_LINKS, appUrl } from "@/lib/app-links";
import { C } from "./theme";

/** Closing call to action: dark teal panel with a warm glow in one corner. */
export default function CTASection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6 sm:pb-20 lg:pb-24">
      <div
        className="relative overflow-hidden rounded-[32px] px-6 py-14 sm:px-12 lg:px-16"
        style={{ background: C.ink }}
      >
        {/* Warm radial bloom off the top-right corner, as in the comp. */}
        <div
          className="pointer-events-none absolute -top-40 right-0 size-96 rounded-full"
          style={{
            background: `radial-gradient(closest-side, ${C.warmBright}38, transparent 70%)`,
          }}
          aria-hidden
        />

        <div className="relative mx-auto flex max-w-[640px] flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-extrabold leading-tight text-white lg:text-3xl">
            Ready to explore Zoiko Social?
          </h2>
          <p className="text-base leading-6 text-white/[0.82]">
            Join the community, or reach out if you&apos;d like to work with us.
          </p>

          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
            <Link
              href={APP_LINKS.signUp}
              className="flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold text-white transition hover:opacity-90"
              style={{ background: C.warmBright }}
            >
              Join Free
            </Link>
            <Link
              href={APP_LINKS.home}
              className="flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Explore Zoiko Social
            </Link>
            <Link
              href={appUrl("/careers")}
              className="flex items-center justify-center rounded-xl border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              View Careers
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
