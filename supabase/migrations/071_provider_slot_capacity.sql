-- ── HOW MANY BOOKINGS MAY SHARE A TIME ───────────────────────────────────────
-- Business hours already existed (provider_availability), but nothing said how
-- many animals a provider can take at once, and nothing stopped two people
-- booking the same minute — createBooking had no overlap or capacity check at
-- all. This is the missing half: a single number per provider, used to turn the
-- working window into slots that report how much space is left.
--
-- Defaults to 1, which is the safe reading of existing listings: one booking at
-- a time until the owner says otherwise. A boarding business raises it.
--
-- The capacity itself is enforced in a serializable transaction in
-- providers.service.ts, not by a constraint here: the limit is per (service,
-- start time) and depends on a row count, which a CHECK cannot express.

ALTER TABLE public.service_providers
  ADD COLUMN IF NOT EXISTS slot_capacity INTEGER NOT NULL DEFAULT 1;

ALTER TABLE public.service_providers
  DROP CONSTRAINT IF EXISTS service_providers_slot_capacity_positive;

ALTER TABLE public.service_providers
  ADD CONSTRAINT service_providers_slot_capacity_positive
  CHECK (slot_capacity >= 1 AND slot_capacity <= 50);

COMMENT ON COLUMN public.service_providers.slot_capacity IS
  'Concurrent bookings allowed per slot. 1 means one at a time.';

-- Overlapping-booking lookups run on (provider, scheduled_at) filtered by
-- status, and the existing indexes cover neither pair.
CREATE INDEX IF NOT EXISTS pet_care_bookings_provider_scheduled_idx
  ON public.pet_care_bookings (provider_id, scheduled_at);
