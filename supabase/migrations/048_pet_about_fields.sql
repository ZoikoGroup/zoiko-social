-- ── Pet About section: identity and care details ────────────────────────────
-- Adds the descriptive fields shown in a pet's About panel. Weight is
-- intentionally NOT stored here: it is tracked over time in
-- pet_health_records (type = 'weight') so the growth chart remains the single
-- source of truth, and About reads the latest record from there. Idempotent.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS color text;
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS microchip_id text;
-- Nullable on purpose — NULL means "not specified", distinct from a known false.
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS neutered boolean;
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS adoption_date date;
