"use client";

import { useState } from "react";
import Image from "next/image";
import Section from "./Section";
import { CATEGORIES, IMG, RESOURCES, externalProps, type Category } from "./content";
import { C } from "./theme";

type Filter = Category | "all";

function matches(r: (typeof RESOURCES)[number], query: string, filter: Filter) {
  if (filter !== "all" && r.category !== filter) return false;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [r.title, r.body, ...r.tags].some((s) => s.toLowerCase().includes(q));
}

function scrollToResults() {
  document.getElementById("recommended")?.scrollIntoView({ behavior: "smooth" });
}

function Hero({
  query,
  setQuery,
  filter,
  setFilter,
}: {
  query: string;
  setQuery: (q: string) => void;
  filter: Filter;
  setFilter: (f: Filter) => void;
}) {
  const chip = (value: Filter, label: string) => {
    const on = filter === value;
    return (
      <button
        key={value}
        type="button"
        aria-pressed={on}
        onClick={() => {
          setFilter(value);
          scrollToResults();
        }}
        className="rounded-xl px-4 py-2 text-sm font-semibold transition"
        style={{ background: on ? C.brand : "#fff", color: on ? "#fff" : C.ink, border: `2px solid ${on ? C.brand : C.line}` }}
      >
        {label}
      </button>
    );
  };

  return (
    <section className="bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20 xl:px-28">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-1.5">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl sm:leading-[64.4px]" style={{ color: C.ink }}>
          Get support, feel better
        </h1>
        <p className="text-base leading-7" style={{ color: C.muted }}>
          Curated resources for mental health, wellness, and community support. Everyone deserves access to care.
        </p>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            scrollToResults();
          }}
          className="flex flex-col gap-3 pt-8 sm:flex-row sm:pt-10"
        >
          <label className="flex-1">
            <span className="sr-only">Search resources</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: therapy, crisis support, wellness groups..."
              className="h-14 w-full rounded-[20px] bg-white px-5 text-base outline-none placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-cyan-700/30 sm:h-full sm:min-h-14 sm:px-6"
              style={{ color: C.ink, border: `2px solid ${C.brand}` }}
            />
          </label>
          <button
            type="submit"
            className="rounded-xl px-8 py-4 text-sm font-semibold text-white transition hover:opacity-90 sm:py-5"
            style={{ background: C.brand }}
          >
            Search
          </button>
        </form>
        <div className="flex flex-wrap gap-2 pt-5 sm:gap-3 sm:pt-6">
          {chip("all", "All Resources")}
          {CATEGORIES.map((c) => chip(c, c))}
        </div>
        {/* Not in the design; a mental-health page should always surface the
            US crisis line alongside its resources. */}
        <p className="pt-5 text-sm leading-6" style={{ color: C.muted }}>
          In crisis or thinking about suicide? Call or text{" "}
          <a href="tel:988" className="font-bold underline underline-offset-2" style={{ color: C.brand }}>
            988
          </a>{" "}
          (US) any time, or contact your local emergency number.
        </p>
      </div>
    </section>
  );
}

function Recommended({ query, filter, clear }: { query: string; filter: Filter; clear: () => void }) {
  const results = RESOURCES.filter((r) => matches(r, query, filter));
  const filtered = filter !== "all" || query.trim() !== "";

  return (
    <Section id="recommended" title="Recommended resources" tinted>
      {filtered && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm" style={{ color: C.muted }} aria-live="polite">
          <span>
            Showing {results.length} of {RESOURCES.length} resources
          </span>
          <button type="button" onClick={clear} className="font-semibold underline underline-offset-2" style={{ color: C.brand }}>
            Show all
          </button>
        </div>
      )}
      {results.length > 0 ? (
        <div className="grid gap-4 pt-2 sm:grid-cols-2 sm:gap-6 sm:pt-6 md:grid-cols-3">
          {results.map((r) => (
            <article
              key={r.title}
              className="flex flex-col gap-3 rounded-[20px] bg-white p-6"
              style={{ border: `1px solid ${C.line}` }}
            >
              <span className="flex size-[52px] items-center justify-center rounded-xl" style={{ background: C.chip }}>
                <Image src={`${IMG}${r.icon}.webp`} alt="" width={24} height={24} className="size-6" />
              </span>
              <h3 className="pt-2 text-lg font-bold" style={{ color: C.brand }}>
                {r.title}
              </h3>
              <p className="text-[15px] leading-6" style={{ color: C.muted }}>
                {r.body}
              </p>
              <div className="flex flex-wrap gap-2 pb-2">
                {r.tags.map((t) => (
                  <span key={t} className="rounded-xl px-3 py-1 text-xs font-medium" style={{ background: C.chip, color: C.brand }}>
                    {t}
                  </span>
                ))}
              </div>
              <a
                href={r.href}
                {...externalProps(r.href)}
                className="mt-auto rounded-xl px-4 py-2 text-center text-sm font-medium text-white transition hover:opacity-90"
                style={{ background: C.brand }}
              >
                {r.action}
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[20px] bg-white px-6 py-12 text-center" style={{ border: `1px solid ${C.line}` }}>
          <p className="text-base font-bold" style={{ color: C.ink }}>
            No resources match your search.
          </p>
          <button
            type="button"
            onClick={clear}
            className="mt-4 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: C.brand }}
          >
            Show all resources
          </button>
        </div>
      )}
    </Section>
  );
}

/**
 * The hero search filters the "Recommended resources" cards further down, so
 * both live here; the sections the design places between them are passed in
 * as `children`.
 */
export default function ResourceSearch({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  return (
    <>
      <Hero query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} />
      {children}
      <Recommended
        query={query}
        filter={filter}
        clear={() => {
          setQuery("");
          setFilter("all");
        }}
      />
    </>
  );
}
