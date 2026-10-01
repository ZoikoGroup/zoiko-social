import Link from "next/link";
import { APP_LINKS } from "@/lib/app-links";
// Figma color tokens
const INK_COLOR = "#073B47";          // Headings & text: Firefly/Ink
const MOSQUE_COLOR = "#066879";       // Brand / CTA: Mosque
const NEVADA_COLOR = "#646E73";       // Subtitle & Notes: Nevada
const POPULAR_ORANGE = "#F68A4B";     // Badge: Orange
const BORDER_COLOR = "#DCEAEE";       // Subtle border: Geyser
const PREMIUM_BG = "#F0F7F9";         // Premium card bg: Black Squeeze

/**
 * "Simple, Transparent Pricing" — Free vs. Premium plan cards.
 */
export default function Pricing() {
  return (
    <section id="pricing" className="w-full bg-white px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1040px] flex-col gap-12">
        {/* Section Heading */}
        <h2
          className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: INK_COLOR }}
        >
          Simple, Transparent Pricing
        </h2>

        {/* 2 Plan Cards */}
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2">
          {/* Free Plan Card */}
          <div
            className="flex flex-col justify-between rounded-[24px] bg-white p-8 shadow-[0px_1px_3px_0px_rgba(7,59,71,0.06)]"
            style={{ border: `1px solid ${BORDER_COLOR}` }}
          >
            <div className="flex flex-col items-center gap-3 pt-6 text-center">
              <p
                className="text-xl font-bold"
                style={{ color: INK_COLOR }}
              >
                Free
              </p>
              <p
                className="text-3xl font-extrabold"
                style={{ color: INK_COLOR }}
              >
                $0
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: NEVADA_COLOR }}
              >
                Forever free
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 pt-8">
              <Link
                href={APP_LINKS.signUp}
                className="w-full rounded-xl py-3.5 text-center text-sm font-bold transition hover:bg-neutral-50"
                style={{
                  border: `1px solid ${BORDER_COLOR}`,
                  color: INK_COLOR,
                  backgroundColor: "#FFFFFF",
                }}
              >
                Start Free
              </Link>
              <p
                className="text-center text-xs leading-5"
                style={{ color: NEVADA_COLOR }}
              >
                Ad-supported experience with core features
              </p>
            </div>
          </div>

          {/* Premium Plan Card */}
          <div
            className="relative flex flex-col justify-between rounded-[24px] p-8 shadow-[0px_1px_3px_0px_rgba(7,59,71,0.06)]"
            style={{
              backgroundColor: PREMIUM_BG,
              border: `2px solid ${MOSQUE_COLOR}`,
            }}
          >
            {/* POPULAR Badge */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div
                className="rounded-full px-4 py-1 text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: POPULAR_ORANGE }}
              >
                POPULAR
              </div>
              <p
                className="text-xl font-bold"
                style={{ color: INK_COLOR }}
              >
                Premium
              </p>
              <p
                className="text-3xl font-extrabold"
                style={{ color: MOSQUE_COLOR }}
              >
                $9.99
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: NEVADA_COLOR }}
              >
                Monthly or Annual
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 pt-6">
              <Link
                href={APP_LINKS.signUp}
                className="w-full rounded-xl py-3.5 text-center text-sm font-bold text-white shadow-sm transition hover:opacity-90"
                style={{ backgroundColor: MOSQUE_COLOR }}
              >
                Upgrade Now
              </Link>
              <p
                className="text-center text-xs leading-5"
                style={{ color: NEVADA_COLOR }}
              >
                All 8 capabilities + priority support
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bulb Note */}
        <p
          className="flex items-center justify-center gap-1.5 text-center text-xs leading-5"
          style={{ color: NEVADA_COLOR }}
        >
          <span className="text-sm leading-none">💡</span>
          <span>
            Paying annually? Save 20%. 7-day free trial available. Cancel anytime.
          </span>
        </p>
      </div>
    </section>
  );
}