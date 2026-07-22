-- ── Events — Coordinates (map pins + near-me) ───────────────────────────────
-- Optional lat/lng captured from the place-autocomplete pick. Enables an
-- embedded map pin on the detail page and distance/near-me sorting. Idempotent.

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS latitude  double precision;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS longitude double precision;
