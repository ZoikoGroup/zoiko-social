-- ── Events ↔ communities ─────────────────────────────────────────────────────
-- A community could not host an event. The two features sat side by side —
-- filed together in the help centre, even — with nothing joining them, so a
-- rescue group organising a monthly meet had to post the event separately and
-- hope its members noticed.
--
-- Nullable: most events belong to a person, not a community. SET NULL on delete
-- because losing a community should not cancel the event.

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS community_id uuid REFERENCES public.communities(id) ON DELETE SET NULL;

-- "Events in this community", newest-first.
CREATE INDEX IF NOT EXISTS events_community_starts_idx
  ON public.events (community_id, starts_at)
  WHERE community_id IS NOT NULL;

-- ── Health records ↔ the clinic that wrote them ──────────────────────────────
-- When a vet adds a visit summary to a pet's Health Passport, the clinic's name
-- is baked into the record title as text. So the owner sees "Check-up — City
-- Vets" and can do nothing with it: no tap through to the clinic, no way to ask
-- "what has this vet treated my pet for". The data was already in hand at write
-- time and thrown away.
--
-- SET NULL so removing a clinic listing leaves the medical history intact —
-- these records outlive the businesses that created them.

ALTER TABLE public.pet_health_records
  ADD COLUMN IF NOT EXISTS provider_id uuid REFERENCES public.service_providers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS pet_health_records_provider_idx
  ON public.pet_health_records (provider_id)
  WHERE provider_id IS NOT NULL;
