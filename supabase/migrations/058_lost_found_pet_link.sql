-- ── Lost & found reports ↔ pet profiles ──────────────────────────────────────
-- Reporting your own pet missing meant retyping its breed, colour and microchip
-- and re-uploading photos — details already sitting on the pet profile, entered
-- at the worst possible moment to be filling in a form. The report also stayed
-- disconnected from the pet afterwards, so neither view knew about the other.
--
-- BreedingProfile already carries a pet_id and auto-fills from the Health
-- Passport, so this is the established pattern rather than a new idea.
--
-- Nullable, and SET NULL on delete: most found-pet reports are about somebody
-- else's animal and will never have a pet_id, and deleting a pet profile must
-- not delete the report of it being missing.
--
-- Idempotent.

ALTER TABLE public.lost_found_posts
  ADD COLUMN IF NOT EXISTS pet_id uuid REFERENCES public.pets(id) ON DELETE SET NULL;

-- "Is this pet currently reported missing?" on the pet profile.
CREATE INDEX IF NOT EXISTS lost_found_posts_pet_idx
  ON public.lost_found_posts (pet_id)
  WHERE pet_id IS NOT NULL;

-- ── Sightings — coordinates ──────────────────────────────────────────────────
-- A sighting recorded only a free-text location, while the parent report has
-- lat/lng. That made the one genuinely useful view impossible: a map of where
-- an animal has actually been seen, in order, so a search can be pointed
-- somewhere. Nullable because a phone may refuse or lack location permission.

ALTER TABLE public.lost_found_sightings
  ADD COLUMN IF NOT EXISTS latitude  double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision;
