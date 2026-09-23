"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { appUrl } from "@/lib/app-links";
import { CATEGORIES, PRODUCTS, SPECIES, STAGES, TABS, type Product } from "./products";
import { C } from "./theme";

type Sort = "relevance" | "price-asc" | "price-desc";
type Query = { tab: string | null; species: string; stage: string; category: string; sort: Sort };

const DEFAULT: Query = { tab: null, species: "all", stage: "all", category: "all", sort: "relevance" };

const SORTS: readonly { value: Sort; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const SHOP = appUrl("/shop");

function matches(p: Product, q: Query) {
  const tab = TABS.find((t) => t.label === q.tab);
  if (tab && !tab.categories.includes(p.category)) return false;
  if (q.species !== "all" && !p.species.includes(q.species as Product["species"][number])) return false;
  if (q.stage !== "all" && p.stage !== "All Stages" && p.stage !== q.stage) return false;
  if (q.category !== "all" && p.category !== q.category) return false;
  return true;
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <label className="flex min-w-0 flex-col gap-2">
      <span className="text-xs font-bold uppercase leading-5 tracking-wide" style={{ color: C.ink }}>
        {label}
      </span>
      <span className="relative">
        {/* text-base below sm stops iOS zooming into the field on focus. */}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full cursor-pointer appearance-none truncate rounded-xl bg-white pl-4 pr-8 text-base outline-none focus-visible:ring-2 focus-visible:ring-cyan-700/30 sm:text-xs"
          style={{ color: C.ink, border: `1px solid ${C.line}` }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: C.muted }}
        />
      </span>
    </label>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span
      className="rounded-sm px-2 py-[3px] text-[10px] font-semibold uppercase leading-4"
      style={{ background: C.chip, color: C.brand, border: `1px solid ${C.line}` }}
    >
      {label}
    </span>
  );
}

function ProductCard({ p }: { p: Product }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[20px] bg-white" style={{ border: `1px solid ${C.line}` }}>
      <div className="relative h-44 bg-gradient-to-br from-orange-500 to-cyan-800">
        <Image
          src={p.image}
          alt={p.imageAlt}
          fill
          sizes="(min-width: 1024px) 288px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-bold uppercase leading-4 tracking-wide" style={{ color: C.warm }}>
          {p.category}
        </p>
        <h3 className="pt-3 text-base font-bold leading-5" style={{ color: C.ink }}>
          {p.name}
        </h3>
        <div className="flex flex-wrap gap-2 pt-3">
          {(p.tags ?? [...p.species, p.stage]).map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
        <p className="pb-4 pt-3 text-lg font-bold leading-7" style={{ color: C.brand }}>
          ${p.price.toFixed(2)}
        </p>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-4" style={{ borderTop: `1px solid ${C.line}` }}>
          <a
            href={SHOP}
            className="rounded-xl px-4 py-2.5 text-center text-xs font-semibold text-white transition hover:opacity-90"
            style={{ background: C.brand }}
          >
            View
          </a>
          <a
            href={SHOP}
            className="rounded-xl bg-gray-50 px-4 py-2.5 text-center text-xs font-semibold transition hover:bg-white"
            style={{ color: C.brand, border: `1px solid ${C.line}` }}
          >
            Learn More
          </a>
        </div>
      </div>
    </article>
  );
}

export default function ProductListing() {
  const [q, setQ] = useState<Query>(DEFAULT);
  // Until the visitor picks a tab, show the design's snapshot: the first tab
  // highlighted over the full listing.
  const [touched, setTouched] = useState(false);

  const update = (patch: Partial<Query>) => {
    setQ({ ...q, ...patch });
    setTouched(true);
  };

  const results = PRODUCTS.filter((p) => matches(p, q));
  if (q.sort === "price-asc") results.sort((a, b) => a.price - b.price);
  if (q.sort === "price-desc") results.sort((a, b) => b.price - a.price);

  const activeTab = touched ? q.tab : TABS[0].label;
  const filtered = JSON.stringify(q) !== JSON.stringify(DEFAULT);

  const filter = (key: "species" | "stage" | "category", label: string, all: string, options: readonly string[]) => (
    <Select
      label={label}
      value={q[key]}
      onChange={(v) => update({ [key]: v })}
      options={[{ value: "all", label: all }, ...options.map((o) => ({ value: o, label: o }))]}
    />
  );

  return (
    <section className="px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20 xl:px-28" style={{ background: C.panel }}>
      <div className="mx-auto flex max-w-[1230px] flex-col gap-8">
        {/* One scrollable row below lg, so a tab never ends up alone on a
            second line. */}
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:gap-4 lg:px-0 [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => {
            const on = activeTab === t.label;
            return (
              <button
                key={t.label}
                type="button"
                aria-pressed={on}
                onClick={() => update({ tab: q.tab === t.label ? null : t.label })}
                className="shrink-0 whitespace-nowrap rounded-[20px] px-5 py-3 text-sm font-bold transition sm:px-6 sm:py-4"
                style={{
                  background: on ? C.brand : "#fff",
                  color: on ? "#fff" : C.ink,
                  border: `1px solid ${on ? C.brand : C.line}`,
                }}
              >
                <span aria-hidden>{t.icon}</span> {t.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {filter("species", "Pet Type", "All species", SPECIES)}
          {filter("stage", "Life Stage", "All stages", STAGES)}
          {filter("category", "Category", "All categories", CATEGORIES)}
          <Select label="Sort By" value={q.sort} onChange={(v) => update({ sort: v as Sort })} options={SORTS} />
        </div>

        <div className="flex items-center justify-between pb-4" style={{ borderBottom: `1px solid ${C.line}` }}>
          <p className="text-sm font-semibold leading-6" style={{ color: C.muted }} aria-live="polite">
            Showing {results.length} {results.length === 1 ? "product" : "products"}
          </p>
          {filtered ? (
            <button
              type="button"
              onClick={() => update(DEFAULT)}
              className="text-xs leading-5 underline-offset-2 hover:underline"
              style={{ color: C.ink }}
            >
              View all results
            </button>
          ) : (
            <a href={SHOP} className="text-xs leading-5 underline-offset-2 hover:underline" style={{ color: C.ink }}>
              View all results
            </a>
          )}
        </div>

        {results.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-[20px] bg-white px-6 py-12 text-center" style={{ border: `1px solid ${C.line}` }}>
            <p className="text-base font-bold" style={{ color: C.ink }}>
              No products match these filters.
            </p>
            <button
              type="button"
              onClick={() => update(DEFAULT)}
              className="mt-4 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
              style={{ background: C.brand }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
