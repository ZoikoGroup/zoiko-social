"use client";

import Image from "next/image";
import { useState } from "react";
import { C } from "./theme";
import { LISTINGS, type Listing } from "./listings";
import ListingDialog from "./ListingDialog";

/**
 * A single preview card. Save is a real toggle — it holds for the visit
 * rather than persisting, since the landing site has no account session; the
 * complete Animals for Adoption page is where a saved list would live.
 */
function ListingCard({
  listing,
  saved,
  onToggleSave,
  onOpen,
}: {
  listing: Listing;
  saved: boolean;
  onToggleSave: () => void;
  onOpen: () => void;
}) {
  return (
    <article
      className="flex flex-col overflow-hidden rounded-[20px] bg-white"
      style={{ border: `1px solid ${C.line}` }}
    >
      {/* Fixed aspect rather than a fixed height, so the image keeps its
          framing as the column narrows. */}
      <div className="relative aspect-[291/150] w-full" style={{ background: C.chip }}>
        <Image
          src={listing.image}
          alt={listing.alt}
          fill
          sizes="(min-width: 1024px) 291px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col items-start gap-1.5 px-4 pb-4 pt-3">
        <h3 className="text-base font-bold leading-6" style={{ color: C.inkDeep }}>
          {listing.name}
        </h3>
        <p className="text-xs leading-5" style={{ color: C.muted }}>
          {listing.meta}
        </p>
        <p
          className="rounded-md px-2 py-[3px] text-xs font-semibold leading-4"
          style={{ background: C.chip, color: C.ink }}
        >
          Listed by {listing.listedBy}
        </p>

        <div className="flex items-start gap-2 pt-1.5">
          <button
            type="button"
            onClick={onToggleSave}
            aria-pressed={saved}
            className="rounded-[10px] px-3 py-1.5 text-xs font-semibold transition"
            style={
              saved
                ? { background: C.chip, color: C.brand, border: `1px solid ${C.brand}` }
                : { background: "#fff", color: C.inkDeep, border: `1px solid ${C.line}` }
            }
          >
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={onOpen}
            className="rounded-[10px] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
            style={{ background: C.brand }}
          >
            View Profile
            <span className="sr-only"> for {listing.name}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

/** The eight-card preview grid: one column on phones, two from sm, four from lg. */
export default function ListingGrid() {
  const [saved, setSaved] = useState<string[]>([]);
  const [open, setOpen] = useState<Listing | null>(null);

  const toggle = (id: string) =>
    setSaved((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {LISTINGS.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            saved={saved.includes(listing.id)}
            onToggleSave={() => toggle(listing.id)}
            onOpen={() => setOpen(listing)}
          />
        ))}
      </div>

      <ListingDialog
        listing={open}
        saved={open ? saved.includes(open.id) : false}
        onToggleSave={() => open && toggle(open.id)}
        onClose={() => setOpen(null)}
      />
    </>
  );
}
