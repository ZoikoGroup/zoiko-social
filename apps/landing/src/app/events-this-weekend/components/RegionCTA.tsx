import Link from "next/link";
import { APP_LINKS } from "@/lib/app-links";
import { C } from "./theme";

export default function RegionCTA() {
  return (
    <section className="py-16 sm:py-20" style={{ background: C.panel }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div
          className="flex flex-col gap-6 rounded-[28px] p-6 text-white sm:gap-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between"
          style={{
            // Deep teal into a softer sea-green, with a faint warm glow top right.
            background:
              "radial-gradient(circle at 82% 20%, rgba(232,137,36,0.22) 0%, rgba(232,137,36,0) 45%), linear-gradient(100deg, #073B47 0%, #06505D 40%, #2C6D6B 100%)",
          }}
        >
          <div className="max-w-[520px]">
            <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">
              Set your region and never miss a weekend near you.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/80 sm:text-base">
              Join free to save events, get material-change alerts, and follow
              the organizers you trust.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={APP_LINKS.signUp}
              className="rounded-xl px-6 py-3 text-center text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: C.warmBright }}
            >
              Join Free
            </a>
            <Link
              href="/communities-all"
              className="rounded-xl border border-white/40 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
            >
              Explore Communities
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
