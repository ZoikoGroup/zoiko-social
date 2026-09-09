-- ── Post kinds + structured metadata ────────────────────────────────────────
-- Adds a post "kind" (category) and a JSONB metadata blob for structured posts
-- (rescue case, vet tip, lost & found, wildlife sighting, …). Idempotent.

ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'standard';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS metadata jsonb;

-- Filter feeds/surfaces by kind (e.g. lost-and-found board)
CREATE INDEX IF NOT EXISTS posts_kind_idx ON public.posts (kind);
