-- ─────────────────────────────────────────────────────────────────────────────
-- ZoikoSocial — pg_trgm Extension & GIN Indexes for User Search
-- Accelerates ILIKE / LIKE queries on profiles.username and
-- profiles.display_name using trigram-based GIN indexes.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Enable pg_trgm Extension (idempotent) ────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ── GIN Indexes for Trigram Search ──────────────────────────────────────────
--
-- Standard B-tree indexes cannot accelerate ILIKE/LIKE queries when the
-- pattern is not left-anchored (e.g. %query%). The pg_trgm extension
-- splits text into trigrams and builds a GIN index that supports
-- index-only scans for ILIKE, LIKE, and regex queries on the column.
--
-- operator class `gin_trgm_ops` tells PostgreSQL to index trigrams for
-- similarity/ILIKE matching rather than exact equality.
--
-- These indexes are used automatically by the query planner when Prisma's
-- `contains` with `mode: 'insensitive'` is used — no application changes
-- required.

CREATE INDEX IF NOT EXISTS profiles_username_trgm_idx
  ON public.profiles
  USING gin (username gin_trgm_ops);

CREATE INDEX IF NOT EXISTS profiles_display_name_trgm_idx
  ON public.profiles
  USING gin (display_name gin_trgm_ops);

-- ── Combined index for the common search pattern (active + name match) ──────
-- Most search queries filter on state = 'active' AND (username ILIKE or
-- display_name ILIKE). A partial GIN index further reduces index size by
-- excluding inactive/suspended/banned profiles from the index entirely.

CREATE INDEX IF NOT EXISTS profiles_active_search_idx
  ON public.profiles
  USING gin (username gin_trgm_ops, display_name gin_trgm_ops)
  WHERE state = 'active';

-- ── NOTES ───────────────────────────────────────────────────────────────────
--
-- Migration 008 — created 2026-07-03
-- Rollback: DROP EXTENSION IF EXISTS pg_trgm CASCADE;
--           (cascading drops the GIN indexes referencing the extension)
--
-- These indexes are write-amortized: GIN indexes have slightly higher
-- insert/update cost than B-tree, but the trade-off is worthwhile for
-- the drastic read improvement on user search — the hottest read path
-- in the Network module.
