-- ── Pet diary + health passport ─────────────────────────────────────────────
-- Per-pet timeline entries and health records. Idempotent.

-- NB: table is `pet_diary` (not `pet_diary_entries`, which is a legacy table from
-- 000_schema referencing the old pet_profiles). This one references `pets` (013).
CREATE TABLE IF NOT EXISTS public.pet_diary (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id     uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  owner_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind       text NOT NULL DEFAULT 'note',      -- note | milestone | photo | checkup
  title      text,
  body       text,
  photo_url  text,
  entry_date date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pet_diary_pet_idx ON public.pet_diary (pet_id, entry_date DESC);

CREATE TABLE IF NOT EXISTS public.pet_health_records (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id      uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  owner_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        text NOT NULL,                    -- vaccination | vet_visit | medication | allergy | weight | note
  title       text NOT NULL,
  notes       text,
  record_date date,
  next_due    date,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pet_health_pet_idx ON public.pet_health_records (pet_id, record_date DESC);

ALTER TABLE public.pet_diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_health_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pet_diary_owner ON public.pet_diary;
CREATE POLICY pet_diary_owner ON public.pet_diary FOR SELECT USING (owner_id = auth.uid());

DROP POLICY IF EXISTS pet_health_owner ON public.pet_health_records;
CREATE POLICY pet_health_owner ON public.pet_health_records FOR SELECT USING (owner_id = auth.uid());
