-- ── Pets ─────────────────────────────────────────────────────────────────────
-- Per-user pet records powering the "My Pets" widget, pet diary and health
-- passport surfaces. Idempotent.

CREATE TABLE IF NOT EXISTS public.pets (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name       text NOT NULL,
  species    text NOT NULL,               -- Cat, Dog, Parrot, …
  breed      text,
  avatar_url text,
  bio        text,
  birthdate  date,
  is_public  boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pets_owner_idx ON public.pets (owner_id, created_at DESC);

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pets_select ON public.pets;
CREATE POLICY pets_select ON public.pets FOR SELECT
  USING (is_public = true OR owner_id = auth.uid());
