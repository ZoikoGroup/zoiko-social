-- ── PROFILE BANNER ───────────────────────────────────────────────────────────
-- Cover/banner image for profile pages. Uploaded to the existing `avatars`
-- bucket under the owner's path ({user_id}/banner-*.webp), so no new storage
-- bucket or RLS policies are needed — only this column.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS banner_url TEXT;
