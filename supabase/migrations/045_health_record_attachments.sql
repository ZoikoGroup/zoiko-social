-- ── Health Passport: record attachments ─────────────────────────────────────
-- Photos/scans of lab reports, prescriptions, vaccination cards, etc. attached
-- to a health record. Idempotent.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.pet_health_records ADD COLUMN IF NOT EXISTS attachments text[] NOT NULL DEFAULT '{}';
