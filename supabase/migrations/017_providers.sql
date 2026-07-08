-- ── Service providers directory (Vet Finder + Pet Care) ─────────────────────
-- One directory table serves both surfaces via the `category` discriminator.
-- Idempotent.

CREATE TABLE IF NOT EXISTS public.service_providers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  added_by     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category     text NOT NULL,                 -- vet | pet_care
  name         text NOT NULL,
  service_type text,                          -- Veterinary Clinic | Grooming | Boarding | Walking | Training | …
  description  text,
  location     text,                          -- city / area
  address      text,
  phone        text,
  website      text,
  cover_url    text,
  is_deleted   boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS providers_browse_idx ON public.service_providers (category, created_at DESC) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS providers_added_by_idx ON public.service_providers (added_by);

ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS service_providers_select ON public.service_providers;
CREATE POLICY service_providers_select ON public.service_providers FOR SELECT USING (is_deleted = false);
