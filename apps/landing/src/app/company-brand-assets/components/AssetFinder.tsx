"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { ASSETS, CATEGORIES, FORMATS, type Asset } from "./content";
import { C } from "./theme";

type Query = { text: string; category: string; format: string };
const ALL: Query = { text: "", category: "all", format: "all" };

function matches(a: Asset, q: Query) {
  if (q.category !== "all" && a.category !== q.category) return false;
  if (q.format !== "all" && !a.formats.includes(q.format as Asset["formats"][number])) return false;
  const t = q.text.trim().toLowerCase();
  if (!t) return true;
  return [a.title, a.description, a.category, ...a.formats].some((s) => s.toLowerCase().includes(t));
}

const LABEL = "block pb-2 text-xs font-semibold";

function Select({
  label,
  value,
  all,
  options,
  onChange,
}: {
  label: string;
  value: string;
  all: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="min-w-0">
      <span className={LABEL} style={{ color: C.ink }}>
        {label}
      </span>
      <span className="relative block">
        {/* text-base below sm stops iOS zooming into the field on focus. */}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full cursor-pointer appearance-none rounded-xl pl-5 pr-9 text-base outline-none focus-visible:ring-2 focus-visible:ring-cyan-700/30 sm:text-sm"
          style={{ background: C.select, color: "#000", border: `1px solid ${C.line}` }}
        >
          <option value="all">{all}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: C.muted }}
        />
      </span>
    </label>
  );
}

export default function AssetFinder() {
  const [q, setQ] = useState<Query>(ALL);
  const results = ASSETS.filter((a) => matches(a, q));
  const filtered = JSON.stringify(q) !== JSON.stringify(ALL);

  return (
    <section id="asset-finder" className="scroll-mt-4 bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20 xl:px-28">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12">
        <div className="flex flex-col gap-4 sm:gap-5">
          <h2 className="text-2xl font-extrabold leading-tight sm:text-4xl sm:leading-10" style={{ color: C.ink }}>
            Quick asset finder
          </h2>
          <p className="text-base leading-7" style={{ color: C.muted }}>
            Search for the assets you need by name, category, or format.
          </p>
          <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <label className="min-w-0">
              <span className={LABEL} style={{ color: C.ink }}>
                Search assets
              </span>
              <input
                type="search"
                value={q.text}
                onChange={(e) => setQ({ ...q, text: e.target.value })}
                placeholder="Logo, colors, social icons..."
                className="h-12 w-full rounded-xl bg-white px-4 text-base outline-none placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-cyan-700/30 sm:text-sm"
                style={{ color: C.ink, border: `1px solid ${C.line}` }}
              />
            </label>
            <Select label="Category" value={q.category} all="All categories" options={CATEGORIES} onChange={(v) => setQ({ ...q, category: v })} />
            <Select label="Format" value={q.format} all="All formats" options={FORMATS} onChange={(v) => setQ({ ...q, format: v })} />
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5">
          <h2 className="text-2xl font-extrabold leading-tight sm:text-4xl sm:leading-10" style={{ color: C.ink }}>
            Featured assets
          </h2>
          <p className="text-base leading-7" style={{ color: C.muted }}>
            Commonly requested files and current approved brand materials.
          </p>
          {filtered && (
            <p className="text-sm" style={{ color: C.muted }} aria-live="polite">
              Showing {results.length} of {ASSETS.length} assets ·{" "}
              <button type="button" onClick={() => setQ(ALL)} className="font-semibold underline underline-offset-2" style={{ color: C.brand }}>
                Clear
              </button>
            </p>
          )}
          {results.length > 0 ? (
            // Straight from one column to three: with three assets, two columns leaves one card alone.
            <div className="grid gap-6 pt-2 sm:pt-7 md:grid-cols-3 md:gap-4 lg:gap-6">
              {results.map((a) => (
                <article
                  key={a.title}
                  className="flex flex-col overflow-hidden rounded-[20px] bg-white"
                  style={{ border: `1px solid ${C.line}` }}
                >
                  <div className="relative h-40 bg-white">
                    <Image
                      src={a.image}
                      alt={a.imageAlt}
                      fill
                      unoptimized={a.image.endsWith(".svg")}
                      sizes="(min-width: 1024px) 394px, (min-width: 768px) 33vw, 100vw"
                      className={a.contain ? "object-contain px-6 pb-4 pt-12" : "object-cover"}
                    />
                    <span
                      className="absolute right-4 top-4 rounded-xl px-2 py-1 text-xs font-semibold"
                      style={{ background: C.chip, color: C.brand }}
                    >
                      Current
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2.5 p-6">
                    <h3 className="text-lg font-bold" style={{ color: C.ink }}>
                      {a.title}
                    </h3>
                    <p className="text-xs leading-5" style={{ color: C.muted }}>
                      {a.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pb-1.5 pt-1">
                      {a.formats.map((f) => (
                        <span key={f} className="rounded-xl px-2 py-[3px] text-xs font-semibold" style={{ background: C.chip, color: C.brand }}>
                          {f}
                        </span>
                      ))}
                    </div>
                    <a
                      href={a.href}
                      download={a.download}
                      className="mt-auto self-start text-sm font-semibold hover:underline"
                      style={{ color: C.brand }}
                    >
                      {a.action} →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[20px] px-6 py-10 text-center" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
              <p className="font-bold" style={{ color: C.ink }}>
                No assets match your search.
              </p>
              <button
                type="button"
                onClick={() => setQ(ALL)}
                className="mt-4 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: C.brand }}
              >
                Show all assets
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
