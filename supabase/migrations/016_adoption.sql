-- ── Adoption & Rescue ───────────────────────────────────────────────────────
-- Adoptable-animal listings + adoption enquiries. Idempotent.

CREATE TABLE IF NOT EXISTS public.adoption_posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name            text NOT NULL,
  species         text NOT NULL,
  breed           text,
  age             text,
  sex             text NOT NULL DEFAULT 'unknown',   -- male | female | unknown
  size            text,                              -- small | medium | large
  description     text,
  location        text,
  cover_url       text,
  photos          text[] NOT NULL DEFAULT '{}',
  vaccinated      boolean NOT NULL DEFAULT false,
  neutered        boolean NOT NULL DEFAULT false,
  good_with       text[] NOT NULL DEFAULT '{}',      -- kids | dogs | cats
  fee             int,
  status          text NOT NULL DEFAULT 'available', -- available | pending | adopted | withdrawn
  enquiries_count int NOT NULL DEFAULT 0,
  is_deleted      boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS adoption_posts_browse_idx ON public.adoption_posts (status, created_at DESC) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS adoption_posts_poster_idx ON public.adoption_posts (poster_id, created_at DESC);
CREATE INDEX IF NOT EXISTS adoption_posts_species_idx ON public.adoption_posts (species);

CREATE TABLE IF NOT EXISTS public.adoption_enquiries (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id   uuid NOT NULL REFERENCES public.adoption_posts(id) ON DELETE CASCADE,
  applicant_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message      text,
  status       text NOT NULL DEFAULT 'pending',      -- pending | accepted | rejected | withdrawn
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (listing_id, applicant_id)
);
CREATE INDEX IF NOT EXISTS adoption_enq_listing_idx ON public.adoption_enquiries (listing_id, created_at DESC);
CREATE INDEX IF NOT EXISTS adoption_enq_applicant_idx ON public.adoption_enquiries (applicant_id);

ALTER TABLE public.adoption_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adoption_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS adoption_posts_select ON public.adoption_posts;
CREATE POLICY adoption_posts_select ON public.adoption_posts FOR SELECT USING (is_deleted = false);

DROP POLICY IF EXISTS adoption_enq_select ON public.adoption_enquiries;
CREATE POLICY adoption_enq_select ON public.adoption_enquiries FOR SELECT USING (applicant_id = auth.uid());
