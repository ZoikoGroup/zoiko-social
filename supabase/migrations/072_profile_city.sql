-- ── Profile City (general location for the "Show location" toggle) ───────────
-- The show_location privacy toggle existed in user_settings but the profile
-- table had no location data to display.  This migration adds a free-text
-- `city` column so the toggle has something to show.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text;

COMMENT ON COLUMN public.profiles.city IS 'General city / region shown on the profile when the user enables the Show location privacy toggle.';
