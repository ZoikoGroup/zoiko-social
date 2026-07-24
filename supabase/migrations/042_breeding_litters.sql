-- ── Breeding Match: Litter → Adoption pipeline ──────────────────────────────
-- After an accepted match, owners record a litter (mating → birth → count) and
-- list the offspring into the Adoption marketplace. Idempotent.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.breeding_litters (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id   uuid NOT NULL REFERENCES public.breeding_requests(id) ON DELETE CASCADE,
  recorded_by  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  species      text,
  breed        text,
  mated_at     date,
  expected_at  date,
  born_at      date,
  count        int,
  notes        text,
  status       text NOT NULL DEFAULT 'expecting',   -- expecting | born
  listed_count int NOT NULL DEFAULT 0,              -- offspring listed to Adoption
  is_deleted   boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS breeding_litters_request_idx ON public.breeding_litters (request_id) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS breeding_litters_recorder_idx ON public.breeding_litters (recorded_by, created_at DESC) WHERE is_deleted = false;

ALTER TABLE public.breeding_litters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS breeding_litters_select ON public.breeding_litters;
CREATE POLICY breeding_litters_select ON public.breeding_litters FOR SELECT USING (is_deleted = false);
DROP POLICY IF EXISTS breeding_litters_insert ON public.breeding_litters;
CREATE POLICY breeding_litters_insert ON public.breeding_litters FOR INSERT WITH CHECK (recorded_by = auth.uid());
DROP POLICY IF EXISTS breeding_litters_update ON public.breeding_litters;
CREATE POLICY breeding_litters_update ON public.breeding_litters FOR UPDATE USING (recorded_by = auth.uid());
