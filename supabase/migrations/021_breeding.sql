-- ── Responsible Breeder Match ───────────────────────────────────────────────
-- Owners list a pet available for responsible breeding (with health tests +
-- certifications). Others send match requests (with notifications). Idempotent.
-- Note: named `breeding_profiles` to avoid the legacy `breeding_listings` table.

CREATE TABLE IF NOT EXISTS public.breeding_profiles (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pet_name       text NOT NULL,
  species        text NOT NULL DEFAULT 'dog',   -- dog|cat|bird|rabbit|other
  breed          text NOT NULL,
  sex            text NOT NULL DEFAULT 'male',   -- male | female
  age            text,
  location       text,
  about          text,
  health_tests   text[] NOT NULL DEFAULT '{}',
  certifications text[] NOT NULL DEFAULT '{}',
  cover_url      text,
  photos         text[] NOT NULL DEFAULT '{}',
  fee_cents      int,
  currency       text NOT NULL DEFAULT 'USD',
  status         text NOT NULL DEFAULT 'available',  -- available | paused | unavailable
  requests_count int  NOT NULL DEFAULT 0,
  is_deleted     boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS breeding_profiles_status_idx ON public.breeding_profiles (status, created_at DESC) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS breeding_profiles_species_idx ON public.breeding_profiles (species, created_at DESC);
CREATE INDEX IF NOT EXISTS breeding_profiles_owner_idx ON public.breeding_profiles (owner_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.breeding_requests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id   uuid NOT NULL REFERENCES public.breeding_profiles(id) ON DELETE CASCADE,
  requester_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message      text,
  status       text NOT NULL DEFAULT 'pending',   -- pending | accepted | declined
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, requester_id)
);
CREATE INDEX IF NOT EXISTS breeding_requests_profile_idx ON public.breeding_requests (profile_id, created_at DESC);

ALTER TABLE public.breeding_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breeding_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS breeding_profiles_select ON public.breeding_profiles;
CREATE POLICY breeding_profiles_select ON public.breeding_profiles FOR SELECT USING (is_deleted = false);

DROP POLICY IF EXISTS breeding_requests_select ON public.breeding_requests;
CREATE POLICY breeding_requests_select ON public.breeding_requests FOR SELECT USING (true);
