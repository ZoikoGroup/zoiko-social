"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, Search, SlidersHorizontal } from "lucide-react";
import { C } from "./theme";
import {
  ACTIVITY,
  CATEGORIES,
  COMMUNITIES,
  PAGE_SIZE,
  type Access,
  type Category,
} from "./communities";
import CommunityCard from "./CommunityCard";

const SORTS = ["Popular ranking", "Most active", "A–Z"] as const;
type Sort = (typeof SORTS)[number];

const ACCESS_OPTIONS: Access[] = ["Open to join", "Request required"];

const toggle = <T,>(list: T[], item: T) =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

const control =
  "flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-semibold transition hover:opacity-80";

function Chip({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className="rounded-full px-3 py-1.5 text-xs font-semibold transition hover:opacity-80"
      style={
        on
          ? { background: C.brand, color: "#fff", border: `1px solid ${C.brand}` }
          : { background: "#fff", color: C.muted, border: `1px solid ${C.line}` }
      }
    >
      {label}
    </button>
  );
}

/**
 * Search, filters, sort and the community grid.
 *
 * "Popular ranking" is the order the data arrives in, which the page says is
 * source-defined and fixed while you read; the other sorts only apply when
 * the viewer asks for them.
 */
export default function PopularBoard() {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [access, setAccess] = useState<Access[]>([]);
  const [sort, setSort] = useState<Sort>("Popular ranking");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [shown, setShown] = useState(PAGE_SIZE);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sortOpen) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !sortRef.current?.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [sortOpen]);

  const q = query.trim().toLowerCase();
  const matched = COMMUNITIES.filter((c) => {
    if (q && !`${c.name} ${c.description}`.toLowerCase().includes(q)) return false;
    if (categories.length && !categories.includes(c.category)) return false;
    return !access.length || access.includes(c.access);
  });

  const results =
    sort === "A–Z"
      ? [...matched].sort((a, b) => a.name.localeCompare(b.name))
      : sort === "Most active"
        ? [...matched].sort((a, b) => ACTIVITY.indexOf(a.activity) - ACTIVITY.indexOf(b.activity))
        : matched;

  const visible = results.slice(0, shown);
  const filtered = Boolean(q || categories.length || access.length);

  return (
    <>
      <div
        className="flex flex-wrap items-center gap-3 py-2"
        style={{ borderBottom: `1px solid ${C.line}` }}
      >
        <label
          className="flex w-full min-w-64 max-w-96 items-center gap-2 rounded-xl bg-white px-3.5 py-2 sm:w-auto sm:flex-1"
          style={{ border: `1px solid ${C.line}` }}
        >
          <Search size={15} strokeWidth={2} className="shrink-0" style={{ color: C.inkDeep }} />
          <span className="sr-only">Search popular communities</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShown(PAGE_SIZE);
            }}
            placeholder="Search popular communities"
            className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[#71767A]"
            style={{ color: C.inkDeep }}
          />
        </label>

        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          className={control}
          style={{ color: C.inkDeep, border: `1px solid ${filtersOpen ? C.brand : C.line}` }}
        >
          <SlidersHorizontal size={14} strokeWidth={2} />
          Filters
          {filtered ? (
            <span
              className="rounded-full px-1.5 text-xs font-bold"
              style={{ background: C.chip, color: C.brand }}
            >
              {categories.length + access.length}
            </span>
          ) : null}
        </button>

        <div ref={sortRef} className="relative sm:ml-auto">
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            aria-expanded={sortOpen}
            className="flex items-center gap-2 text-xs font-semibold transition hover:opacity-80"
            style={{ color: C.muted }}
          >
            <ArrowUpDown size={14} strokeWidth={2} />
            Sort: {sort}
          </button>
          {sortOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl bg-white py-1 shadow-[0_8px_24px_rgba(7,59,71,0.14)]"
              style={{ border: `1px solid ${C.line}` }}
            >
              {SORTS.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setSort(option);
                    setSortOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-xs font-semibold hover:bg-[#F7F9F9]"
                  style={{ color: option === sort ? C.brand : C.inkDeep }}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {filtersOpen ? (
        <div
          className="mt-4 flex flex-col gap-3 rounded-[20px] p-4"
          style={{ background: C.chip, border: `1px solid ${C.line}` }}
        >
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-tight" style={{ color: C.muted }}>
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  on={categories.includes(category)}
                  onClick={() => {
                    setCategories((l) => toggle(l, category));
                    setShown(PAGE_SIZE);
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-tight" style={{ color: C.muted }}>
              Access
            </p>
            <div className="flex flex-wrap gap-2">
              {ACCESS_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  on={access.includes(option)}
                  onClick={() => {
                    setAccess((l) => toggle(l, option));
                    setShown(PAGE_SIZE);
                  }}
                />
              ))}
            </div>
          </div>
          {filtered ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategories([]);
                setAccess([]);
              }}
              className="self-start text-xs font-bold underline underline-offset-2"
              style={{ color: C.brand }}
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 pt-5">
        <h2 className="text-xl font-extrabold leading-8" style={{ color: C.ink }}>
          Popular communities
        </h2>
        <div className="flex flex-wrap items-center gap-3.5 text-xs leading-5" style={{ color: C.muted }}>
          <span aria-live="polite">
            {results.length} {results.length === 1 ? "community" : "communities"}
          </span>
          <span>Updated 12 minutes ago</span>
        </div>
      </div>
      <p className="text-xs leading-5" style={{ color: C.muted }}>
        Order reflects current source-defined activity signals and will not
        rearrange while you are reading.
      </p>

      {visible.length ? (
        <div className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      ) : (
        <div
          className="mt-6 flex flex-col items-center gap-2 rounded-[20px] px-6 py-10 text-center"
          style={{ border: `1px dashed ${C.line}` }}
        >
          <p className="text-sm leading-5" style={{ color: C.muted }}>
            No popular communities match your search.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategories([]);
              setAccess([]);
            }}
            className="text-sm font-bold underline underline-offset-2"
            style={{ color: C.brand }}
          >
            Clear filters
          </button>
        </div>
      )}

      {visible.length < results.length ? (
        <div className="flex justify-center pb-2 pt-7">
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE_SIZE)}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold transition hover:opacity-80"
            style={{ color: C.inkDeep, border: `1px solid ${C.line}` }}
          >
            Load more communities
          </button>
        </div>
      ) : null}
    </>
  );
}
