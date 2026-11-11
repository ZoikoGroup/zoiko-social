"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Sparkle, Tag, X } from "lucide-react";
import { BLACK_FRIDAY_AT, pad, useCountdown } from "@/lib/use-countdown";

const SEEN_KEY = "bf-2026-popup-seen";
const OPEN_DELAY_MS = 1200;

/**
 * Black Friday promo modal. Opens shortly after a visitor lands, once per browser
 * session, and never on /black-friday itself (they are already there).
 */
export default function BlackFridayPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const units = useCountdown(BLACK_FRIDAY_AT);

  useEffect(() => {
    if (pathname === "/black-friday") return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      // Storage blocked (private mode etc.) — still show it, just won't be remembered.
    }
    const id = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    ctaRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;
  const close = () => setOpen(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-jakarta">
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-[bf-fade_300ms_ease-out] bg-[#06161B]/70 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bf-popup-title"
        className="relative grid w-full max-w-[880px] animate-[bf-pop_450ms_cubic-bezier(0.2,0.9,0.3,1.2)] overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] motion-reduce:animate-none md:grid-cols-[0.9fr_1.1fr]"
      >
        {/* Close */}
        <button
          type="button"
          onClick={close}
          aria-label="Close Black Friday offer"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        {/* Visual */}
        <div className="relative h-48 bg-[#0B4552] md:h-auto">
          <Image
            src="/black-friday/hero-rescue-foster.webp"
            alt="A family kneeling on the grass feeding a litter of puppies"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A222B]/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0A222B]/40" />

          {/* Price tag */}
          <div
            className="absolute left-5 top-5 -rotate-[8deg] animate-[bf-swing_3s_ease-in-out_infinite] bg-[#E8892A] px-5 pb-8 pt-3 text-[#0F2B33] shadow-xl motion-reduce:animate-none md:left-6 md:top-8"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 78%, 72% 100%, 0 100%)", transformOrigin: "50% 0" }}
            aria-hidden
          >
            <span className="mb-1 block h-4 w-4 rounded-full border-[3px] border-[#0F2B33]" />
            <p className="text-xl font-extrabold leading-tight">
              BLACK
              <br />
              FRIDAY
              <br />
              <span className="text-2xl">SALE</span>
            </p>
            <p className="mt-1 text-[11px] font-semibold text-white">NOV 27</p>
          </div>

          <p className="absolute bottom-4 left-5 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur md:bottom-6 md:left-6">
            <Sparkle className="h-3.5 w-3.5 fill-[#E8892A] text-[#E8892A]" aria-hidden />
            Joining is always free
          </p>
        </div>

        {/* Content */}
        <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_100%_100%,#C8701F_0%,rgba(200,112,31,0)_55%),linear-gradient(120deg,#0A222B_0%,#0C4552_60%,#0E5B66_100%)] px-6 pb-7 pt-8 text-white sm:px-9 sm:pb-9 sm:pt-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#E8892A] px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#0F2B33]">
            <Tag className="h-3 w-3" aria-hidden />
            Black Friday 2026
          </span>

          <h2 id="bf-popup-title" className="mt-4 text-3xl font-extrabold leading-tight sm:text-[34px]">
            A social space for <span className="text-[#E8892A]">animal lovers</span> — now on sale.
          </h2>

          {/* Offer */}
          <div className="mt-5 flex items-center gap-5 rounded-2xl border-[3px] border-[#E8892A] bg-white/5 px-5 py-3">
            <p className="flex flex-col items-center leading-none text-[#E8892A]">
              <span className="text-5xl font-extrabold">30%</span>
              <span className="text-lg font-extrabold">off</span>
            </p>
            <p className="text-base font-bold leading-snug">
              paid Creator &amp; Business tools
              <span className="block text-xs font-medium text-white/60">for the first year*</span>
            </p>
          </div>

          {/* Countdown */}
          <div className="mt-5 flex items-center gap-2" role="timer" aria-label="Time until Black Friday">
            {units.map(({ label, value }) => (
              <div key={label} className="flex flex-1 flex-col items-center rounded-xl border border-white/25 bg-white/10 py-2">
                <span className="text-xl font-bold tabular-nums">{pad(value)}</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-white/70">{label}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              ref={ctaRef}
              href="/black-friday"
              onClick={close}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#F2A04A] to-[#E07F1F] px-7 py-4 font-bold text-[#0F2B33] shadow-[0_12px_28px_rgba(232,137,42,0.45)] outline-none ring-white/70 transition-transform hover:-translate-y-0.5 focus-visible:ring-2"
            >
              Shop Black Friday deals
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={close}
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-white/75 underline-offset-4 hover:text-white hover:underline"
            >
              Maybe later
            </button>
          </div>

          <p className="mt-5 text-[11px] leading-relaxed text-white/45">
            *Applies to new upgrades of eligible paid tiers, where live. Joining the community is always free.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bf-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes bf-pop { from { opacity: 0; transform: translateY(24px) scale(0.94) } to { opacity: 1; transform: none } }
        @keyframes bf-swing { 0%,100% { transform: rotate(-8deg) } 50% { transform: rotate(-3deg) } }
      `}</style>
    </div>
  );
}
