-- ── Lost & Found — Richer pet data + coordinates ────────────────────────────
-- Adds identification fields (age, color, sex, size, microchip, collar, neutered,
-- vaccinated), multiple photos, and coordinates for map pin + near-me/matching.
-- Note: age & color were collected in the report form but never had columns.
-- Idempotent.

ALTER TABLE public.lost_found_posts ADD COLUMN IF NOT EXISTS age          text;
ALTER TABLE public.lost_found_posts ADD COLUMN IF NOT EXISTS color        text;
ALTER TABLE public.lost_found_posts ADD COLUMN IF NOT EXISTS sex          text;   -- male | female | unknown
ALTER TABLE public.lost_found_posts ADD COLUMN IF NOT EXISTS size         text;   -- small | medium | large
ALTER TABLE public.lost_found_posts ADD COLUMN IF NOT EXISTS microchip_id text;
ALTER TABLE public.lost_found_posts ADD COLUMN IF NOT EXISTS collar       text;
ALTER TABLE public.lost_found_posts ADD COLUMN IF NOT EXISTS neutered     boolean;
ALTER TABLE public.lost_found_posts ADD COLUMN IF NOT EXISTS vaccinated   boolean;
ALTER TABLE public.lost_found_posts ADD COLUMN IF NOT EXISTS photo_urls   text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.lost_found_posts ADD COLUMN IF NOT EXISTS latitude     double precision;
ALTER TABLE public.lost_found_posts ADD COLUMN IF NOT EXISTS longitude    double precision;

-- Matching queries filter by species within a kind.
CREATE INDEX IF NOT EXISTS lost_found_species_idx ON public.lost_found_posts (species, kind, status);
