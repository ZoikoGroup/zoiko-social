"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Shield, X } from "lucide-react";
import { APP_LINKS, appUrl } from "@/lib/app-links";
import { C } from "./theme";
import { type Listing } from "./listings";

/** An uppercase section label. */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <h4
      className="pt-6 text-[13px] font-bold uppercase tracking-[0.04em]"
      style={{ color: C.muted }}
    >
      {children}
    </h4>
  );
}

/** One boxed fact in the Details grid. */
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{ background: C.panel, border: `1px solid ${C.line}` }}
    >
      <p className="text-[12px] font-medium uppercase tracking-[0.03em]" style={{ color: C.muted }}>
        {label}
      </p>
      <p className="pt-1 text-[16px] font-bold leading-6" style={{ color: C.ink }}>
        {value}
      </p>
    </div>
  );
}

/**
 * The View Profile popup: the photo across the top with the availability
 * badge and close control over it, then the animal's details, the
 * verification note, and the actions.
 */
export default function ListingDialog({
  listing,
  saved,
  onToggleSave,
  onClose,
}: {
  listing: Listing | null;
  saved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!listing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    /* The page behind must not scroll while the popup is up. */
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [listing, onClose]);

  if (!listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0"
        style={{ background: "rgba(7,30,36,0.4)" }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="listing-dialog-title"
        className="relative max-h-[88vh] w-[600px] max-w-full overflow-y-auto overscroll-contain rounded-[20px] bg-white shadow-[0_20px_48px_rgba(7,59,71,0.16)]"
      >
        {/* The badge and the close control sit over the photo. */}
        <div className="relative aspect-[16/9] w-full" style={{ background: C.chip }}>
          <Image
            src={listing.image}
            alt={listing.alt}
            fill
            sizes="600px"
            className="object-cover"
            priority
          />
          <span
            className="absolute left-4 top-4 rounded-lg px-3 py-1.5 text-[13px] font-bold text-white"
            style={{ background: C.ink }}
          >
            {listing.status}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full text-white transition hover:opacity-90"
            style={{ background: "rgba(7,30,36,0.55)" }}
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <div className="px-6 pb-6 sm:px-8">
          <h2
            id="listing-dialog-title"
            className="pt-6 text-[28px] font-extrabold leading-tight"
            style={{ color: C.ink }}
          >
            {listing.name}
          </h2>
          <p className="pt-1.5 text-[15px]" style={{ color: C.muted }}>
            {listing.species} · {listing.age} · {listing.sex}
          </p>

          <p
            className="mt-3 inline-block rounded-[100px] px-3.5 py-2 text-[13px] font-semibold"
            style={{ background: C.chip, color: C.ink }}
          >
            Listed by {listing.listedBy} · Verified source
          </p>

          <Label>About</Label>
          <p className="pt-2 text-[15px] leading-7" style={{ color: C.inkDeep }}>
            {listing.about}
          </p>

          <Label>Details</Label>
          <div className="grid grid-cols-1 gap-3 pt-3 sm:grid-cols-2">
            <Detail label="Species" value={listing.species} />
            <Detail label="Age" value={listing.age} />
            <Detail label="Sex" value={listing.sex} />
            <Detail label="Location" value={listing.location} />
            <Detail label="Good with" value={listing.goodWith} />
            <Detail label="Adoption fee" value={listing.fee} />
          </div>

          <Label>Verification &amp; trust</Label>
          <div
            className="mt-3 flex items-start gap-3 rounded-xl p-4"
            style={{ background: "#E9F3F5" }}
          >
            <Shield size={18} strokeWidth={1.75} className="mt-0.5 shrink-0" style={{ color: C.brand }} aria-hidden />
            <p className="text-[14px] leading-6" style={{ color: C.inkDeep }}>
              This listing comes from a currently verified rescue or shelter.
              Verification confirms the source meets Zoiko Social&apos;s
              requirements — it does not guarantee this animal&apos;s health,
              temperament, or the outcome of an adoption. Review details
              directly with the shelter before deciding.{" "}
              <Link href="/adopt-adoption-safety" className="font-semibold underline" style={{ color: C.ink }}>
                Read Adoption Safety guidance
              </Link>
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-6">
            <Link
              href="/zoiko_social_adopt"
              className="rounded-xl px-6 py-3.5 text-[15px] font-semibold text-white transition hover:opacity-90"
              style={{ background: C.brand }}
            >
              Start Adoption Inquiry
            </Link>
            <button
              type="button"
              onClick={onToggleSave}
              aria-pressed={saved}
              className="rounded-xl px-6 py-3.5 text-[15px] font-semibold transition"
              style={
                saved
                  ? { background: C.chip, color: C.brand, border: `1px solid ${C.brand}` }
                  : { background: "#fff", color: C.ink, border: `1px solid ${C.line}` }
              }
            >
              {saved ? "Saved" : "Save"}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-5">
            <Link
              href={appUrl("/docs/adoption-and-lost-found")}
              className="text-[14px] font-medium"
              style={{ color: C.muted }}
            >
              How we verify this shelter
            </Link>
            <Link href={APP_LINKS.safety} className="text-[14px] font-medium" style={{ color: "#B3261E" }}>
              Report a concern
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
