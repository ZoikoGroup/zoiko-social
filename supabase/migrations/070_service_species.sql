-- ── WHICH PETS A SERVICE IS FOR ──────────────────────────────────────────────
-- A provider can say which animals the business serves (service_providers.species),
-- but an individual service could not. That is the level where it usually
-- matters: a groomer who takes dogs and cats may still offer a "Large Breed
-- Full Groom" that is dogs only, and a "Nail Trim" that is not.
--
-- Additive and defaulted, so existing services keep working and mean "no
-- restriction stated" rather than "no pets accepted". Empty is deliberately not
-- treated as a filter anywhere — a service that says nothing is bookable for
-- any animal, the same as before this column existed.

ALTER TABLE public.pet_care_services
  ADD COLUMN IF NOT EXISTS species TEXT[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.pet_care_services.species IS
  'Animals this service is offered for. Empty means unstated, not none — it is '
  'never used to block a booking (ZSOC pet-care services).';
