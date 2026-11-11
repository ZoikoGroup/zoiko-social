import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";
import Countdown from "./Countdown";
import { BLACK_FRIDAY_AT } from "@/lib/use-countdown";

export default function CtaSection() {
  return (
    <section className="mx-auto max-w-[1232px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative">
        <div className="relative overflow-hidden rounded-3xl px-6 py-16 text-center">
          <Image
            src="/black-friday/cta-community-bg.webp"
            alt=""
            fill
            sizes="(max-width: 1232px) 100vw, 1128px"
            className="object-cover"
          />
          <div className="relative flex flex-col items-center gap-6">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Found a community that fits what you care about?
            </h2>
            <p className="max-w-[460px] text-lg leading-relaxed text-white/85">
              Create your Zoiko Social account and join according to each community&apos;s access
              rules — it&apos;s free to get started.
            </p>
            <Countdown target={BLACK_FRIDAY_AT} />
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href={APP_LINKS.signUp}
                className="inline-flex items-center gap-4 rounded-xl bg-white px-10 py-4 font-medium text-[#0B6475] transition-colors hover:bg-cyan-50"
              >
                Join free <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/communities-all"
                className="rounded-xl bg-[#0B6475] px-6 py-4 font-semibold text-white transition-colors hover:bg-[#0D7488]"
              >
                Browse all communities
              </Link>
            </div>
          </div>
        </div>

        <JoinFreeBadge />
      </div>
    </section>
  );
}

/** Orange rotating seal: "FREE TO JOIN · BLACK FRIDAY ·" around "JOIN FREE TODAY". */
function JoinFreeBadge() {
  return (
    <Link
      href={APP_LINKS.signUp}
      aria-label="Join free today"
      className="absolute -bottom-10 -right-4 hidden h-[200px] w-[200px] items-center justify-center rounded-full border border-[#0F2B33] bg-[#E8892A] text-[#0F2B33] shadow-xl lg:-right-16 lg:flex"
    >
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full animate-[spin_24s_linear_infinite] motion-reduce:animate-none"
        aria-hidden
      >
        <defs>
          <path id="bf-badge-ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-current text-[15px] font-bold uppercase" letterSpacing="3">
          <textPath href="#bf-badge-ring">Free to join · Black Friday · Free to join · Black Friday ·</textPath>
        </text>
      </svg>
      <span className="flex -rotate-[20deg] flex-col items-center leading-none">
        <span className="text-3xl font-extrabold">JOIN</span>
        <span className="text-3xl font-extrabold">FREE</span>
        <span className="mt-2 text-sm">TODAY</span>
      </span>
    </Link>
  );
}
