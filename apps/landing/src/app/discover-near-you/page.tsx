import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { APP_LINKS } from "@/lib/app-links";
import NearYouBoard from "./_components/NearYouBoard";
import { C, inkAt } from "./_components/theme";

export const metadata: Metadata = {
  title: "Near You | Zoiko Social",
  description:
    "Local animal communities once your region is set. Precise location is never required or collected.",
};

/*
  The banner photo was exported with solid red padding on both sides; it has
  been cropped to the photograph itself so the image can cover the banner
  edge to edge.
*/
const BANNER = "/discover-near-you/cat-statue-street.webp";

const translucentButton =
  "flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10";

export default function DiscoverNearYouPage() {
  return (
    <div className="min-h-screen pb-20" style={{ background: C.page }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <NearYouBoard />

        <section className="relative mt-14 overflow-hidden rounded-[32px]">
          <Image
            src={BANNER}
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1232px"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(60deg, ${inkAt(0.92)} 32%, ${inkAt(0.55)} 78%)` }}
          />
          <div className="relative max-w-[520px] px-6 py-12 sm:px-11 sm:py-14">
            <h2 className="text-xl font-extrabold leading-snug text-white sm:text-2xl sm:leading-9">
              Local relevance never overrides animal welfare, child safety, or
              community privacy.
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/90">
              Sensitive rescue, foster, and wildlife communities show a
              broadened region or &ldquo;Location protected&rdquo; — even when
              that means less local precision. Verification and moderation are
              separate trust signals, never a safety guarantee.
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Link
                href={APP_LINKS.safety}
                className="flex items-center justify-center rounded-xl px-4 pb-3 pt-2.5 text-sm font-semibold leading-5 text-white underline underline-offset-2 transition hover:opacity-90"
                style={{ background: C.warm }}
              >
                Community Standards
              </Link>
              <Link
                href={APP_LINKS.safety}
                className={`${translucentButton} underline underline-offset-2`}
                style={{ background: inkAt(0.45), border: "1px solid rgba(255,255,255,0.55)" }}
              >
                Report a concern
              </Link>
            </div>
          </div>
        </section>

        <section
          className="mt-14 flex flex-col items-center rounded-[32px] px-6 py-12 text-center sm:py-14"
          style={{ background: `linear-gradient(66deg, ${C.ink} 0%, ${C.brand} 65%)` }}
        >
          <h2 className="max-w-[520px] text-xl font-extrabold leading-snug text-white sm:text-2xl sm:leading-10">
            Join Zoiko Social to participate in your local animal communities.
          </h2>
          <p className="mt-3 max-w-[460px] text-sm leading-5 text-white/90">
            Create a free account to join, request, save, and get updates from
            the communities near your region.
          </p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href={APP_LINKS.signUp}
              className="flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: C.warm }}
            >
              Join Free
            </Link>
            <Link
              href={APP_LINKS.signIn}
              className={translucentButton}
              style={{ background: inkAt(0.45), border: "1px solid rgba(255,255,255,0.55)" }}
            >
              Sign In
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
