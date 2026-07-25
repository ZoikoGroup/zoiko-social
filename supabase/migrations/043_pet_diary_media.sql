-- ── Pet Diary: multiple photos + tags ───────────────────────────────────────
-- Adds a photo gallery and free-text tags to diary entries. Idempotent.
-- (Weight charts reuse existing pet_health_records; no change needed there.)
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.pet_diary ADD COLUMN IF NOT EXISTS photo_urls text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.pet_diary ADD COLUMN IF NOT EXISTS tags       text[] NOT NULL DEFAULT '{}';
