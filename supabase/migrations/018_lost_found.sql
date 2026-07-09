-- ── Lost & Found ─────────────────────────────────────────────────────────────
-- Lost/found pet reports + community sightings. Uses `lost_found_posts` (the
-- legacy 000_schema `lost_found_reports` has restrictive enums we don't use).
-- Idempotent.

CREATE TABLE IF NOT EXISTS public.lost_found_posts (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind               text NOT NULL,                    -- lost | found
  pet_name           text,
  species            text NOT NULL,
  breed              text,
  description        text,
  last_seen_location text,
  last_seen_at       date,
  photo_url          text,
  contact            text,
  reward             int,
  status             text NOT NULL DEFAULT 'active',   -- active | reunited | closed
  sightings_count    int NOT NULL DEFAULT 0,
  is_deleted         boolean NOT NULL DEFAULT false,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lost_found_browse_idx ON public.lost_found_posts (kind, status, created_at DESC) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS lost_found_reporter_idx ON public.lost_found_posts (reporter_id);

CREATE TABLE IF NOT EXISTS public.lost_found_sightings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     uuid NOT NULL REFERENCES public.lost_found_posts(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message     text,
  location    text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lost_found_sightings_idx ON public.lost_found_sightings (post_id, created_at DESC);

ALTER TABLE public.lost_found_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_found_sightings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS lost_found_posts_select ON public.lost_found_posts;
CREATE POLICY lost_found_posts_select ON public.lost_found_posts FOR SELECT USING (is_deleted = false);

DROP POLICY IF EXISTS lost_found_sightings_select ON public.lost_found_sightings;
CREATE POLICY lost_found_sightings_select ON public.lost_found_sightings FOR SELECT USING (true);
