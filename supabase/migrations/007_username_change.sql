-- ─────────────────────────────────────────────────────────────────────────────
-- ZoikoSocial — Username change tracking
-- Users may change their username once every 30 days; the API enforces the
-- cooldown against this timestamp.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username_changed_at timestamptz;
