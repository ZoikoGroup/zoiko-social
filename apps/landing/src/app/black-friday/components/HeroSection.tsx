import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PawPrint, Tag } from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_100%_100%,#C8701F_0%,rgba(200,112,31,0)_45%),linear-gradient(110deg,#0A222B_0%,#0C4552_55%,#0E5B66_100%)]">
      <div className="mx-auto grid max-w-[1232px] items-center gap-14 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.15fr_1fr] lg:px-8">
        {/* Copy */}
        <div className="flex flex-col items-start gap-6">
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#E8892A] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#0F2B33] shadow-[0_8px_20px_rgba(232,137,42,0.35)]">
              <Tag className="h-3.5 w-3.5" aria-hidden />
              Black Friday 2026
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-900/40 px-4 py-2 text-xs font-semibold text-cyan-50">
              <PawPrint className="h-3.5 w-3.5 text-cyan-300" aria-hidden />
              For animal lovers
            </span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Finally, a social space
            <br className="hidden sm:block" /> for{" "}
            <span className="text-[#E8892A]">animal lovers.</span>
          </h1>

          <p className="max-w-[560px] text-lg leading-relaxed text-white/85">
            Your kind of community is waiting. Find your people, your species and your
            cause — and join the animal-loving community on Zoiko Social.
          </p>

          <div className="flex w-full max-w-[440px] items-center justify-between gap-4 rounded-[28px] border-4 border-[#E8892A] bg-white/5 px-8 py-4 backdrop-blur-sm">
            <p className="flex flex-col items-center leading-none text-[#E8892A]">
              <span className="text-6xl font-extrabold">30%</span>
              <span className="text-2xl font-extrabold">off</span>
            </p>
            <p className="text-right text-xl font-bold leading-snug text-white">
              <span className="text-base text-[#E8892A]">paid</span> Creator &amp;
              <br />
              Business tools
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-2xl bg-[#0B6475] px-8 py-5 text-base font-semibold text-white transition-colors hover:bg-[#0D7488]"
            >
              Explore Zoiko Social <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={APP_LINKS.signUp}
              className="inline-flex items-center rounded-2xl bg-white px-8 py-5 text-base font-semibold text-[#0B6475] transition-colors hover:bg-cyan-50"
            >
              Join free
            </Link>
          </div>
        </div>

        {/* Featured community card */}
        <div className="relative mx-auto w-full max-w-[430px]">
          <div className="rounded-3xl bg-white p-8 shadow-2xl">
            <div className="relative aspect-[366/223] overflow-hidden rounded-3xl">
              <Image
                src="/black-friday/hero-rescue-foster.webp"
                alt="A family kneeling on the grass feeding a litter of puppies"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 366px"
                className="object-cover"
              />
            </div>
            <span className="mt-4 inline-block rounded-full bg-slate-600 px-3 py-1.5 text-xs font-semibold text-white">
              Rescue &amp; Adoption
            </span>
            <h2 className="mt-3 text-xl font-bold text-[#0F2B33]">Rescue &amp; Foster Network</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              A community for fosters, adopters and rescue volunteers to share and support.
            </p>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[
                    ["M", "bg-[#0B6475]"],
                    ["A", "bg-[#E8892A]"],
                    ["K", "bg-emerald-400"],
                    ["+", "bg-[#0B6475]"],
                  ].map(([letter, bg]) => (
                    <span
                      key={letter}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-[#0F2B33] ${bg}`}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-slate-400">Open to join</span>
              </div>
              <Link
                href={APP_LINKS.signUp}
                className="rounded-xl bg-gradient-to-b from-[#1FB3C9] to-[#0E8EA5] px-5 py-2 text-sm font-semibold text-[#0F2B33] shadow-[0_8px_16px_rgba(14,142,165,0.35)]"
              >
                Join
              </Link>
            </div>
          </div>

          {/* Price tag */}
          <div
            className="absolute -right-4 -top-6 hidden rotate-[8deg] bg-[#E8892A] px-6 pb-10 pt-4 text-[#0F2B33] shadow-xl sm:block md:-right-12"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 78%, 72% 100%, 0 100%)" }}
            aria-hidden
          >
            <span className="mb-1 block h-5 w-5 rounded-full border-[3px] border-[#0F2B33]" />
            <p className="text-2xl font-extrabold leading-tight">
              BLACK
              <br />
              FRIDAY
              <br />
              <span className="text-3xl">SALE</span>
            </p>
            <p className="mt-1 text-xs font-medium text-white">NOV 27</p>
          </div>
        </div>
      </div>
    </section>
  );
}
